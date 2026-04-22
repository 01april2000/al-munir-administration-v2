"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/app/dashboard/admin/transaksi/columns";
import { Transaksi } from "@/lib/types/transaksi";
import { Printer } from "lucide-react";

interface ReceiptPrintProps {
  transaksi: Transaksi | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptPrinting({ transaksi, isOpen, onClose }: ReceiptPrintProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Tidak dapat membuka jendela cetak. Periksa pengaturan popup browser.");
      return;
    }

    const origin = window.location.origin;
    const kopImageUrl = `${origin}/kop%201.png`;
    const now = new Date();
    const printTimestamp = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(now);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk - ${transaksi?.kode || ""}</title>
          <style>
            @page {
              margin: 8mm 10mm;
              size: 9.5in 11in;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              color: #000;
              background-color: #fff;
              line-height: 1.4;
              font-size: 11px;
            }
            .receipt-page {
              width: 100%;
              margin: 0 auto;
            }

            /* === KOP SURAT === */
            .kop-surat {
              text-align: center;
              margin-bottom: 2px;
            }
            .kop-surat img {
              width: 50%;
              max-width: 50%;
              height: auto;
              display: block;
              margin: 0 auto;
            }
            .kop-fallback {
              text-align: center;
              padding: 5px 0;
            }
            .kop-fallback .kop-name {
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 3px;
            }
            .kop-fallback .kop-desc {
              font-size: 10px;
              margin-top: 2px;
            }

            /* === GARIS PEMISAH === */
            .separator-double {
              border: none;
              border-top: 3px double #000;
              margin: 4px 0;
            }
            .separator-single {
              border: none;
              border-top: 1px solid #000;
              margin: 3px 0;
            }

            /* === JUDUL STRUK === */
            .receipt-title {
              text-align: center;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 3px;
              text-transform: uppercase;
              margin: 4px 0 2px 0;
            }
            .receipt-subtitle {
              text-align: center;
              font-size: 10px;
              margin-bottom: 3px;
              color: #333;
            }

            /* === MAIN CONTENT LAYOUT === */
            .content-wrapper {
              display: flex;
              gap: 20px;
              margin: 5px 0;
            }
            .content-left {
              flex: 1;
            }
            .content-right {
              flex: 1.2;
            }

            /* === INFO TRANSAKSI === */
            .info-section {
              margin: 3px 0;
            }
            .info-row {
              display: flex;
              padding: 1px 0;
              font-size: 11px;
              border-bottom: 1px dotted #ccc;
            }
            .info-label {
              width: 140px;
              flex-shrink: 0;
              font-weight: 600;
            }
            .info-value {
              flex: 1;
            }
            .info-separator {
              width: 15px;
              text-align: center;
              flex-shrink: 0;
            }

            /* === DETAIL PEMBAYARAN TABLE === */
            .detail-table {
              width: 100%;
              border-collapse: collapse;
              margin: 5px 0;
              font-size: 11px;
            }
            .detail-table th {
              background-color: #f0f0f0;
              border: 1px solid #000;
              padding: 4px 8px;
              text-align: left;
              font-weight: bold;
              font-size: 10px;
            }
            .detail-table td {
              border: 1px solid #000;
              padding: 4px 8px;
            }
            .detail-table .text-right {
              text-align: right;
            }
            .detail-table .text-center {
              text-align: center;
            }
            .detail-table .total-row td {
              font-weight: bold;
              font-size: 12px;
              background-color: #f5f5f5;
            }

            /* === STATUS BADGE === */
            .status-lunas {
              display: inline-block;
              padding: 2px 8px;
              font-weight: bold;
              font-size: 10px;
              border: 1px solid #000;
              letter-spacing: 1px;
            }

            /* === BOTTOM SECTION === */
            .bottom-section {
              display: flex;
              gap: 20px;
              margin-top: 5px;
            }
            .bottom-left {
              flex: 1;
            }
            .bottom-right {
              flex: 1;
            }

