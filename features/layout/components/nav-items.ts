import { BarChart2, GitFork, Home, Settings, Users } from "lucide-react"

export const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/people", label: "People", icon: Users },
  { href: "/weekly-report", label: "Weekly Report", icon: BarChart2 },
  { href: "/graph", label: "Graph", icon: GitFork },
] as const

export const settingsNavItem = { href: "/settings", label: "Settings", icon: Settings } as const
