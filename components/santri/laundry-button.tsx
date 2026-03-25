"use client"

import { LaundryDialog } from "@/components/santri/laundry-dialog"
import { Button } from "@/components/ui/button"
import { Shirt } from "lucide-react"

interface LaundryButtonProps {
  className?: string
}

export function LaundryButton({ className }: LaundryButtonProps) {
  return (
    <LaundryDialog
      trigger={
        <Button size="sm" className={`${className} bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`}>
          <Shirt className="mr-2 h-3 w-3 md:h-4 md:w-4 text-foreground" />
          <span className="text-xs md:text-sm text-foreground">Bayar Laundry</span>
        </Button>
      }
      onPaymentComplete={() => {
        // Navigation is handled by LaundryDialog - no need to reload
      }}
    />
  )
}
