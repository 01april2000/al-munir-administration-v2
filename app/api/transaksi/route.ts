import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, JenisTransaksi, StatusTransaksi, StatusUangSaku, JenisSantri, Role, JenisTagihan, StatusTagihan } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// GET - List all transaksi with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jenis = searchParams.get("jenis") as JenisTransaksi | null;
    const status = searchParams.get("status") as StatusTransaksi | null;
    const santriId = searchParams.get("santriId");
    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");
    let jenisSantri = searchParams.get("jenisSantri") as JenisSantri | null;
    const managedBy = searchParams.get("managedBy") as Role | null;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Auto-filter by jenisSantri based on user role
    const userRole = session.user.role as Role;
    if (userRole === "BENDAHARA_SMK") {
      jenisSantri = "SMK";
    } else if (userRole === "BENDAHARA_SMP") {
      jenisSantri = "SMP";
    } else if (userRole === "BENDAHARA_PONDOK") {
      jenisSantri = "PONDOK";
    }

    // Build filter
    const filter: {
      jenis?: JenisTransaksi;
      status?: StatusTransaksi;
      santriId?: string;
      bulan?: string;
      tahun?: number;
      santri?: { jenisSantri?: JenisSantri };
      managedBy?: Role;
      OR?: Array<{
        santri?: {
          OR?: Array<{
            nama?: { contains: string; mode: "insensitive" };
            nis?: { contains: string; mode: "insensitive" };
          }>;
        };
      }>;
    } = {};

    if (jenis && Object.values(JenisTransaksi).includes(jenis)) {
      filter.jenis = jenis;
    }
    if (status && Object.values(StatusTransaksi).includes(status)) {
      filter.status = status;
    }
    if (santriId) filter.santriId = santriId;
    if (bulan) filter.bulan = bulan;
    if (tahun) filter.tahun = parseInt(tahun);
    if (jenisSantri && Object.values(JenisSantri).includes(jenisSantri)) {
      filter.santri = { jenisSantri };
    }
    if (managedBy && Object.values(Role).includes(managedBy)) {
      filter.managedBy = managedBy;
    }
    if (search) {
      filter.OR = [
        {
          santri: {
            OR: [
              { nama: { contains: search, mode: "insensitive" } },
              { nis: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [transaksi, total] = await Promise.all([
      prisma.transaksi.findMany({
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
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.transaksi.count({ where: filter }),
    ]);

    return NextResponse.json({
      items: transaksi,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching transaksi:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaksi" },
      { status: 500 }
    );
  }
}

// POST - Create a new transaksi
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      santriId,
      jenis,
      jumlah,
      bulan,
      tahun,
      periodePembayaran,
      tanggalBayar,
      status,
      statusUangSaku,
      jenisLaundry,
      keterangan,
    } = body;

    // Validate required fields
    if (!santriId || !jenis || !jumlah) {
      return NextResponse.json(
        { error: "Santri ID, jenis transaksi, dan jumlah wajib diisi" },
        { status: 400 }
      );
    }

    // Validate jenis transaksi
    if (!Object.values(JenisTransaksi).includes(jenis)) {
      return NextResponse.json(
        { error: "Jenis transaksi tidak valid" },
        { status: 400 }
      );
    }

    // Validate required fields based on jenis
    if ((jenis === "SPP" || jenis === "SYAHRIAH") && (!bulan || !tahun)) {
      return NextResponse.json(
        { error: "Bulan dan tahun wajib diisi untuk transaksi SPP dan Syahriah" },
        { status: 400 }
      );
    }

    if (jenis === "UANG_SAKU" && !statusUangSaku) {
      return NextResponse.json(
        { error: "Status uang saku wajib diisi untuk transaksi Uang Saku" },
        { status: 400 }
      );
    }

    // Validate statusUangSaku if provided
    if (statusUangSaku && !Object.values(StatusUangSaku).includes(statusUangSaku)) {
      return NextResponse.json(
        { error: "Status uang saku tidak valid" },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !Object.values(StatusTransaksi).includes(status)) {
      return NextResponse.json(
        { error: "Status transaksi tidak valid" },
        { status: 400 }
      );
    }

    // Check if santri exists
    const santri = await prisma.santri.findUnique({
      where: { id: santriId },
    });

    if (!santri) {
      return NextResponse.json(
        { error: "Santri tidak ditemukan" },
        { status: 404 }
      );
    }

    // Generate transaction code
    const kode = `TRX-${jenis}-${Date.now()}`;

    // Create the transaction
    const transaksi = await prisma.transaksi.create({
      data: {
        kode,
        santriId,
        jenis,
        jumlah,
        bulan: bulan || null,
        tahun: tahun || null,
        periodePembayaran: periodePembayaran || null,
        tanggalBayar: tanggalBayar ? new Date(tanggalBayar) : null,
        status: status || "BELUM_BAYAR",
        statusUangSaku: statusUangSaku || null,
        jenisLaundry: jenisLaundry || null,
        keterangan: keterangan || null,
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

    // For SPP and SYAHRIAH transactions, create or update the corresponding Tagihan
    if (jenis === "SPP" || jenis === "SYAHRIAH") {
      const bulanList = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      // Calculate jatuh tempo (15th of the month)
      const bulanIndex = bulanList.indexOf(bulan!);
      const jatuhTempo = new Date(tahun!, bulanIndex, 15);

      const tagihanJenis: JenisTagihan = jenis === "SPP" ? "SPP" : "SYAHRIAH";
      const tagihanKode = `${tagihanJenis}-${santri.nis}-${bulan}-${tahun}`;

      // Determine tagihan status based on transaksi status
      const tagihanStatus: StatusTagihan = status === "LUNAS" ? "LUNAS" : "BELUM_LUNAS";

      // Create or update the tagihan record
      await prisma.tagihan.upsert({
        where: {
          santriId_jenis_bulan_tahun: {
            santriId,
            jenis: tagihanJenis,
            bulan: bulan!,
            tahun: tahun!,
          },
        },
        update: {
          jumlah,
          status: tagihanStatus,
          transaksiId: transaksi.id,
          updatedAt: new Date(),
        },
        create: {
          kode: tagihanKode,
          santriId,
          jenis: tagihanJenis,
          bulan: bulan!,
          tahun: tahun!,
          jumlah,
          status: tagihanStatus,
          jatuhTempo,
          transaksiId: transaksi.id,
        },
      });
    }

    return NextResponse.json({ transaksi }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaksi:", error);
    return NextResponse.json(
      { error: "Failed to create transaksi" },
      { status: 500 }
    );
  }
}