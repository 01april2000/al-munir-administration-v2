"use client"

import { TopupDialog } from "@/components/santri/topup-dialog"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

interface TopupButtonProps {
  className?: string
}

export function TopupButton({ className }: TopupButtonProps) {
  return (
    <TopupDialog
      trigger={
        <Button size="sm" className={`${className} bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`}>
          <CreditCard className="mr-2 h-3 w-3 md:h-4 md:w-4" />
          <span className="text-xs md:text-sm">Top Up</span>
        </Button>
      }
      onTopupComplete={() => {
        // Refresh the page to update balance
        window.location.reload()
      }}
    />
  )
}
