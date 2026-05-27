import { z } from "zod"

import { RELATIONSHIP_TYPES } from "@/shared/constants/relationship-types"

export const CreatePersonSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  avatar: z.string().url().optional().nullable().or(z.literal("")),
  relationship: z.enum(RELATIONSHIP_TYPES),
  location: z.string().max(100).optional().nullable(),
  tags: z.string().max(500).optional().nullable(),
  howWeMet: z.string().max(1000).optional().nullable(),
  currentSituation: z.string().max(1000).optional().nullable(),
  whatMattersToThem: z.string().max(1000).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  birthday: z.string().max(100).optional().nullable(),
  knownSince: z.string().max(100).optional().nullable(),
})

export const UpdatePersonSchema = CreatePersonSchema.partial()

export type CreatePersonInput = z.infer<typeof CreatePersonSchema>
export type UpdatePersonInput = z.infer<typeof UpdatePersonSchema>
