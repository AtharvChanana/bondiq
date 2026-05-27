import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { PeopleService } from "@/server/services/people.service"
import { CreatePersonSchema } from "@/server/validators/people.validator"

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const people = await PeopleService.getAllByUser(session.user.id)
  return NextResponse.json(people)
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = CreatePersonSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const person = await PeopleService.create(session.user.id, parsed.data)
  return NextResponse.json(person, { status: 201 })
}
