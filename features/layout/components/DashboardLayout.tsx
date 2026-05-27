import { Header } from "@/features/layout/components/Header"
import { MobileNav } from "@/features/layout/components/MobileNav"
import { FloatingAskBondIQ } from "@/features/layout/components/FloatingAskBondIQ"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      {/* pb-24 on mobile to account for MobileNav, pb-16 on desktop */}
      <main className="mx-auto max-w-7xl px-4 md:px-6 pt-8 pb-24 md:pb-16">
        {children}
      </main>
      <FloatingAskBondIQ />
      <MobileNav />
    </div>
  )
}