            /* === TANDA TANGAN === */
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
              padding: 0 30px;
            }
            .signature-box {
              text-align: center;
              width: 180px;
            }
            .signature-box .sig-title {
              font-size: 11px;
              font-weight: 600;
              margin-bottom: 3px;
            }
            .signature-box .sig-space {
              height: 50px;
            }
            .signature-box .sig-line {
              border-bottom: 1px solid #000;
              margin-bottom: 3px;
            }
            .signature-box .sig-name {
              font-size: 11px;
              font-weight: 600;
            }

            /* === FOOTER === */
            .receipt-footer {
              margin-top: 15px;
              padding-top: 5px;
              border-top: 1px solid #000;
              text-align: center;
              font-size: 9px;
              color: #555;
            }
            .receipt-footer p {
              margin: 1px 0;
            }
            .print-info {
              text-align: right;
              font-size: 7px;
              color: #999;
              margin-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="receipt-page">
            <!-- KOP SURAT -->
            <div class="kop-surat">
              <img src="${kopImageUrl}" alt="Kop Surat Al-Munir" onerror="this.style.display='none'; document.getElementById('fallback-kop').style.display='block';" />
              <div id="fallback-kop" class="kop-fallback" style="display:none;">
                <div class="kop-name">PONDOK PESANTREN AL-MUNIR</div>
                <div class="kop-desc">Sekolah Menengah Kejuruan (SMK) & Sekolah Menengah Pertama (SMP)</div>
              </div>
            </div>

            <hr class="separator-double" />

            <!-- JUDUL STRUK -->
            <div class="receipt-title">BUKTI PEMBAYARAN</div>
            <div class="receipt-subtitle">No. Referensi: <strong>${transaksi?.kode || "-"}</strong></div>

            <hr class="separator-single" />

            <!-- 2-COLUMN CONTENT: INFO + TABLE -->
            <div class="content-wrapper">
              <!-- LEFT: INFORMASI TRANSAKSI -->
              <div class="content-left">
                <div class="info-section">
                  <div class="info-row">
                    <span class="info-label">Tanggal Pembayaran</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">${transaksi?.tanggalBayar ? formatDate(transaksi.tanggalBayar) : formatDate(new Date())}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Nama Santri</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">${transaksi?.santri?.nama || "-"}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">NIS</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">${transaksi?.santri?.nis || "-"}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Kelas</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">${transaksi?.santri?.kelas || "-"}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Asrama</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">${transaksi?.santri?.asrama || "-"}</span>
                  </div>
                  ${transaksi?.metodePembayaran ? `<div class="info-row">
                    <span class="info-label">Metode Pembayaran</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">${transaksi.metodePembayaran}</span>
                  </div>` : ""}
                </div>
              </div>

              <!-- RIGHT: TABEL DETAIL PEMBAYARAN -->
              <div class="content-right">
                <table class="detail-table">
                  <thead>
                    <tr>
                      <th style="width: 35px;">No</th>
                      <th>Uraian</th>
                      <th style="width: 90px;" class="text-center">Periode</th>
                      <th style="width: 140px;" class="text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center">1</td>
                      <td>
                        ${transaksi?.jenis || "-"}
                        ${transaksi?.keterangan ? `<br/><small style="color:#666;">${transaksi.keterangan}</small>` : ""}
                      </td>
                      <td class="text-center">
                        ${transaksi?.bulan ? transaksi.bulan : "-"}<br/>
                        ${transaksi?.tahun ? transaksi.tahun : ""}
                      </td>
                      <td class="text-right">${formatCurrency(transaksi?.jumlah || 0)}</td>
                    </tr>
                    <tr class="total-row">
                      <td colspan="3" class="text-right" style="padding-right: 15px;">TOTAL BAYAR</td>
                      <td class="text-right">${formatCurrency(transaksi?.jumlah || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- STATUS & TERBILANG (side by side) -->
            <div class="bottom-section">
              <div class="bottom-left">
                <div style="margin: 3px 0; font-size: 11px;">
                  <strong>Status Pembayaran:</strong>
                  <span class="status-lunas">${transaksi?.status || "-"}</span>
                </div>
              </div>
              <div class="bottom-right">
                <div style="margin: 3px 0; font-size: 10px; font-style: italic; padding: 3px 8px; border: 1px dashed #999; background: #fafafa;">
                  <strong>Terbilang:</strong> ${terbilang(transaksi?.jumlah || 0)} Rupiah
                </div>
              </div>
            </div>

            <!-- TANDA TANGAN -->
            <div class="signature-section">
              <div class="signature-box">
                <div class="sig-title">Penyetor</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">(..............................)</div>
              </div>
              <div class="signature-box">
                <div class="sig-title">Bendahara / Kasir</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">(..............................)</div>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="receipt-footer">
              <p>Struk ini merupakan bukti pembayaran yang sah.</p>
              <p>Harap simpan dengan baik sebagai bukti pembayaran.</p>
              <p style="margin-top: 5px; font-weight: 600;">Pondok Pesantren Al-Munir</p>
            </div>

            <div class="print-info">
              Dicetak oleh Sistem Administrasi Al-Munir | ${printTimestamp}
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);

    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };

  if (!transaksi) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Bukti Pembayaran
          </DialogTitle>
        </DialogHeader>

        <div className="p-4" ref={receiptRef}>
          <div className="text-sm text-muted-foreground mb-4">
            Mohon simpan struk pembayaran ini untuk mencatat transaksi yang sudah lunas.
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Kode Transaksi</p>
              <p className="font-mono">{transaksi.kode}</p>
            </div>
            <div>
              <p className="font-medium">Tanggal Bayar</p>
              <p className="font-mono">
                {transaksi.tanggalBayar 
                  ? formatDate(transaksi.tanggalBayar) 
                  : formatDate(new Date())}
              </p>
            </div>
            <div>
              <p className="font-medium">Santri</p>
              <p className="font-mono">{transaksi.santri.nama} ({transaksi.santri.nis})</p>
            </div>
            <div>
              <p className="font-medium">Jenis Transaksi</p>
              <p className="font-mono">{transaksi.jenis}</p>
            </div>
            {transaksi.bulan && (
              <div>
                <p className="font-medium">Bulan</p>
                <p className="font-mono">{transaksi.bulan}</p>
              </div>
            )}
            {transaksi.tahun && (
              <div>
                <p className="font-medium">Tahun</p>
                <p className="font-mono">{transaksi.tahun}</p>
              </div>
            )}
            <div>
              <p className="font-medium">Jumlah</p>
              <p className="font-mono text-lg font-bold">{formatCurrency(transaksi.jumlah)}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <Badge variant={transaksi.status === "LUNAS" ? "default" : "secondary"}>
                {transaksi.status}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Cetak Struk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Fungsi terbilang - mengubah angka menjadi kata-kata dalam Bahasa Indonesia
 */
function terbilang(amount: number): string {
  if (amount === 0) return "Nol";

  const satuan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  
  function convert(n: number): string {
    if (n < 12) return satuan[n];
    if (n < 20) return convert(n - 10) + " Belas";
    if (n < 100) return convert(Math.floor(n / 10)) + " Puluh" + (n % 10 ? " " + convert(n % 10) : "");
    if (n < 200) return "Seratus" + (n - 100 ? " " + convert(n - 100) : "");
    if (n < 1000) return convert(Math.floor(n / 100)) + " Ratus" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 2000) return "Seribu" + (n - 1000 ? " " + convert(n - 1000) : "");
    if (n < 1000000) return convert(Math.floor(n / 1000)) + " Ribu" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + " Juta" + (n % 1000000 ? " " + convert(n % 1000000) : "");
    if (n < 1000000000000) return convert(Math.floor(n / 1000000000)) + " Miliar" + (n % 1000000000 ? " " + convert(n % 1000000000) : "");
    return convert(Math.floor(n / 1000000000000)) + " Triliun" + (n % 1000000000000 ? " " + convert(n % 1000000000000) : "");
  }

  return convert(Math.floor(amount));
}

// Hook for easier usage
export function useReceiptPrinting() {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);

  const openReceipt = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    setIsReceiptOpen(true);
  };

  const closeReceipt = () => {
    setIsReceiptOpen(false);
    setSelectedTransaksi(null);
  };

  return {
    isReceiptOpen,
    selectedTransaksi,
    openReceipt,
    closeReceipt,
    ReceiptDialog: () => (
      <ReceiptPrinting
        transaksi={selectedTransaksi}
        isOpen={isReceiptOpen}
        onClose={closeReceipt}
      />
    ),
  };
}
