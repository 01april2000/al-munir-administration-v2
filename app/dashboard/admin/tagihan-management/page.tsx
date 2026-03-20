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
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, selectColumn, Tagihan, bulanOptions } from "./columns";
import { Plus, FileText, Loader2, RefreshCw, Sparkles, Trash2, AlertTriangle } from "lucide-react";
import { RowSelectionState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

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

  // Filter states
  const [filterBulan, setFilterBulan] = useState(bulanList[currentMonthIndex]);
  const [filterTahun, setFilterTahun] = useState(currentYear.toString());

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

  // Calculate summary
  const totalBelumLunas = tagihanList.filter(t => t.status === "BELUM_LUNAS").length;
  const totalLunas = tagihanList.filter(t => t.status === "LUNAS").length;
  const totalOverdue = tagihanList.filter(t => t.status === "OVERDUE").length;
  const totalJumlah = tagihanList.reduce((sum, t) => sum + t.jumlah, 0);

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
            <div className="text-2xl font-bold">{tagihanList.length}</div>
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
          <div className="flex gap-4">
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
              <Input
                id="filter-tahun"
                type="number"
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
                min="2020"
                max="2100"
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={fetchTagihan}>
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
              columns={columnsWithSelect}
              data={tagihanList}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              enableRowSelection={true}
              getRowId={(row) => row.id}
            />
          )}
        </CardContent>
      </Card>

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