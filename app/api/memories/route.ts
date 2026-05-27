import { NextResponse } from "next/server"

import { getServerSession } from "@/server/lib/auth"
import { MemoriesService } from "@/server/services/memories.service"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const personId = new URL(req.url).searchParams.get("personId")
  if (!personId) return NextResponse.json({ error: "personId is required" }, { status: 400 })

  const memories = await MemoriesService.getByPerson(session.user.id, personId)
  return NextResponse.json(memories)
}
