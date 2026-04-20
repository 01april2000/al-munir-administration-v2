import { NextRequest, NextResponse } from "next/server";
import { StatusTransaksi, JenisTransaksi, Role, JenisTagihan } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createSnapTransaction, generateOrderId, generateCombinedOrderId } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// POST - Create payment transaction with Midtrans
// Supports:
// - Single tagihan: { tagihanId: string }
// - Multiple tagihan (SPP + SYAHRIAH combination): { tagihanIds: string[] }
// - Existing transaksi: { transaksiId: string }
export async function POST(request: NextRequest) {
  try {
    // IP-based rate limit (protects against unauthenticated floods)
    const ipLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CREATE);
    if (ipLimit) return ipLimit;

    console.log("=== Payment Create API Called ===");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("Session:", session?.user?.id, session?.user?.role);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // User-based rate limit (per authenticated user)
    const userLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CREATE, session.user.id);
    if (userLimit) return userLimit;

    const body = await request.json();
    const { tagihanId, tagihanIds, transaksiId } = body;

    console.log("Request body:", { tagihanId, tagihanIds, transaksiId });

    // Validate input - support single tagihanId, multiple tagihanIds, or transaksiId
    const isCombinedPayment = tagihanIds && Array.isArray(tagihanIds) && tagihanIds.length > 0;
    const isSinglePayment = tagihanId && !isCombinedPayment;
    
    if (!isSinglePayment && !isCombinedPayment && !transaksiId) {
      return NextResponse.json(
        { error: "Tagihan ID, Tagihan IDs array, or Transaksi ID is required" },
        { status: 400 }
      );
    }

    // Get the santri record using userId from session
    const userId = session.user.id;
    console.log("Fetching santri for userId:", userId);
    const santri = await prisma.santri.findUnique({
      where: { userId },
      select: {
        id: true,
        nis: true,
        nama: true,
        kelas: true,
        asrama: true,
      },
    });

    console.log("Santri found:", santri ? santri.id : null);

    if (!santri) {
      return NextResponse.json(
        { error: "Santri not found" },
        { status: 404 }
      );
    }

    // Handle combined payment (multiple tagihan - SPP + SYAHRIAH)
    if (isCombinedPayment) {
      return await handleCombinedPayment(request, santri, tagihanIds, session);
    }

    let tagihan: any = null;
    let transaksi: any = null;

    // Get tagihan data for single payment
    if (isSinglePayment) {
      tagihan = await prisma.tagihan.findUnique({
        where: { id: tagihanId },
      });

      if (!tagihan) {
        return NextResponse.json(
          { error: "Tagihan not found" },
          { status: 404 }
        );
      }

      if (tagihan.status === "LUNAS") {
        return NextResponse.json(
          { error: "Tagihan sudah lunas" },
          { status: 400 }
        );
      }

      // Check if santri is the current user
      if (tagihan.santriId !== santri.id) {
        return NextResponse.json(
          { error: "Unauthorized - You can only pay your own bills" },
          { status: 403 }
        );
      }
    } else if (transaksiId) {
      transaksi = await prisma.transaksi.findUnique({
        where: { id: transaksiId },
      });

      if (!transaksi) {
        return NextResponse.json(
          { error: "Transaksi not found" },
          { status: 404 }
        );
      }

      if (transaksi.status === "LUNAS") {
        return NextResponse.json(
          { error: "Transaksi sudah lunas" },
          { status: 400 }
        );
      }

      // Check if santri is the current user
      if (transaksi.santriId !== santri.id) {
        return NextResponse.json(
          { error: "Unauthorized - You can only pay your own bills" },
          { status: 403 }
        );
      }
    }

    // Generate order ID
    const orderId = generateOrderId(tagihanId || transaksiId);

    // Determine amount and item details
    const amount = tagihan ? tagihan.jumlah : transaksi.jumlah;
    const jenis = tagihan ? tagihan.jenis : transaksi.jenis;
    
    // Generate item name based on jenis
    let itemName = jenis;
    if (jenis === "SPP") {
      itemName = "SPP";
    } else if (jenis === "SYAHRIAH") {
      itemName = "Syahriah";
    } else if (jenis === "PKL") {
      itemName = transaksi?.keterangan || "Biaya PKL";
    } else if (jenis === "LKS") {
      itemName = transaksi?.keterangan || "Biaya LKS";
    } else if (jenis === "UJIAN") {
      itemName = transaksi?.keterangan || "Biaya Ujian";
    } else if (jenis === "TKA") {
      itemName = transaksi?.keterangan || "Biaya TKA";
    } else if (jenis === "BUKU_PENDAMPING") {
      itemName = transaksi?.keterangan || "Biaya Buku Pendamping";
    }
    
    const itemDetails = [
      {
        id: tagihanId || transaksiId,
        name: itemName,
        price: amount,
        quantity: 1,
      },
    ];

    // Create or update transaksi with PENDING status
    let finalTransaksiId = transaksiId;

    if (isSinglePayment && tagihanId) {
      // Check if transaksi already exists for this tagihan
      const existingTransaksi = await prisma.transaksi.findFirst({
        where: {
          tagihan: {
            some: { id: tagihanId },
          },
        },
      });

      if (existingTransaksi) {
        finalTransaksiId = existingTransaksi.id;
      } else {
        // Create new transaksi
        const newTransaksi = await prisma.transaksi.create({
          data: {
            kode: `TRX-${santri.nis}-${Date.now()}`,
            santriId: santri.id,
            jenis: jenis as JenisTransaksi,
            bulan: tagihan.bulan,
            tahun: tagihan.tahun,
            jumlah: amount,
            keterangan: tagihan.keterangan,
            status: StatusTransaksi.PENDING,
            managedBy: (session.user.role as Role) || Role.ADMIN,
            tagihan: {
              connect: { id: tagihanId },
            },
          },
        });

        finalTransaksiId = newTransaksi.id;
      }
    } else {
      // Update existing transaksi status to PENDING
      await prisma.transaksi.update({
        where: { id: transaksiId },
        data: { status: StatusTransaksi.PENDING },
      });
    }

    // Build finish redirect URL with payment info
    // This ensures user is redirected back to the app after payment on Midtrans Simulator
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "https://al-munir-administration-v2.vercel.app/"
    const finishRedirectUrl = `${appUrl}/santri?payment_status=success&payment_type=${encodeURIComponent(jenis)}&amount=${amount}&order_id=${orderId}&refresh=${Date.now()}`

    // Create Midtrans Snap transaction
    const midtransTransaction = await createSnapTransaction({
      orderId,
      grossAmount: amount,
      customerDetails: {
        firstName: santri.nama.split(" ")[0],
        lastName: santri.nama.split(" ").slice(1).join(" ") || undefined,
        email: `${santri.nis}@santri.com`,
        phone: undefined,
      },
      itemDetails,
      tagihanId: tagihanId || "",
      santriName: santri.nama,
      finishRedirectUrl,
    });

    // Store Midtrans transaction details
    await prisma.midtransTransaction.create({
      data: {
        orderId,
        transaksiId: finalTransaksiId,
        grossAmount: amount,
        transactionStatus: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      token: midtransTransaction.token,
      redirectUrl: midtransTransaction.redirect_url,
      orderId,
      transaksiId: finalTransaksiId,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payment" },
      { status: 500 }
    );
  }
}

