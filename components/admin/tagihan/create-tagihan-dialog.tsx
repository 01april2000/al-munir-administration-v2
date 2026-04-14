"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Loader2, Plus } from "lucide-react";
import {
  CreateTagihanDialogProps,
  CreateTagihanData,
  SantriOption,
} from "@/lib/types/tagihan-dialogs";

const defaultJenisTransaksiOptions = [
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

export function CreateTagihanDialog({
  open,
  onOpenChange,
  onCreate,
  isCreating,
  result,
  santriList,
  onSantriListLoad,
  jenisTransaksiOptions = defaultJenisTransaksiOptions,
  jenisUjianOptions,
}: CreateTagihanDialogProps) {
  const [santriSearch, setSantriSearch] = useState("");
  const [selectedSantriId, setSelectedSantriId] = useState("");
  const [jenisTransaksi, setJenisTransaksi] = useState("SPP");
  const [jumlah, setJumlah] = useState("");
  const [bulan, setBulan] = useState(bulanList[currentMonthIndex]);
  const [tahun, setTahun] = useState(currentYear.toString());
  const [keterangan, setKeterangan] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [jenisUjian, setJenisUjian] = useState("");

  // Load santri list when dialog opens
  useEffect(() => {
    if (open) {
      onSantriListLoad();
      // Reset form
      setSantriSearch("");
      setSelectedSantriId("");
      setJenisTransaksi("SPP");
      setJumlah("");
      setBulan(bulanList[currentMonthIndex]);
      setTahun(currentYear.toString());
      setKeterangan("");
      setLocalError(null);
      setJenisUjian("");
    }
  }, [open, onSantriListLoad]);

  // Filter santri based on search
  const filteredSantri = useMemo(() => {
    if (!santriSearch.trim()) return santriList;
    const query = santriSearch.toLowerCase();
    return santriList.filter(
      (s) =>
        s.nis.toLowerCase().includes(query) ||
        s.nama.toLowerCase().includes(query) ||
        s.kelas.toLowerCase().includes(query)
    );
  }, [santriList, santriSearch]);

  const handleCreate = async () => {
    setLocalError(null);

    if (!selectedSantriId || !jumlah) {
      setLocalError("Santri dan jumlah harus diisi");
      return;
    }

    // Validate jenis ujian for UJIAN type
    if (jenisTransaksi === "UJIAN" && jenisUjianOptions && jenisUjianOptions.length > 0 && !jenisUjian) {
      setLocalError("Jenis ujian wajib dipilih");
      return;
    }

    const data: CreateTagihanData = {
      santriId: selectedSantriId,
      jenis: jenisTransaksi,
      jumlah: parseInt(jumlah),
      bulan,
      tahun: parseInt(tahun),
      keterangan: keterangan || undefined,
      jenisUjian: jenisTransaksi === "UJIAN" ? jenisUjian : undefined,
    };

    await onCreate(data);

    // Reset form on success (check if result is successful)
    if (result?.success) {
      setSelectedSantriId("");
      setJumlah("");
      setKeterangan("");
      setSantriSearch("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat Tagihan Baru</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Santri Search and Select */}
          <div className="space-y-2">
            <Label htmlFor="santri-search">Cari Santri</Label>
            <Input
              id="santri-search"
              type="text"
              placeholder="Ketik NIS, nama, atau kelas..."
              value={santriSearch}
              onChange={(e) => setSantriSearch(e.target.value)}
            />
            <select
              id="selected-santri"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={selectedSantriId}
              onChange={(e) => setSelectedSantriId(e.target.value)}
            >
              <option value="">Pilih Santri</option>
              {filteredSantri.slice(0, 50).map((santri) => (
                <option key={santri.id} value={santri.id}>
                  {santri.nis} - {santri.nama} ({santri.kelas}) -{" "}
                  {santri.jenisSantri}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Transaksi Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="jenis-transaksi">Jenis Transaksi</Label>
            <select
              id="jenis-transaksi"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={jenisTransaksi}
              onChange={(e) => setJenisTransaksi(e.target.value)}
            >
              {jenisTransaksiOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show jenis ujian dropdown only for UJIAN type */}
          {jenisTransaksi === "UJIAN" && jenisUjianOptions && jenisUjianOptions.length > 0 && (
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

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="create-jumlah">Jumlah (Rp) *</Label>
            <Input
              id="create-jumlah"
              type="number"
              placeholder="Masukkan jumlah"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
            />
          </div>

          {/* Bulan and Tahun */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-bulan">Bulan</Label>
              <select
                id="create-bulan"
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
              <Label htmlFor="create-tahun">Tahun</Label>
              <Input
                id="create-tahun"
                type="number"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                min="2020"
                max="2100"
              />
            </div>
          </div>

          {/* Keterangan */}
          <div className="space-y-2">
            <Label htmlFor="create-keterangan">Keterangan (Opsional)</Label>
            <Input
              id="create-keterangan"
              type="text"
              placeholder="Keterangan tambahan"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />
          </div>

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
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Membuat...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Buat Tagihan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
