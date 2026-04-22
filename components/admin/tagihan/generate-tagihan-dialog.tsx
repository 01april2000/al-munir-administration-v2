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
  JenisTagihanOption,
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

const defaultJenisSantriOptions = [
  { value: "", label: "Semua" },
  { value: "SMK", label: "SMK" },
  { value: "SMP", label: "SMP" },
  { value: "PONDOK", label: "Pondok" },
];

const jenisPondokOptions = [
  { value: "", label: "Semua Tingkat" },
  { value: "ALMUNIR_1", label: "Almunir 1" },
  { value: "ALMUNIR_2", label: "Almunir 2" },
  { value: "SALAF", label: "Salaf" },
  { value: "NON_PONDOK", label: "Non Pondok" },
];

const defaultJenisTagihanOptions: JenisTagihanOption[] = [
  { value: "", label: "Semua Jenis" },
  // SPP dinonaktifkan sementara — lihat lib/config.ts
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

const semesterOptions = [
  { value: "SEMESTER_1", label: "Semester 1 (Ganjil)" },
  { value: "SEMESTER_2", label: "Semester 2 (Genap)" },
];

export function GenerateTagihanDialog({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
  result,
  jenisSantri: fixedJenisSantri,
  title = "Generate Tagihan Bulanan",
  jenisTagihanOptions = defaultJenisTagihanOptions,
  kelasOptions = [],
  showKelasForTypes = ["UJIAN", "LKS"],
  defaultSppHint,
  defaultSyahriahHint,
  showJenisSantriDropdown = false,
  infoBoxes,
}: GenerateTagihanDialogProps) {
  const [bulan, setBulan] = useState(bulanList[currentMonthIndex]);
  const [tahun, setTahun] = useState(currentYear.toString());
  const [jenisSantri, setJenisSantri] = useState("");
  const [jenisPondok, setJenisPondok] = useState("");
  const [jenisTagihan, setJenisTagihan] = useState(
    jenisTagihanOptions.find((o) => o.value === "ALL") ? "ALL" : ""
  );
  const [sppAmount, setSppAmount] = useState("");
  const [syahriahAmount, setSyahriahAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [jenisUjian, setJenisUjian] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedKelas, setSelectedKelas] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setBulan(bulanList[currentMonthIndex]);
      setTahun(currentYear.toString());
      setJenisSantri("");
      setJenisPondok("");
      setJenisTagihan(
        jenisTagihanOptions.find((o) => o.value === "ALL") ? "ALL" : ""
      );
      setSppAmount("");
      setSyahriahAmount("");
      setCustomAmount("");
      setJenisUjian("");
      setSemester("");
      setSelectedKelas([]);
      setLocalError(null);
    }
  }, [open, jenisTagihanOptions]);

  // Determine effective jenis santri
  const effectiveJenisSantri = fixedJenisSantri || jenisSantri || undefined;

  // Whether to show kelas selector
  const showKelas =
    kelasOptions.length > 0 && showKelasForTypes.includes(jenisTagihan);

  // Whether current tagihan type uses Syahriah amounts (SPP dinonaktifkan)
  const usesSyahriah =
    !jenisTagihan ||
    jenisTagihan === "ALL" ||
    jenisTagihan === "SYAHRIAH";

  // Whether current tagihan type uses custom amount
  const usesCustomAmount =
    jenisTagihan &&
    jenisTagihan !== "ALL" &&
    jenisTagihan !== "SYAHRIAH";

  const handleGenerate = async () => {
    setLocalError(null);

    // Validate custom amount for non-SYAHRIAH types
    if (usesCustomAmount && (!customAmount || parseInt(customAmount) <= 0)) {
      setLocalError(`Jumlah untuk tagihan ${jenisTagihan} wajib diisi`);
      return;
    }

    // Validate jenis ujian for UJIAN type
    if (jenisTagihan === "UJIAN" && !jenisUjian) {
      setLocalError("Jenis ujian wajib dipilih");
      return;
    }

    // Validate semester for LKS and BUKU_PENDAMPING types
    if ((jenisTagihan === "LKS" || jenisTagihan === "BUKU_PENDAMPING") && !semester) {
      setLocalError("Semester wajib dipilih");
      return;
    }

    // Validate kelas for types that require it
    if (showKelas && selectedKelas.length === 0) {
      setLocalError("Pilih minimal satu kelas");
      return;
    }

    const data: GenerateTagihanData = {
      bulan,
      tahun: parseInt(tahun),
      jenisSantri: effectiveJenisSantri,
      jenisPondok: jenisPondok || undefined,
      jenisTagihan,
      jenisUjian: jenisTagihan === "UJIAN" ? jenisUjian : undefined,
      semester: jenisTagihan === "LKS" || jenisTagihan === "BUKU_PENDAMPING" ? semester : undefined,
      sppAmount: sppAmount ? parseInt(sppAmount) : undefined,
      syahriahAmount: syahriahAmount ? parseInt(syahriahAmount) : undefined,
      customAmount: customAmount ? parseInt(customAmount) : undefined,
      kelas: showKelas ? selectedKelas : undefined,
    };

    await onGenerate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Bulan & Tahun */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="generate-bulan">Bulan</Label>
              <select
                id="generate-bulan"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
              >
                {bulanOptions
                  .filter((o) => o.value !== "")
                  .map((option) => (
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

          {/* Jenis Santri dropdown (only for admin) */}
          {showJenisSantriDropdown && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jenis-santri">Jenis Santri</Label>
                <select
                  id="jenis-santri"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={jenisSantri}
                  onChange={(e) => setJenisSantri(e.target.value)}
                >
                  {defaultJenisSantriOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jenis Tagihan */}
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
          )}

          {/* Jenis Pondok filter */}
          {showJenisSantriDropdown && (
            <div className="space-y-2">
              <Label htmlFor="jenis-pondok">Jenis Pondok</Label>
              <select
                id="jenis-pondok"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={jenisPondok}
                onChange={(e) => setJenisPondok(e.target.value)}
              >
                {jenisPondokOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Filter berdasarkan tingkat pondok. Pondok Bawah/Salaf → Syahriah saja.
              </p>
            </div>
          )}

          {/* Jenis Tagihan (when jenis santri is NOT shown as dropdown) */}
          {!showJenisSantriDropdown && (
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
          )}

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

          {/* Show semester dropdown for LKS and BUKU_PENDAMPING types */}
          {(jenisTagihan === "LKS" || jenisTagihan === "BUKU_PENDAMPING") && (
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

          {/* Show kelas selector for configured types */}
          {showKelas && (
            <div className="space-y-2">
              <Label>Pilih Kelas</Label>
              <div className="grid grid-cols-3 gap-2">
                {kelasOptions.map((option) => (
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
                          setSelectedKelas(
                            selectedKelas.filter((k) => k !== option.value)
                          );
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
                  onClick={() =>
                    setSelectedKelas(kelasOptions.map((o) => o.value))
                  }
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

          {/* Show Syahriah field only for ALL or SYAHRIAH */}
          {usesSyahriah && (
            <div className="grid grid-cols-1 gap-4">
              {(jenisTagihan === "ALL" ||
                jenisTagihan === "SYAHRIAH" ||
                !jenisTagihan) && (
                <div className="space-y-2">
                  <Label htmlFor="syahriah-amount">
                    Jumlah Syahriah (Opsional)
                  </Label>
                  <Input
                    id="syahriah-amount"
                    type="number"
                    placeholder="Default per jenis santri"
                    value={syahriahAmount}
                    onChange={(e) => setSyahriahAmount(e.target.value)}
                  />
                  {defaultSyahriahHint && (
                    <p className="text-xs text-muted-foreground">
                      {defaultSyahriahHint}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Show custom amount field for other tagihan types */}
          {usesCustomAmount && (
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

          {/* Info boxes for specific tagihan types */}
          {infoBoxes && infoBoxes[jenisTagihan] && (
            <div className="p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm">
              {infoBoxes[jenisTagihan]}
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
