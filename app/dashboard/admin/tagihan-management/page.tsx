"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, selectColumn, bulanOptions } from "./columns";
import { FileText, Loader2, RefreshCw, Sparkles, Search, Receipt, Trash2 } from "lucide-react";
import { RowSelectionState } from "@tanstack/react-table";
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
import {
  DeleteTagihanDialog,
  GenerateTagihanDialog,
  CreateTagihanDialog,
  CashPaymentDialog,
} from "@/components/admin/tagihan";
import {
  Tagihan,
  GenerateTagihanData,
  CreateTagihanData,
  SantriOption,
  GenerateResult,
  CreateResult,
} from "@/lib/types/tagihan-dialogs";

const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth();

const jenisSantriOptions = [
  { value: "", label: "Semua" },
  { value: "SMK", label: "SMK" },
  { value: "SMP", label: "SMP" },
  { value: "PONDOK", label: "Pondok" },
];

const jenisTagihanOptions = [
  { value: "", label: "Semua Jenis" },
  // SPP dinonaktifkan sementara — lihat lib/config.ts
  { value: "SYAHRIAH", label: "Syahriah" },
  { value: "UJIAN", label: "Ujian" },
  { value: "PKL", label: "PKL" },
  { value: "LKS", label: "LKS" },
  { value: "BUKU_PENDAMPING", label: "Buku Pendamping" },
];

const jenisUjianOptions = [
  { value: "UTS", label: "UTS (Ujian Tengah Semester)" },
  { value: "UAS", label: "UAS (Ujian Akhir Semester)" },
  { value: "UJIAN_NASIONAL", label: "Ujian Nasional" },
  { value: "UJIAN_SEKOLAH", label: "Ujian Sekolah" },
  { value: "UJIAN_PRAKTIK", label: "Ujian Praktik" },
  { value: "ANBK", label: "ANBK (Asesmen Nasional Berbasis Komputer)" },
  { value: "TKA", label: "TKA (Tes Kompetensi Akademik)" },
  { value: "UJIAN_LAINNYA", label: "Ujian Lainnya" },
];

const semesterOptions = [
  { value: "SEMESTER_1", label: "Semester 1 (Ganjil)" },
  { value: "SEMESTER_2", label: "Semester 2 (Genap)" },
];

