import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// POST - Bulk delete tagihan (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Check which tagihan have transaksi
    const tagihanList = await prisma.tagihan.findMany({
      where: {
        id: { in: ids },
      },
      include: { transaksi: true },
    });

    const withTransaksi = tagihanList.filter((t) => t.transaksi !== null);
    const withoutTransaksi = tagihanList.filter((t) => t.transaksi === null);

    if (withTransaksi.length > 0) {
      return NextResponse.json(
        {
          error: `${withTransaksi.length} tagihan memiliki transaksi dan tidak dapat dihapus. Hapus transaksi terlebih dahulu.`,
          skippedCount: withTransaksi.length,
        },
        { status: 400 }
      );
    }

    const result = await prisma.tagihan.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error bulk deleting tagihan:", error);
    return NextResponse.json(
      { error: "Failed to delete tagihan" },
      { status: 500 }
    );
  }
}
