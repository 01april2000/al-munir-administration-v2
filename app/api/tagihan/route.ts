import { NextRequest, NextResponse } from "next/server";
import { StatusTagihan, JenisTagihan, JenisSantri, JenisTransaksi } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET - List all tagihan with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");
    const status = searchParams.get("status") as StatusTagihan | null;
    const jenis = searchParams.get("jenis") as JenisTagihan | null;
    const jenisSantri = searchParams.get("jenisSantri") as JenisSantri | null;
    const santriId = searchParams.get("santriId");

    // Build filter
    const filter: {
      bulan?: string;
      tahun?: number;
      status?: StatusTagihan;
      jenis?: JenisTagihan;
      santriId?: string;
      santri?: { jenisSantri?: JenisSantri };
    } = {};

    // For bendahara roles, restrict to their jenisSantri
    if (session.user.role === "BENDAHARA_SMK") {
      filter.santri = { jenisSantri: "SMK" };
    } else if (session.user.role === "BENDAHARA_SMP") {
      filter.santri = { jenisSantri: "SMP" };
    } else if (session.user.role === "BENDAHARA_PONDOK") {
      filter.santri = { jenisSantri: "PONDOK" };
    } else if (jenisSantri && Object.values(JenisSantri).includes(jenisSantri)) {
      // For admin, use the jenisSantri filter if provided
      filter.santri = { jenisSantri };
    }

    if (bulan) filter.bulan = bulan;
    if (tahun) filter.tahun = parseInt(tahun);
    if (status && Object.values(StatusTagihan).includes(status)) {
      filter.status = status;
    }
    if (jenis && Object.values(JenisTagihan).includes(jenis)) {
      filter.jenis = jenis;
    }
    if (santriId) filter.santriId = santriId;

    const tagihan = await prisma.tagihan.findMany({
      where: filter,
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
          },
        },
      },
      orderBy: [
        { tahun: "desc" },
        { bulan: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ tagihan });
  } catch (error) {
    console.error("Error fetching tagihan:", error);
    return NextResponse.json(
      { error: "Failed to fetch tagihan" },
      { status: 500 }
    );
  }
}

// POST - Create a new tagihan (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { santriId, jenis, jumlah, bulan, tahun, keterangan } = body;

    if (!santriId || !jenis || !jumlah) {
      return NextResponse.json(
        { error: "Santri ID, jenis, dan jumlah harus diisi" },
        { status: 400 }
      );
    }

    // Validate santri exists
    const santri = await prisma.santri.findUnique({
      where: { id: santriId },
    });

    if (!santri) {
      return NextResponse.json(
        { error: "Santri tidak ditemukan" },
        { status: 404 }
      );
    }

    // Validate jenis is a valid JenisTransaksi
    const validJenisTransaksi = Object.values(JenisTransaksi);
    if (!validJenisTransaksi.includes(jenis as JenisTransaksi)) {
      return NextResponse.json(
        { error: "Jenis transaksi tidak valid" },
        { status: 400 }
      );
    }

    // All jenis are now stored as tagihan
    // Generate kode tagihan
    const jenisCode = jenis.substring(0, 3).toUpperCase();
    const count = await prisma.tagihan.count({
      where: { jenis: jenis as JenisTagihan },
    });
    const kode = `TG-${jenisCode}-${String(count + 1).padStart(5, "0")}`;
    // Normalize bulan and tahun with defaults
    const finalBulan = bulan || "Januari";
    const finalTahun = tahun || new Date().getFullYear();

    // Check if tagihan already exists for this santri, bulan, tahun, jenis
    const existingTagihan = await prisma.tagihan.findFirst({
      where: {
        santriId,
        jenis: jenis as JenisTagihan,
        bulan: finalBulan,
        tahun: finalTahun,
      },
    });

    if (existingTagihan) {
      return NextResponse.json(
        { error: "Tagihan untuk santri ini sudah ada pada periode yang sama" },
        { status: 400 }
      );
    }

    // Create tagihan
    // Calculate jatuh tempo (due date) - default to end of the month
    const jatuhTempo = new Date();
    const bulanIndex = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ].indexOf(finalBulan);
    if (bulanIndex !== -1) {
      jatuhTempo.setFullYear(finalTahun, bulanIndex + 1, 0); // Last day of the month
    } else {
      // Default to end of current month
      jatuhTempo.setMonth(jatuhTempo.getMonth() + 1, 0);
    }

    const tagihan = await prisma.tagihan.create({
      data: {
        kode,
        santriId,
        jenis: jenis as JenisTagihan,
        jumlah: parseInt(jumlah),
        bulan: finalBulan,
        tahun: finalTahun,
        status: StatusTagihan.BELUM_LUNAS,
        jatuhTempo,
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
    });

    return NextResponse.json({
      success: true,
      message: "Tagihan berhasil dibuat",
      tagihan,
    });
  } catch (error) {
    console.error("Error creating tagihan:", error);
    return NextResponse.json(
      { error: "Failed to create tagihan" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a tagihan (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Tagihan ID is required" },
        { status: 400 }
      );
    }

    // Check if tagihan has transaksi
    const tagihan = await prisma.tagihan.findUnique({
      where: { id },
      include: { transaksi: true },
    });

    if (!tagihan) {
      return NextResponse.json(
        { error: "Tagihan not found" },
        { status: 404 }
      );
    }

    if (tagihan.transaksi) {
      return NextResponse.json(
        { error: "Cannot delete tagihan that has transaksi. Remove transaksi first." },
        { status: 400 }
      );
    }

    await prisma.tagihan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Tagihan deleted successfully" });
  } catch (error) {
    console.error("Error deleting tagihan:", error);
    return NextResponse.json(
      { error: "Failed to delete tagihan" },
      { status: 500 }
    );
  }
}