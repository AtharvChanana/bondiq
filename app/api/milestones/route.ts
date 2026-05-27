import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { MilestonesService } from "@/server/services/milestones.service"
import { CreateMilestoneSchema } from "@/server/validators/milestones.validator"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const personId = new URL(req.url).searchParams.get("personId")
  if (!personId) return NextResponse.json({ error: "personId is required" }, { status: 400 })

  const milestones = await MilestonesService.getByPerson(session.user.id, personId)
  return NextResponse.json(milestones)
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = CreateMilestoneSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const milestone = await MilestonesService.create(session.user.id, parsed.data)
  return NextResponse.json(milestone, { status: 201 })
}
