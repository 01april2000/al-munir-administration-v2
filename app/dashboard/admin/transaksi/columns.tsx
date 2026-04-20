"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Trash2, Banknote, Printer } from "lucide-react";
import { Transaksi, JenisTransaksi, STATUS_TRANSAKSI_OPTIONS, STATUS_UANG_SAKU_OPTIONS, BULAN_OPTIONS } from "@/lib/types/transaksi";

// Format currency to Indonesian Rupiah
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date to Indonesian locale
export function formatDate(date: Date | string | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

// Status badge variants
const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  LUNAS: "default",
  PENDING: "secondary",
  BELUM_BAYAR: "destructive",
  DITOLAK: "outline",
};

const statusLabels: Record<string, string> = {
  LUNAS: "Lunas",
  PENDING: "Pending",
  BELUM_BAYAR: "Belum Bayar",
  DITOLAK: "Ditolak",
};

const statusUangSakuVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DITAMBAH: "default",
  DIAMBIL: "secondary",
};

const statusUangSakuLabels: Record<string, string> = {
  DITAMBAH: "Ditambah",
  DIAMBIL: "Diambil",
};

// Status Badge Component
export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusVariants[status] || "outline"}>
      {statusLabels[status] || status}
    </Badge>
  );
}

// Status Uang Saku Badge Component
export function StatusUangSakuBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusUangSakuVariants[status] || "outline"}>
      {statusUangSakuLabels[status] || status}
    </Badge>
  );
}

// Metode Pembayaran labels and variants
const metodePembayaranVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CASH: "default",
  MIDTRANS: "secondary",
  TRANSFER: "outline",
  SALDO: "secondary",
};

const metodePembayaranLabels: Record<string, string> = {
  CASH: "Cash",
  MIDTRANS: "Midtrans",
  TRANSFER: "Transfer",
  SALDO: "Saldo",
};

// Metode Pembayaran Badge Component
export function MetodePembayaranBadge({ metode }: { metode: string | null }) {
  if (!metode) return <span className="text-muted-foreground">-</span>;
  return (
    <Badge variant={metodePembayaranVariants[metode] || "outline"}>
      {metodePembayaranLabels[metode] || metode}
    </Badge>
  );
}

interface ColumnOptions {
  onDelete?: (transaksi: Transaksi) => void;
  onCashPayment?: (transaksi: Transaksi) => void;
  onPrintReceipt?: (transaksi: Transaksi) => void;
}

