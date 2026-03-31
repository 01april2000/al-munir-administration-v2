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
import { columns, selectColumn, Tagihan, bulanOptions } from "./columns";
import { Plus, FileText, Loader2, RefreshCw, Sparkles, Trash2, AlertTriangle, Search } from "lucide-react";
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
  { value: "ALL", label: "SPP & Syahriah" },
  { value: "SPP", label: "SPP saja" },
  { value: "SYAHRIAH", label: "Syahriah saja" },
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

  const fetchTagihan = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterBulan) params.append("bulan", filterBulan);
      if (filterTahun) params.append("tahun", filterTahun);

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
  }, [filterBulan, filterTahun]);

  useEffect(() => {
    fetchTagihan();
  }, [fetchTagihan]);

  const handleGenerateTagihan = async () => {
    try {
      setGenerating(true);
      setGenerateResult(null);

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

  // Register handleDeleteTagihan on window object for columns.tsx to access
  useEffect(() => {
    (window as any).handleDeleteTagihan = handleDeleteTagihan;
    return () => {
      delete (window as any).handleDeleteTagihan;
    };
  }, [handleDeleteTagihan]);

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
        <Button onClick={() => setIsGenerateDialogOpen(true)}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Tagihan
        </Button>
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
                <option value="">Semua Jenis</option>
                <option value="SPP">SPP</option>
                <option value="SYAHRIAH">Syahriah</option>
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

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Default amounts per jenis santri:</p>
              <ul className="list-disc list-inside mt-1">
                <li>SMK: SPP Rp 350.000, Syahriah Rp 250.000</li>
                <li>SMP: SPP Rp 300.000, Syahriah Rp 200.000</li>
                <li>Pondok: SPP Rp 250.000, Syahriah Rp 150.000</li>
              </ul>
            </div>

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
    </div>
  );
}