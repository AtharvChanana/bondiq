import { z } from "zod"

export const CreateMilestoneSchema = z.object({
  personId: z.string().min(1),
  title: z.string().min(1).max(120),
  date: z.string().datetime().optional().nullable().or(z.literal("")),
  isRecurring: z.boolean().default(false),
})

export const UpdateMilestoneSchema = CreateMilestoneSchema.omit({ personId: true }).partial()

export type CreateMilestoneInput = z.infer<typeof CreateMilestoneSchema>
export type UpdateMilestoneInput = z.infer<typeof UpdateMilestoneSchema>