/**
 * Handle combined payment for multiple tagihan (SPP + SYAHRIAH)
 * Creates SEPARATE transactions for each tagihan but ONE Midtrans payment with combined total
 * This allows for better tracking per jenis tagihan while still providing single payment experience
 */
async function handleCombinedPayment(
  request: NextRequest,
  santri: { id: string; nis: string; nama: string; kelas: string; asrama: string },
  tagihanIds: string[],
  session: any
) {
  console.log("=== Handling Combined Payment for tagihanIds:", tagihanIds);

  // Fetch all tagihan
  const tagihanList = await prisma.tagihan.findMany({
    where: {
      id: { in: tagihanIds },
    },
  });

  if (tagihanList.length === 0) {
    return NextResponse.json(
      { error: "No valid tagihan found" },
      { status: 404 }
    );
  }

  // Validate all tagihan belong to the santri and are not paid
  for (const tagihan of tagihanList) {
    if (tagihan.santriId !== santri.id) {
      return NextResponse.json(
        { error: "Unauthorized - You can only pay your own bills" },
        { status: 403 }
      );
    }
    if (tagihan.status === "LUNAS") {
      return NextResponse.json(
        { error: `Tagihan ${tagihan.jenis} ${tagihan.bulan} ${tagihan.tahun} sudah lunas` },
        { status: 400 }
      );
    }
  }

  // Only allow SPP and SYAHRIAH to be combined
  const invalidTagihan = tagihanList.filter(
    (t) => t.jenis !== JenisTagihan.SPP && t.jenis !== JenisTagihan.SYAHRIAH
  );
  if (invalidTagihan.length > 0) {
    return NextResponse.json(
      { error: "Only SPP and SYAHRIAH can be combined in a single payment" },
      { status: 400 }
    );
  }

  // Calculate total amount
  const totalAmount = tagihanList.reduce((sum, t) => sum + t.jumlah, 0);
  console.log("Combined payment total amount:", totalAmount);

  // Build item details for Midtrans
  const itemDetails = tagihanList.map((t) => ({
    id: t.id,
    name: `${t.jenis === JenisTagihan.SPP ? "SPP" : "Syahriah"} ${t.bulan} ${t.tahun}`,
    price: t.jumlah,
    quantity: 1,
  }));

  // Generate order ID for combined payment (uses santri NIS for shorter ID)
  const orderId = generateCombinedOrderId(santri.nis);

  // Find and mark ALL old transactions (individual or combined) as DITOLAK
  // This happens when santri previously initiated payment for any of these tagihan
  // but then decided to pay them all together with new separate transactions
  const oldTransactions = await prisma.transaksi.findMany({
    where: {
      santriId: santri.id,
      tagihan: {
        some: {
          id: { in: tagihanIds },
        },
      },
      status: { in: [StatusTransaksi.PENDING, StatusTransaksi.BELUM_BAYAR] },
    },
    include: {
      tagihan: true,
    },
  });

  // Mark ALL old transactions as DITOLAK (including old TRX-COMBINED-... ones)
  for (const oldTx of oldTransactions) {
    await prisma.transaksi.update({
      where: { id: oldTx.id },
      data: { status: StatusTransaksi.DITOLAK },
    });
    console.log(`Marked old transaction ${oldTx.id} (${oldTx.kode}) as DITOLAK (replaced by new separate transactions)`);
  }

  // Create SEPARATE transactions for each tagihan
  // This is the key change - each tagihan gets its own transaction record
  // IMPORTANT: We ALWAYS create new transactions to ensure proper separation
  // Old combined transactions (TRX-COMBINED-...) are marked as DITOLAK above
  const createdTransactions = await prisma.$transaction(async (tx) => {
    const transactions = [];
    
    for (const tagihan of tagihanList) {
      // ALWAYS create new transaction for each tagihan
      // This ensures each tagihan has its own transaction record for proper reporting
      const newTx = await tx.transaksi.create({
        data: {
          kode: `TRX-${tagihan.jenis}-${santri.nis}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          santriId: santri.id,
          jenis: tagihan.jenis as JenisTransaksi,
          bulan: tagihan.bulan,
          tahun: tagihan.tahun,
          jumlah: tagihan.jumlah, // Individual amount per tagihan
          keterangan: tagihan.keterangan,
          status: StatusTransaksi.PENDING,
          managedBy: (session.user.role as Role) || Role.ADMIN,
          tagihan: {
            connect: { id: tagihan.id },
          },
        },
      });
      transactions.push(newTx);
      console.log(`Created new transaction ${newTx.id} (${newTx.kode}) for tagihan ${tagihan.id} (${tagihan.jenis}): ${tagihan.jumlah}`);
    }
    
    return transactions;
  });

  const transaksiIds = createdTransactions.map(t => t.id);
  console.log("Created/separated transactions:", transaksiIds);

  // Build finish redirect URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "https://al-munir-administration-v2.vercel.app/";
  const finishRedirectUrl = `${appUrl}/santri?payment_status=success&payment_type=COMBINED&amount=${totalAmount}&order_id=${orderId}&refresh=${Date.now()}`;

  // Create Midtrans Snap transaction with combined total
  const midtransTransaction = await createSnapTransaction({
    orderId,
    grossAmount: totalAmount, // Combined total for single payment
    customerDetails: {
      firstName: santri.nama.split(" ")[0],
      lastName: santri.nama.split(" ").slice(1).join(" ") || undefined,
      email: `${santri.nis}@santri.com`,
      phone: undefined,
    },
    itemDetails, // Shows breakdown per tagihan
    tagihanId: tagihanIds.join(","), // Store all tagihan IDs
    santriName: santri.nama,
    finishRedirectUrl,
  });

  // Store Midtrans transaction with ALL transaksi IDs as JSON array
  await prisma.midtransTransaction.create({
    data: {
      orderId,
      transaksiIds: JSON.stringify(transaksiIds), // Store array of transaction IDs
      grossAmount: totalAmount,
      transactionStatus: "PENDING",
    },
  });

  console.log("Combined payment created successfully:", {
    orderId,
    transaksiIds,
    totalAmount,
    tagihanCount: tagihanList.length,
    breakdown: tagihanList.map(t => `${t.jenis}: ${t.jumlah}`),
  });

  return NextResponse.json({
    success: true,
    token: midtransTransaction.token,
    redirectUrl: midtransTransaction.redirect_url,
    orderId,
    transaksiIds, // Return all transaction IDs
    isCombined: true,
    combinedDetails: {
      totalAmount,
      tagihanCount: tagihanList.length,
      items: itemDetails,
      transactions: createdTransactions.map(t => ({
        id: t.id,
        jenis: t.jenis,
        jumlah: t.jumlah,
      })),
    },
  });
}
