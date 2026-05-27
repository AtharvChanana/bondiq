import { NextResponse } from "next/server"

import { generateNudgesForAllUsers } from "@/server/jobs/nudge-engine.job"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const nudges = await generateNudgesForAllUsers()
  return NextResponse.json({ generated: nudges.length })
}
