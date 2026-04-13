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
import { FileText, Loader2, RefreshCw, Sparkles, Plus } from "lucide-react";
import { RowSelectionState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  CreateTagihanDialog,
  CashPaymentDialog,
} from "@/components/admin/tagihan";
import {
  CreateTagihanData,
  SantriOption,
  CreateResult,
  JenisTransaksiOption,
  Tagihan as TagihanType,
} from "@/lib/types/tagihan-dialogs";

const smkJenisTransaksiOptions: JenisTransaksiOption[] = [
  { value: "SPP", label: "SPP" },
  { value: "SYAHRIAH", label: "Syahriah" },
  { value: "UJIAN", label: "Ujian" },
  { value: "PKL", label: "PKL" },
  { value: "LKS", label: "LKS" },
];

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

const jenisTagihanOptions = [
  { value: "ALL", label: "SPP & Syahriah" },
  { value: "SPP", label: "SPP saja" },
  { value: "SYAHRIAH", label: "Syahriah saja" },
  { value: "PKL", label: "PKL" },
  { value: "LKS", label: "LKS" },
  { value: "UJIAN", label: "Ujian" },
];

const jenisUjianOptions = [
  { value: "UTS", label: "UTS (Ujian Tengah Semester)" },
  { value: "UAS", label: "UAS (Ujian Akhir Semester)" },
  { value: "UJIAN_NASIONAL", label: "Ujian Nasional" },
  { value: "UJIAN_SEKOLAH", label: "Ujian Sekolah" },
  { value: "UJIAN_PRAKTIK", label: "Ujian Praktik" },
  { value: "ANBK", label: "ANBK (Asesmen Nasional Berbasis Komputer)" },
  { value: "TKA", label: "TKA (Tes Kompetensi Akademik)" },
  { value: "UJIAN_LAINNYA", label: "Ujian Lainnya" },
];

const semesterOptions = [
  { value: "SEMESTER_1", label: "Semester 1 (Ganjil)" },
  { value: "SEMESTER_2", label: "Semester 2 (Genap)" },
];

const smkKelasOptions = [
  { value: "X_RPL_A", label: "X RPL A" },
  { value: "X_RPL_B", label: "X RPL B" },
  { value: "X_AKL", label: "X AKL" },
  { value: "XI_RPL_A", label: "XI RPL A" },
  { value: "XI_RPL_B", label: "XI RPL B" },
  { value: "XI_AKL", label: "XI AKL" },
  { value: "XII_RPL_A", label: "XII RPL A" },
  { value: "XII_RPL_B", label: "XII RPL B" },
  { value: "XII_AKL", label: "XII AKL" },
];

