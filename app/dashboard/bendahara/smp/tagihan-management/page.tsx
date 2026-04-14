"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, selectColumn, Tagihan, bulanOptions } from "./columns";
import { FileText, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { RowSelectionState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { GenerateTagihanDialog } from "@/components/admin/tagihan";
import {
  GenerateTagihanData,
  GenerateResult,
  JenisTagihanOption,
} from "@/lib/types/tagihan-dialogs";

const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth();
const bulanList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "BELUM_LUNAS", label: "Belum Lunas" },
  { value: "LUNAS", label: "Lunas" },
  { value: "OVERDUE", label: "Terlambat" },
];

const smpJenisTagihanOptions: JenisTagihanOption[] = [
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

  // Generate dialog result state
  const [generateResult, setGenerateResult] = useState<GenerateResult | null>(null);

  // Filter states
  const [filterBulan, setFilterBulan] = useState(bulanList[currentMonthIndex]);
  const [filterTahun, setFilterTahun] = useState(currentYear.toString());
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJenis, setFilterJenis] = useState("");

  const fetchTagihan = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterBulan) params.append("bulan", filterBulan);
      if (filterTahun) params.append("tahun", filterTahun);
      if (filterStatus) params.append("status", filterStatus);
      if (filterJenis) params.append("jenis", filterJenis);
      params.append("jenisSantri", "SMP"); // Filter for SMP santri only

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
  }, [filterBulan, filterTahun, filterStatus, filterJenis]);

  useEffect(() => {
    fetchTagihan();
  }, [fetchTagihan]);

  // Handle generate tagihan via shared dialog
  const handleGenerateTagihan = async (data: GenerateTagihanData) => {
    try {
      setGenerating(true);
      setGenerateResult(null);

      const response = await fetch("/api/tagihan/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          jenisSantri: "SMP",
        }),
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
          <h1 className="text-2xl font-bold">Manajemen Tagihan SMP</h1>
          <p className="text-muted-foreground">
            Kelola tagihan bulanan santri SMP (SPP & Syahriah)
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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <select
                id="filter-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-jenis">Jenis Tagihan</Label>
              <select
                id="filter-jenis"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
              >
                {smpJenisTagihanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={fetchTagihan}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
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

      {/* Generate Dialog (Shared Component) */}
      <GenerateTagihanDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
        onGenerate={handleGenerateTagihan}
        isGenerating={generating}
        result={generateResult}
        jenisSantri="SMP"
        title="Generate Tagihan Bulanan SMP"
        jenisTagihanOptions={smpJenisTagihanOptions}
        defaultSppHint="Default: Rp 300.000"
        defaultSyahriahHint="Default: Rp 200.000"
      />
    </div>
  );
}
