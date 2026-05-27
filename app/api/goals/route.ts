import { NextResponse } from "next/server"
import { getServerSession } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"
import { z } from "zod"

const CreateGoalSchema = z.object({
  personId: z.string(),
  title: z.string().min(1),
  frequencyDays: z.number().int().min(1),
})

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const personId = searchParams.get("personId")
  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id, ...(personId ? { personId } : {}) },
    include: { person: { select: { name: true, lastContactedAt: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(goals)
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const parsed = CreateGoalSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const person = await prisma.person.findFirst({ where: { id: parsed.data.personId, userId: session.user.id } })
  if (!person) return NextResponse.json({ error: "Person not found" }, { status: 404 })
  const goal = await prisma.goal.create({
    data: {
      userId: session.user.id,
      personId: parsed.data.personId,
      title: parsed.data.title,
      frequencyDays: parsed.data.frequencyDays,
    },
  })
  return NextResponse.json(goal, { status: 201 })
}
