import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, JenisSantri } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// GET - Fetch tagihan and transaksi for SMP santri
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the santri record using userId from session
    const userId = session.user.id;
    const santri = await prisma.santri.findUnique({
      where: { userId },
      select: { id: true, jenisSantri: true },
    });

    if (!santri) {
      return NextResponse.json({ error: "Santri not found" }, { status: 404 });
    }

    const santriId = santri.id;

    // Verify the santri is SMP type
    if (santri.jenisSantri !== JenisSantri.SMP) {
      return NextResponse.json({ error: "Not authorized for SMP data" }, { status: 403 });
    }

    if (!santri || santri.jenisSantri !== JenisSantri.SMP) {
      return NextResponse.json({ error: "Not authorized for SMP data" }, { status: 403 });
    }

    // Fetch tagihan and transaksi in parallel
    const [tagihan, transaksi] = await Promise.all([
      prisma.tagihan.findMany({
        where: {
          santriId,
          santri: {
            jenisSantri: JenisSantri.SMP,
          },
        },
        include: {
          transaksi: {
            select: {
              id: true,
              kode: true,
              status: true,
              tanggalBayar: true,
              jumlah: true,
            },
          },
        },
        orderBy: [
          { tahun: "desc" },
          { bulan: "desc" },
          { createdAt: "desc" },
        ],
      }),
      prisma.transaksi.findMany({
        where: {
          santriId,
          santri: {
            jenisSantri: JenisSantri.SMP,
          },
        },
        include: {
          santri: {
            select: {
              id: true,
              nis: true,
              nama: true,
              kelas: true,
              asrama: true,
              jenisSantri: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      tagihan,
      transaksi,
    });
  } catch (error) {
    console.error("Error fetching SMP santri data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
