import { z } from "zod"

export const UpdateNudgeSchema = z.object({
  status: z.enum(["pending", "seen", "acted", "dismissed"]),
})

export type UpdateNudgeInput = z.infer<typeof UpdateNudgeSchema>
