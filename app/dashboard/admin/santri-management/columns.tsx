"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type StatusSantri = "AKTIF" | "NON_AKTIF" | "LULUS" | "KELUAR";
export type JenisSantri = "SMK" | "SMP" | "PONDOK";
export type JenisBeasiswa = "FULL" | "SYAHRIAH" | "SPP" | "UANG_SAKU";

export interface Santri {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  asrama: string;
  wali: string;
  status: StatusSantri;
  beasiswa: boolean;
  jenisBeasiswa: JenisBeasiswa | null;
  jenisSantri: JenisSantri;
  userId: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface ColumnOptions {
  onEdit: (santri: Santri) => void;
  onDelete: (santri: Santri) => void;
}

const statusLabels: Record<StatusSantri, string> = {
  AKTIF: "Aktif",
  NON_AKTIF: "Non-Aktif",
  LULUS: "Lulus",
  KELUAR: "Keluar",
};

const statusVariants: Record<StatusSantri, "default" | "secondary" | "destructive" | "outline"> = {
  AKTIF: "default",
  NON_AKTIF: "secondary",
  LULUS: "outline",
  KELUAR: "destructive",
};

const jenisSantriLabels: Record<JenisSantri, string> = {
  SMK: "SMK",
  SMP: "SMP",
  PONDOK: "Pondok",
};

const jenisSantriVariants: Record<JenisSantri, "default" | "secondary" | "destructive" | "outline"> = {
  SMK: "default",
  SMP: "secondary",
  PONDOK: "outline",
};

const jenisBeasiswaLabels: Record<JenisBeasiswa, string> = {
  FULL: "Full",
  SYAHRIAH: "Syahriah",
  SPP: "SPP",
  UANG_SAKU: "Uang Saku",
};

// Separate column for checkbox selection
export const selectColumn: ColumnDef<Santri> = {
  id: "__select__",
  header: ({ table }) => {
    const isAllSelected = table.getIsAllPageRowsSelected();
    const isSomeSelected = table.getIsSomePageRowsSelected();
    return (
      <Checkbox
        checked={isAllSelected ? true : isSomeSelected ? true : false}
        data-state={isSomeSelected && !isAllSelected ? "indeterminate" : undefined}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    );
  },
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected() ? true : false}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};

export const createColumns = ({ onEdit, onDelete }: ColumnOptions): ColumnDef<Santri>[] => [
  {
    id: "santri",
    header: "Nama",
    cell: ({ row }) => {
      const santri = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{santri.nama}</span>
            <Badge variant={jenisSantriVariants[santri.jenisSantri]}>
              {jenisSantriLabels[santri.jenisSantri]}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">{santri.nis}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "kelas",
    header: "Kelas",
  },
  {
    accessorKey: "asrama",
    header: "Asrama",
  },
  {
    accessorKey: "wali",
    header: "Wali",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("wali")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as StatusSantri;
      return (
        <Badge variant={statusVariants[status]}>
          {statusLabels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "beasiswa",
    header: "Beasiswa",
    cell: ({ row }) => {
      const santri = row.original;
      if (!santri.beasiswa) {
        return (
          <span className="text-muted-foreground text-sm">-</span>
        );
      }
      return (
        <Badge variant="secondary">
          {santri.jenisBeasiswa ? jenisBeasiswaLabels[santri.jenisBeasiswa] : "Ya"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const santri = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(santri.id)}>
                Copy santri ID
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onEdit(santri)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(santri)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];