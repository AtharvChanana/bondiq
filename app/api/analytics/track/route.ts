import { NextResponse } from "next/server"
import { prisma } from "@/server/lib/prisma"
import { z } from "zod"

const TrackSchema = z.object({
  path: z.string(),
  ip: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.string().optional().nullable(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = TrackSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Ignore localhost internal API calls and static assets if they sneaked in
    if (parsed.data.path.startsWith("/api") || parsed.data.path.startsWith("/_next")) {
      return NextResponse.json({ ok: true })
    }

    await prisma.siteVisit.create({
      data: {
        path: parsed.data.path,
        ip: parsed.data.ip ?? "Unknown",
        userAgent: parsed.data.userAgent ?? "Unknown",
        userId: parsed.data.userId,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[analytics/track] Error logging visit:", error)
    return NextResponse.json({ error: "Failed to log visit" }, { status: 500 })
  }
}
