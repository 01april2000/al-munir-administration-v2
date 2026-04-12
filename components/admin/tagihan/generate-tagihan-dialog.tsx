"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Sparkles } from "lucide-react";
import {
  GenerateTagihanDialogProps,
  GenerateTagihanData,
} from "@/lib/types/tagihan-dialogs";

const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth();
const bulanList = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const bulanOptions = [
  { value: "", label: "Semua Bulan" },
  ...bulanList.map((bulan) => ({ value: bulan, label: bulan })),
];

const jenisSantriOptions = [
  { value: "", label: "Semua" },
  { value: "SMK", label: "SMK" },
  { value: "SMP", label: "SMP" },
  { value: "PONDOK", label: "Pondok" },
];

const jenisTagihanOptions = [
  { value: "", label: "Semua Jenis" },
  { value: "SPP", label: "SPP" },
  { value: "SYAHRIAH", label: "Syahriah" },
  { value: "UANG_SAKU", label: "Uang Saku" },
  { value: "LAUNDRY", label: "Laundry" },
  { value: "UJIAN", label: "Ujian" },
  { value: "PKL", label: "PKL" },
  { value: "LKS", label: "LKS" },
  { value: "BUKU_PENDAMPING", label: "Buku Pendamping" },
  { value: "TKA", label: "TKA" },
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

export function GenerateTagihanDialog({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
  result,
}: GenerateTagihanDialogProps) {
  const [bulan, setBulan] = useState(bulanList[currentMonthIndex]);
  const [tahun, setTahun] = useState(currentYear.toString());
  const [jenisSantri, setJenisSantri] = useState("");
  const [jenisTagihan, setJenisTagihan] = useState("ALL");
  const [sppAmount, setSppAmount] = useState("");
  const [syahriahAmount, setSyahriahAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [jenisUjian, setJenisUjian] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setBulan(bulanList[currentMonthIndex]);
      setTahun(currentYear.toString());
      setJenisSantri("");
      setJenisTagihan("ALL");
      setSppAmount("");
      setSyahriahAmount("");
      setCustomAmount("");
      setJenisUjian("");
      setLocalError(null);
    }
  }, [open]);

  const handleGenerate = async () => {
    setLocalError(null);

    // Check if custom amount is required for non-SPP/SYAHRIAH types
    const isOtherTagihanType =
      jenisTagihan &&
      jenisTagihan !== "ALL" &&
      jenisTagihan !== "SPP" &&
      jenisTagihan !== "SYAHRIAH";

    if (isOtherTagihanType && !customAmount) {
      setLocalError(`Jumlah untuk tagihan ${jenisTagihan} wajib diisi`);
      return;
    }

    // Check if jenis ujian is required for UJIAN type
    if (jenisTagihan === "UJIAN" && !jenisUjian) {
      setLocalError("Jenis ujian wajib dipilih");
      return;
    }

    const data: GenerateTagihanData = {
      bulan,
      tahun: parseInt(tahun),
      jenisSantri: jenisSantri || undefined,
      jenisTagihan,
      jenisUjian: jenisTagihan === "UJIAN" ? jenisUjian : undefined,
      sppAmount: sppAmount ? parseInt(sppAmount) : undefined,
      syahriahAmount: syahriahAmount ? parseInt(syahriahAmount) : undefined,
      customAmount: customAmount ? parseInt(customAmount) : undefined,
    };

    await onGenerate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
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
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
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

          {/* Show SPP/Syahriah fields only for ALL, SPP, or SYAHRIAH */}
          {(!jenisTagihan ||
            jenisTagihan === "ALL" ||
            jenisTagihan === "SPP" ||
            jenisTagihan === "SYAHRIAH") && (
            <div className="grid grid-cols-2 gap-4">
              {(jenisTagihan === "ALL" ||
                jenisTagihan === "SPP" ||
                !jenisTagihan) && (
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
              )}
              {(jenisTagihan === "ALL" ||
                jenisTagihan === "SYAHRIAH" ||
                !jenisTagihan) && (
                <div className="space-y-2">
                  <Label htmlFor="syahriah-amount">
                    Jumlah Syahriah (Rp) - Opsional
                  </Label>
                  <Input
                    id="syahriah-amount"
                    type="number"
                    placeholder="Default per jenis santri"
                    value={syahriahAmount}
                    onChange={(e) => setSyahriahAmount(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Show custom amount field for other tagihan types */}
          {jenisTagihan &&
            jenisTagihan !== "ALL" &&
            jenisTagihan !== "SPP" &&
            jenisTagihan !== "SYAHRIAH" && (
              <div className="space-y-2">
                <Label htmlFor="custom-amount">
                  Jumlah{" "}
                  {jenisTagihanOptions.find((o) => o.value === jenisTagihan)
                    ?.label}{" "}
                  (Rp) *
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

          {/* Show default amounts info only for SPP/SYAHRIAH */}
          {(!jenisTagihan ||
            jenisTagihan === "ALL" ||
            jenisTagihan === "SPP" ||
            jenisTagihan === "SYAHRIAH") && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Default amounts per jenis santri:</p>
              <ul className="list-disc list-inside mt-1">
                <li>SMK: SPP Rp 350.000, Syahriah Rp 250.000</li>
                <li>SMP: SPP Rp 300.000, Syahriah Rp 200.000</li>
                <li>Pondok: SPP Rp 250.000, Syahriah Rp 150.000</li>
              </ul>
            </div>
          )}

          {/* Local validation error */}
          {localError && (
            <div className="p-4 rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
              <p className="font-medium">{localError}</p>
            </div>
          )}

          {/* API result */}
          {result && (
            <div
              className={`p-4 rounded-md ${
                result.success
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              }`}
            >
              <p className="font-medium">{result.message}</p>
              {result.data && (
                <div className="mt-2 text-sm">
                  <p>Total Santri: {result.data.totalSantri}</p>
                  <p>Dibuat: {result.data.created}</p>
                  <p>Dilewati (sudah ada): {result.data.skipped}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
  );
}
