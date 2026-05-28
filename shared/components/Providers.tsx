"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/shared/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data fresh for 5 minutes — no re-fetches on tab switch
            staleTime: 1000 * 60 * 5,
            // Keep unused data in memory for 10 minutes
            gcTime: 1000 * 60 * 10,
            // Don't refetch just because the user focused the window
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}

