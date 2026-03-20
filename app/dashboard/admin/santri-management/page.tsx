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
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  createColumns,
  selectColumn,
  Santri,
  StatusSantri,
  JenisSantri,
  JenisBeasiswa,
} from "./columns";
import { Plus, Users, Loader2, Trash2, GraduationCap, UserCheck } from "lucide-react";
import { RowSelectionState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

interface FormData {
  nis: string;
  nama: string;
  kelas: string;
  asrama: string;
  wali: string;
  status: StatusSantri;
  beasiswa: boolean;
  jenisBeasiswa: JenisBeasiswa | null;
  jenisSantri: JenisSantri;
  email: string;
  password: string;
}

const initialFormData: FormData = {
  nis: "",
  nama: "",
  kelas: "",
  asrama: "",
  wali: "",
  status: "AKTIF",
  beasiswa: false,
  jenisBeasiswa: null,
  jenisSantri: "PONDOK",
  email: "",
  password: "",
};

const statusOptions: { value: StatusSantri; label: string }[] = [
  { value: "AKTIF", label: "Aktif" },
  { value: "NON_AKTIF", label: "Non-Aktif" },
  { value: "LULUS", label: "Lulus" },
  { value: "KELUAR", label: "Keluar" },
];

const jenisSantriOptions: { value: JenisSantri; label: string }[] = [
  { value: "SMK", label: "SMK" },
  { value: "SMP", label: "SMP" },
  { value: "PONDOK", label: "Pondok" },
];

const jenisBeasiswaOptions: { value: JenisBeasiswa; label: string }[] = [
  { value: "FULL", label: "Full" },
  { value: "SYAHRIAH", label: "Syahriah" },
  { value: "SPP", label: "SPP" },
  { value: "UANG_SAKU", label: "Uang Saku" },
];

export default function SantriManagementPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [deletingSantri, setDeletingSantri] = useState<Santri | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const fetchSantri = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/santri");
      if (!response.ok) {
        throw new Error("Failed to fetch santri");
      }
      const data = await response.json();
      setSantriList(data.santri);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  const handleOpenCreateDialog = () => {
    setEditingSantri(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (santri: Santri) => {
    setEditingSantri(santri);
    setFormData({
      nis: santri.nis,
      nama: santri.nama,
      kelas: santri.kelas,
      asrama: santri.asrama,
      wali: santri.wali,
      status: santri.status,
      beasiswa: santri.beasiswa,
      jenisBeasiswa: santri.jenisBeasiswa,
      jenisSantri: santri.jenisSantri,
      email: santri.user?.email || "",
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (santri: Santri) => {
    setDeletingSantri(santri);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSantri(null);
    setFormData(initialFormData);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingSantri(null);
  };

  const handleCloseBulkDeleteDialog = () => {
    setIsBulkDeleteDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingSantri ? `/api/santri/${editingSantri.id}` : "/api/santri";
      const method = editingSantri ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save santri");
      }

      await fetchSantri();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSantri) return;

    setSubmitting(true);

    try {
      const response = await fetch(`/api/santri/${deletingSantri.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete santri");
      }

      await fetchSantri();
      handleCloseDeleteDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/santri/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete santri");
      }

      setRowSelection({});
      await fetchSantri();
      handleCloseBulkDeleteDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = createColumns({
    onEdit: handleOpenEditDialog,
    onDelete: handleOpenDeleteDialog,
  });

  // Combine select column with other columns
  const tableColumns = [selectColumn, ...columns];

  const selectedCount = Object.keys(rowSelection).length;

  // Calculate summary
  const totalSantri = santriList.length;
  const aktifSantri = santriList.filter((s) => s.status === "AKTIF").length;
  const nonAktifSantri = santriList.filter((s) => s.status === "NON_AKTIF").length;
  const beasiswaSantri = santriList.filter((s) => s.beasiswa).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Santri</h1>
          <p className="text-muted-foreground">Kelola data santri</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus ({selectedCount})
            </Button>
          )}
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Santri
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Santri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSantri}</div>
            <p className="text-xs text-muted-foreground">Terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
            <Badge>{aktifSantri}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aktifSantri}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Aktif</CardTitle>
            <Badge variant="secondary">{nonAktifSantri}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nonAktifSantri}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beasiswa</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beasiswaSantri}</div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable
              columns={tableColumns}
              data={santriList}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              enableRowSelection={true}
              getRowId={(row) => row.id}
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSantri ? "Edit Santri" : "Tambah Santri Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nis">NIS</Label>
                <Input
                  id="nis"
                  value={formData.nis}
                  onChange={(e) =>
                    setFormData({ ...formData, nis: e.target.value })
                  }
                  placeholder="NIS"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  placeholder="Nama lengkap"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kelas">Kelas</Label>
                <Input
                  id="kelas"
                  value={formData.kelas}
                  onChange={(e) =>
                    setFormData({ ...formData, kelas: e.target.value })
                  }
                  placeholder="Kelas"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asrama">Asrama</Label>
                <Input
                  id="asrama"
                  value={formData.asrama}
                  onChange={(e) =>
                    setFormData({ ...formData, asrama: e.target.value })
                  }
                  placeholder="Asrama"
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="wali">Wali</Label>
                <Input
                  id="wali"
                  value={formData.wali}
                  onChange={(e) =>
                    setFormData({ ...formData, wali: e.target.value })
                  }
                  placeholder="Nama wali"
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email untuk login"
                  required={!editingSantri}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="password">
                  {editingSantri ? "Password Baru (kosongkan jika tidak diubah)" : "Password"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={editingSantri ? "Kosongkan jika tidak diubah" : "Password untuk login"}
                  required={!editingSantri}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jenisSantri">Jenis Santri</Label>
                <select
                  id="jenisSantri"
                  value={formData.jenisSantri}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jenisSantri: e.target.value as JenisSantri,
                    })
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {jenisSantriOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as StatusSantri,
                    })
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="beasiswa"
                  checked={formData.beasiswa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beasiswa: e.target.checked,
                      jenisBeasiswa: e.target.checked
                        ? formData.jenisBeasiswa || "FULL"
                        : null,
                    })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="beasiswa">Beasiswa</Label>
              </div>
              {formData.beasiswa && (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="jenisBeasiswa">Jenis Beasiswa</Label>
                  <select
                    id="jenisBeasiswa"
                    value={formData.jenisBeasiswa || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenisBeasiswa: e.target.value as JenisBeasiswa,
                      })
                    }
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  >
                    {jenisBeasiswaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" disabled={submitting} />}>
                Batal
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Santri</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus santri{" "}
              <strong>{deletingSantri?.nama}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </p>
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={submitting} />}>
              Batal
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? (
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

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Santri Terpilih</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus <strong>{selectedCount} santri</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={submitting} />}>
              Batal
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={submitting}
            >
              {submitting ? (
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
    </div>
  );
}
