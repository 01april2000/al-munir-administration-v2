import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, StatusTransaksi, JenisTransaksi, StatusUangSaku, Role } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createSnapTransaction } from "@/lib/midtrans";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// POST - Create top-up transaction with Midtrans
export async function POST(request: NextRequest) {
  try {
    console.log("=== Top-up Payment API Called ===");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("Session:", session?.user?.id, session?.user?.role);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    console.log("Request body:", { amount });

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

    // Create transaksi for top-up with PENDING status
    const transaksi = await prisma.transaksi.create({
      data: {
        kode: `TOPUP-${santri.nis}-${Date.now()}`,
        santriId: santri.id,
        jenis: JenisTransaksi.UANG_SAKU,
        jumlah: amount,
        status: StatusTransaksi.PENDING,
        statusUangSaku: StatusUangSaku.DITAMBAH,
        keterangan: "Top-up Uang Saku",
        managedBy: (session.user.role as Role) || Role.ADMIN,
      },
    });

    console.log("Created transaksi:", transaksi.id);

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
          name: "Top-up Uang Saku",
          price: amount,
          quantity: 1,
        },
      ],
      tagihanId: "",
      santriName: santri.nama,
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
