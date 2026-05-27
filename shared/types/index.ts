import type { RelationshipType } from "@/shared/constants/relationship-types"

export type Sentiment = "positive" | "neutral" | "negative" | "mixed"
export type Importance = "high" | "medium" | "low"
export type InteractionType =
  | "call"
  | "message"
  | "meetup"
  | "voice_log"
  | "text_log"

export interface PersonSummary {
  id: string
  name: string
  avatar: string | null
  relationship: RelationshipType
  location: string | null
  tags: string | null
  currentSituation: string | null
  whatMattersToThem: string | null
  healthScore: number
  lastContactedAt: string | Date | null
  interactions?: InteractionDTO[]
}

export interface MemoryDTO {
  id: string
  personId: string
  category: string
  content: string
  importance: Importance | string
  createdAt: string | Date
}

export interface MilestoneDTO {
  id: string
  title: string
  date: string | Date | null
  isRecurring: boolean
}

export interface InteractionDTO {
  id: string
  personId: string
  type: InteractionType | string
  rawContent: string
  summary: string | null
  sentiment: Sentiment | string | null
  extractionStatus: string
  createdAt: string | Date
}

export interface NudgeDTO {
  id: string
  personId: string
  reason: string
  draftMessage: string | null
  status: string
  createdAt: string | Date
  person?: PersonSummary
}
