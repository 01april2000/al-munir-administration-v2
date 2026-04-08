"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Banknote, CheckCircle } from "lucide-react";
import { CashPaymentDialogProps } from "@/lib/types/tagihan-dialogs";

export function CashPaymentDialog({
  open,
  onOpenChange,
  tagihan,
  onConfirm,
  isProcessing,
  error,
  success,
}: CashPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <Banknote className="h-5 w-5" />
            Pembayaran Cash
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {tagihan && (
            <div className="space-y-3">
              {success ? (
                <div className="flex flex-col items-center justify-center py-6 text-green-600">
                  <CheckCircle className="h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">Pembayaran Berhasil!</p>
                  <p className="text-sm text-muted-foreground">
                    Memuat ulang data...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Konfirmasi pembayaran cash untuk tagihan ini?
                  </p>
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Kode:</span>
                      <span>{tagihan.kode}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Jenis:</span>
                      <span>{tagihan.jenis}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Santri:</span>
                      <span>{tagihan.santri.nama}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">NIS:</span>
                      <span>{tagihan.santri.nis}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Bulan/Tahun:</span>
                      <span>
                        {tagihan.bulan} {tagihan.tahun}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-green-600">
                      <span>Jumlah:</span>
                      <span>Rp {tagihan.jumlah.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        {!success && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Banknote className="mr-2 h-4 w-4" />
                  Konfirmasi Bayar
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
