import { NextRequest, NextResponse } from "next/server";
import { StatusTransaksi, JenisTransaksi, StatusUangSaku, Role } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createSnapTransaction } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { KETERANGAN_TOPUP_TAGIHAN, KETERANGAN_TOPUP_UANG_SAKU } from "@/lib/payment-handler";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// POST - Create top-up transaction with Midtrans
export async function POST(request: NextRequest) {
  try {
    // IP-based rate limit
    const ipLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CREATE);
    if (ipLimit) return ipLimit;

    console.log("=== Top-up Payment API Called ===");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("Session:", session?.user?.id, session?.user?.role);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // User-based rate limit
    const userLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CREATE, session.user.id);
    if (userLimit) return userLimit;

    const body = await request.json();
    const { amount, saldoType } = body;

    console.log("Request body:", { amount, saldoType });

    // Validate input
    if (!amount || typeof amount !== "number" || amount < 10000) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum top-up is Rp 10.000" },
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
        jenisSantri: true,
      },
    });

    console.log("Santri found:", santri ? santri.id : null);

    if (!santri) {
      return NextResponse.json(
        { error: "Santri not found" },
        { status: 404 }
      );
    }

    // Generate order ID (shorter format for Midtrans)
    const orderId = `TU-${Date.now()}-${santri.nis.slice(-4)}`;

    // Determine keterangan based on saldoType (using shared constants)
    const isTagihan = saldoType === "TAGIHAN";
    const keterangan = isTagihan ? KETERANGAN_TOPUP_TAGIHAN : KETERANGAN_TOPUP_UANG_SAKU;

    // Create transaksi for top-up with PENDING status
    const transaksi = await prisma.transaksi.create({
      data: {
        kode: `TOPUP-${santri.nis}-${Date.now()}`,
        santriId: santri.id,
        jenis: JenisTransaksi.UANG_SAKU,
        jumlah: amount,
        status: StatusTransaksi.PENDING,
        statusUangSaku: StatusUangSaku.DITAMBAH,
        keterangan,
        managedBy: (session.user.role as Role) || Role.ADMIN,
      },
    });

    console.log("Created transaksi:", transaksi.id);

    // Build finish redirect URL so Midtrans redirects back to the santri page
    // This prevents the user from being stuck on Midtrans domain after payment
    const jenisPath = santri.jenisSantri?.toLowerCase() || "smk";
    const finishRedirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/santri/${jenisPath}`;

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
      itemDetails: [
        {
          id: transaksi.id,
          name: isTagihan ? "Top-up Saldo Tagihan" : "Top-up Uang Saku",
          price: amount,
          quantity: 1,
        },
      ],
      tagihanId: "",
      santriName: santri.nama,
      finishRedirectUrl,
    });

    // Store Midtrans transaction details
    await prisma.midtransTransaction.create({
      data: {
        orderId,
        transaksiId: transaksi.id,
        grossAmount: amount,
        transactionStatus: "pending",
      },
    });

    console.log("Top-up transaction created successfully:", {
      orderId,
      transaksiId: transaksi.id,
      amount,
    });

    return NextResponse.json({
      token: midtransTransaction.token,
      redirectUrl: midtransTransaction.redirect_url,
      orderId,
      transaksiId: transaksi.id,
    });
  } catch (error) {
    console.error("Error creating top-up transaction:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : undefined);
    return NextResponse.json(
      { error: "Failed to create top-up transaction" },
      { status: 500 }
    );
  }
}