// Base columns shared by all transaction types
const baseColumns: ColumnDef<Transaksi>[] = [
  {
    accessorKey: "kode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kode
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "santri",
    header: "Santri",
    cell: ({ row }) => {
      const santri = row.original.santri;
      return (
        <div>
          <div className="font-medium">{santri.nama}</div>
          <div className="text-xs text-muted-foreground">{santri.nis}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "jumlah",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Jumlah
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const jumlah = row.getValue("jumlah") as number;
      return <div className="font-medium">{formatCurrency(jumlah)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "metodePembayaran",
    header: "Metode",
    cell: ({ row }) => {
      const metode = row.getValue("metodePembayaran") as string | null;
      return <MetodePembayaranBadge metode={metode} />;
    },
  },
  {
    accessorKey: "tanggalBayar",
    header: "Tgl. Bayar",
    cell: ({ row }) => {
      const tanggalBayar = row.getValue("tanggalBayar") as Date | null;
      return formatDate(tanggalBayar);
    },
  },
];

// SPP/Syahriah specific columns
const sppSyahriahColumns: ColumnDef<Transaksi>[] = [
  {
    accessorKey: "bulan",
    header: "Bulan",
    cell: ({ row }) => {
      const bulan = row.getValue("bulan") as string;
      return bulan || "-";
    },
  },
  {
    accessorKey: "tahun",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tahun
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "periodePembayaran",
    header: "Periode",
    cell: ({ row }) => {
      const periode = row.getValue("periodePembayaran") as string;
      if (!periode) return "-";
      const labels: Record<string, string> = {
        BULANAN: "Bulanan",
        SEMESTER: "Semester",
        TAHUNAN: "Tahunan",
      };
      return labels[periode] || periode;
    },
  },
];

// Jenis Transaksi label mapping
const jenisTransaksiLabels: Record<string, string> = {
  SPP: "SPP",
  SYAHRIAH: "Syahriah",
  PKL: "PKL",
  UANG_SAKU: "Uang Saku",
  LAUNDRY: "Laundry",
  LKS: "LKS",
  UJIAN: "Ujian",
  BUKU_PENDAMPING: "Buku Pendamping",
};

// Uang Saku specific columns
const uangSakuColumns: ColumnDef<Transaksi>[] = [
  {
    accessorKey: "statusUangSaku",
    header: "Jenis",
    cell: ({ row }) => {
      const status = row.getValue("statusUangSaku") as string;
      const jenis = row.original.jenis;
      if (status) {
        return <StatusUangSakuBadge status={status} />;
      }
      // For saldo-paid transactions (metodePembayaran: SALDO), show the transaction jenis
      if (jenis && jenis !== "UANG_SAKU") {
        return <Badge variant="outline">{jenisTransaksiLabels[jenis] || jenis}</Badge>;
      }
      return "-";
    },
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
    cell: ({ row }) => {
      const keterangan = row.getValue("keterangan") as string;
      return keterangan ? (
        <span className="text-sm text-muted-foreground">{keterangan}</span>
      ) : (
        "-"
      );
    },
  },
];

// Ujian specific columns
const JENIS_UJIAN_OPTIONS = [
  { value: "UTS", label: "UTS (Ujian Tengah Semester)" },
  { value: "UAS", label: "UAS (Ujian Akhir Semester)" },
  { value: "UJIAN_NASIONAL", label: "Ujian Nasional" },
  { value: "UJIAN_SEKOLAH", label: "Ujian Sekolah" },
  { value: "UJIAN_PRAKTIK", label: "Ujian Praktik" },
  { value: "ANBK", label: "ANBK (Asesmen Nasional Berbasis Komputer)" },
  { value: "TKA", label: "TKA (Tes Kompetensi Akademik)" },
  { value: "UJIAN_LAINNYA", label: "Ujian Lainnya" },
] as const;

const ujianColumns: ColumnDef<Transaksi>[] = [
  {
    id: "jenisUjian",
    accessorKey: "keterangan",
    header: "Jenis Ujian",
    cell: ({ row }) => {
      const keterangan = row.original.keterangan;
      const jenisUjianOption = JENIS_UJIAN_OPTIONS.find(
        (opt) => opt.value === keterangan
      );
      return jenisUjianOption ? jenisUjianOption.label : keterangan || "-";
    },
  },
  {
    accessorKey: "bulan",
    header: "Bulan",
    cell: ({ row }) => {
      const bulan = row.getValue("bulan") as string;
      if (!bulan) return "-";
      const bulanOption = BULAN_OPTIONS.find((opt) => opt.value === bulan);
      return bulanOption ? bulanOption.label : bulan;
    },
  },
  {
    accessorKey: "tahun",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tahun
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

// Semester options for LKS
const SEMESTER_OPTIONS = [
  { value: "SEMESTER_1", label: "Semester 1 (Ganjil)" },
  { value: "SEMESTER_2", label: "Semester 2 (Genap)" },
  { value: "Semester 1", label: "Semester 1" },
  { value: "Semester 2", label: "Semester 2" },
] as const;

// LKS specific columns
const lksColumns: ColumnDef<Transaksi>[] = [
  {
    id: "semester",
    header: "Semester",
    cell: ({ row }) => {
      const keterangan = row.original.keterangan;
      const bulan = row.original.bulan;
      // Check keterangan first (from tagihan generate), then bulan (from transaksi generate)
      const semesterValue = keterangan || bulan;
      const semesterOption = SEMESTER_OPTIONS.find(
        (opt) => opt.value === semesterValue
      );
      return semesterOption ? semesterOption.label : semesterValue || "-";
    },
  },
  {
    accessorKey: "tahun",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tahun
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

// Laundry specific columns
const laundryColumns: ColumnDef<Transaksi>[] = [
  {
    accessorKey: "jenisLaundry",
    header: "Jenis Laundry",
    cell: ({ row }) => {
      const jenisLaundry = row.getValue("jenisLaundry") as string;
      return jenisLaundry || "-";
    },
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
    cell: ({ row }) => {
      const keterangan = row.getValue("keterangan") as string;
      return keterangan ? (
        <span className="text-sm text-muted-foreground">{keterangan}</span>
      ) : (
        "-"
      );
    },
  },
];

// Actions column factory
function createActionsColumn(options: ColumnOptions): ColumnDef<Transaksi> {
  return {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const transaksi = row.original;
      const canConfirmCashPayment = transaksi.status === "BELUM_BAYAR" || transaksi.status === "PENDING";
      const canPrintReceipt = transaksi.status === "LUNAS";
      
      return (
        <div className="flex items-center gap-1">
          {options.onCashPayment && canConfirmCashPayment && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => options.onCashPayment!(transaksi)}
              title="Konfirmasi Pembayaran Cash"
            >
              <Banknote className="h-4 w-4 text-green-600" />
            </Button>
          )}
          {options.onPrintReceipt && canPrintReceipt && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => options.onPrintReceipt!(transaksi)}
              title="Cetak Struk"
            >
              <Printer className="h-4 w-4 text-blue-600" />
            </Button>
          )}
          {options.onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => options.onDelete!(transaksi)}
              title="Hapus"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      );
    },
  };
}

// Main function to get columns based on transaction type
export function getTransaksiColumns(
  jenis: JenisTransaksi,
  options: ColumnOptions = {}
): ColumnDef<Transaksi>[] {
  const columns: ColumnDef<Transaksi>[] = [...baseColumns];

  // Add type-specific columns before the status column
  if (jenis === "SPP" || jenis === "SYAHRIAH") {
    // Insert before status column (index 3)
    columns.splice(3, 0, ...sppSyahriahColumns);
  } else if (jenis === "UANG_SAKU") {
    // Insert statusUangSaku before jumlah column
    columns.splice(2, 0, ...uangSakuColumns.filter((_, i) => i === 0));
    // Insert keterangan after status column
    columns.splice(6, 0, ...uangSakuColumns.filter((_, i) => i === 1));
  } else if (jenis === "LAUNDRY") {
    // Insert jenisLaundry after santri column
    columns.splice(2, 0, ...laundryColumns.filter((_, i) => i === 0));
    // Insert keterangan after status column
    columns.splice(6, 0, ...laundryColumns.filter((_, i) => i === 1));
  } else if (jenis === "UJIAN") {
    // Insert jenisUjian and tahun after santri column
    columns.splice(2, 0, ...ujianColumns);
  } else if (jenis === "LKS") {
    // Insert semester, bulan, and tahun after santri column
    columns.splice(2, 0, ...lksColumns);
  }

  // Add actions column if callbacks provided
  if (options.onDelete || options.onCashPayment || options.onPrintReceipt) {
    columns.push(createActionsColumn(options));
  }

  return columns;
}

// Export constants for use in pages
export { STATUS_TRANSAKSI_OPTIONS, STATUS_UANG_SAKU_OPTIONS, BULAN_OPTIONS };
export { JENIS_UJIAN_OPTIONS };
export { SEMESTER_OPTIONS };

// Periode pembayaran options
export const PERIODE_PEMBAYARAN_OPTIONS = [
  { value: "BULANAN", label: "Bulanan" },
  { value: "SEMESTER", label: "Semester" },
  { value: "TAHUNAN", label: "Tahunan" },
] as const;

// Jenis laundry options (example - can be expanded)
export const JENIS_LAUNDRY_OPTIONS = [
  { value: "REGULAR", label: "Regular" },
  { value: "EXPRESS", label: "Express" },
  { value: "PREMIUM", label: "Premium" },
] as const;