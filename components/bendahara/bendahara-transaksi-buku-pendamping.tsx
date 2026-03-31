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
  formatCurrency,
  STATUS_TRANSAKSI_OPTIONS,
  BULAN_OPTIONS,
  PERIODE_PEMBAYARAN_OPTIONS,
} from "@/app/dashboard/admin/transaksi/columns";
import { Transaksi } from "@/lib/types/transaksi";
import { Plus, RefreshCw, Loader2, FileText, BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth();
const bulanList = BULAN_OPTIONS.map((b) => b.value) as string[];

const SEMESTER_OPTIONS = [
  { value: "Semester 1", label: "Semester 1" },
  { value: "Semester 2", label: "Semester 2" },
] as const;

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
  semester: string;
  tahun: string;
  jumlah: string;
  periodePembayaran: string;
  status: string;
  tanggalBayar: string;
  keterangan: string;
}

const getDefaultFormData = (): FormData => ({
  santriId: "",
  semester: "Semester 1",
  tahun: currentYear.toString(),
  jumlah: "",
  periodePembayaran: "BULANAN",
  status: "BELUM_BAYAR",
  tanggalBayar: "",
  keterangan: "",
});

export function BendaharaTransaksiBukuPendamping() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filter states
  const [filterSemester, setFilterSemester] = useState<string>("");
  const [filterTahun, setFilterTahun] = useState(currentYear.toString());
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);

  // Generate form states
  const [generateTahun, setGenerateTahun] = useState(currentYear.toString());
  const [generateJumlah, setGenerateJumlah] = useState("");
  const [generateResult, setGenerateResult] = useState<{
    success?: boolean;
    message?: string;
    data?: {
      totalSantri: number;
      created: number;
      skipped: number;
      jenisTransaksi: string;
      tahun: number;
      jumlah: number;
    };
  } | null>(null);

  // Form states
  const [formData, setFormData] = useState<FormData>(getDefaultFormData());

  // Santri search for dropdown
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [santriSearch, setSantriSearch] = useState("");
  const [loadingSantri, setLoadingSantri] = useState(false);
  const [showSantriDropdown, setShowSantriDropdown] = useState(false);
  const santriDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch santri for dropdown (only SMP santri)
  const fetchSantri = useCallback(async (search: string = "") => {
    try {
      setLoadingSantri(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("limit", "20");
      params.append("jenisSantri", "SMP");

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

  // Fetch transaksi
  const fetchTransaksi = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("jenis", "BUKU_PENDAMPING");
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (filterSemester) params.append("bulan", filterSemester);
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
  }, [page, limit, filterSemester, filterTahun, filterStatus, searchQuery]);

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
    // Auto-set status to LUNAS if tanggalBayar is provided
    const autoStatus = data.tanggalBayar ? "LUNAS" : data.status;

    const base: Record<string, unknown> = {
      jumlah: parseInt(data.jumlah),
      status: autoStatus,
      tanggalBayar: data.tanggalBayar || null,
      keterangan: data.keterangan || null,
    };

    if (!isEdit) {
      base.santriId = data.santriId;
      base.jenis = "BUKU_PENDAMPING";
    }

    base.bulan = data.semester;
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
      semester: transaksi.bulan || "Semester 1",
      tahun: transaksi.tahun?.toString() || currentYear.toString(),
      jumlah: transaksi.jumlah.toString(),
      periodePembayaran: transaksi.periodePembayaran || "BULANAN",
      status: transaksi.status,
      tanggalBayar: transaksi.tanggalBayar
        ? new Date(transaksi.tanggalBayar).toISOString().split("T")[0]
        : "",
      keterangan: transaksi.keterangan || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    setIsDeleteDialogOpen(true);
  };

  // Handle generate transactions
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setGenerateResult(null);

      const response = await fetch("/api/transaksi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jenisTransaksi: "BUKU_PENDAMPING",
          tahun: parseInt(generateTahun),
          jumlah: generateJumlah ? parseInt(generateJumlah) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate transaksi");
      }

      setGenerateResult(data);
      
      // Refresh the list
      await fetchTransaksi();
    } catch (err) {
      setGenerateResult({
        success: false,
        message: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsGenerating(false);
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
      header: "Semester",
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
      accessorKey: "keterangan",
      header: "Keterangan",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        const keterangan = row.original.keterangan;
        return keterangan || "-";
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }: { row: { original: Transaksi } }) => {
        return (
          <div className="flex gap-2">
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pembayaran Buku Pendamping</h2>
          <p className="text-sm text-muted-foreground">Kelola pembayaran buku pendamping santri SMP</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsGenerateDialogOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pembayaran
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
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
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <Label htmlFor="filter-semester">Semester</Label>
              <select
                id="filter-semester"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
              >
                <option value="">Semua</option>
                {SEMESTER_OPTIONS.map((option) => (
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
            <DataTable
              columns={columns}
              data={transaksiList}
            />
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Pembayaran Buku Pendamping</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="santri">Santri</Label>
              <div className="relative" ref={santriDropdownRef}>
                <Input
                  id="santri-search"
                  placeholder="Ketik nama santri..."
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
              </div>
              {/* Hidden input for form validation */}
              <input type="hidden" value={formData.santriId} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="semester">Semester</Label>
                <select
                  id="semester"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.semester}
                  onChange={(e) => handleFormChange("semester", e.target.value)}
                >
                  {SEMESTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="tahun">Tahun</Label>
                <Input
                  id="tahun"
                  type="number"
                  value={formData.tahun}
                  onChange={(e) => handleFormChange("tahun", e.target.value)}
                  min="2020"
                  max="2100"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="jumlah">Harga Total Buku Pendamping (Rp)</Label>
              <Input
                id="jumlah"
                type="number"
                value={formData.jumlah}
                onChange={(e) => handleFormChange("jumlah", e.target.value)}
                placeholder="Masukkan harga total buku pendamping"
              />
            </div>
            <div>
              <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
              <Input
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) => handleFormChange("keterangan", e.target.value)}
                placeholder="Masukkan keterangan (opsional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
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
                <Label htmlFor="tanggalBayar">Tanggal Bayar</Label>
                <Input
                  id="tanggalBayar"
                  type="date"
                  value={formData.tanggalBayar}
                  onChange={(e) => handleFormChange("tanggalBayar", e.target.value)}
                />
              </div>
            </div>
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
            <DialogTitle>Edit Pembayaran Buku Pendamping</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedTransaksi && (
              <div className="text-sm text-muted-foreground mb-2">
                <strong>{selectedTransaksi.santri.nama}</strong> ({selectedTransaksi.santri.nis})
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-semester">Semester</Label>
                <select
                  id="edit-semester"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.semester}
                  onChange={(e) => handleFormChange("semester", e.target.value)}
                >
                  {SEMESTER_OPTIONS.map((option) => (
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
            <div>
              <Label htmlFor="edit-jumlah">Harga Total Buku Pendamping (Rp)</Label>
              <Input
                id="edit-jumlah"
                type="number"
                value={formData.jumlah}
                onChange={(e) => handleFormChange("jumlah", e.target.value)}
                placeholder="Masukkan harga total buku pendamping"
              />
            </div>
            <div>
              <Label htmlFor="edit-keterangan">Keterangan (Opsional)</Label>
              <Input
                id="edit-keterangan"
                value={formData.keterangan}
                onChange={(e) => handleFormChange("keterangan", e.target.value)}
                placeholder="Masukkan keterangan (opsional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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

      {/* Generate Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Transaksi Buku Pendamping</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="generate-jumlah">Jumlah (Opsional)</Label>
                <Input
                  id="generate-jumlah"
                  type="number"
                  placeholder="Biaya buku pendamping"
                  value={generateJumlah}
                  onChange={(e) => setGenerateJumlah(e.target.value)}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Kosongkan jumlah untuk menggunakan nilai default (Rp 75.000)
            </p>

            {generateResult && (
              <div className={`p-4 rounded-md ${generateResult.success ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}`}>
                <p className="font-medium">{generateResult.message}</p>
                {generateResult.data && (
                  <div className="mt-2 text-sm">
                    <p>Total Santri: {generateResult.data.totalSantri}</p>
                    <p>Dibuat: {generateResult.data.created}</p>
                    <p>Sudah Ada: {generateResult.data.skipped}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)} disabled={isGenerating}>
              Batal
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
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
