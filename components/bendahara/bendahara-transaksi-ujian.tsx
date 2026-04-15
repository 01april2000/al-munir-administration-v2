"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  formatCurrency,
  STATUS_TRANSAKSI_OPTIONS,
} from "@/app/dashboard/admin/transaksi/columns";
import { useReceiptPrinting } from "@/components/shared/receipt-printing";
import { Transaksi } from "@/lib/types/transaksi";
import { RefreshCw, Loader2, FileText, Banknote, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const currentYear = new Date().getFullYear();

// Exam type options
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

interface FormData {
  santriId: string;
  jenisUjian: string;
  tahun: string;
  jumlah: string;
  status: string;
  tanggalBayar: string;
}

const getDefaultFormData = (): FormData => ({
  santriId: "",
  jenisUjian: "UTS",
  tahun: currentYear.toString(),
  jumlah: "",
  status: "BELUM_BAYAR",
  tanggalBayar: "",
});

interface BendaharaTransaksiUjianProps {
  role: "smk" | "smp";
}

export function BendaharaTransaksiUjian({ role }: BendaharaTransaksiUjianProps) {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filter states
  const [filterJenisUjian, setFilterJenisUjian] = useState("");
  const [filterTahun, setFilterTahun] = useState(currentYear.toString());
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);
  
  // Cash payment state
  const [isCashPaymentLoading, setIsCashPaymentLoading] = useState<string | null>(null);
  
  // Receipt printing hook
  const { openReceipt, ReceiptDialog } = useReceiptPrinting();

  // Form states
  const [formData, setFormData] = useState<FormData>(getDefaultFormData());

  // Fetch transaksi
  const fetchTransaksi = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("jenis", "UJIAN");
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (filterTahun) params.append("tahun", filterTahun);
      if (filterStatus) params.append("status", filterStatus);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/transaksi?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transaksi");
      }
      const data = await response.json();
      setTransaksiList(data.items);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterJenisUjian, filterTahun, filterStatus, searchQuery]);

  useEffect(() => {
    fetchTransaksi();
  }, [fetchTransaksi]);

  // Handle form change
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData(getDefaultFormData());
  };

  // Build request body
  const buildRequestBody = (data: FormData, isEdit: boolean = false) => {
    const base: Record<string, unknown> = {
      jumlah: parseInt(data.jumlah),
      status: data.status,
      tanggalBayar: data.tanggalBayar || null,
      tahun: parseInt(data.tahun),
      keterangan: data.jenisUjian,
    };

    if (!isEdit) {
      base.santriId = data.santriId;
      base.jenis = "UJIAN";
    }

    return base;
  };

  // Handle edit transaksi
  const handleEdit = async () => {
    if (!selectedTransaksi || !formData.jumlah) {
      setError("Mohon lengkapi semua field yang diperlukan");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/transaksi/${selectedTransaksi.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequestBody(formData, true)),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update transaksi");
      }

      setIsEditDialogOpen(false);
      setSelectedTransaksi(null);
      resetForm();
      fetchTransaksi();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete transaksi
  const handleDelete = async () => {
    if (!selectedTransaksi) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/transaksi/${selectedTransaksi.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete transaksi");
      }

      setIsDeleteDialogOpen(false);
      setSelectedTransaksi(null);
      fetchTransaksi();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog with data
  const openEditDialog = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    const jenisUjian = transaksi.keterangan || "UTS";
    setFormData({
      santriId: transaksi.santriId,
      jenisUjian,
      tahun: transaksi.tahun?.toString() || currentYear.toString(),
      jumlah: transaksi.jumlah.toString(),
      status: transaksi.status,
      tanggalBayar: transaksi.tanggalBayar
        ? new Date(transaksi.tanggalBayar).toISOString().split("T")[0]
        : "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    setIsDeleteDialogOpen(true);
  };

  // Handle cash payment
  const handleCashPayment = async (transaksi: Transaksi) => {
    try {
      setIsCashPaymentLoading(transaksi.id);
      const response = await fetch("/api/transaksi/cash-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaksiId: transaksi.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengkonfirmasi pembayaran cash");
      }

      // Refresh the transaction list
      fetchTransaksi();
      
      // Open receipt dialog with updated transaction
      if (data.transaksi) {
        openReceipt(data.transaksi);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsCashPaymentLoading(null);
    }
  };

  // Get columns with actions
  const columns = [
    {
      accessorKey: "kode",
      header: "Kode",
    },
    {
      id: "santri",
      header: "Santri",
      cell: ({ row }: { row: { original: Transaksi } }) => {
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
      id: "jenisUjian",
      header: "Jenis Ujian",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        const keterangan = row.original.keterangan;
        const jenisUjianOption = JENIS_UJIAN_OPTIONS.find(
          (opt) => opt.value === keterangan
        );
        return jenisUjianOption ? jenisUjianOption.label : keterangan || "-";
      },
    },
    {
      accessorKey: "tahun",
      header: "Tahun",
    },
    {
      accessorKey: "jumlah",
      header: "Jumlah",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        const jumlah = row.original.jumlah;
        return <div className="font-medium">{formatCurrency(jumlah)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        const status = row.original.status;
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          LUNAS: "default",
          PENDING: "secondary",
          BELUM_BAYAR: "destructive",
          DITOLAK: "outline",
        };
        const labels: Record<string, string> = {
          LUNAS: "Lunas",
          PENDING: "Pending",
          BELUM_BAYAR: "Belum Bayar",
          DITOLAK: "Ditolak",
        };
        return (
          <Badge variant={variants[status] || "outline"}>
            {labels[status] || status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "metodePembayaran",
      header: "Metode Pembayaran",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        const metode = row.original.metodePembayaran;
        if (!metode) return "-";
        const labels: Record<string, string> = {
          CASH: "Cash",
          MIDTRANS: "Midtrans",
          TRANSFER: "Transfer",
          SALDO: "Saldo",
        };
        return labels[metode] || metode;
      },
    },
    {
      accessorKey: "tanggalBayar",
      header: "Tgl. Bayar",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        const tanggalBayar = row.original.tanggalBayar;
        if (!tanggalBayar) return "-";
        const d = typeof tanggalBayar === "string" ? new Date(tanggalBayar) : tanggalBayar;
        return new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(d);
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        const transaksi = row.original;
        const isNotPaid = transaksi.status !== "LUNAS";
        
        return (
          <div className="flex gap-2">
            {isNotPaid && (
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleCashPayment(transaksi)}
                disabled={isCashPaymentLoading === transaksi.id}
              >
                {isCashPaymentLoading === transaksi.id ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Banknote className="mr-1 h-3 w-3" />
                )}
                Cash
              </Button>
            )}
            {transaksi.status === "LUNAS" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openReceipt(transaksi)}
              >
                <Printer className="mr-1 h-3 w-3" />
                Cetak
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDeleteDialog(row.original)}
            >
              Hapus
            </Button>
          </div>
        );
      },
    },
  ];

  // Calculate summary
  const totalJumlah = transaksiList.reduce((sum, t) => sum + t.jumlah, 0);
  const totalLunas = transaksiList.filter((t) => t.status === "LUNAS").length;
  const totalPending = transaksiList.filter((t) => t.status === "PENDING").length;
  const totalBelumBayar = transaksiList.filter((t) => t.status === "BELUM_BAYAR").length;

  const roleTitle = role === "smk" ? "SMK" : "SMP";

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pembayaran Ujian</h2>
          <p className="text-sm text-muted-foreground">Kelola pembayaran ujian santri {roleTitle}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalJumlah)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lunas</CardTitle>
            <Badge variant="default">{totalLunas}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLunas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge variant="secondary">{totalPending}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Bayar</CardTitle>
            <Badge variant="destructive">{totalBelumBayar}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBelumBayar}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="filter-jenis-ujian">Jenis Ujian</Label>
              <select
                id="filter-jenis-ujian"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterJenisUjian}
                onChange={(e) => setFilterJenisUjian(e.target.value)}
              >
                <option value="">Semua</option>
                {JENIS_UJIAN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="filter-tahun">Tahun</Label>
              <Input
                id="filter-tahun"
                type="number"
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
                min="2020"
                max="2100"
              />
            </div>
            <div>
              <Label htmlFor="filter-status">Status</Label>
              <select
                id="filter-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua</option>
                {STATUS_TRANSAKSI_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="search">Cari Santri</Label>
              <Input
                id="search"
                placeholder="Nama atau NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={fetchTransaksi}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-8">{error}</div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={transaksiList}
              />
              {/* Pagination */}
              {total > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} dari {total} data
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
                        .filter((p) => {
                          const totalPages = Math.ceil(total / limit);
                          if (totalPages <= 5) return true;
                          if (p === 1 || p === totalPages) return true;
                          if (Math.abs(p - page) <= 1) return true;
                          return false;
                        })
                        .map((p, i, arr) => (
                          <PaginationItem key={p}>
                            {i > 0 && arr[i - 1] !== p - 1 && (
                              <PaginationEllipsis />
                            )}
                            <PaginationLink
                              onClick={() => setPage(p)}
                              isActive={page === p}
                              className="cursor-pointer"
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
                          className={page >= Math.ceil(total / limit) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Pembayaran Ujian</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedTransaksi && (
              <div className="text-sm text-muted-foreground mb-2">
                <strong>{selectedTransaksi.santri.nama}</strong> ({selectedTransaksi.santri.nis})
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-jenis-ujian">Jenis Ujian</Label>
                <select
                  id="edit-jenis-ujian"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.jenisUjian}
                  onChange={(e) => handleFormChange("jenisUjian", e.target.value)}
                >
                  {JENIS_UJIAN_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-tahun">Tahun</Label>
                <Input
                  id="edit-tahun"
                  type="number"
                  value={formData.tahun}
                  onChange={(e) => handleFormChange("tahun", e.target.value)}
                  min="2020"
                  max="2100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-jumlah">Jumlah (Rp)</Label>
                <Input
                  id="edit-jumlah"
                  type="number"
                  value={formData.jumlah}
                  onChange={(e) => handleFormChange("jumlah", e.target.value)}
                  placeholder="Masukkan jumlah"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.status}
                  onChange={(e) => handleFormChange("status", e.target.value)}
                >
                  {STATUS_TRANSAKSI_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-tanggalBayar">Tanggal Bayar</Label>
              <Input
                id="edit-tanggalBayar"
                type="date"
                value={formData.tanggalBayar}
                onChange={(e) => handleFormChange("tanggalBayar", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Apakah Anda yakin ingin menghapus transaksi ini?
            </p>
            {selectedTransaksi && (
              <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                <p><strong>Kode:</strong> {selectedTransaksi.kode}</p>
                <p><strong>Santri:</strong> {selectedTransaksi.santri.nama}</p>
                <p><strong>Jenis Ujian:</strong> {selectedTransaksi.keterangan}</p>
                <p><strong>Jumlah:</strong> {formatCurrency(selectedTransaksi.jumlah)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <ReceiptDialog />
    </div>
  );
}
