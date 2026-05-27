import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { MilestonesService } from "@/server/services/milestones.service"
import { UpdateMilestoneSchema } from "@/server/validators/milestones.validator"

interface Params {
  params: { id: string }
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = UpdateMilestoneSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const milestone = await MilestonesService.update(session.user.id, params.id, parsed.data)
  return NextResponse.json(milestone)
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await MilestonesService.delete(session.user.id, params.id)
  return NextResponse.json({ ok: true })
}
