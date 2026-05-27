import { NextResponse } from "next/server"
import { getServerSession } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await prisma.goal.deleteMany({ where: { id: params.id, userId: session.user.id } })
  return NextResponse.json({ ok: true })
}
