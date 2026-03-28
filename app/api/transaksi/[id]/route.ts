import { NextRequest, NextResponse } from "next/server";
import { JenisTransaksi, StatusTransaksi, StatusUangSaku, PeriodePembayaran, JenisTagihan, StatusTagihan } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET - Get a single transaksi by ID
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

    const transaksi = await prisma.transaksi.findUnique({
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
      },
    });

    if (!transaksi) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaksi });
  } catch (error) {
    console.error("Error fetching transaksi:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaksi" },
      { status: 500 }
    );
  }
}

// PUT - Update a transaksi
export async function PUT(
  request: NextRequest,
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

    // Check if transaksi exists
    const existingTransaksi = await prisma.transaksi.findUnique({
      where: { id },
    });

    if (!existingTransaksi) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    // Validate jenis if provided
    if (jenis && !Object.values(JenisTransaksi).includes(jenis)) {
      return NextResponse.json(
        { error: "Jenis transaksi tidak valid" },
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

    // Validate statusUangSaku if provided
    if (statusUangSaku && !Object.values(StatusUangSaku).includes(statusUangSaku)) {
      return NextResponse.json(
        { error: "Status uang saku tidak valid" },
        { status: 400 }
      );
    }

    // Validate periodePembayaran if provided
    if (periodePembayaran && !Object.values(PeriodePembayaran).includes(periodePembayaran)) {
      return NextResponse.json(
        { error: "Periode pembayaran tidak valid" },
        { status: 400 }
      );
    }

    // If santriId is being changed, verify the santri exists
    if (santriId && santriId !== existingTransaksi.santriId) {
      const santri = await prisma.santri.findUnique({
        where: { id: santriId },
      });
      if (!santri) {
        return NextResponse.json(
          { error: "Santri tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    const transaksi = await prisma.transaksi.update({
      where: { id },
      data: {
        ...(santriId !== undefined && { santriId }),
        ...(jenis !== undefined && { jenis }),
        ...(jumlah !== undefined && { jumlah }),
        ...(bulan !== undefined && { bulan }),
        ...(tahun !== undefined && { tahun }),
        ...(periodePembayaran !== undefined && { periodePembayaran }),
        ...(tanggalBayar !== undefined && { tanggalBayar: tanggalBayar ? new Date(tanggalBayar) : null }),
        ...(status !== undefined && { status }),
        ...(statusUangSaku !== undefined && { statusUangSaku }),
        ...(jenisLaundry !== undefined && { jenisLaundry }),
        ...(keterangan !== undefined && { keterangan }),
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

    // For SPP and SYAHRIAH transactions, update the corresponding Tagihan
    const transaksiJenis = jenis ?? existingTransaksi.jenis;
    const transaksiBulan = bulan ?? existingTransaksi.bulan;
    const transaksiTahun = tahun ?? existingTransaksi.tahun;
    const transaksiJumlah = jumlah ?? existingTransaksi.jumlah;
    const transaksiStatus = status ?? existingTransaksi.status;
    const transaksiSantriId = santriId ?? existingTransaksi.santriId;

    if (transaksiJenis === "SPP" || transaksiJenis === "SYAHRIAH") {
      const bulanList = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      const tagihanJenis: JenisTagihan = transaksiJenis === "SPP" ? "SPP" : "SYAHRIAH";
      const tagihanStatus: StatusTagihan = transaksiStatus === "LUNAS" ? "LUNAS" : "BELUM_LUNAS";

      // Update the tagihan record if it exists
      if (transaksiBulan && transaksiTahun) {
        await prisma.tagihan.updateMany({
          where: {
            santriId: transaksiSantriId,
            jenis: tagihanJenis,
            bulan: transaksiBulan,
            tahun: transaksiTahun,
          },
          data: {
            jumlah: transaksiJumlah,
            status: tagihanStatus,
            transaksiId: transaksi.id,
            updatedAt: new Date(),
          },
        });
      }
    }

  // Handle UANG_SAKU balance updates
  const transaksiStatusUangSaku = statusUangSaku ?? existingTransaksi.statusUangSaku;
  
  if (transaksiJenis === "UANG_SAKU" && transaksiStatusUangSaku) {
    // Calculate balance changes based on status changes
    const wasLunas = existingTransaksi.status === "LUNAS";
    const nowLunas = transaksiStatus === "LUNAS";
    
    if (!wasLunas && nowLunas) {
      // Status changed to LUNAS - add/subtract balance
      const balanceChange = transaksiStatusUangSaku === "DITAMBAH" ? transaksiJumlah : -transaksiJumlah;
      await prisma.santri.update({
        where: { id: transaksiSantriId },
        data: {
          saldoUangSaku: {
            increment: balanceChange,
          },
        },
      });
    } else if (wasLunas && !nowLunas) {
      // Status changed from LUNAS to non-LUNAS - reverse the balance
      const balanceChange = transaksiStatusUangSaku === "DITAMBAH" ? -transaksiJumlah : transaksiJumlah;
      await prisma.santri.update({
        where: { id: transaksiSantriId },
        data: {
          saldoUangSaku: {
            increment: balanceChange,
          },
        },
      });
    } else if (wasLunas && nowLunas && jumlah !== undefined && jumlah !== existingTransaksi.jumlah) {
      // Amount changed while staying LUNAS - adjust the difference
      const oldBalanceChange = transaksiStatusUangSaku === "DITAMBAH" ? -existingTransaksi.jumlah : existingTransaksi.jumlah;
      const newBalanceChange = transaksiStatusUangSaku === "DITAMBAH" ? transaksiJumlah : -transaksiJumlah;
      const netChange = oldBalanceChange + newBalanceChange;
      
      if (netChange !== 0) {
        await prisma.santri.update({
          where: { id: transaksiSantriId },
          data: {
            saldoUangSaku: {
              increment: netChange,
            },
          },
        });
      }
    }
  }

  return NextResponse.json({ transaksi });
  } catch (error) {
    console.error("Error updating transaksi:", error);
    return NextResponse.json(
      { error: "Failed to update transaksi" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a transaksi
export async function DELETE(
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

    // Check if transaksi exists
    const existingTransaksi = await prisma.transaksi.findUnique({
      where: { id },
    });

    if (!existingTransaksi) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    // For SPP and SYAHRIAH transactions, update the corresponding Tagihan
    if (existingTransaksi.jenis === "SPP" || existingTransaksi.jenis === "SYAHRIAH") {
      if (existingTransaksi.bulan && existingTransaksi.tahun) {
        const tagihanJenis: JenisTagihan = existingTransaksi.jenis === "SPP" ? "SPP" : "SYAHRIAH";
        
        // Update the tagihan record to remove the transaksi reference and reset status
        await prisma.tagihan.updateMany({
          where: {
            santriId: existingTransaksi.santriId,
            jenis: tagihanJenis,
            bulan: existingTransaksi.bulan,
            tahun: existingTransaksi.tahun,
          },
          data: {
            transaksiId: null,
            status: "BELUM_LUNAS",
            updatedAt: new Date(),
          },
        });
      }
    }

    await prisma.transaksi.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting transaksi:", error);
    return NextResponse.json(
      { error: "Failed to delete transaksi" },
      { status: 500 }
    );
  }
}