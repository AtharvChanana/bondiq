import { NextResponse } from "next/server"
import { z } from "zod"

import { getServerSession } from "@/server/lib/auth"
import { InteractionsService } from "@/server/services/interactions.service"

const RetrySchema = z
  .object({
    personId: z.string().optional(),
    interactionId: z.string().optional(),
  })
  .refine((data) => data.personId || data.interactionId, {
    message: "personId or interactionId is required",
  })

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = RetrySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  if (parsed.data.interactionId) {
    const interaction = await InteractionsService.retryOne(
      session.user.id,
      parsed.data.interactionId
    )
    return NextResponse.json({ interaction })
  }

  const results = await InteractionsService.retryFailedForPerson(
    session.user.id,
    parsed.data.personId!
  )
  return NextResponse.json({ results })
}
