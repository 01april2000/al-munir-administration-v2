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
  JENIS_LAUNDRY_OPTIONS,
  BULAN_OPTIONS,
} from "@/app/dashboard/admin/transaksi/columns";
import { Transaksi } from "@/lib/types/transaksi";
import { Plus, RefreshCw, Loader2, Shirt, Search, Filter, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
}

interface FormData {
  santriId: string;
  jumlah: string;
  jenisLaundry: string;
  keterangan: string;
  status: string;
  tanggalBayar: string;
}

export function BendaharaTransaksiLaundry() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJenisLaundry, setFilterJenisLaundry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    santriId: "",
    jumlah: "",
    jenisLaundry: "REGULAR",
    keterangan: "",
    status: "BELUM_BAYAR",
    tanggalBayar: "",
  });

  // Santri search for dropdown
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [santriSearch, setSantriSearch] = useState("");
  const [loadingSantri, setLoadingSantri] = useState(false);
  const [showSantriDropdown, setShowSantriDropdown] = useState(false);
  const santriDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch santri for dropdown (all santri: SMK, SMP, and PONDOK)
  const fetchSantri = useCallback(async (search: string = "") => {
    try {
      setLoadingSantri(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("limit", "50");

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
      params.append("jenis", "LAUNDRY");
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      params.append("allJenisSantri", "true"); // Fetch from all jenis santri (SMK, SMP, PONDOK)

      if (filterStatus) params.append("status", filterStatus);
      if (filterJenisLaundry) params.append("jenisLaundry", filterJenisLaundry);
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
  }, [page, limit, filterStatus, filterJenisLaundry, searchQuery]);

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
    setFormData({
      santriId: "",
      jumlah: "",
      jenisLaundry: "REGULAR",
      keterangan: "",
      status: "BELUM_BAYAR",
      tanggalBayar: "",
    });
    setSantriSearch("");
    setShowSantriDropdown(false);
  };

  // Build request body
  const buildRequestBody = (data: FormData, isEdit: boolean = false) => {
    const base: Record<string, unknown> = {
      jumlah: parseInt(data.jumlah),
      jenisLaundry: data.jenisLaundry,
      keterangan: data.keterangan || null,
      status: data.status,
      tanggalBayar: data.tanggalBayar || null,
    };

    if (!isEdit) {
      base.santriId = data.santriId;
      base.jenis = "LAUNDRY";
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
        throw new Error("Failed to delete transaksi");
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

  // Open edit dialog
  const openEditDialog = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    setFormData({
      santriId: transaksi.santriId,
      jumlah: transaksi.jumlah.toString(),
      jenisLaundry: transaksi.jenisLaundry || "REGULAR",
      keterangan: transaksi.keterangan || "",
      status: transaksi.status,
      tanggalBayar: transaksi.tanggalBayar
        ? new Date(transaksi.tanggalBayar).toISOString().split("T")[0]
        : "",
    });
    setSantriSearch("");
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    setIsDeleteDialogOpen(true);
  };

  // Calculate statistics
  const totalJumlah = transaksiList.reduce((sum, t) => sum + t.jumlah, 0);
  const totalLunas = transaksiList.filter(t => t.status === "LUNAS").length;
  const totalPending = transaksiList.filter(t => t.status === "PENDING").length;
  const totalBelumBayar = transaksiList.filter(t => t.status === "BELUM_BAYAR").length;

  // Render form fields based on edit mode
  const getFormFields = (isEdit: boolean = false) => {
    return (
      <>
        {!isEdit && (
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
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Transaksi Laundry</h2>
          <p className="text-sm text-muted-foreground">Kelola transaksi laundry santri pondok</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
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
              <Label htmlFor="filter-jenis-laundry">Jenis Laundry</Label>
              <select
                id="filter-jenis-laundry"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterJenisLaundry}
                onChange={(e) => setFilterJenisLaundry(e.target.value)}
              >
                <option value="">Semua</option>
                {JENIS_LAUNDRY_OPTIONS.map((option) => (
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
              columns={getTransaksiColumns("LAUNDRY", {
                onEdit: openEditDialog,
                onDelete: openDeleteDialog,
              })}
              data={transaksiList}
            />
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Transaksi Laundry</DialogTitle>
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
            <DialogTitle>Edit Transaksi Laundry</DialogTitle>
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
    </div>
  );
}
