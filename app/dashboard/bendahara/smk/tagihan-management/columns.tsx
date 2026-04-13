"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye, Banknote } from "lucide-react";

export type Tagihan = {
  id: string;
  kode: string;
  jenis: "SPP" | "SYAHRIAH";
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
      return (
        <Badge variant={jenis === "SPP" ? "default" : "secondary"}>
          {jenis}
        </Badge>
      );
    },
  },
  {
    accessorKey: "santri.nama",
    header: "Nama Santri",
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
    header: "Kelas",
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
    header: "Jumlah",
    cell: ({ row }) => {
      const jumlah = row.getValue("jumlah") as number;
      return <div>Rp {jumlah.toLocaleString("id-ID")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "LUNAS"
              ? "default"
              : status === "OVERDUE"
              ? "destructive"
              : "secondary"
          }
        >
          {status === "LUNAS"
            ? "Lunas"
            : status === "OVERDUE"
            ? "Terlambat"
            : "Belum Lunas"}
        </Badge>
      );
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
      const handleCashPayment = () => {
        if (typeof window !== "undefined" && (window as any).handleCashPayment) {
          (window as any).handleCashPayment(tagihan);
        }
      };

      const isPaid = tagihan.status === "LUNAS";

      return (
        <div className="flex items-center gap-2">
          {!isPaid && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCashPayment}
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
              title="Bayar Cash"
            >
              <Banknote className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];

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

export const selectColumn: ColumnDef<Tagihan> = {
  id: "select",
  header: ({ table }) => (
    <input
      type="checkbox"
      checked={table.getIsAllPageRowsSelected()}
      onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
      aria-label="Select all"
      className="translate-y-[2px]"
    />
  ),
  cell: ({ row }) => (
    <input
      type="checkbox"
      checked={row.getIsSelected()}
      onChange={(e) => row.toggleSelected(e.target.checked)}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};