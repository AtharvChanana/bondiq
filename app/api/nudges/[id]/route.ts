import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { NudgesService } from "@/server/services/nudges.service"
import { UpdateNudgeSchema } from "@/server/validators/nudges.validator"

interface Params {
  params: { id: string }
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = UpdateNudgeSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const nudge = await NudgesService.update(session.user.id, params.id, parsed.data)
  return NextResponse.json(nudge)
}
