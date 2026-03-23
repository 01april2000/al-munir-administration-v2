"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "lucide-react"
import { MONTHS } from "@/lib/financial"

interface PeriodSelectorProps {
  selectedMonth: number
  selectedYear: number
  tempMonth: number
  tempYear: number
  isPeriodDialogOpen: boolean
  onOpenChange: (open: boolean) => void
  onTempMonthChange: (month: number) => void
  onTempYearChange: (year: number) => void
  onApply: () => void
}

export function PeriodSelector({
  selectedMonth,
  selectedYear,
  tempMonth,
  tempYear,
  isPeriodDialogOpen,
  onOpenChange,
  onTempMonthChange,
  onTempYearChange,
  onApply,
}: PeriodSelectorProps) {
  // Generate year options (current year and 5 years back)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

  const handleOpenDialog = () => {
    onTempMonthChange(selectedMonth)
    onTempYearChange(selectedYear)
    onOpenChange(true)
  }

  return (
    <Dialog open={isPeriodDialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" onClick={handleOpenDialog}>
            <Calendar className="h-4 w-4 mr-2" />
            Pilih Periode
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pilih Periode</DialogTitle>
          <DialogDescription>
            Pilih bulan dan tahun untuk melihat laporan keuangan
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bulan</label>
              <select
                value={tempMonth}
                onChange={(e) => onTempMonthChange(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tahun</label>
              <select
                value={tempYear}
                onChange={(e) => onTempYearChange(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={onApply}>
            Terapkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
