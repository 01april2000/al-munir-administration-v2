import { NextRequest, NextResponse } from "next/server";
import { StatusTransaksi, JenisTransaksi, Role } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createSnapTransaction } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// Fixed laundry price for 1 month
const LAUNDRY_PRICE = 100000;

// POST - Create laundry payment transaction with Midtrans
export async function POST(request: NextRequest) {
  try {
    // IP-based rate limit
    const ipLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CREATE);
    if (ipLimit) return ipLimit;

    logger.log("=== Laundry Payment API Called ===");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    logger.log("Session:", session?.user?.id, session?.user?.role);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // User-based rate limit
    const userLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CREATE, session.user.id);
    if (userLimit) return userLimit;

    const body = await request.json();
    const { bulan, tahun } = body;

    logger.log("Request body:", { bulan, tahun });

    // Validate input
    if (!bulan || !tahun) {
      return NextResponse.json(
        { error: "Bulan dan tahun harus diisi" },
        { status: 400 }
      );
    }

    // Get the santri record using userId from session
    const userId = session.user.id;
    logger.log("Fetching santri for userId:", userId);
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

    logger.log("Santri found:", santri ? santri.id : null);

    if (!santri) {
      return NextResponse.json(
        { error: "Santri not found" },
        { status: 404 }
      );
    }

    // Check if there's already a pending laundry transaction for this month
    const existingTransaction = await prisma.transaksi.findFirst({
      where: {
        santriId: santri.id,
        jenis: JenisTransaksi.LAUNDRY,
        status: StatusTransaksi.PENDING,
        keterangan: {
          contains: `Bulan ${bulan} ${tahun}`
        }
      }
    });

    if (existingTransaction) {
      return NextResponse.json(
        { error: "Anda sudah memiliki transaksi laundry yang sedang diproses untuk bulan ini" },
        { status: 400 }
      );
    }

    // Generate order ID (shorter format for Midtrans)
    const orderId = `LD-${Date.now()}-${santri.nis.slice(-4)}`;

    // Create transaksi for laundry with PENDING status
    const transaksi = await prisma.transaksi.create({
      data: {
        kode: `LAUNDRY-${santri.nis}-${Date.now()}`,
        santriId: santri.id,
        jenis: JenisTransaksi.LAUNDRY,
        jumlah: LAUNDRY_PRICE,
        status: StatusTransaksi.PENDING,
        keterangan: `Laundry Bulan ${bulan} ${tahun}`,
        managedBy: (session.user.role as Role) || Role.ADMIN,
      },
    });

    logger.log("Created transaksi:", transaksi.id);

    // Create Midtrans Snap transaction
    const midtransTransaction = await createSnapTransaction({
      orderId,
      grossAmount: LAUNDRY_PRICE,
      customerDetails: {
        firstName: santri.nama.split(" ")[0],
        lastName: santri.nama.split(" ").slice(1).join(" ") || undefined,
        email: `${santri.nis}@santri.com`,
        phone: undefined,
      },
      itemDetails: [
        {
          id: transaksi.id,
          name: `Laundry Bulan ${bulan} ${tahun}`,
          price: LAUNDRY_PRICE,
          quantity: 1,
        },
      ],
      tagihanId: transaksi.id,
      santriName: santri.nama,
    });

    logger.log("Midtrans transaction created:", midtransTransaction.token);

    // Store Midtrans transaction details for webhook
    await prisma.midtransTransaction.create({
      data: {
        orderId,
        transaksiId: transaksi.id,
        grossAmount: LAUNDRY_PRICE,
        transactionStatus: "PENDING",
      },
    });

    return NextResponse.json({
      token: midtransTransaction.token,
      orderId: orderId,
      redirectUrl: midtransTransaction.redirectUrl,
      amount: LAUNDRY_PRICE,
    });
  } catch (error) {
    console.error("Error creating laundry payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
