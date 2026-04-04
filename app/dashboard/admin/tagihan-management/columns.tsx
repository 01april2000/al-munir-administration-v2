"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye, Trash2 } from "lucide-react";

export type JenisTagihanType =
  | "SPP"
  | "SYAHRIAH"
  | "UANG_SAKU"
  | "LAUNDRY"
  | "UJIAN"
  | "PKL"
  | "LKS"
  | "BUKU_PENDAMPING"
  | "TKA";

export type Tagihan = {
  id: string;
  kode: string;
  jenis: JenisTagihanType;
  bulan: string;
  tahun: number;
  jumlah: number;
  status: "BELUM_LUNAS" | "LUNAS" | "OVERDUE";
  jatuhTempo: string;
  createdAt: string;
  santri: {
    id: string;
    nis: string;
    nama: string;
    kelas: string;
    asrama: string;
    jenisSantri: "SMK" | "SMP" | "PONDOK";
  };
  transaksi: {
    id: string;
    kode: string;
    status: string;
    tanggalBayar: string | null;
  } | null;
};

export const columns: ColumnDef<Tagihan>[] = [
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
    accessorKey: "jenis",
    header: "Jenis",
    cell: ({ row }) => {
      const jenis = row.getValue("jenis") as string;
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        SPP: "default",
        SYAHRIAH: "secondary",
        UANG_SAKU: "outline",
        LAUNDRY: "outline",
        UJIAN: "destructive",
        PKL: "secondary",
        LKS: "secondary",
        BUKU_PENDAMPING: "default",
        TKA: "default",
      };
      return (
        <Badge variant={variants[jenis] || "default"}>
          {jenis}
        </Badge>
      );
    },
  },
  {
    accessorKey: "santri.nama",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Santri
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    accessorKey: "santri.kelas",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kelas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "santri.jenisSantri",
    header: "Jenis Santri",
    cell: ({ row }) => {
      const jenisSantri = row.original.santri.jenisSantri;
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        SMK: "default",
        SMP: "secondary",
        PONDOK: "outline",
      };
      return <Badge variant={variants[jenisSantri] || "default"}>{jenisSantri}</Badge>;
    },
  },
  {
    accessorKey: "bulan",
    header: "Bulan",
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
      return (
        <div className="font-medium">
          Rp {jumlah.toLocaleString("id-ID")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        LUNAS: "default",
        BELUM_LUNAS: "secondary",
        OVERDUE: "destructive",
      };
      const labels: Record<string, string> = {
        LUNAS: "Lunas",
        BELUM_LUNAS: "Belum Lunas",
        OVERDUE: "Terlambat",
      };
      return <Badge variant={variants[status] || "default"}>{labels[status]}</Badge>;
    },
  },
  {
    accessorKey: "jatuhTempo",
    header: "Jatuh Tempo",
    cell: ({ row }) => {
      const jatuhTempo = row.getValue("jatuhTempo") as string;
      return new Date(jatuhTempo).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const tagihan = row.original;
      const handleDelete = () => {
        if (typeof window !== "undefined" && (window as any).handleDeleteTagihan) {
          (window as any).handleDeleteTagihan(tagihan);
        }
      };
      
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export const selectColumn: ColumnDef<Tagihan> = {
  id: "select",
  header: ({ table }) => (
    <input
      type="checkbox"
      checked={table.getIsAllPageRowsSelected()}
      onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
      aria-label="Select all"
      className="translate-y-[2px]"
    />
  ),
  cell: ({ row }) => (
    <input
      type="checkbox"
      checked={row.getIsSelected()}
      onChange={(e) => row.toggleSelected(!!e.target.checked)}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};

export const bulanOptions = [
  { value: "", label: "Semua Bulan" },
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
];