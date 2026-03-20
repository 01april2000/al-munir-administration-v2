import { 
  JenisTransaksi, 
  StatusTransaksi, 
  StatusUangSaku,
  PeriodePembayaran,
  Role 
} from '@/lib/generated/prisma';

// Re-export types
export type { 
  JenisTransaksi, 
  StatusTransaksi, 
  StatusUangSaku,
  PeriodePembayaran,
  Role 
};

// Transaksi type for API responses
export interface Transaksi {
  id: string;
  kode: string;
  santriId: string;
  jenis: JenisTransaksi;
  bulan: string | null;
  periodePembayaran: PeriodePembayaran | null;
  tahun: number | null;
  jumlah: number;
  tanggalBayar: Date | null;
  status: StatusTransaksi;
  statusUangSaku: StatusUangSaku | null;
  jenisLaundry: string | null;
  keterangan: string | null;
  managedBy: Role | null;
  createdAt: Date;
  updatedAt: Date;
  santri: {
    id: string;
    nis: string;
    nama: string;
    kelas: string;
    asrama: string;
    jenisSantri: string;
  };
}

// Create/Update input types
export interface TransaksiCreateInput {
  santriId: string;
  jenis: JenisTransaksi;
  jumlah: number;
  bulan?: string;
  tahun?: number;
  periodePembayaran?: PeriodePembayaran;
  tanggalBayar?: Date;
  status?: StatusTransaksi;
  statusUangSaku?: StatusUangSaku;
  jenisLaundry?: string;
  keterangan?: string;
}

export interface TransaksiUpdateInput extends Partial<TransaksiCreateInput> {
  id: string;
}

// Filter types for API queries
export interface TransaksiFilter {
  jenis?: JenisTransaksi;
  status?: StatusTransaksi;
  santriId?: string;
  bulan?: string;
  tahun?: number;
  jenisSantri?: string;
  managedBy?: Role;
  search?: string;
  page?: number;
  limit?: number;
}

// Constants for UI
export const JENIS_TRANSAKSI_OPTIONS = [
  { value: 'SPP', label: 'SPP' },
  { value: 'SYAHRIAH', label: 'Syahriah' },
  { value: 'UANG_SAKU', label: 'Uang Saku' },
  { value: 'LAUNDRY', label: 'Laundry' },
] as const;

export const STATUS_TRANSAKSI_OPTIONS = [
  { value: 'LUNAS', label: 'Lunas' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'BELUM_BAYAR', label: 'Belum Bayar' },
  { value: 'DITOLAK', label: 'Ditolak' },
] as const;

export const STATUS_UANG_SAKU_OPTIONS = [
  { value: 'DITAMBAH', label: 'Ditambah' },
  { value: 'DIAMBIL', label: 'Diambil' },
] as const;

export const BULAN_OPTIONS = [
  { value: 'Januari', label: 'Januari' },
  { value: 'Februari', label: 'Februari' },
  { value: 'Maret', label: 'Maret' },
  { value: 'April', label: 'April' },
  { value: 'Mei', label: 'Mei' },
  { value: 'Juni', label: 'Juni' },
  { value: 'Juli', label: 'Juli' },
  { value: 'Agustus', label: 'Agustus' },
  { value: 'September', label: 'September' },
  { value: 'Oktober', label: 'Oktober' },
  { value: 'November', label: 'November' },
  { value: 'Desember', label: 'Desember' },
] as const;