import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET - Get a single tagihan by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const tagihan = await prisma.tagihan.findUnique({
      where: { id },
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
        transaksi: {
          select: {
            id: true,
            kode: true,
            status: true,
            tanggalBayar: true,
            metodePembayaran: true,
            keterangan: true,
            createdAt: true,
          },
        },
      },
    });

    if (!tagihan) {
      return NextResponse.json(
        { error: "Tagihan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tagihan });
  } catch (error) {
    console.error("Error fetching tagihan:", error);
    return NextResponse.json(
      { error: "Failed to fetch tagihan" },
      { status: 500 }
    );
  }
}
