import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { DashboardService } from "@/server/services/dashboard.service"

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const dashboard = await DashboardService.get(session.user.id)
  return NextResponse.json(dashboard)
}
