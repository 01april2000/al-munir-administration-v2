"use client";

import { useState, useRef } from "react";
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
import { Loader2, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { JenisSantri } from "@/lib/generated/prisma";

interface ImportSantriDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultJenisSantri?: JenisSantri; // If set, all imported santri will use this jenis
}

interface ImportResult {
  message: string;
  results: {
    success: number;
    failed: number;
    errors: { row: number; message: string }[];
  };
}

export function ImportSantriDialog({ open, onOpenChange, onSuccess, defaultJenisSantri }: ImportSantriDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[] | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setResult(null);

    if (!selectedFile) {
      return;
    }

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setError("File harus berformat Excel (.xlsx atau .xls)");
      return;
    }

    setFile(selectedFile);
    parseExcelFile(selectedFile);
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError("File Excel kosong atau tidak memiliki data yang valid");
          setPreviewData(null);
          return;
        }

        // Show first 5 rows as preview
        setPreviewData(jsonData.slice(0, 5) as Record<string, unknown>[]);
      } catch (err) {
        setError("Gagal membaca file Excel. Pastikan format file benar.");
        setPreviewData(null);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (!file || !previewData) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Read full file data
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Transform data to match API expectations
          const transformedData = (jsonData as Record<string, unknown>[]).map((row) => ({
            nis: String(row["NIS"] || row["nis"] || ""),
            nama: String(row["Nama"] || row["nama"] || row["NAMA"] || ""),
            kelas: String(row["Kelas"] || row["kelas"] || row["KELAS"] || ""),
            asrama: String(row["Asrama"] || row["asrama"] || row["ASRAMA"] || ""),
            wali: String(row["Wali"] || row["wali"] || row["WALI"] || ""),
            status: String(row["Status"] || row["status"] || row["STATUS"] || "AKTIF"),
            beasiswa: String(row["Beasiswa"] || row["beasiswa"] || row["BEASISWA"] || "").toLowerCase() === "ya" ||
                      String(row["Beasiswa"] || row["beasiswa"] || row["BEASISWA"] || "").toLowerCase() === "true" ||
                      String(row["Beasiswa"] || row["beasiswa"] || row["BEASISWA"] || "") === "1",
            jenisBeasiswa: String(row["Jenis Beasiswa"] || row["jenisBeasiswa"] || row["jenis_beasiswa"] || row["JENIS_BEASISWA"] || "") || null,
            // Use defaultJenisSantri if provided, otherwise use value from Excel
            jenisSantri: defaultJenisSantri || String(row["Jenis Santri"] || row["jenisSantri"] || row["jenis_santri"] || row["JENIS_SANTRI"] || "PONDOK"),
            jenisPondok: String(row["Jenis Pondok"] || row["jenisPondok"] || row["jenis_pondok"] || row["JENIS_PONDOK"] || "NON_PONDOK"),
            email: String(row["Email"] || row["email"] || row["EMAIL"] || ""),
            password: String(row["Password"] || row["password"] || row["PASSWORD"] || ""),
          }));

          const response = await fetch("/api/santri/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: transformedData }),
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.error || "Gagal mengimport data");
          }

          setResult(responseData);
          setFile(null);
          setPreviewData(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          // Call onSuccess if all imports were successful
          if (responseData.results.failed === 0) {
            onSuccess();
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
          setLoading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    // Use defaultJenisSantri for template if provided
    const jenisSantriValue = defaultJenisSantri || "PONDOK";
    
    const templateData = [
      {
        NIS: "12345",
        Nama: "Ahmad Fauzi",
        Kelas: "XII",
        Asrama: "Asrama Putra 1",
        Wali: "Bapak Ahmad",
        Status: "AKTIF",
        Beasiswa: "Ya",
        "Jenis Beasiswa": "FULL",
        "Jenis Santri": jenisSantriValue,
        "Jenis Pondok": "NON_PONDOK",
        Email: "ahmad@example.com",
        Password: "password123",
      },
      {
        NIS: "12346",
        Nama: "Siti Aisyah",
        Kelas: "XI",
        Asrama: "Asrama Putri 1",
        Wali: "Ibu Siti",
        Status: "AKTIF",
        Beasiswa: "Tidak",
        "Jenis Beasiswa": "",
        "Jenis Santri": jenisSantriValue,
        "Jenis Pondok": "ALMUNIR_1",
        Email: "aisyah@example.com",
        Password: "password123",
      },
      {
        NIS: "12347",
        Nama: "Muhammad Rizki",
        Kelas: jenisSantriValue === "PONDOK" ? "" : "X",
        Asrama: "Asrama Putra 2",
        Wali: "Bapak Muhammad",
        Status: "AKTIF",
        Beasiswa: "Ya",
        "Jenis Beasiswa": "SYAHRIAH",
        "Jenis Santri": jenisSantriValue,
        "Jenis Pondok": "ALMUNIR_2",
        Email: "rizki@example.com",
        Password: "password123",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Import Santri");
    XLSX.writeFile(workbook, `template_import_santri_${jenisSantriValue.toLowerCase()}.xlsx`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Data Santri dari Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Download Template */}
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Download Template</p>
                <p className="text-xs text-muted-foreground">
                  Download template Excel untuk format import yang benar
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Pilih File Excel</Label>
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Format yang didukung: .xlsx, .xls
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* Preview Data */}
          {previewData && previewData.length > 0 && (
            <div className="space-y-2">
              <Label>Preview Data (5 baris pertama)</Label>
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th key={key} className="px-3 py-2 text-left font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-t">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-3 py-2">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import Result */}
          {result && (
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                {result.results.failed === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <p className="font-medium">{result.message}</p>
              </div>

              {result.results.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Detail Error:</p>
                  <div className="max-h-40 overflow-y-auto rounded-lg border bg-muted/50 p-2">
                    {result.results.errors.map((err, index) => (
                      <div key={index} className="text-sm py-1">
                        <span className="font-medium">Baris {err.row}:</span> {err.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Keterangan Kolom:</strong>
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
              <li><strong>NIS</strong> - Nomor Induk Santri (unik)</li>
              <li><strong>Nama</strong> - Nama lengkap santri</li>
              <li><strong>Kelas</strong> - Kelas (opsional untuk santri PONDOK)</li>
              <li><strong>Asrama</strong> - Nama asrama</li>
              <li><strong>Wali</strong> - Nama wali santri</li>
              <li><strong>Status</strong> - AKTIF, NON_AKTIF, LULUS, KELUAR</li>
              <li><strong>Beasiswa</strong> - Ya/Tidak</li>
              <li><strong>Jenis Beasiswa</strong> - FULL, SYAHRIAH, SPP, UANG_SAKU</li>
              {!defaultJenisSantri && (
                <li><strong>Jenis Santri</strong> - SMK, SMP, PONDOK</li>
              )}
              {defaultJenisSantri && (
                <li><strong>Jenis Santri</strong> - Otomatis diatur ke <strong>{defaultJenisSantri}</strong></li>
              )}
              <li><strong>Jenis Pondok</strong> - ALMUNIR_1, ALMUNIR_2, SALAF, NON_PONDOK (default: NON_PONDOK)</li>
              <li><strong>Email</strong> - Email untuk login (unik)</li>
              <li><strong>Password</strong> - Password untuk login</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" disabled={loading} />}>
            Batal
          </DialogClose>
          <Button
            onClick={handleImport}
            disabled={!file || !previewData || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengimport...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
