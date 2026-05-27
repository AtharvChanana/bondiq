import { z } from "zod"

export const ExtractInteractionSchema = z.object({
  rawContent: z.string().min(3),
})

export const DraftMessageSchema = z.object({
  personId: z.string().min(1),
  occasion: z
    .enum(["checking_in", "birthday", "following_up", "congratulating", "just_because"])
    .default("checking_in"),
  reason: z.string().optional(),
})

export const BriefSchema = z.object({
  personId: z.string().min(1),
})