export default function TagihanManagementPage() {
  const [tagihanList, setTagihanList] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagihanToDelete, setTagihanToDelete] = useState<Tagihan | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Bulk delete dialog state
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState<string | null>(null);

  // Generate dialog state
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<GenerateResult | null>(null);

  // Create dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState<CreateResult | null>(null);
  const [santriList, setSantriList] = useState<SantriOption[]>([]);

  // Cash payment dialog state
  const [isCashPaymentDialogOpen, setIsCashPaymentDialogOpen] = useState(false);
  const [tagihanToPay, setTagihanToPay] = useState<Tagihan | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [cashPaymentError, setCashPaymentError] = useState<string | null>(null);
  const [cashPaymentSuccess, setCashPaymentSuccess] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [filterBulan, setFilterBulan] = useState("");
  const [filterTahun, setFilterTahun] = useState("");
  const [filterJenisTagihan, setFilterJenisTagihan] = useState("");
  const [filterJenisSantri, setFilterJenisSantri] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchTagihan = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterBulan) params.append("bulan", filterBulan);
      if (filterTahun) params.append("tahun", filterTahun);
      if (filterJenisTagihan) params.append("jenis", filterJenisTagihan);
      if (filterJenisSantri) params.append("jenisSantri", filterJenisSantri);
      if (filterStatus) params.append("status", filterStatus);

      const response = await fetch(`/api/tagihan?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tagihan");
      }
      const data = await response.json();
      setTagihanList(data.tagihan);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [filterBulan, filterTahun, filterJenisTagihan, filterJenisSantri, filterStatus]);

  useEffect(() => {
    fetchTagihan();
  }, [fetchTagihan]);

  // Fetch santri list for create dialog
  const fetchSantriList = useCallback(async () => {
    try {
      const response = await fetch("/api/santri?limit=1000");
      if (!response.ok) {
        throw new Error("Failed to fetch santri");
      }
      const data = await response.json();
      setSantriList(data.santri || data);
    } catch (err) {
      console.error("Error fetching santri:", err);
    }
  }, []);

  // Handle generate tagihan
  const handleGenerateTagihan = async (data: GenerateTagihanData) => {
    try {
      setGenerating(true);
      setGenerateResult(null);

      const response = await fetch("/api/tagihan/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate tagihan");
      }

      setGenerateResult(result);
      
      // Refresh the list
      await fetchTagihan();
    } catch (err) {
      setGenerateResult({
        success: false,
        message: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Handle create tagihan
  const handleCreateTagihan = async (data: CreateTagihanData) => {
    try {
      setCreating(true);
      setCreateResult(null);

      const response = await fetch("/api/tagihan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create tagihan");
      }

      setCreateResult({
        success: true,
        message: "Tagihan berhasil dibuat",
      });

      // Refresh the list
      await fetchTagihan();
    } catch (err) {
      setCreateResult({
        success: false,
        message: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle delete tagihan
  const handleDeleteTagihan = (tagihan: Tagihan) => {
    setTagihanToDelete(tagihan);
    setDeleteError(null);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTagihan = async () => {
    if (!tagihanToDelete) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      const response = await fetch(`/api/tagihan?id=${tagihanToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete tagihan");
      }

      // Refresh the list
      await fetchTagihan();
      setIsDeleteDialogOpen(false);
      setTagihanToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleting(false);
    }
  };

  // Bulk delete handler
  const selectedCount = Object.keys(rowSelection).length;

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    setBulkDeleting(true);
    setBulkDeleteError(null);

    try {
      const response = await fetch("/api/tagihan/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete tagihan");
      }

      setRowSelection({});
      await fetchTagihan();
      setIsBulkDeleteDialogOpen(false);
    } catch (err) {
      setBulkDeleteError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setBulkDeleting(false);
    }
  };

  // Handle cash payment
  const handleCashPayment = (tagihan: Tagihan) => {
    setTagihanToPay(tagihan);
    setCashPaymentError(null);
    setCashPaymentSuccess(false);
    setIsCashPaymentDialogOpen(true);
  };

  const confirmCashPayment = async () => {
    if (!tagihanToPay) return;

    try {
      setProcessingPayment(true);
      setCashPaymentError(null);

      const response = await fetch("/api/transaksi/cash-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tagihanIds: [tagihanToPay.id],
          santriId: tagihanToPay.santri.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process cash payment");
      }

      setCashPaymentSuccess(true);
      
      // Refresh the list after a short delay
      setTimeout(async () => {
        await fetchTagihan();
        setIsCashPaymentDialogOpen(false);
        setTagihanToPay(null);
        setCashPaymentSuccess(false);
      }, 1500);
    } catch (err) {
      setCashPaymentError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Register handleDeleteTagihan on window object for columns.tsx to access
  useEffect(() => {
    (window as any).handleDeleteTagihan = handleDeleteTagihan;
    return () => {
      delete (window as any).handleDeleteTagihan;
    };
  }, [handleDeleteTagihan]);

  // Register handleCashPayment on window object for columns.tsx to access
  useEffect(() => {
    (window as any).handleCashPayment = handleCashPayment;
    return () => {
      delete (window as any).handleCashPayment;
    };
  }, [handleCashPayment]);

  const columnsWithSelect = [selectColumn, ...columns];

  // Filter data based on search query and field filters
  const filteredData = useMemo(() => {
    let result = [...tagihanList];

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((tagihan) => {
        return (
          tagihan.kode.toLowerCase().includes(query) ||
          tagihan.jenis.toLowerCase().includes(query) ||
          tagihan.bulan.toLowerCase().includes(query) ||
          tagihan.status.toLowerCase().includes(query) ||
          tagihan.santri.nis.toLowerCase().includes(query) ||
          tagihan.santri.nama.toLowerCase().includes(query) ||
          tagihan.santri.kelas.toLowerCase().includes(query) ||
          tagihan.santri.asrama.toLowerCase().includes(query) ||
          tagihan.santri.jenisSantri.toLowerCase().includes(query) ||
          tagihan.jumlah.toString().includes(query) ||
          tagihan.tahun.toString().includes(query)
        );
      });
    }

    // Apply jenis tagihan filter
    if (filterJenisTagihan) {
      result = result.filter((tagihan) => tagihan.jenis === filterJenisTagihan);
    }

    // Apply jenis santri filter
    if (filterJenisSantri) {
      result = result.filter((tagihan) => tagihan.santri.jenisSantri === filterJenisSantri);
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter((tagihan) => tagihan.status === filterStatus);
    }

    return result;
  }, [tagihanList, searchQuery, filterJenisTagihan, filterJenisSantri, filterStatus]);

  // Pagination calculations - use filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset to page 1 when search query or filters change
  useEffect(() => {
    setCurrentPage(1);
    setRowSelection({});
  }, [searchQuery, filterJenisTagihan, filterJenisSantri, filterStatus]);

  // Reset row selection when page changes
  useEffect(() => {
    setRowSelection({});
  }, [currentPage]);

  // Calculate summary based on filtered data
  const totalBelumLunas = filteredData.filter(t => t.status === "BELUM_LUNAS").length;
  const totalLunas = filteredData.filter(t => t.status === "LUNAS").length;
  const totalOverdue = filteredData.filter(t => t.status === "OVERDUE").length;
  const totalJumlah = filteredData.reduce((sum, t) => sum + t.jumlah, 0);

  // Generate page numbers with ellipsis
  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Tagihan</h1>
          <p className="text-muted-foreground">
            Kelola tagihan bulanan santri
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { fetchSantriList(); setIsCreateDialogOpen(true); }}>
            <Receipt className="mr-2 h-4 w-4" />
            Buat Tagihan
          </Button>
          <Button onClick={() => setIsGenerateDialogOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Tagihan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
            <p className="text-xs text-muted-foreground">
              Rp {totalJumlah.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Lunas</CardTitle>
            <Badge variant="secondary">{totalBelumLunas}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBelumLunas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lunas</CardTitle>
            <Badge>{totalLunas}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLunas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
            <Badge variant="destructive">{totalOverdue}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOverdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex-1">
              <Label htmlFor="filter-bulan">Bulan</Label>
              <select
                id="filter-bulan"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
              >
                {bulanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="filter-tahun">Tahun</Label>
              <select
                id="filter-tahun"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
              >
                <option value="">Semua Tahun</option>
                {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="filter-jenis-tagihan">Jenis Tagihan</Label>
              <select
                id="filter-jenis-tagihan"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterJenisTagihan}
                onChange={(e) => setFilterJenisTagihan(e.target.value)}
              >
                {jenisTagihanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="filter-jenis-santri">Jenis Santri</Label>
              <select
                id="filter-jenis-santri"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterJenisSantri}
                onChange={(e) => setFilterJenisSantri(e.target.value)}
              >
                {jenisSantriOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="filter-status">Status</Label>
              <select
                id="filter-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="LUNAS">Lunas</option>
                <option value="BELUM_LUNAS">Belum Lunas</option>
                <option value="OVERDUE">Terlambat</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={fetchTagihan} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setFilterBulan("");
                  setFilterTahun("");
                  setFilterJenisTagihan("");
                  setFilterJenisSantri("");
                  setFilterStatus("");
                  setSearchQuery("");
                }}
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari tagihan (kode, nama santri, NIS, kelas, jenis...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setBulkDeleteError(null);
              setIsBulkDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus ({selectedCount})
          </Button>
        )}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Ditemukan {filteredData.length} hasil
          </div>
        )}
      </div>

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
            <DataTable
              columns={columnsWithSelect}
              data={paginatedData}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              enableRowSelection={true}
              getRowId={(row) => row.id}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Tagihan Terpilih</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus <strong>{selectedCount} tagihan</strong>?
              Tindakan ini tidak dapat dibatalkan. Tagihan yang memiliki transaksi tidak akan dihapus.
            </p>
            {bulkDeleteError && (
              <p className="mt-2 text-sm text-destructive">{bulkDeleteError}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={bulkDeleting} />}>
              Batal
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
            >
              {bulkDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                `Hapus (${selectedCount})`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteTagihanDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        tagihan={tagihanToDelete}
        onConfirm={confirmDeleteTagihan}
        isDeleting={deleting}
        error={deleteError}
      />

      {/* Generate Dialog */}
      <GenerateTagihanDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
        onGenerate={handleGenerateTagihan}
        isGenerating={generating}
        result={generateResult}
        showJenisSantriDropdown
        infoBoxes={{
          PKL: (
            <>
              <p className="font-medium">ℹ️ Keterangan PKL</p>
              <p className="mt-1">
                Tagihan PKL hanya akan digenerate untuk santri kelas{" "}
                <strong>XII_RPL_A</strong>, <strong>XII_RPL_B</strong>, dan{" "}
                <strong>XII_AKL</strong>.
              </p>
            </>
          ),
        }}
      />

      {/* Create Tagihan Dialog */}
      <CreateTagihanDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateTagihan}
        isCreating={creating}
        result={createResult}
        santriList={santriList}
        onSantriListLoad={fetchSantriList}
        jenisUjianOptions={jenisUjianOptions}
        semesterOptions={semesterOptions}
      />

      {/* Cash Payment Dialog */}
      <CashPaymentDialog
        open={isCashPaymentDialogOpen}
        onOpenChange={setIsCashPaymentDialogOpen}
        tagihan={tagihanToPay}
        onConfirm={confirmCashPayment}
        isProcessing={processingPayment}
        error={cashPaymentError}
        success={cashPaymentSuccess}
      />
    </div>
  );
}
