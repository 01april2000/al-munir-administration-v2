"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

// Define SMK-specific transaction types
export type JenisTransaksiSMK = "SPP" | "SYAHRIAH" | "LKS" | "PKL" | "UJIAN";

// Transaksi type for SMK
export interface TransaksiSMK {
  id: string;
  kode: string;
  santriId: string;
  jenis: JenisTransaksiSMK;
  bulan: string | null;
  tahun: number | null;
  jumlah: number;
  tanggalBayar: Date | null;
  status: string;
  keterangan: string | null;
  createdAt: Date;
  updatedAt: Date;
  santri: {
    id: string;
    nis: string;
    nama: string;
    kelas: string;
  };
}

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

// Status Badge Component
export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusVariants[status] || "outline"}>
      {statusLabels[status] || status}
    </Badge>
  );
}

interface ColumnOptions {
  onEdit?: (transaksi: TransaksiSMK) => void;
  onDelete?: (transaksi: TransaksiSMK) => void;
}

// Base columns shared by all transaction types
const baseColumns: ColumnDef<TransaksiSMK>[] = [
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
    accessorKey: "tanggalBayar",
    header: "Tgl. Bayar",
    cell: ({ row }) => {
      const tanggalBayar = row.getValue("tanggalBayar") as Date | null;
      return formatDate(tanggalBayar);
    },
  },
];

// SPP/Syahriah specific columns
const sppSyahriahColumns: ColumnDef<TransaksiSMK>[] = [
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
];

// LKS/PKL/Ujian specific columns
const lksPklUjianColumns: ColumnDef<TransaksiSMK>[] = [
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
function createActionsColumn(options: ColumnOptions): ColumnDef<TransaksiSMK> {
  return {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const transaksi = row.original;
      return (
        <div className="flex items-center gap-2">
          {options.onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => options.onEdit!(transaksi)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {options.onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => options.onDelete!(transaksi)}
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
  jenis: JenisTransaksiSMK,
  options: ColumnOptions = {}
): ColumnDef<TransaksiSMK>[] {
  const columns: ColumnDef<TransaksiSMK>[] = [...baseColumns];

  // Add type-specific columns before the status column
  if (jenis === "SPP" || jenis === "SYAHRIAH") {
    // Insert before status column (index 3)
    columns.splice(3, 0, ...sppSyahriahColumns);
  } else if (jenis === "LKS" || jenis === "PKL" || jenis === "UJIAN") {
    // Insert keterangan after status column
    columns.splice(5, 0, ...lksPklUjianColumns);
  }

  // Add actions column if callbacks provided
  if (options.onEdit || options.onDelete) {
    columns.push(createActionsColumn(options));
  }

  return columns;
}

// Export constants for use in pages
export const STATUS_TRANSAKSI_OPTIONS = [
  { value: "LUNAS", label: "Lunas" },
  { value: "PENDING", label: "Pending" },
  { value: "BELUM_BAYAR", label: "Belum Bayar" },
  { value: "DITOLAK", label: "Ditolak" },
] as const;

export const BULAN_OPTIONS = [
  { value: "Januari", label: "Januari" },
  { value: "Februari", label: "Februari" },
  { value: "Maret", label: "Maret" },
  { value: "April", label: "April" },
  { value: "Mei", label: "Mei" },
  { value: "Juni", label: "Juni" },
  { value: "Juli", label: "Juli" },
  { value: "Agustus", label: "Agustus" },
  { value: "September", label: "September" },
  { value: "Oktober", label: "Oktober" },
  { value: "November", label: "November" },
  { value: "Desember", label: "Desember" },
] as const;
