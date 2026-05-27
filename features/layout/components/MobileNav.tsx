"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Brain, Network, Settings } from "lucide-react"
import { cn } from "@/shared/utils/cn"

const mobileNavItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/people", label: "People", icon: Users },
  { href: "/log", label: "Log", icon: Brain },
  { href: "/graph", label: "Graph", icon: Network },
  { href: "/settings", label: "Settings", icon: Settings },
] as const

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-white border-t-4 border-black pb-safe">
      <div className="grid grid-cols-5 divide-x-2 divide-black h-16">
        {mobileNavItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors duration-0",
                active ? "bg-[#CCFF00] text-black" : "bg-white text-black hover:bg-gray-100"
              )}
            >
              <Icon size={20} strokeWidth={active ? 3 : 2} />
              <span 
                className={cn(
                  "uppercase text-[9px] tracking-wider",
                  active ? "font-bold" : "font-semibold"
                )}
                style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
