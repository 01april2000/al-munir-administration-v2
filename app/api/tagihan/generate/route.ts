import { NextRequest, NextResponse } from "next/server";
import { JenisTagihan, StatusTagihan, JenisSantri, StatusSantri, KelasSantri } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Default amounts per jenisSantri for SPP and SYAHRIAH (can be configured later in a settings table)
const DEFAULT_AMOUNTS: Record<JenisSantri, { SPP: number; SYAHRIAH: number }> = {
  SMK: { SPP: 250000, SYAHRIAH: 300000 },
  SMP: { SPP: 300000, SYAHRIAH: 200000 },
  PONDOK: { SPP: 250000, SYAHRIAH: 150000 },
};

// All available JenisTagihan types
const ALL_JENIS_TAGIHAN: JenisTagihan[] = [
  "SPP", "SYAHRIAH", "UANG_SAKU", "LAUNDRY",
  "UJIAN", "PKL", "LKS", "BUKU_PENDAMPING", "TKA"
];

// PKL tagihan is only for kelas XII
const PKL_ALLOWED_KELAS = ["XII_RPL_A", "XII_RPL_B", "XII_AKL"] as const;

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
    const { bulan, tahun, jenisSantri, jenisTagihan, jenisUjian, semester, sppAmount, syahriahAmount, customAmount, kelas } = body as {
      bulan: string;
      tahun: number;
      jenisSantri?: string;
      jenisTagihan?: string;
      jenisUjian?: string;
      semester?: string;
      sppAmount?: number;
      syahriahAmount?: number;
      customAmount?: number;
      kelas?: string[];
    };

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

    // Validate jenisTagihan - must be a valid JenisTagihan or "ALL"
    const validJenisTagihan = jenisTagihan === "ALL" || (jenisTagihan ? ALL_JENIS_TAGIHAN.includes(jenisTagihan as JenisTagihan) : false);
    if (jenisTagihan && !validJenisTagihan) {
      return NextResponse.json(
        { error: `Jenis tagihan tidak valid. Pilihan: ${ALL_JENIS_TAGIHAN.join(", ")} atau ALL` },
        { status: 400 }
      );
    }

    // For non-SPP/SYAHRIAH types, customAmount is required
    const isOtherTagihanType = jenisTagihan &&
      jenisTagihan !== "ALL" &&
      jenisTagihan !== "SPP" &&
      jenisTagihan !== "SYAHRIAH";
    
    if (isOtherTagihanType && (!customAmount || customAmount <= 0)) {
      return NextResponse.json(
        { error: `Jumlah untuk tagihan ${jenisTagihan} wajib diisi` },
        { status: 400 }
      );
    }

    // For UJIAN type, jenisUjian is required
    if (jenisTagihan === "UJIAN" && !jenisUjian) {
      return NextResponse.json(
        { error: "Jenis ujian wajib dipilih" },
        { status: 400 }
      );
    }

    // For LKS and BUKU_PENDAMPING types, semester is required
    if ((jenisTagihan === "LKS" || jenisTagihan === "BUKU_PENDAMPING") && !semester) {
      return NextResponse.json(
        { error: `Semester wajib dipilih untuk tagihan ${jenisTagihan}` },
        { status: 400 }
      );
    }

    // Build filter for santri
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const santriFilter: any = {
      status: StatusSantri.AKTIF,
    };

    // For bendahara, force their jenisSantri. For admin, use the filter if provided.
    if (allowedJenisSantri) {
      santriFilter.jenisSantri = allowedJenisSantri;
    } else if (jenisSantri && ["SMK", "SMP", "PONDOK"].includes(jenisSantri)) {
      santriFilter.jenisSantri = jenisSantri as JenisSantri;
    }

    // Filter by kelas if provided
    if (kelas && kelas.length > 0) {
      santriFilter.kelas = { in: kelas as KelasSantri[] };
    }

    // Get all active santri
    const activeSantri = await prisma.santri.findMany({
      where: santriFilter,
      select: {
        id: true,
        nis: true,
        nama: true,
        kelas: true,
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
    const generateAll = !jenisTagihan || jenisTagihan === "ALL";
    const generateSPP = generateAll || jenisTagihan === "SPP";
    const generateSyahriah = generateAll || jenisTagihan === "SYAHRIAH";
    
    // For other tagihan types (UJIAN, PKL, LKS, etc.)
    const generateOtherType: JenisTagihan | null = isOtherTagihanType ? jenisTagihan as JenisTagihan : null;

    const tagihanData: {
      kode: string;
      santriId: string;
      jenis: JenisTagihan;
      bulan: string;
      tahun: number;
      jumlah: number;
      status: StatusTagihan;
      jatuhTempo: Date;
      keterangan?: string | null;
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

      // Generate other tagihan types (UJIAN, PKL, LKS, BUKU_PENDAMPING, TKA, UANG_SAKU, LAUNDRY)
      if (generateOtherType && customAmount && customAmount > 0) {
        // For PKL, only generate for specific kelas (XII)
        if (generateOtherType === "PKL" && !PKL_ALLOWED_KELAS.includes(santri.kelas as typeof PKL_ALLOWED_KELAS[number])) {
          continue;
        }

        // For UJIAN type, include jenisUjian in the kode
        // For LKS type, include semester in the kode
        let kodeSuffix = `${bulan}-${tahun}`;
        if (generateOtherType === "UJIAN" && jenisUjian) {
          kodeSuffix = `${jenisUjian}-${bulan}-${tahun}`;
        } else if ((generateOtherType === "LKS" || generateOtherType === "BUKU_PENDAMPING") && semester) {
          kodeSuffix = `${semester}-${bulan}-${tahun}`;
        }

        // Determine keterangan based on type
        let keteranganValue: string | null = null;
        if (generateOtherType === "UJIAN") {
          keteranganValue = jenisUjian || null;
        } else if (generateOtherType === "LKS" || generateOtherType === "BUKU_PENDAMPING") {
          keteranganValue = semester || null;
        }
        
        tagihanData.push({
          kode: `${generateOtherType}-${santri.nis}-${kodeSuffix}`,
          santriId: santri.id,
          jenis: generateOtherType,
          bulan,
          tahun,
          jumlah: customAmount,
          status: "BELUM_LUNAS",
          jatuhTempo,
          keterangan: keteranganValue,
        });
      }
    }

    // Use createMany with skipDuplicates for bulk insert (1 query instead of N queries)
    const result = await prisma.tagihan.createMany({
      data: tagihanData,
      skipDuplicates: true, // Skip jika kode sudah ada (unique constraint)
    });

    const created = result.count;
    const skipped = tagihanData.length - result.count;

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
// GET - Cron job endpoint for automatic monthly generation
export async function GET(request: NextRequest) {
  try {
    // ===== VALIDASI CRON SECRET =====
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ===== AUTO-DETECT BULAN & TAHUN =====
    const now = new Date();
    const wibOffset = 7 * 60 * 60 * 1000;
    const wibTime = new Date(now.getTime() + wibOffset);
    
    const bulanList = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    const bulan = bulanList[wibTime.getMonth()];
    const tahun = wibTime.getFullYear();

    // ===== REUSE LOGIC DARI POST =====
    const activeSantri = await prisma.santri.findMany({
      where: { status: StatusSantri.AKTIF },
      select: {
        id: true, nis: true, nama: true, jenisSantri: true,
        beasiswa: true, jenisBeasiswa: true,
      },
    });

    if (activeSantri.length === 0) {
      return NextResponse.json({ success: true, message: "Tidak ada santri aktif" });
    }

    const bulanIndex = bulanList.indexOf(bulan);
    const jatuhTempo = new Date(tahun, bulanIndex, 15);

    const tagihanData: any[] = [];

    for (const santri of activeSantri) {
      const amounts = DEFAULT_AMOUNTS[santri.jenisSantri];

      // SPP
      const skipSPP = santri.beasiswa && 
        (santri.jenisBeasiswa === "FULL" || santri.jenisBeasiswa === "SPP");
      if (!skipSPP && amounts.SPP > 0) {
        tagihanData.push({
          kode: `SPP-${santri.nis}-${bulan}-${tahun}`,
          santriId: santri.id, jenis: "SPP", bulan, tahun,
          jumlah: amounts.SPP, status: "BELUM_LUNAS", jatuhTempo,
        });
      }

      // SYAHRIAH
      const skipSyahriah = santri.beasiswa && 
        (santri.jenisBeasiswa === "FULL" || santri.jenisBeasiswa === "SYAHRIAH");
      if (!skipSyahriah && amounts.SYAHRIAH > 0) {
        tagihanData.push({
          kode: `SYAHRIAH-${santri.nis}-${bulan}-${tahun}`,
          santriId: santri.id, jenis: "SYAHRIAH", bulan, tahun,
          jumlah: amounts.SYAHRIAH, status: "BELUM_LUNAS", jatuhTempo,
        });
      }
    }

    // Use createMany with skipDuplicates for bulk insert (1 query instead of N queries)
    const result = await prisma.tagihan.createMany({
      data: tagihanData,
      skipDuplicates: true, // Skip jika kode sudah ada (unique constraint)
    });

    const created = result.count;
    const skipped = tagihanData.length - result.count;

    return NextResponse.json({
      success: true,
      message: `Cron: ${created} tagihan dibuat, ${skipped} sudah ada.`,
      data: { bulan, tahun, created, skipped },
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
