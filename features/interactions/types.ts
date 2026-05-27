import type { InteractionDTO, PersonSummary } from "@/shared/types"

export interface CreateInteractionInput {
  personId: string
  type: "text_log" | "voice_log" | "call" | "message" | "meetup"
  rawContent: string
}

export type Interaction = InteractionDTO
export type InteractionPerson = PersonSummary
