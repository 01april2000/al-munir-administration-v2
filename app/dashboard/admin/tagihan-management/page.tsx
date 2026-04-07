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
import { columns, selectColumn, Tagihan, bulanOptions, JenisTagihanType } from "./columns";
import { Plus, FileText, Loader2, RefreshCw, Sparkles, Trash2, AlertTriangle, Search, Receipt, Banknote, CheckCircle } from "lucide-react";
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

const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth();
const bulanList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const jenisSantriOptions = [
  { value: "", label: "Semua" },
  { value: "SMK", label: "SMK" },
  { value: "SMP", label: "SMP" },
  { value: "PONDOK", label: "Pondok" },
];

const jenisTagihanOptions = [
  { value: "", label: "Semua Jenis" },
  { value: "SPP", label: "SPP" },
  { value: "SYAHRIAH", label: "Syahriah" },
  { value: "UANG_SAKU", label: "Uang Saku" },
  { value: "LAUNDRY", label: "Laundry" },
  { value: "UJIAN", label: "Ujian" },
  { value: "PKL", label: "PKL" },
  { value: "LKS", label: "LKS" },
  { value: "BUKU_PENDAMPING", label: "Buku Pendamping" },
  { value: "TKA", label: "TKA" },
];

// All transaction types for creating tagihan
const jenisTransaksiOptions = [
  { value: "SPP", label: "SPP" },
  { value: "SYAHRIAH", label: "Syahriah" },
  { value: "UANG_SAKU", label: "Uang Saku" },
  { value: "LAUNDRY", label: "Laundry" },
  { value: "UJIAN", label: "Ujian" },
  { value: "PKL", label: "PKL" },
  { value: "LKS", label: "LKS" },
  { value: "BUKU_PENDAMPING", label: "Buku Pendamping" },
  { value: "TKA", label: "TKA" },
];

