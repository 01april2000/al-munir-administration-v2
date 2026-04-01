import { NextRequest, NextResponse } from "next/server";
import { JenisTransaksi, StatusTransaksi, StatusSantri, JenisSantri, Role, KelasSantri } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Default amounts for different transaction types
const DEFAULT_AMOUNTS: Record<string, number> = {
  UJIAN_UTS: 50000,
  UJIAN_UAS: 75000,
  UJIAN_NASIONAL: 100000,
  UJIAN_SEKOLAH: 60000,
  UJIAN_PRAKTIK: 80000,
  UJIAN_ANBK: 50000,
  UJIAN_TKA: 150000,
  UJIAN_LAINNYA: 50000,
  BUKU_PENDAMPING: 75000,
  PKL: 150000,
  LKS: 100000,
};

// Kelas yang terkena tagihan PKL
const PKL_KELAS: KelasSantri[] = [
  KelasSantri.XII_RPL_A,
  KelasSantri.XII_RPL_B,
  KelasSantri.XII_AKL,
];

// POST - Generate transactions for all active santri for a specific type
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
    const { jenisTransaksi, tahun, jenisSantri, jumlah, jenisUjian, keterangan, kelas, semester } = body;

    // Validate input
    if (!jenisTransaksi || !tahun) {
      return NextResponse.json(
        { error: "Jenis transaksi dan tahun wajib diisi" },
        { status: 400 }
      );
    }

    // Validate jenisTransaksi
    const validJenisTransaksi = ["UJIAN", "BUKU_PENDAMPING", "PKL", "LKS"];
    if (!validJenisTransaksi.includes(jenisTransaksi)) {
      return NextResponse.json(
        { error: "Jenis transaksi tidak valid. Gunakan: UJIAN, BUKU_PENDAMPING, PKL, atau LKS" },
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
      kelas?: { in: KelasSantri[] };
    } = {
      status: StatusSantri.AKTIF,
    };

    // For bendahara, force their jenisSantri. For admin, use the filter if provided.
    if (allowedJenisSantri) {
      santriFilter.jenisSantri = allowedJenisSantri;
    } else if (jenisSantri && ["SMK", "SMP", "PONDOK"].includes(jenisSantri)) {
      santriFilter.jenisSantri = jenisSantri as JenisSantri;
    }

    // For PKL, only target specific kelas (XII_RPL_A, XII_RPL_B, XII_AKL)
    if (jenisTransaksi === "PKL") {
      santriFilter.kelas = { in: PKL_KELAS };
      // PKL hanya untuk SMK
      santriFilter.jenisSantri = "SMK";
    }

    // For LKS, filter by selected kelas if provided
    if (jenisTransaksi === "LKS") {
      // LKS hanya untuk SMK
      santriFilter.jenisSantri = "SMK";
      // If specific kelas are selected, filter by them
      if (kelas && Array.isArray(kelas) && kelas.length > 0) {
        santriFilter.kelas = { in: kelas as KelasSantri[] };
      }
    }

    // Get all active santri
    const activeSantri = await prisma.santri.findMany({
      where: santriFilter,
      select: {
        id: true,
        nis: true,
        nama: true,
        jenisSantri: true,
        kelas: true,
      },
    });

    if (activeSantri.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada santri aktif ditemukan" },
        { status: 400 }
      );
    }

    // Determine the amount
    let finalJumlah = jumlah;
    if (!finalJumlah) {
      // Use default amount based on jenisUjian for UJIAN
      if (jenisTransaksi === "UJIAN" && jenisUjian) {
        const key = `UJIAN_${jenisUjian.toUpperCase()}`;
        finalJumlah = DEFAULT_AMOUNTS[key] || DEFAULT_AMOUNTS.UJIAN_LAINNYA;
      } else if (jenisTransaksi === "BUKU_PENDAMPING") {
        finalJumlah = DEFAULT_AMOUNTS.BUKU_PENDAMPING;
      } else if (jenisTransaksi === "PKL") {
        finalJumlah = DEFAULT_AMOUNTS.PKL;
      } else if (jenisTransaksi === "LKS") {
        finalJumlah = DEFAULT_AMOUNTS.LKS;
      } else {
        finalJumlah = DEFAULT_AMOUNTS.UJIAN_LAINNYA;
      }
    }

    // Generate kode prefix
    let kodePrefix: string;
    if (jenisTransaksi === "UJIAN") {
      kodePrefix = `UJIAN-${jenisUjian || "LAINNYA"}-${tahun}`;
    } else if (jenisTransaksi === "PKL") {
      kodePrefix = `PKL-${tahun}`;
    } else if (jenisTransaksi === "LKS") {
      kodePrefix = `LKS-${semester || "Semester-1"}-${tahun}`;
    } else {
      kodePrefix = `BUKU-PENDAMPING-${tahun}`;
    }

    // Build keterangan
    let finalKeterangan: string;
    if (jenisTransaksi === "UJIAN") {
      finalKeterangan = jenisUjian || keterangan || "Ujian";
    } else if (jenisTransaksi === "PKL") {
      finalKeterangan = keterangan || "Praktik Kerja Lapangan";
    } else if (jenisTransaksi === "LKS") {
      finalKeterangan = keterangan || "Lembar Kerja Siswa";
    } else {
      finalKeterangan = keterangan || "Buku Pendamping";
    }

    const transaksiData: {
      kode: string;
      santriId: string;
      jenis: JenisTransaksi;
      jumlah: number;
      tahun: number;
      bulan?: string;
      status: StatusTransaksi;
      managedBy: Role;
      keterangan: string;
    }[] = [];

    for (const santri of activeSantri) {
      const data: {
        kode: string;
        santriId: string;
        jenis: JenisTransaksi;
        jumlah: number;
        tahun: number;
        bulan?: string;
        status: StatusTransaksi;
        managedBy: Role;
        keterangan: string;
      } = {
        kode: `${kodePrefix}-${santri.nis}`,
        santriId: santri.id,
        jenis: jenisTransaksi as JenisTransaksi,
        jumlah: finalJumlah,
        tahun,
        status: "BELUM_BAYAR",
        managedBy: session.user.role as Role,
        keterangan: finalKeterangan,
      };

      // Add bulan (semester) for LKS transactions
      if (jenisTransaksi === "LKS" && semester) {
        data.bulan = semester;
      }

      transaksiData.push(data);
    }

    // Use try-catch to handle duplicates gracefully
    let created = 0;
    let skipped = 0;

    for (const transaksi of transaksiData) {
      try {
        await prisma.transaksi.create({
          data: transaksi,
        });
        created++;
      } catch (error) {
        // Unique constraint violation means it already exists
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil membuat ${created} transaksi. ${skipped} transaksi sudah ada sebelumnya.`,
      data: {
        totalSantri: activeSantri.length,
        created,
        skipped,
        jenisTransaksi,
        tahun,
        jumlah: finalJumlah,
      },
    });
  } catch (error) {
    console.error("Error generating transaksi:", error);
    return NextResponse.json(
      { error: "Gagal membuat transaksi" },
      { status: 500 }
    );
  }
}