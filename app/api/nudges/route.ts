import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { generateNudgesForUser } from "@/server/jobs/nudge-engine.job"
import { NudgesService } from "@/server/services/nudges.service"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const isHistory = url.searchParams.get("history") === "true"

  if (isHistory) {
    const nudges = await NudgesService.getHistory(session.user.id)
    return NextResponse.json(nudges)
  }

  await generateNudgesForUser(session.user.id)
  const nudges = await NudgesService.getPending(session.user.id)
  return NextResponse.json(nudges)
}
