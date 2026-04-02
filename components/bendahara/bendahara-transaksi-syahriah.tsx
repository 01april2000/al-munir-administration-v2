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
  BULAN_OPTIONS,
  PERIODE_PEMBAYARAN_OPTIONS,
} from "@/app/dashboard/admin/transaksi/columns";
import { Transaksi } from "@/lib/types/transaksi";
import { Plus, RefreshCw, Loader2, FileText, Banknote, Printer } from "lucide-react";
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

interface FormData {
  santriId: string;
  bulan: string;
  tahun: string;
  jumlah: string;
  periodePembayaran: string;
  status: string;
  tanggalBayar: string;
}

interface BendaharaTransaksiSyahriahProps {
  jenisSantri: "SMK" | "SMP" | "PONDOK";
}

const getDefaultFormData = (): FormData => ({
  santriId: "",
  bulan: bulanList[currentMonthIndex],
  tahun: currentYear.toString(),
  jumlah: "",
  periodePembayaran: "BULANAN",
  status: "BELUM_BAYAR",
  tanggalBayar: "",
});

export function BendaharaTransaksiSyahriah({ jenisSantri }: BendaharaTransaksiSyahriahProps) {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filter states
  const [filterBulan, setFilterBulan] = useState<string>(bulanList[currentMonthIndex]);
  const [filterTahun, setFilterTahun] = useState(currentYear.toString());
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);

  // Cash payment state
  const [isCashPaymentLoading, setIsCashPaymentLoading] = useState<string | null>(null);
  
  // Receipt printing hook
  const { isReceiptOpen, selectedTransaksi: receiptTransaksi, openReceipt, closeReceipt, ReceiptDialog } = useReceiptPrinting();

  // Form states
  const [formData, setFormData] = useState<FormData>(getDefaultFormData());

  // Santri search for dropdown
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [santriSearch, setSantriSearch] = useState("");
  const [loadingSantri, setLoadingSantri] = useState(false);
  const [showSantriDropdown, setShowSantriDropdown] = useState(false);
  const santriDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch santri for dropdown (based on jenisSantri prop)
  const fetchSantri = useCallback(async (search: string = "") => {
    try {
      setLoadingSantri(true);
      const params = new URLSearchParams();
      params.append("jenisSantri", jenisSantri);
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
  }, [jenisSantri]);

  // Fetch transaksi (SYAHRIAH only, filtered by user role in API)
  const fetchTransaksi = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("jenis", "SYAHRIAH");
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      // Add filters
      if (filterBulan) params.append("bulan", filterBulan);
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
  }, [page, limit, filterBulan, filterTahun, filterStatus, searchQuery]);

  useEffect(() => {
    fetchTransaksi();
  }, [fetchTransaksi]);

  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (santriDropdownRef.current && !santriDropdownRef.current.contains(event.target as Node)) {
        setShowSantriDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle form change
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData(getDefaultFormData());
    setSantriSearch("");
    setShowSantriDropdown(false);
  };

  // Build request body
  const buildRequestBody = (data: FormData, isEdit: boolean = false) => {
    const base: Record<string, unknown> = {
      jumlah: parseInt(data.jumlah),
      status: data.status,
      tanggalBayar: data.tanggalBayar || null,
    };

    if (!isEdit) {
      base.santriId = data.santriId;
      base.jenis = "SYAHRIAH";
    }

    base.bulan = data.bulan;
    base.tahun = parseInt(data.tahun);
    base.periodePembayaran = data.periodePembayaran;

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
      accessorKey: "bulan",
      header: "Bulan",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        const bulan = row.original.bulan;
        return bulan || "-";
      },
    },
    {
      accessorKey: "tahun",
      header: "Tahun",
    },
    {
      accessorKey: "periodePembayaran",
      header: "Periode",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        const periode = row.original.periodePembayaran;
        if (!periode) return "-";
        const labels: Record<string, string> = {
          BULANAN: "Bulanan",
          SEMESTER: "Semester",
          TAHUNAN: "Tahunan",
        };
        return labels[periode] || periode;
      },
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

  // Summary cards
  const getSummaryCards = () => {
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

  // Form fields
  const getFormFields = (isEdit: boolean = false) => {
    return (
      <>
        {!isEdit && (
          <div>
            <Label htmlFor="santri">Santri</Label>
            <div className="relative" ref={santriDropdownRef}>
              <Input
                id="santri-search"
                placeholder={`Ketik nama santri ${jenisSantri}...`}
                value={santriSearch}
                onChange={(e) => {
                  setSantriSearch(e.target.value);
                  // Only show dropdown when user types (at least 1 character)
                  if (e.target.value.length > 0) {
                    fetchSantri(e.target.value);
                    setShowSantriDropdown(true);
                  } else {
                    setShowSantriDropdown(false);
                  }
                }}
                autoComplete="off"
              />
              {loadingSantri && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {/* Autocomplete Dropdown */}
              {showSantriDropdown && santriList.length > 0 && (
                <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover shadow-md">
                  {santriList.map((santri) => (
                    <div
                      key={santri.id}
                      className="flex flex-col px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        handleFormChange("santriId", santri.id);
                        setSantriSearch(`${santri.nama} - ${santri.nis}`);
                        setShowSantriDropdown(false);
                      }}
                    >
                      <span className="font-medium">{santri.nama}</span>
                      <span className="text-xs text-muted-foreground">
                        NIS: {santri.nis} | Kelas: {santri.kelas}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* No results message */}
              {showSantriDropdown && !loadingSantri && santriSearch.length > 0 && santriList.length === 0 && (
                <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md p-3 text-sm text-muted-foreground">
                  Tidak ada santri ditemukan
                </div>
              )}
              {/* Hidden input for form validation */}
              <input type="hidden" value={formData.santriId} />
            </div>
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
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Syahriah</h2>
          <p className="text-sm text-muted-foreground">Kelola pembayaran syahriah santri {jenisSantri}</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Transaksi
        </Button>
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
          <div className="grid gap-4 md:grid-cols-5">
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

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Transaksi Syahriah</DialogTitle>
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
            <DialogTitle>Edit Transaksi Syahriah</DialogTitle>
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

      {/* Receipt Dialog */}
      <ReceiptDialog />
    </div>
  );
}
