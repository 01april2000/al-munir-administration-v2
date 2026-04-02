"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  getTransaksiColumns,
  formatCurrency,
  STATUS_TRANSAKSI_OPTIONS,
  STATUS_UANG_SAKU_OPTIONS,
  BULAN_OPTIONS,
  PERIODE_PEMBAYARAN_OPTIONS,
  JENIS_LAUNDRY_OPTIONS,
} from "@/app/dashboard/admin/transaksi/columns";
import { Transaksi, JenisTransaksi } from "@/lib/types/transaksi";
import { Plus, RefreshCw, Loader2, FileText, ArrowUpCircle, ArrowDownCircle, Wallet, Shirt, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useReceiptPrinting } from "@/components/shared/receipt-printing";
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
const bulanList = BULAN_OPTIONS.map((b) => b.value) as string[];

interface Santri {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  asrama: string;
  jenisSantri: string;
  saldo: number;
}

interface TransaksiTabContentProps {
  jenis: JenisTransaksi;
  title: string;
  description: string;
}

// Form data type that covers all transaction types
interface FormData {
  santriId: string;
  bulan: string;
  tahun: string;
  jumlah: string;
  periodePembayaran: string;
  status: string;
  tanggalBayar: string;
  statusUangSaku: string;
  jenisLaundry: string;
  keterangan: string;
}

// Default form data for each transaction type
const getDefaultFormData = (jenis: JenisTransaksi): FormData => {
  const base: FormData = {
    santriId: "",
    bulan: bulanList[currentMonthIndex],
    tahun: currentYear.toString(),
    jumlah: "",
    periodePembayaran: "BULANAN",
    status: "BELUM_BAYAR",
    tanggalBayar: "",
    statusUangSaku: "DITAMBAH",
    jenisLaundry: "REGULAR",
    keterangan: "",
  };

  if (jenis === "UANG_SAKU") {
    base.status = "LUNAS";
  }

  return base;
};

