import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { AIService } from "@/server/services/ai.service"
import { DraftMessageSchema } from "@/server/validators/ai.validator"

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = DraftMessageSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const result = await AIService.draftMessage(
    session.user.id,
    parsed.data.personId,
    parsed.data.occasion,
    parsed.data.reason
  )
  return NextResponse.json(result)
}
