import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { InteractionsService } from "@/server/services/interactions.service"
import { CreateInteractionSchema } from "@/server/validators/interactions.validator"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const personId = new URL(req.url).searchParams.get("personId")
  if (!personId) return NextResponse.json({ error: "personId is required" }, { status: 400 })

  const interactions = await InteractionsService.findByPerson(session.user.id, personId)
  return NextResponse.json(interactions)
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = CreateInteractionSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const interaction = await InteractionsService.create(session.user.id, parsed.data)
  return NextResponse.json(interaction, { status: 201 })
}
