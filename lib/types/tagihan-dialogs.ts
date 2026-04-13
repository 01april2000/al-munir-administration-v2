// Types for Tagihan Management Dialogs

export interface TagihanSantri {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  asrama: string;
  jenisSantri: "SMK" | "SMP" | "PONDOK";
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
export interface GenerateTagihanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: GenerateTagihanData) => Promise<void>;
  isGenerating: boolean;
  result: GenerateResult | null;
}

export interface GenerateTagihanData {
  bulan: string;
  tahun: number;
  jenisSantri?: string;
  jenisTagihan: string;
  jenisUjian?: string;
  semester?: string;
  sppAmount?: number;
  syahriahAmount?: number;
  customAmount?: number;
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
}

export interface CreateTagihanData {
  santriId: string;
  jenis: string;
  jumlah: number;
  bulan: string;
  tahun: number;
  keterangan?: string;
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
