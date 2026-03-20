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
  getTransaksiColumns,
  formatCurrency,
  STATUS_TRANSAKSI_OPTIONS,
  JENIS_LAUNDRY_OPTIONS,
} from "@/app/dashboard/admin/transaksi/columns";
import { Transaksi } from "@/lib/types/transaksi";
import { Plus, RefreshCw, Loader2, Shirt, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  // Fetch santri for dropdown (PONDOK only)
  const fetchSantri = useCallback(async (search: string = "") => {
    try {
      setLoadingSantri(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("limit", "20");
      params.append("jenisSantri", "PONDOK");

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
        method: "PATCH",
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
        ? new Date(transaksi.tanggalBayar).toISOString().split('T')[0]
        : "",
    });
    setSantriSearch(transaksi.santri.nama);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    setIsDeleteDialogOpen(true);
  };

  // Calculate statistics
  const totalPendapatan = transaksiList.reduce((sum, t) => sum + t.jumlah, 0);
  const totalLunas = transaksiList.filter(t => t.status === "LUNAS").length;
  const totalBelumBayar = transaksiList.filter(t => t.status === "BELUM_BAYAR").length;
  const totalPending = transaksiList.filter(t => t.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPendapatan)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lunas</CardTitle>
            <Badge variant="default">LUNAS</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLunas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Bayar</CardTitle>
            <Badge variant="destructive">BELUM</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBelumBayar}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge variant="secondary">PENDING</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Transaksi Laundry</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchTransaksi}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari santri..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Filter className="h-4 w-4 mt-3 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Semua Status</option>
                  {STATUS_TRANSAKSI_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Shirt className="h-4 w-4 mt-3 text-muted-foreground" />
                <select
                  value={filterJenisLaundry}
                  onChange={(e) => setFilterJenisLaundry(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Semua Jenis Laundry</option>
                  {JENIS_LAUNDRY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          {/* Data Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="santri">Santri *</Label>
              <div className="relative">
                <Input
                  id="santri"
                  placeholder="Cari nama santri..."
                  value={santriSearch}
                  onChange={(e) => {
                    setSantriSearch(e.target.value);
                    fetchSantri(e.target.value);
                    setShowSantriDropdown(true);
                  }}
                  onFocus={() => {
                    if (santriSearch) fetchSantri(santriSearch);
                    setShowSantriDropdown(true);
                  }}
                />
                {showSantriDropdown && santriList.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                    {santriList.map((santri) => (
                      <button
                        key={santri.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, santriId: santri.id }));
                          setSantriSearch(`${santri.nama} (${santri.nis})`);
                          setShowSantriDropdown(false);
                        }}
                      >
                        {santri.nama} ({santri.nis}) - {santri.asrama}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah (Rp) *</Label>
              <Input
                id="jumlah"
                type="number"
                placeholder="Masukkan jumlah"
                value={formData.jumlah}
                onChange={(e) => handleFormChange("jumlah", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenisLaundry">Jenis Laundry *</Label>
              <select
                id="jenisLaundry"
                value={formData.jenisLaundry}
                onChange={(e) => handleFormChange("jenisLaundry", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {JENIS_LAUNDRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {STATUS_TRANSAKSI_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggalBayar">Tanggal Bayar</Label>
              <Input
                id="tanggalBayar"
                type="date"
                value={formData.tanggalBayar}
                onChange={(e) => handleFormChange("tanggalBayar", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Input
                id="keterangan"
                placeholder="Masukkan keterangan (opsional)"
                value={formData.keterangan}
                onChange={(e) => handleFormChange("keterangan", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button onClick={handleAdd} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
            <div className="space-y-2">
              <Label htmlFor="edit-santri">Santri</Label>
              <Input
                id="edit-santri"
                value={santriSearch}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-jumlah">Jumlah (Rp) *</Label>
              <Input
                id="edit-jumlah"
                type="number"
                placeholder="Masukkan jumlah"
                value={formData.jumlah}
                onChange={(e) => handleFormChange("jumlah", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-jenisLaundry">Jenis Laundry *</Label>
              <select
                id="edit-jenisLaundry"
                value={formData.jenisLaundry}
                onChange={(e) => handleFormChange("jenisLaundry", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {JENIS_LAUNDRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {STATUS_TRANSAKSI_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tanggalBayar">Tanggal Bayar</Label>
              <Input
                id="edit-tanggalBayar"
                type="date"
                value={formData.tanggalBayar}
                onChange={(e) => handleFormChange("tanggalBayar", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-keterangan">Keterangan</Label>
              <Input
                id="edit-keterangan"
                placeholder="Masukkan keterangan (opsional)"
                value={formData.keterangan}
                onChange={(e) => handleFormChange("keterangan", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Transaksi</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            {selectedTransaksi && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">{selectedTransaksi.santri.nama}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(selectedTransaksi.jumlah)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
