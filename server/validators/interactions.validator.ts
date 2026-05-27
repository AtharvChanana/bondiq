import { z } from "zod"

export const InteractionTypeSchema = z.enum([
  "call",
  "message",
  "meetup",
  "voice_log",
  "text_log",
])

export const CreateInteractionSchema = z.object({
  personId: z.string().min(1),
  type: InteractionTypeSchema.default("text_log"),
  rawContent: z.string().min(3, "Add a few words about what happened"),
})

export type CreateInteractionInput = z.infer<typeof CreateInteractionSchema>