export default function TagihanManagementPage() {
  const [tagihanList, setTagihanList] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagihanToDelete, setTagihanToDelete] = useState<Tagihan | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Cash payment state
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

  // Generate form states
  const [generateBulan, setGenerateBulan] = useState(bulanList[currentMonthIndex]);
  const [generateTahun, setGenerateTahun] = useState(currentYear.toString());
  const [jenisSantri, setJenisSantri] = useState("");
  const [jenisTagihan, setJenisTagihan] = useState("ALL");
  const [sppAmount, setSppAmount] = useState("");
  const [syahriahAmount, setSyahriahAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [generateResult, setGenerateResult] = useState<{
    success?: boolean;
    message?: string;
    data?: {
      totalSantri: number;
      created: number;
      skipped: number;
      bulan: string;
      tahun: number;
    };
  } | null>(null);

  // Create tagihan states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [santriList, setSantriList] = useState<{ id: string; nis: string; nama: string; kelas: string; jenisSantri: string }[]>([]);
  const [santriSearch, setSantriSearch] = useState("");
  const [selectedSantriId, setSelectedSantriId] = useState("");
  const [createJenisTransaksi, setCreateJenisTransaksi] = useState("SPP");
  const [createJumlah, setCreateJumlah] = useState("");
  const [createBulan, setCreateBulan] = useState(bulanList[currentMonthIndex]);
  const [createTahun, setCreateTahun] = useState(currentYear.toString());
  const [createKeterangan, setCreateKeterangan] = useState("");

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

  const handleGenerateTagihan = async () => {
    try {
      setGenerating(true);
      setGenerateResult(null);

      // Check if custom amount is required for non-SPP/SYAHRIAH types
      const isOtherTagihanType = jenisTagihan &&
        jenisTagihan !== "ALL" &&
        jenisTagihan !== "SPP" &&
        jenisTagihan !== "SYAHRIAH";
      
      if (isOtherTagihanType && !customAmount) {
        setGenerateResult({
          success: false,
          message: `Jumlah untuk tagihan ${jenisTagihan} wajib diisi`,
        });
        setGenerating(false);
        return;
      }

      const response = await fetch("/api/tagihan/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bulan: generateBulan,
          tahun: parseInt(generateTahun),
          jenisSantri: jenisSantri || undefined,
          jenisTagihan: jenisTagihan,
          sppAmount: sppAmount ? parseInt(sppAmount) : undefined,
          syahriahAmount: syahriahAmount ? parseInt(syahriahAmount) : undefined,
          customAmount: customAmount ? parseInt(customAmount) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate tagihan");
      }

      setGenerateResult(data);
      
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

  // Filter santri based on search
  const filteredSantri = useMemo(() => {
    if (!santriSearch.trim()) return santriList;
    const query = santriSearch.toLowerCase();
    return santriList.filter(
      (s) =>
        s.nis.toLowerCase().includes(query) ||
        s.nama.toLowerCase().includes(query) ||
        s.kelas.toLowerCase().includes(query)
    );
  }, [santriList, santriSearch]);

  const handleCreateTagihan = async () => {
    if (!selectedSantriId || !createJumlah) {
      setCreateResult({
        success: false,
        message: "Santri dan jumlah harus diisi",
      });
      return;
    }

    try {
      setCreating(true);
      setCreateResult(null);

      const response = await fetch("/api/tagihan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          santriId: selectedSantriId,
          jenis: createJenisTransaksi,
          jumlah: parseInt(createJumlah),
          bulan: createBulan,
          tahun: parseInt(createTahun),
          keterangan: createKeterangan || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create tagihan");
      }

      setCreateResult({
        success: true,
        message: "Tagihan berhasil dibuat",
      });

      // Reset form
      setSelectedSantriId("");
      setCreateJumlah("");
      setCreateKeterangan("");
      setSantriSearch("");

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

  // Open create dialog and fetch santri list
  const handleOpenCreateDialog = () => {
    fetchSantriList();
    setIsCreateDialogOpen(true);
  };

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
            Kelola tagihan bulanan santri (SPP & Syahriah)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenCreateDialog}>
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
                <option value="">Semua Jenis</option>
                <option value="SMK">SMK</option>
                <option value="SMP">SMP</option>
                <option value="PONDOK">Pondok</option>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Hapus Tagihan
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {tagihanToDelete && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Apakah Anda yakin ingin menghapus tagihan ini?
                </p>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Kode:</span>
                    <span>{tagihanToDelete.kode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Jenis:</span>
                    <span>{tagihanToDelete.jenis}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Santri:</span>
                    <span>{tagihanToDelete.santri.nama}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Jumlah:</span>
                    <span>Rp {tagihanToDelete.jumlah.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Status:</span>
                    <Badge variant={tagihanToDelete.status === "LUNAS" ? "default" : tagihanToDelete.status === "OVERDUE" ? "destructive" : "secondary"}>
                      {tagihanToDelete.status === "LUNAS" ? "Lunas" : tagihanToDelete.status === "OVERDUE" ? "Terlambat" : "Belum Lunas"}
                    </Badge>
                  </div>
                </div>
                {deleteError && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {deleteError}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTagihan} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Tagihan Bulanan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="generate-bulan">Bulan</Label>
                <select
                  id="generate-bulan"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={generateBulan}
                  onChange={(e) => setGenerateBulan(e.target.value)}
                >
                  {bulanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="generate-tahun">Tahun</Label>
                <Input
                  id="generate-tahun"
                  type="number"
                  value={generateTahun}
                  onChange={(e) => setGenerateTahun(e.target.value)}
                  min="2020"
                  max="2100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jenis-santri">Jenis Santri</Label>
                <select
                  id="jenis-santri"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={jenisSantri}
                  onChange={(e) => setJenisSantri(e.target.value)}
                >
                  {jenisSantriOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jenis-tagihan">Jenis Tagihan</Label>
                <select
                  id="jenis-tagihan"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={jenisTagihan}
                  onChange={(e) => setJenisTagihan(e.target.value)}
                >
                  {jenisTagihanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Show SPP/Syahriah fields only for ALL, SPP, or SYAHRIAH */}
            {(!jenisTagihan || jenisTagihan === "ALL" || jenisTagihan === "SPP" || jenisTagihan === "SYAHRIAH") && (
              <div className="grid grid-cols-2 gap-4">
                {(jenisTagihan === "ALL" || jenisTagihan === "SPP" || !jenisTagihan) && (
                  <div className="space-y-2">
                    <Label htmlFor="spp-amount">Jumlah SPP (Rp) - Opsional</Label>
                    <Input
                      id="spp-amount"
                      type="number"
                      placeholder="Default per jenis santri"
                      value={sppAmount}
                      onChange={(e) => setSppAmount(e.target.value)}
                    />
                  </div>
                )}
                {(jenisTagihan === "ALL" || jenisTagihan === "SYAHRIAH" || !jenisTagihan) && (
                  <div className="space-y-2">
                    <Label htmlFor="syahriah-amount">Jumlah Syahriah (Rp) - Opsional</Label>
                    <Input
                      id="syahriah-amount"
                      type="number"
                      placeholder="Default per jenis santri"
                      value={syahriahAmount}
                      onChange={(e) => setSyahriahAmount(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Show custom amount field for other tagihan types */}
            {jenisTagihan && jenisTagihan !== "ALL" && jenisTagihan !== "SPP" && jenisTagihan !== "SYAHRIAH" && (
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Jumlah {jenisTagihanOptions.find(o => o.value === jenisTagihan)?.label} (Rp) *</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            )}

            {/* Show default amounts info only for SPP/SYAHRIAH */}
            {(!jenisTagihan || jenisTagihan === "ALL" || jenisTagihan === "SPP" || jenisTagihan === "SYAHRIAH") && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Default amounts per jenis santri:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>SMK: SPP Rp 350.000, Syahriah Rp 250.000</li>
                  <li>SMP: SPP Rp 300.000, Syahriah Rp 200.000</li>
                  <li>Pondok: SPP Rp 250.000, Syahriah Rp 150.000</li>
                </ul>
              </div>
            )}

            {generateResult && (
              <div
                className={`p-4 rounded-md ${
                  generateResult.success
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                }`}
              >
                <p className="font-medium">{generateResult.message}</p>
                {generateResult.data && (
                  <div className="mt-2 text-sm">
                    <p>Total Santri: {generateResult.data.totalSantri}</p>
                    <p>Dibuat: {generateResult.data.created}</p>
                    <p>Dilewati (sudah ada): {generateResult.data.skipped}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleGenerateTagihan} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Tagihan Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Buat Tagihan Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Santri Search and Select */}
            <div className="space-y-2">
              <Label htmlFor="santri-search">Cari Santri</Label>
              <Input
                id="santri-search"
                type="text"
                placeholder="Ketik NIS, nama, atau kelas..."
                value={santriSearch}
                onChange={(e) => setSantriSearch(e.target.value)}
              />
              <select
                id="selected-santri"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedSantriId}
                onChange={(e) => setSelectedSantriId(e.target.value)}
              >
                <option value="">Pilih Santri</option>
                {filteredSantri.slice(0, 50).map((santri) => (
                  <option key={santri.id} value={santri.id}>
                    {santri.nis} - {santri.nama} ({santri.kelas}) - {santri.jenisSantri}
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis Transaksi Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="jenis-transaksi">Jenis Transaksi</Label>
              <select
                id="jenis-transaksi"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={createJenisTransaksi}
                onChange={(e) => setCreateJenisTransaksi(e.target.value)}
              >
                {jenisTransaksiOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="create-jumlah">Jumlah (Rp) *</Label>
              <Input
                id="create-jumlah"
                type="number"
                placeholder="Masukkan jumlah"
                value={createJumlah}
                onChange={(e) => setCreateJumlah(e.target.value)}
              />
            </div>

            {/* Bulan and Tahun */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-bulan">Bulan</Label>
                <select
                  id="create-bulan"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={createBulan}
                  onChange={(e) => setCreateBulan(e.target.value)}
                >
                  {bulanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-tahun">Tahun</Label>
                <Input
                  id="create-tahun"
                  type="number"
                  value={createTahun}
                  onChange={(e) => setCreateTahun(e.target.value)}
                  min="2020"
                  max="2100"
                />
              </div>
            </div>

            {/* Keterangan */}
            <div className="space-y-2">
              <Label htmlFor="create-keterangan">Keterangan (Opsional)</Label>
              <Input
                id="create-keterangan"
                type="text"
                placeholder="Keterangan tambahan"
                value={createKeterangan}
                onChange={(e) => setCreateKeterangan(e.target.value)}
              />
            </div>

            {/* Result Message */}
            {createResult && (
              <div
                className={`p-4 rounded-md ${
                  createResult.success
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                }`}
              >
                <p className="font-medium">{createResult.message}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateTagihan} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Membuat...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Tagihan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cash Payment Dialog */}
      <Dialog open={isCashPaymentDialogOpen} onOpenChange={setIsCashPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Banknote className="h-5 w-5" />
              Pembayaran Cash
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {tagihanToPay && (
              <div className="space-y-3">
                {cashPaymentSuccess ? (
                  <div className="flex flex-col items-center justify-center py-6 text-green-600">
                    <CheckCircle className="h-16 w-16 mb-4" />
                    <p className="text-lg font-medium">Pembayaran Berhasil!</p>
                    <p className="text-sm text-muted-foreground">Memuat ulang data...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Konfirmasi pembayaran cash untuk tagihan ini?
                    </p>
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Kode:</span>
                        <span>{tagihanToPay.kode}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Jenis:</span>
                        <span>{tagihanToPay.jenis}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Santri:</span>
                        <span>{tagihanToPay.santri.nama}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">NIS:</span>
                        <span>{tagihanToPay.santri.nis}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Bulan/Tahun:</span>
                        <span>{tagihanToPay.bulan} {tagihanToPay.tahun}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-green-600">
                        <span>Jumlah:</span>
                        <span>Rp {tagihanToPay.jumlah.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                    {cashPaymentError && (
                      <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        {cashPaymentError}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          {!cashPaymentSuccess && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCashPaymentDialogOpen(false)} disabled={processingPayment}>
                Batal
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={confirmCashPayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Banknote className="mr-2 h-4 w-4" />
                    Konfirmasi Bayar
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}