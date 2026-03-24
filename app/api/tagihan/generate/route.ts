import { NextRequest, NextResponse } from "next/server";
import { JenisTagihan, StatusTagihan, JenisSantri, StatusSantri } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Default amounts per jenisSantri (can be configured later in a settings table)
const DEFAULT_AMOUNTS: Record<JenisSantri, { SPP: number; SYAHRIAH: number }> = {
  SMK: { SPP: 250000, SYAHRIAH: 300000 },
  SMP: { SPP: 300000, SYAHRIAH: 200000 },
  PONDOK: { SPP: 250000, SYAHRIAH: 150000 },
};

// POST - Generate tagihan for all active santri for a specific month/year
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Determine allowed jenisSantri based on role
    let allowedJenisSantri: JenisSantri | null = null;
    if (session.user.role === "ADMIN") {
      // Admin can generate for any jenisSantri
      allowedJenisSantri = null;
    } else if (session.user.role === "BENDAHARA_SMK") {
      allowedJenisSantri = "SMK";
    } else if (session.user.role === "BENDAHARA_SMP") {
      allowedJenisSantri = "SMP";
    } else if (session.user.role === "BENDAHARA_PONDOK") {
      allowedJenisSantri = "PONDOK";
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bulan, tahun, jenisSantri, jenisTagihan, sppAmount, syahriahAmount } = body;

    // Validate input
    if (!bulan || !tahun) {
      return NextResponse.json(
        { error: "Bulan dan tahun wajib diisi" },
        { status: 400 }
      );
    }

    const bulanList = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    if (!bulanList.includes(bulan)) {
      return NextResponse.json(
        { error: "Bulan tidak valid. Gunakan format: Januari, Februari, dst." },
        { status: 400 }
      );
    }

    if (typeof tahun !== "number" || tahun < 2020 || tahun > 2100) {
      return NextResponse.json(
        { error: "Tahun tidak valid" },
        { status: 400 }
      );
    }

    // Build filter for santri
    const santriFilter: {
      status: StatusSantri;
      jenisSantri?: JenisSantri;
    } = {
      status: StatusSantri.AKTIF,
    };

    // For bendahara, force their jenisSantri. For admin, use the filter if provided.
    if (allowedJenisSantri) {
      santriFilter.jenisSantri = allowedJenisSantri;
    } else if (jenisSantri && ["SMK", "SMP", "PONDOK"].includes(jenisSantri)) {
      santriFilter.jenisSantri = jenisSantri as JenisSantri;
    }

    // Get all active santri
    const activeSantri = await prisma.santri.findMany({
      where: santriFilter,
      select: {
        id: true,
        nis: true,
        nama: true,
        jenisSantri: true,
        beasiswa: true,
        jenisBeasiswa: true,
      },
    });

    if (activeSantri.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada santri aktif ditemukan" },
        { status: 400 }
      );
    }

    // Calculate jatuh tempo (15th of the month)
    const bulanIndex = bulanList.indexOf(bulan);
    const jatuhTempo = new Date(tahun, bulanIndex, 15);

    // Determine which tagihan types to generate
    const generateSPP = !jenisTagihan || jenisTagihan === "SPP" || jenisTagihan === "ALL";
    const generateSyahriah = !jenisTagihan || jenisTagihan === "SYAHRIAH" || jenisTagihan === "ALL";

    const tagihanData: {
      kode: string;
      santriId: string;
      jenis: JenisTagihan;
      bulan: string;
      tahun: number;
      jumlah: number;
      status: StatusTagihan;
      jatuhTempo: Date;
    }[] = [];

    for (const santri of activeSantri) {
      // Get amounts based on jenisSantri or custom amounts
      const amounts = DEFAULT_AMOUNTS[santri.jenisSantri];
      const sppAmountFinal = sppAmount ?? amounts.SPP;
      const syahriahAmountFinal = syahriahAmount ?? amounts.SYAHRIAH;

      // Generate SPP tagihan
      if (generateSPP) {
        // Skip if santri has full or SPP scholarship
        const skipSPP = santri.beasiswa && 
          (santri.jenisBeasiswa === "FULL" || santri.jenisBeasiswa === "SPP");

        if (!skipSPP && sppAmountFinal > 0) {
          tagihanData.push({
            kode: `SPP-${santri.nis}-${bulan}-${tahun}`,
            santriId: santri.id,
            jenis: "SPP",
            bulan,
            tahun,
            jumlah: sppAmountFinal,
            status: "BELUM_LUNAS",
            jatuhTempo,
          });
        }
      }

      // Generate SYAHRIAH tagihan
      if (generateSyahriah) {
        // Skip if santri has full or SYAHRIAH scholarship
        const skipSyahriah = santri.beasiswa && 
          (santri.jenisBeasiswa === "FULL" || santri.jenisBeasiswa === "SYAHRIAH");

        if (!skipSyahriah && syahriahAmountFinal > 0) {
          tagihanData.push({
            kode: `SYAHRIAH-${santri.nis}-${bulan}-${tahun}`,
            santriId: santri.id,
            jenis: "SYAHRIAH",
            bulan,
            tahun,
            jumlah: syahriahAmountFinal,
            status: "BELUM_LUNAS",
            jatuhTempo,
          });
        }
      }
    }

    // Use upsert to handle duplicates gracefully
    let created = 0;
    let skipped = 0;

    for (const tagihan of tagihanData) {
      try {
        await prisma.tagihan.create({
          data: tagihan,
        });
        created++;
      } catch (error) {
        // Unique constraint violation means it already exists
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil membuat ${created} tagihan. ${skipped} tagihan sudah ada sebelumnya.`,
      data: {
        totalSantri: activeSantri.length,
        created,
        skipped,
        bulan,
        tahun,
      },
    });
  } catch (error) {
    console.error("Error generating tagihan:", error);
    return NextResponse.json(
      { error: "Gagal membuat tagihan" },
      { status: 500 }
    );
  }
}