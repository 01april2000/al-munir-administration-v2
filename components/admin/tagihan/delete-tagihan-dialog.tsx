"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { DeleteTagihanDialogProps } from "@/lib/types/tagihan-dialogs";

export function DeleteTagihanDialog({
  open,
  onOpenChange,
  tagihan,
  onConfirm,
  isDeleting,
  error,
}: DeleteTagihanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Hapus Tagihan
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {tagihan && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin menghapus tagihan ini?
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
                  <span className="font-medium">Jumlah:</span>
                  <span>Rp {tagihan.jumlah.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant={
                      tagihan.status === "LUNAS"
                        ? "default"
                        : tagihan.status === "OVERDUE"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {tagihan.status === "LUNAS"
                      ? "Lunas"
                      : tagihan.status === "OVERDUE"
                      ? "Terlambat"
                      : "Belum Lunas"}
                  </Badge>
                </div>
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
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
  );
}
