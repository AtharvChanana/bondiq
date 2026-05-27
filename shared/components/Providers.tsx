"use client"

import { Toaster } from "sonner"
import { TooltipProvider } from "@/shared/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster
        toastOptions={{
          style: {
            background: '#1A1A1A',
            border: '4px solid #CCFF00',
            color: '#FFFFFF',
            borderRadius: '0',
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            boxShadow: '8px 8px 0px #000000',
          },
        }}
      />
    </TooltipProvider>
  )
}
