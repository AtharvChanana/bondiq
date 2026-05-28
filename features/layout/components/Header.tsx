"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Bell, Heart, BarChart2 } from "lucide-react"

import { mainNavItems, settingsNavItem } from "@/features/layout/components/nav-items"
import { NotificationCenter } from "@/features/layout/components/NotificationCenter"

export function Header() {
  const pathname = usePathname()
  const allNav = [...mainNavItems, settingsNavItem]

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-4 md:px-5 bg-white border-b-4 border-black">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 no-underline">
        <div className="w-7 h-7 bg-black flex items-center justify-center">
          <Heart size={14} color="#FFFFFF" strokeWidth={3} />
        </div>
        <span 
          className="font-extrabold text-lg text-black uppercase tracking-wider"
          style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
        >
          BONDIQ
        </span>
      </Link>

      {/* Weekly Report — visible on all sizes, between logo and right actions */}
      <Link
        href="/weekly-report"
        className="font-bold text-[11px] uppercase tracking-wider no-underline inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black"
        style={{
          fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
          background: '#CCFF00',
          color: '#000000',
          whiteSpace: 'nowrap',
        }}
      >
        <BarChart2 size={12} />
        <span>WEEKLY REPORT</span>
      </Link>

      {/* Desktop Nav - Hidden on mobile */}
      <nav className="hidden md:flex items-center gap-1">
        {allNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-bold text-[11px] uppercase tracking-wider px-3.5 py-1.5 no-underline transition-all duration-100 ${
                active ? 'bg-[#CCFF00] border-2 border-black text-black' : 'bg-transparent border-2 border-transparent text-black'
              }`}
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <NotificationCenter />

        <Link
          href="/log"
          className="font-bold text-[11px] uppercase tracking-wider bg-black text-white border-2 border-black px-3.5 py-1.5 no-underline inline-flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
        >
          <Plus size={12} /> <span className="hidden sm:inline">LOG</span>
        </Link>
      </div>
    </header>
  )
}