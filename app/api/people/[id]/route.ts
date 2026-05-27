import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { PeopleService } from "@/server/services/people.service"
import { UpdatePersonSchema } from "@/server/validators/people.validator"

interface Params {
  params: { id: string }
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const person = await PeopleService.getById(session.user.id, params.id)
  if (!person) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(person)
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = UpdatePersonSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const person = await PeopleService.update(session.user.id, params.id, parsed.data)
  return NextResponse.json(person)
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await PeopleService.delete(session.user.id, params.id)
  return NextResponse.json({ ok: true })
}
