import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, StatusTransaksi, JenisTransaksi, Role } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createSnapTransaction, generateOrderId } from "@/lib/midtrans";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// POST - Create payment transaction with Midtrans
export async function POST(request: NextRequest) {
  try {
    console.log("=== Payment Create API Called ===");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("Session:", session?.user?.id, session?.user?.role);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tagihanId, transaksiId } = body;

    console.log("Request body:", { tagihanId, transaksiId });

    // Validate input
    if (!tagihanId && !transaksiId) {
      return NextResponse.json(
        { error: "Tagihan ID or Transaksi ID is required" },
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

    let tagihan: any = null;
    let transaksi: any = null;

    // Get tagihan data
    if (tagihanId) {
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

    if (tagihanId) {
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
            jenis: jenis === "SPP" ? JenisTransaksi.SPP : JenisTransaksi.SYAHRIAH,
            bulan: tagihan.bulan,
            tahun: tagihan.tahun,
            jumlah: amount,
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
