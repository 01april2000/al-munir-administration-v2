import type { ReactNode } from "react";

// Types for Tagihan Management Dialogs

export interface TagihanSantri {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  asrama: string;
  jenisSantri: "SMK" | "SMP" | "PONDOK";
  jenisPondok: "PONDOK_ATAS" | "PONDOK_BAWAH" | "SYALAF" | "NON_PONDOK";
}

export interface Tagihan {
  id: string;
  kode: string;
  jenis: JenisTagihanType;
  jumlah: number;
  bulan: string;
  tahun: number;
  status: "LUNAS" | "BELUM_LUNAS" | "OVERDUE";
  jatuhTempo: string;
  createdAt: string;
  santri: TagihanSantri;
  transaksi: {
    id: string;
    kode: string;
    status: string;
    tanggalBayar: string | null;
  } | null;
  keterangan?: string;
}

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

export interface GenerateResult {
  success?: boolean;
  message?: string;
  data?: {
    totalSantri: number;
    created: number;
    skipped: number;
    bulan: string;
    tahun: number;
  };
}

export interface CreateResult {
  success?: boolean;
  message?: string;
}

export interface SantriOption {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  jenisSantri: string;
}

// Props for DeleteTagihanDialog
export interface DeleteTagihanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagihan: Tagihan | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  error: string | null;
}

// Props for GenerateTagihanDialog
export interface KelasOption {
  value: string;
  label: string;
}

export interface JenisTagihanOption {
  value: string;
  label: string;
}

export interface GenerateTagihanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: GenerateTagihanData) => Promise<void>;
  isGenerating: boolean;
  result: GenerateResult | null;
  /** Fixed jenis santri (e.g. "SMK"). If set, hides the dropdown and auto-includes in payload */
  jenisSantri?: "SMK" | "SMP" | "PONDOK";
  /** Custom dialog title. Default: "Generate Tagihan Bulanan" */
  title?: string;
  /** Which jenis tagihan options to show in the dropdown */
  jenisTagihanOptions?: JenisTagihanOption[];
  /** Kelas options for checkbox grid (e.g. SMK classes) */
  kelasOptions?: KelasOption[];
  /** Show kelas selector for which tagihan types. Default: ["UJIAN", "LKS"] */
  showKelasForTypes?: string[];
  /** Default SPP amount hint text */
  defaultSppHint?: string;
  /** Default Syahriah amount hint text */
  defaultSyahriahHint?: string;
  /** Show jenis santri dropdown (for admin). Default: false */
  showJenisSantriDropdown?: boolean;
  /** Info box content rendered for specific tagihan types. Key = jenisTagihan value */
  infoBoxes?: Record<string, ReactNode>;
}

export interface GenerateTagihanData {
  bulan: string;
  tahun: number;
  jenisSantri?: string;
  jenisPondok?: string;
  jenisTagihan: string;
  jenisUjian?: string;
  semester?: string;
  sppAmount?: number;
  syahriahAmount?: number;
  customAmount?: number;
  kelas?: string[];
}

// Props for CreateTagihanDialog
export interface JenisTransaksiOption {
  value: string;
  label: string;
}

export interface CreateTagihanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateTagihanData) => Promise<void>;
  isCreating: boolean;
  result: CreateResult | null;
  santriList: SantriOption[];
  onSantriListLoad: () => Promise<void>;
  jenisTransaksiOptions?: JenisTransaksiOption[];
  /** Options for jenis ujian dropdown, shown when jenis transaksi is "UJIAN" */
  jenisUjianOptions?: { value: string; label: string }[];
  /** Options for semester dropdown, shown when jenis transaksi is "LKS" */
  semesterOptions?: { value: string; label: string }[];
}

export interface CreateTagihanData {
  santriId: string;
  jenis: string;
  jumlah: number;
  bulan: string;
  tahun: number;
  keterangan?: string;
  jenisUjian?: string;
  semester?: string;
}

// Props for CashPaymentDialog
export interface CashPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagihan: Tagihan | null;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  success: boolean;
}
