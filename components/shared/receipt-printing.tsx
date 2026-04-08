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

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk - ${transaksi?.kode || ""}</title>
          <style>
            @page {
              margin: 0;
              size: 58mm 3276mm;
            }
            * {
              box-sizing: border-box; /* Memastikan padding tidak menambah lebar */
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Courier New', Courier, monospace;
              width: 100%; /* Ubah ke 100% agar mengikuti driver printer */
              color: #000;
              background-color: #fff;
            }
            .ticket {
              width: 48mm;
              max-width: 48mm;
              margin: 0 auto;
              padding: 0 2mm
            }
            .header {
              text-align: center;
              margin-bottom: 5px;
              padding-bottom: 5px;
              border-bottom: 1px dashed #000;
            }
            .title {
              font-size: 12px; /* Dikurangi dari 14px */
              font-weight: bold;
              margin: 0;
            }
            .subtitle {
              font-size: 9px; /* Dikurangi dari 10px */
              margin: 0;
            }
            .content {
              font-size: 8px; /* Dikurangi dari 11px */
              line-height: 1.3;
            }
            .row {
              display: block;
            }
            .label {
              flex-shrink: 0;
              text-align: left;
              max-width: 45%; /* Batasi lebar label */
            }
            .value {
              text-align: right;
              word-break: break-word;
              white-space: pre-wrap;
              max-width: 55%; /* Batasi lebar value */
            }
            .total-section {
              border-top: 1px dashed #000;
              margin-top: 4px;
              padding-top: 4px;
              font-size: 10px; /* Dikurangi dari 12px */
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 10px;
              font-size: 9px; /* Dikurangi dari 10px */
              padding-bottom: 15mm;
            }
            .footer p {
              margin: 2px 0;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div class="title">AL-MUNIR</div>
              <div class="subtitle">Pondok Pesantren</div>
            </div>
            
            <div class="content">
              <div class="row">
                <span class="label">Kode:</span>
                <span class="value">${transaksi?.kode || "-"}</span>
              </div>
              <div class="row">
                <span class="label">Tgl:</span>
                <span class="value">${transaksi?.tanggalBayar ? formatDate(transaksi.tanggalBayar) : formatDate(new Date())}</span>
              </div>
              <div class="row">
                <span class="label">Santri:</span>
                <span class="value">${transaksi?.santri?.nama || "-"}</span>
              </div>
              <div class="row">
                <span class="label">NIS:</span>
                <span class="value">${transaksi?.santri?.nis || "-"}</span>
              </div>
              <div class="row">
                <span class="label">Jenis:</span>
                <span class="value">${transaksi?.jenis || "-"}</span>
              </div>
              ${transaksi?.bulan ? `<div class="row"><span class="label">Bulan:</span><span class="value">${transaksi.bulan}</span></div>` : ""}
              ${transaksi?.tahun ? `<div class="row"><span class="label">Tahun:</span><span class="value">${transaksi.tahun}</span></div>` : ""}
              
              <div class="row total-section">
                <span class="label">JUMLAH:</span>
                <span class="value">${formatCurrency(transaksi?.jumlah || 0)}</span>
              </div>
              <div class="row" style="margin-top: 2px;">
                <span class="label">Status:</span>
                <span class="value">${transaksi?.status || "-"}</span>
              </div>
            </div>

            <div class="footer">
              <p>Terima kasih</p>
              <p>Simpan sbg bukti bayar</p>
              <p>- - - - - - - - - -</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);

    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };

  if (!transaksi) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Sisa UI Dialog tetap sama seperti sebelumnya */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bukti Pembayaran</DialogTitle>
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

// Hook for easier usage (tetap sama)
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