export default function TagihanManagementPage() {
  const [tagihanList, setTagihanList] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Create dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState<CreateResult | null>(null);
  const [santriList, setSantriList] = useState<SantriOption[]>([]);

  // Cash payment dialog state
  const [isCashPaymentDialogOpen, setIsCashPaymentDialogOpen] = useState(false);
  const [tagihanToPay, setTagihanToPay] = useState<Tagihan | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [cashPaymentError, setCashPaymentError] = useState<string | null>(null);
  const [cashPaymentSuccess, setCashPaymentSuccess] = useState(false);

  // Filter states
  const [filterBulan, setFilterBulan] = useState(bulanList[currentMonthIndex]);
  const [filterTahun, setFilterTahun] = useState(currentYear.toString());
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJenis, setFilterJenis] = useState("");

  // Generate form states
  const [generateBulan, setGenerateBulan] = useState(bulanList[currentMonthIndex]);
  const [generateTahun, setGenerateTahun] = useState(currentYear.toString());
  const [jenisTagihan, setJenisTagihan] = useState("ALL");
  const [sppAmount, setSppAmount] = useState("");
  const [syahriahAmount, setSyahriahAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [jenisUjian, setJenisUjian] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedKelas, setSelectedKelas] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
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

  // Reset generate form when dialog opens
  useEffect(() => {
    if (isGenerateDialogOpen) {
      setGenerateBulan(bulanList[currentMonthIndex]);
      setGenerateTahun(currentYear.toString());
      setJenisTagihan("ALL");
      setSppAmount("");
      setSyahriahAmount("");
      setCustomAmount("");
      setJenisUjian("");
      setSemester("");
      setSelectedKelas([]);
      setLocalError(null);
      setGenerateResult(null);
    }
  }, [isGenerateDialogOpen]);

  // Fetch santri list for create dialog (SMK only)
  const fetchSantriList = useCallback(async () => {
    try {
      const response = await fetch("/api/santri?limit=1000&jenisSantri=SMK");
      if (!response.ok) {
        throw new Error("Failed to fetch santri");
      }
      const data = await response.json();
      setSantriList(data.santri || data);
    } catch (err) {
      console.error("Error fetching santri:", err);
    }
  }, []);

  // Handle create tagihan
  const handleCreateTagihan = async (data: CreateTagihanData) => {
    try {
      setCreating(true);
      setCreateResult(null);

      const response = await fetch("/api/tagihan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create tagihan");
      }

      setCreateResult({
        success: true,
        message: "Tagihan berhasil dibuat",
      });

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

  const fetchTagihan = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterBulan) params.append("bulan", filterBulan);
      if (filterTahun) params.append("tahun", filterTahun);
      if (filterStatus) params.append("status", filterStatus);
      if (filterJenis) params.append("jenis", filterJenis);
      params.append("jenisSantri", "SMK"); // Filter for SMK santri only

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

  const handleGenerateTagihan = async () => {
    setLocalError(null);

    // Validate custom amount for non-SPP/SYAHRIAH types
    const isOtherTagihanType =
      jenisTagihan !== "ALL" &&
      jenisTagihan !== "SPP" &&
      jenisTagihan !== "SYAHRIAH";

    if (isOtherTagihanType && (!customAmount || parseInt(customAmount) <= 0)) {
      setLocalError(`Jumlah untuk tagihan ${jenisTagihan} wajib diisi`);
      return;
    }

    // Validate jenis ujian for UJIAN type
    if (jenisTagihan === "UJIAN" && !jenisUjian) {
      setLocalError("Jenis ujian wajib dipilih");
      return;
    }

    // Validate semester for LKS type
    if (jenisTagihan === "LKS" && !semester) {
      setLocalError("Semester wajib dipilih");
      return;
    }

    // Validate kelas for UJIAN and LKS types
    if ((jenisTagihan === "UJIAN" || jenisTagihan === "LKS") && selectedKelas.length === 0) {
      setLocalError("Pilih minimal satu kelas");
      return;
    }

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
          jenisSantri: "SMK",
          jenisTagihan: jenisTagihan,
          jenisUjian: jenisTagihan === "UJIAN" ? jenisUjian : undefined,
          semester: jenisTagihan === "LKS" ? semester : undefined,
          sppAmount: sppAmount ? parseInt(sppAmount) : undefined,
          syahriahAmount: syahriahAmount ? parseInt(syahriahAmount) : undefined,
          customAmount: customAmount ? parseInt(customAmount) : undefined,
          kelas: (jenisTagihan === "UJIAN" || jenisTagihan === "LKS") ? selectedKelas : undefined,
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

  // Register handleCashPayment on window object for columns.tsx to access
  useEffect(() => {
    (window as any).handleCashPayment = handleCashPayment;
    return () => {
      delete (window as any).handleCashPayment;
    };
  }, [handleCashPayment]);

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
          <h1 className="text-2xl font-bold">Manajemen Tagihan SMK</h1>
          <p className="text-muted-foreground">
            Kelola tagihan bulanan santri SMK (SPP & Syahriah)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
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
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[150px]">
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
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="filter-tahun">Tahun</Label>
              <select
                id="filter-tahun"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
              >
                {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
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
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="filter-jenis">Jenis</Label>
              <select
                id="filter-jenis"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
              >
                <option value="">Semua Jenis</option>
                <option value="SPP">SPP</option>
                <option value="SYAHRIAH">Syahriah</option>
                <option value="PKL">PKL</option>
                <option value="LKS">LKS</option>
                <option value="UJIAN">Ujian</option>
              </select>
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

      {/* Generate Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Tagihan Bulanan SMK</DialogTitle>
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
                  {bulanOptions.filter(o => o.value !== "").map((option) => (
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

            {/* Show jenis ujian dropdown only for UJIAN type */}
            {jenisTagihan === "UJIAN" && (
              <div className="space-y-2">
                <Label htmlFor="jenis-ujian">Jenis Ujian</Label>
                <select
                  id="jenis-ujian"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={jenisUjian}
                  onChange={(e) => setJenisUjian(e.target.value)}
                >
                  <option value="">Pilih Jenis Ujian</option>
                  {jenisUjianOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Show semester dropdown only for LKS type */}
            {jenisTagihan === "LKS" && (
              <div className="space-y-2">
                <Label htmlFor="semester-lks">Semester</Label>
                <select
                  id="semester-lks"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">Pilih Semester</option>
                  {semesterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Show kelas dropdown for UJIAN and LKS types */}
            {(jenisTagihan === "UJIAN" || jenisTagihan === "LKS") && (
              <div className="space-y-2">
                <Label>Pilih Kelas</Label>
                <div className="grid grid-cols-3 gap-2">
                  {smkKelasOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 rounded-md border border-input p-2 cursor-pointer hover:bg-accent"
                    >
                      <input
                        type="checkbox"
                        checked={selectedKelas.includes(option.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedKelas([...selectedKelas, option.value]);
                          } else {
                            setSelectedKelas(selectedKelas.filter((k) => k !== option.value));
                          }
                        }}
                        className="accent-primary"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setSelectedKelas(smkKelasOptions.map((o) => o.value))}
                  >
                    Pilih Semua
                  </button>
                  <span className="text-xs text-muted-foreground">|</span>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setSelectedKelas([])}
                  >
                    Hapus Semua
                  </button>
                </div>
              </div>
            )}

            {/* Show SPP/Syahriah fields only for ALL, SPP, or SYAHRIAH */}
            {(jenisTagihan === "ALL" || jenisTagihan === "SPP" || jenisTagihan === "SYAHRIAH") && (
              <div className="grid grid-cols-2 gap-4">
                {(jenisTagihan === "ALL" || jenisTagihan === "SPP") && (
                  <div className="space-y-2">
                    <Label htmlFor="spp-amount">Jumlah SPP (Opsional)</Label>
                    <Input
                      id="spp-amount"
                      type="number"
                      placeholder="250000"
                      value={sppAmount}
                      onChange={(e) => setSppAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Default: Rp 250.000</p>
                  </div>
                )}
                {(jenisTagihan === "ALL" || jenisTagihan === "SYAHRIAH") && (
                  <div className="space-y-2">
                    <Label htmlFor="syahriah-amount">Jumlah Syahriah (Opsional)</Label>
                    <Input
                      id="syahriah-amount"
                      type="number"
                      placeholder="300000"
                      value={syahriahAmount}
                      onChange={(e) => setSyahriahAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Default: Rp 300.000</p>
                  </div>
                )}
              </div>
            )}

            {/* Show custom amount field for other tagihan types (PKL, LKS, UJIAN) */}
            {jenisTagihan !== "ALL" && jenisTagihan !== "SPP" && jenisTagihan !== "SYAHRIAH" && (
              <div className="space-y-2">
                <Label htmlFor="custom-amount">
                  Jumlah {jenisTagihanOptions.find((o) => o.value === jenisTagihan)?.label} (Rp) *
                </Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            )}

            {/* Show PKL class restriction info */}
            {jenisTagihan === "PKL" && (
              <div className="p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm">
                <p className="font-medium">ℹ️ Keterangan PKL</p>
                <p className="mt-1">
                  Tagihan PKL hanya akan digenerate untuk santri kelas{" "}
                  <strong>XII_RPL_A</strong>, <strong>XII_RPL_B</strong>, dan{" "}
                  <strong>XII_AKL</strong>.
                </p>
              </div>
            )}

            {/* Local validation error */}
            {localError && (
              <div className="p-4 rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                <p className="font-medium">{localError}</p>
              </div>
            )}

            {generateResult && (
              <div className={`p-4 rounded-md ${generateResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)} disabled={generating}>
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
      <CreateTagihanDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateTagihan}
        isCreating={creating}
        result={createResult}
        santriList={santriList}
        onSantriListLoad={fetchSantriList}
        jenisTransaksiOptions={smkJenisTransaksiOptions}
      />

      {/* Cash Payment Dialog */}
      <CashPaymentDialog
        open={isCashPaymentDialogOpen}
        onOpenChange={setIsCashPaymentDialogOpen}
        tagihan={tagihanToPay as any}
        onConfirm={confirmCashPayment}
        isProcessing={processingPayment}
        error={cashPaymentError}
        success={cashPaymentSuccess}
      />
    </div>
  );
}