export function TransaksiTabContent({ jenis, title, description }: TransaksiTabContentProps) {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalSaldoUangSaku, setTotalSaldoUangSaku] = useState(0);

  // Filter states - different per transaction type
  const [filterBulan, setFilterBulan] = useState<string>("");
  const [filterTahun, setFilterTahun] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStatusUangSaku, setFilterStatusUangSaku] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCashPaymentDialogOpen, setIsCashPaymentDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);
  const [isAmbilSaldoDialog, setIsAmbilSaldoDialog] = useState(false);

  // Receipt printing hook
  const { openReceipt, ReceiptDialog } = useReceiptPrinting();

  // Form states
  const [formData, setFormData] = useState<FormData>(getDefaultFormData(jenis));

  // Santri search for dropdown
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [santriSearch, setSantriSearch] = useState("");
  const [loadingSantri, setLoadingSantri] = useState(false);
  const [showSantriDropdown, setShowSantriDropdown] = useState(false);
  const santriDropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch santri for dropdown
  const fetchSantri = useCallback(async (search: string = "") => {
    try {
      setLoadingSantri(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("limit", "20");

      const response = await fetch(`/api/santri?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSantriList(data.santri || []);
      }
    } catch (err) {
      console.error("Error fetching santri:", err);
    } finally {
      setLoadingSantri(false);
    }
  }, []);

  // Handle santri search with debounce
  const handleSantriSearch = useCallback((value: string) => {
    setSantriSearch(value);
    setShowSantriDropdown(true);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      fetchSantri(value);
    }, 300);
  }, [fetchSantri]);

  // Handle santri selection
  const handleSelectSantri = useCallback((santri: Santri) => {
    handleFormChange("santriId", santri.id);
    setSantriSearch(`${santri.nama} - ${santri.nis}`);
    setShowSantriDropdown(false);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (santriDropdownRef.current && !santriDropdownRef.current.contains(event.target as Node)) {
        setShowSantriDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get selected santri info for display
  const getSelectedSantriInfo = useCallback(() => {
    if (!formData.santriId) return null;
    return santriList.find(s => s.id === formData.santriId);
  }, [formData.santriId, santriList]);

  // Fetch transaksi
  const fetchTransaksi = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("jenis", jenis);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      // Add type-specific filters
      if (jenis === "SPP" || jenis === "SYAHRIAH") {
        if (filterBulan) params.append("bulan", filterBulan);
        if (filterTahun) params.append("tahun", filterTahun);
      }
      if (jenis === "UANG_SAKU" && filterStatusUangSaku) {
        params.append("statusUangSaku", filterStatusUangSaku);
      }
      if (filterStatus) params.append("status", filterStatus);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/transaksi?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transaksi");
      }
      const data = await response.json();
      setTransaksiList(data.items);
      setTotal(data.total);
      setTotalSaldoUangSaku(data.totalSaldoUangSaku || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [jenis, page, limit, filterBulan, filterTahun, filterStatus, filterStatusUangSaku, searchQuery]);

  useEffect(() => {
    fetchTransaksi();
  }, [fetchTransaksi]);

  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  // Handle form change
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData(getDefaultFormData(jenis));
    setSantriSearch("");
  };

  // Open dialog for "Ambil Saldo" (withdraw balance)
  const openAmbilSaldoDialog = () => {
    const defaultData = getDefaultFormData(jenis);
    defaultData.statusUangSaku = "DIAMBIL";
    setFormData(defaultData);
    setSantriSearch("");
    setIsAmbilSaldoDialog(true);
    setIsAddDialogOpen(true);
  };

  // Build request body based on transaction type
  const buildRequestBody = (data: FormData, isEdit: boolean = false) => {
    const base: Record<string, unknown> = {
      jumlah: parseInt(data.jumlah),
      status: data.status,
      tanggalBayar: data.tanggalBayar || null,
    };

    if (!isEdit) {
      base.santriId = data.santriId;
      base.jenis = jenis;
    }

    if (jenis === "SPP" || jenis === "SYAHRIAH") {
      base.bulan = data.bulan;
      base.tahun = parseInt(data.tahun);
      base.periodePembayaran = data.periodePembayaran;
    }

    if (jenis === "UANG_SAKU") {
      base.statusUangSaku = data.statusUangSaku;
      base.keterangan = data.keterangan || null;
    }

    if (jenis === "LAUNDRY") {
      base.jenisLaundry = data.jenisLaundry;
      base.keterangan = data.keterangan || null;
    }

    return base;
  };

  // Handle add transaksi
  const handleAdd = async () => {
    if (!formData.santriId || !formData.jumlah) {
      setError("Mohon lengkapi semua field yang diperlukan");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequestBody(formData)),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create transaksi");
      }

      setIsAddDialogOpen(false);
      resetForm();
      fetchTransaksi();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
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
    setFormData({
      santriId: transaksi.santriId,
      bulan: transaksi.bulan || bulanList[currentMonthIndex],
      tahun: transaksi.tahun?.toString() || currentYear.toString(),
      jumlah: transaksi.jumlah.toString(),
      periodePembayaran: transaksi.periodePembayaran || "BULANAN",
      status: transaksi.status,
      tanggalBayar: transaksi.tanggalBayar
        ? new Date(transaksi.tanggalBayar).toISOString().split("T")[0]
        : "",
      statusUangSaku: transaksi.statusUangSaku || "DITAMBAH",
      jenisLaundry: transaksi.jenisLaundry || "REGULAR",
      keterangan: transaksi.keterangan || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    setIsDeleteDialogOpen(true);
  };

  // Open cash payment dialog
  const openCashPaymentDialog = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    setIsCashPaymentDialogOpen(true);
  };

  // Handle cash payment confirmation
  const handleCashPayment = async () => {
    if (!selectedTransaksi) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/transaksi/cash-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaksiId: selectedTransaksi.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to confirm cash payment");
      }

      const data = await response.json();
      setIsCashPaymentDialogOpen(false);
      
      // Refresh the transaction list
      fetchTransaksi();
      
      // Open receipt with updated transaction data
      if (data.transaksi) {
        openReceipt(data.transaksi);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle print receipt
  const handlePrintReceipt = (transaksi: Transaksi) => {
    openReceipt(transaksi);
  };

  // Get columns with actions
  const columns = getTransaksiColumns(jenis, {
    onEdit: openEditDialog,
    onDelete: openDeleteDialog,
    onCashPayment: openCashPaymentDialog,
    onPrintReceipt: handlePrintReceipt,
  });

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Get page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [page, totalPages]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Calculate summary based on transaction type
  const getSummaryCards = () => {
    if (jenis === "UANG_SAKU") {
      const totalDitambah = transaksiList
        .filter((t) => t.statusUangSaku === "DITAMBAH")
        .reduce((sum, t) => sum + t.jumlah, 0);
      const totalDiambil = transaksiList
        .filter((t) => t.statusUangSaku === "DIAMBIL")
        .reduce((sum, t) => sum + t.jumlah, 0);

      return (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ditambah</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalDitambah)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Diambil</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDiambil)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saldo Santri</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalSaldoUangSaku >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(totalSaldoUangSaku)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
        </>
      );
    }

    if (jenis === "LAUNDRY") {
      const totalJumlah = transaksiList.reduce((sum, t) => sum + t.jumlah, 0);
      const totalLunas = transaksiList.filter((t) => t.status === "LUNAS").length;
      const totalPending = transaksiList.filter((t) => t.status === "PENDING").length;
      const totalBelumBayar = transaksiList.filter((t) => t.status === "BELUM_BAYAR").length;

      return (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
              <Shirt className="h-4 w-4 text-muted-foreground" />
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
        </>
      );
    }

    // SPP & Syahriah
    const totalJumlah = transaksiList.reduce((sum, t) => sum + t.jumlah, 0);
    const totalLunas = transaksiList.filter((t) => t.status === "LUNAS").length;
    const totalPending = transaksiList.filter((t) => t.status === "PENDING").length;
    const totalBelumBayar = transaksiList.filter((t) => t.status === "BELUM_BAYAR").length;

    return (
      <>
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
      </>
    );
  };

  // Render type-specific filter fields
  const getFilterFields = () => {
    if (jenis === "SPP" || jenis === "SYAHRIAH") {
      return (
        <>
          <div>
            <Label htmlFor="filter-bulan">Bulan</Label>
            <select
              id="filter-bulan"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
            >
              {BULAN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
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
        </>
      );
    }

    if (jenis === "UANG_SAKU") {
      return (
        <div>
          <Label htmlFor="filter-status-uang-saku">Jenis</Label>
          <select
            id="filter-status-uang-saku"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filterStatusUangSaku}
            onChange={(e) => setFilterStatusUangSaku(e.target.value)}
          >
            <option value="">Semua</option>
            {STATUS_UANG_SAKU_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return null;
  };

  // Render type-specific form fields
  const getFormFields = (isEdit: boolean = false) => {
    if (jenis === "SPP" || jenis === "SYAHRIAH") {
      return (
        <>
          {!isEdit && (
            <div className="relative" ref={santriDropdownRef}>
              <Label htmlFor="santri">Santri</Label>
              <div className="relative">
                <Input
                  id="santri-search"
                  placeholder="Ketik nama atau NIS santri..."
                  value={santriSearch}
                  onChange={(e) => handleSantriSearch(e.target.value)}
                  className={formData.santriId ? "border-green-500 pr-10" : ""}
                />
                {loadingSantri && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {formData.santriId && !loadingSantri && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showSantriDropdown && santriSearch.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                  {loadingSantri ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : santriList.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                      {santriSearch ? "Tidak ada santri ditemukan" : "Ketik untuk mencari santri..."}
                    </div>
                  ) : (
                    santriList.map((santri) => (
                      <div
                        key={santri.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-accent flex items-center justify-between ${
                          formData.santriId === santri.id ? "bg-accent" : ""
                        }`}
                        onClick={() => handleSelectSantri(santri)}
                      >
                        <div>
                          <div className="font-medium">{santri.nama}</div>
                          <div className="text-xs text-muted-foreground">
                            {santri.nis} • {santri.kelas} • {santri.asrama}
                          </div>
                        </div>
                        {formData.santriId === santri.id && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* Selected santri info */}
              {formData.santriId && getSelectedSantriInfo() && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md text-sm">
                  <span className="font-medium text-green-700 dark:text-green-300">
                    {getSelectedSantriInfo()?.nama}
                  </span>
                  <span className="text-green-600 dark:text-green-400"> - </span>
                  <span className="text-green-600 dark:text-green-400">
                    {getSelectedSantriInfo()?.nis} ({getSelectedSantriInfo()?.kelas})
                  </span>
                </div>
              )}
            </div>
          )}
          {isEdit && selectedTransaksi && (
            <div className="text-sm text-muted-foreground mb-2">
              <strong>{selectedTransaksi.santri.nama}</strong> ({selectedTransaksi.santri.nis})
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={isEdit ? "edit-bulan" : "bulan"}>Bulan</Label>
              <select
                id={isEdit ? "edit-bulan" : "bulan"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.bulan}
                onChange={(e) => handleFormChange("bulan", e.target.value)}
              >
                {BULAN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor={isEdit ? "edit-tahun" : "tahun"}>Tahun</Label>
              <Input
                id={isEdit ? "edit-tahun" : "tahun"}
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
              <Label htmlFor={isEdit ? "edit-jumlah" : "jumlah"}>Jumlah (Rp)</Label>
              <Input
                id={isEdit ? "edit-jumlah" : "jumlah"}
                type="number"
                value={formData.jumlah}
                onChange={(e) => handleFormChange("jumlah", e.target.value)}
                placeholder="Masukkan jumlah"
              />
            </div>
            <div>
              <Label htmlFor={isEdit ? "edit-periode" : "periode"}>Periode Pembayaran</Label>
              <select
                id={isEdit ? "edit-periode" : "periode"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.periodePembayaran}
                onChange={(e) => handleFormChange("periodePembayaran", e.target.value)}
              >
                {PERIODE_PEMBAYARAN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={isEdit ? "edit-status" : "status"}>Status</Label>
              <select
                id={isEdit ? "edit-status" : "status"}
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
            <div>
              <Label htmlFor={isEdit ? "edit-tanggalBayar" : "tanggalBayar"}>Tanggal Bayar</Label>
              <Input
                id={isEdit ? "edit-tanggalBayar" : "tanggalBayar"}
                type="date"
                value={formData.tanggalBayar}
                onChange={(e) => handleFormChange("tanggalBayar", e.target.value)}
              />
            </div>
          </div>
        </>
      );
    }

    if (jenis === "UANG_SAKU") {
      return (
        <>
          {!isEdit && (
            <div className="relative" ref={santriDropdownRef}>
              <Label htmlFor="santri">Santri</Label>
              <div className="relative">
                <Input
                  id="santri-search"
                  placeholder="Ketik nama atau NIS santri..."
                  value={santriSearch}
                  onChange={(e) => handleSantriSearch(e.target.value)}
                  className={formData.santriId ? "border-green-500 pr-10" : ""}
                />
                {loadingSantri && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {formData.santriId && !loadingSantri && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showSantriDropdown && santriSearch.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                  {loadingSantri ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : santriList.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                      {santriSearch ? "Tidak ada santri ditemukan" : "Ketik untuk mencari santri..."}
                    </div>
                  ) : (
                    santriList.map((santri) => (
                      <div
                        key={santri.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-accent flex items-center justify-between ${
                          formData.santriId === santri.id ? "bg-accent" : ""
                        }`}
                        onClick={() => handleSelectSantri(santri)}
                      >
                        <div>
                          <div className="font-medium">{santri.nama}</div>
                          <div className="text-xs text-muted-foreground">
                            {santri.nis} • {santri.kelas} • Saldo: {formatCurrency(santri.saldo)}
                          </div>
                        </div>
                        {formData.santriId === santri.id && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* Selected santri info */}
              {formData.santriId && getSelectedSantriInfo() && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md text-sm">
                  <span className="font-medium text-green-700 dark:text-green-300">
                    {getSelectedSantriInfo()?.nama}
                  </span>
                  <span className="text-green-600 dark:text-green-400"> - </span>
                  <span className="text-green-600 dark:text-green-400">
                    {getSelectedSantriInfo()?.nis} ({getSelectedSantriInfo()?.kelas}) - Saldo: {formatCurrency(getSelectedSantriInfo()?.saldo || 0)}
                  </span>
                </div>
              )}
            </div>
          )}
          {isEdit && selectedTransaksi && (
            <div className="text-sm text-muted-foreground mb-2">
              <strong>{selectedTransaksi.santri.nama}</strong> ({selectedTransaksi.santri.nis})
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={isEdit ? "edit-status-uang-saku" : "status-uang-saku"}>Jenis Transaksi</Label>
              <select
                id={isEdit ? "edit-status-uang-saku" : "status-uang-saku"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.statusUangSaku}
                onChange={(e) => handleFormChange("statusUangSaku", e.target.value)}
              >
                {STATUS_UANG_SAKU_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor={isEdit ? "edit-jumlah" : "jumlah"}>Jumlah (Rp)</Label>
              <Input
                id={isEdit ? "edit-jumlah" : "jumlah"}
                type="number"
                value={formData.jumlah}
                onChange={(e) => handleFormChange("jumlah", e.target.value)}
                placeholder="Masukkan jumlah"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={isEdit ? "edit-status" : "status"}>Status</Label>
              <select
                id={isEdit ? "edit-status" : "status"}
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
            <div>
              <Label htmlFor={isEdit ? "edit-tanggalBayar" : "tanggalBayar"}>Tanggal</Label>
              <Input
                id={isEdit ? "edit-tanggalBayar" : "tanggalBayar"}
                type="date"
                value={formData.tanggalBayar}
                onChange={(e) => handleFormChange("tanggalBayar", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor={isEdit ? "edit-keterangan" : "keterangan"}>Keterangan</Label>
            <Input
              id={isEdit ? "edit-keterangan" : "keterangan"}
              value={formData.keterangan}
              onChange={(e) => handleFormChange("keterangan", e.target.value)}
              placeholder="Keterangan (opsional)"
            />
          </div>
        </>
      );
    }

    if (jenis === "LAUNDRY") {
      return (
        <>
          {!isEdit && (
            <div className="relative" ref={santriDropdownRef}>
              <Label htmlFor="santri">Santri</Label>
              <div className="relative">
                <Input
                  id="santri-search"
                  placeholder="Ketik nama atau NIS santri..."
                  value={santriSearch}
                  onChange={(e) => handleSantriSearch(e.target.value)}
                  className={formData.santriId ? "border-green-500 pr-10" : ""}
                />
                {loadingSantri && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {formData.santriId && !loadingSantri && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showSantriDropdown && santriSearch.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                  {loadingSantri ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : santriList.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                      {santriSearch ? "Tidak ada santri ditemukan" : "Ketik untuk mencari santri..."}
                    </div>
                  ) : (
                    santriList.map((santri) => (
                      <div
                        key={santri.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-accent flex items-center justify-between ${
                          formData.santriId === santri.id ? "bg-accent" : ""
                        }`}
                        onClick={() => handleSelectSantri(santri)}
                      >
                        <div>
                          <div className="font-medium">{santri.nama}</div>
                          <div className="text-xs text-muted-foreground">
                            {santri.nis} • {santri.kelas} • {santri.asrama}
                          </div>
                        </div>
                        {formData.santriId === santri.id && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* Selected santri info */}
              {formData.santriId && getSelectedSantriInfo() && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md text-sm">
                  <span className="font-medium text-green-700 dark:text-green-300">
                    {getSelectedSantriInfo()?.nama}
                  </span>
                  <span className="text-green-600 dark:text-green-400"> - </span>
                  <span className="text-green-600 dark:text-green-400">
                    {getSelectedSantriInfo()?.nis} ({getSelectedSantriInfo()?.kelas})
                  </span>
                </div>
              )}
            </div>
          )}
          {isEdit && selectedTransaksi && (
            <div className="text-sm text-muted-foreground mb-2">
              <strong>{selectedTransaksi.santri.nama}</strong> ({selectedTransaksi.santri.nis})
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={isEdit ? "edit-jenis-laundry" : "jenis-laundry"}>Jenis Laundry</Label>
              <select
                id={isEdit ? "edit-jenis-laundry" : "jenis-laundry"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.jenisLaundry}
                onChange={(e) => handleFormChange("jenisLaundry", e.target.value)}
              >
                {JENIS_LAUNDRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor={isEdit ? "edit-jumlah" : "jumlah"}>Jumlah (Rp)</Label>
              <Input
                id={isEdit ? "edit-jumlah" : "jumlah"}
                type="number"
                value={formData.jumlah}
                onChange={(e) => handleFormChange("jumlah", e.target.value)}
                placeholder="Masukkan jumlah"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={isEdit ? "edit-status" : "status"}>Status</Label>
              <select
                id={isEdit ? "edit-status" : "status"}
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
            <div>
              <Label htmlFor={isEdit ? "edit-tanggalBayar" : "tanggalBayar"}>Tanggal Bayar</Label>
              <Input
                id={isEdit ? "edit-tanggalBayar" : "tanggalBayar"}
                type="date"
                value={formData.tanggalBayar}
                onChange={(e) => handleFormChange("tanggalBayar", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor={isEdit ? "edit-keterangan" : "keterangan"}>Keterangan</Label>
            <Input
              id={isEdit ? "edit-keterangan" : "keterangan"}
              value={formData.keterangan}
              onChange={(e) => handleFormChange("keterangan", e.target.value)}
              placeholder="Keterangan (opsional)"
            />
          </div>
        </>
      );
    }

    return null;
  };

  // Determine grid columns for filters
  const filterGridCols = jenis === "UANG_SAKU" || jenis === "LAUNDRY" ? "md:grid-cols-4" : "md:grid-cols-5";

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex gap-2">
          {jenis === "UANG_SAKU" && (
            <Button variant="destructive" onClick={openAmbilSaldoDialog}>
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Ambil Saldo
            </Button>
          )}
          <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {getSummaryCards()}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${filterGridCols}`}>
            {getFilterFields()}
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
            <div className="flex items-end">
              <Button variant="outline" onClick={fetchTransaksi}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
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
            <DataTable
              columns={columns}
              data={transaksiList}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} dari {total} data
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPageNumbers().map((pageNum, index) => (
                <PaginationItem key={index}>
                  {pageNum === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum as number)}
                      isActive={page === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) {
          setIsAmbilSaldoDialog(false);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isAmbilSaldoDialog ? "Ambil Saldo" : `Tambah Transaksi ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {getFormFields(false)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAdd} disabled={isSubmitting}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Transaksi {title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {getFormFields(true)}
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

      {/* Cash Payment Confirmation Dialog */}
      <Dialog open={isCashPaymentDialogOpen} onOpenChange={setIsCashPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran Cash</DialogTitle>
            <DialogDescription>
              Konfirmasi bahwa pembayaran telah diterima secara tunai.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTransaksi && (
              <div className="p-3 bg-muted rounded-md text-sm space-y-2">
                <p><strong>Kode:</strong> {selectedTransaksi.kode}</p>
                <p><strong>Santri:</strong> {selectedTransaksi.santri.nama} ({selectedTransaksi.santri.nis})</p>
                <p><strong>Jenis:</strong> {selectedTransaksi.jenis}</p>
                {selectedTransaksi.bulan && (
                  <p><strong>Bulan:</strong> {selectedTransaksi.bulan} {selectedTransaksi.tahun}</p>
                )}
                <p className="text-lg font-bold text-green-600">
                  <strong>Jumlah:</strong> {formatCurrency(selectedTransaksi.jumlah)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCashPaymentDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCashPayment} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Konfirmasi Pembayaran
                </>
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