// Santri role type - shared between client and server
export type SantriRole = "smk" | "smp" | "pondok"

// Transaction item for processed data
export interface TransactionItem {
  label: string
  amount?: string
  status: "Lunas" | "Menunggu" | "Belum Lunas" | "in" | "out"
  date: string
  balance?: string
  tagihanId?: string
  transaksiId?: string
  rawAmount?: number
}

// Transaction data grouped by type
export interface TransactionData {
  type: string
  title: string
  color: string
  items: TransactionItem[]
}

// Summary statistics
export interface SummaryStats {
  totalUnpaid: number
  totalPaid: number
  unpaidCount: number
  paidCount: number
  uangSakuBalance: number
}

// Santri info
export interface SantriInfo {
  id: string
  nama: string
  nis: string
  kelas: string
  saldoUangSaku: number
  foto?: string | null
  email?: string | null
  telepon?: string | null
  alamat?: string | null
}

// Processed data returned from server
export interface ProcessedSantriData {
  summaryStats: SummaryStats
  tagihanOnly: TransactionData[]
  aktivitasOnly: TransactionData[]
  processedTransactions: TransactionData[]
  santri: SantriInfo
  santriName: string
  santriInitials: string
}

// Role type for transaction config
export type RoleType = "smk" | "smp" | "pondok"

// Pagination result type
export interface PaginatedResult<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

// Paginated processed data for infinite scroll
export interface PaginatedProcessedData {
  tagihanOnly: TransactionData[]
  aktivitasOnly: TransactionData[]
  nextCursorTagihan: string | null
  nextCursorTransaksi: string | null
  hasMoreTagihan: boolean
  hasMoreTransaksi: boolean
}