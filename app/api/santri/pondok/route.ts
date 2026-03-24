import { NextRequest, NextResponse } from "next/server";
import { JenisSantri } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET - Fetch tagihan and transaksi for PONDOK santri
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
      select: { id: true, jenisSantri: true, nama: true },
    });

    if (!santri) {
      return NextResponse.json({ error: "Santri not found" }, { status: 404 });
    }

    const santriId = santri.id;

    // Verify the santri is PONDOK type
    if (santri.jenisSantri !== JenisSantri.PONDOK) {
      return NextResponse.json({ error: "Not authorized for PONDOK data" }, { status: 403 });
    }

    if (!santri || santri.jenisSantri !== JenisSantri.PONDOK) {
      return NextResponse.json({ error: "Not authorized for PONDOK data" }, { status: 403 });
    }

    // Fetch tagihan and transaksi in parallel
    const [tagihan, transaksi] = await Promise.all([
      prisma.tagihan.findMany({
        where: {
          santriId,
          santri: {
            jenisSantri: JenisSantri.PONDOK,
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
            jenisSantri: JenisSantri.PONDOK,
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
      santri: {
        nama: santri.nama,
      },
    });
  } catch (error) {
    console.error("Error fetching PONDOK santri data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
