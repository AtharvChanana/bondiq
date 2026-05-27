import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { AIService } from "@/server/services/ai.service"
import { BriefSchema } from "@/server/validators/ai.validator"

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = BriefSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const brief = await AIService.brief(session.user.id, parsed.data.personId)
  return NextResponse.json({ brief })
}
