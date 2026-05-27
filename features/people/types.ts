import type {
  InteractionDTO,
  MemoryDTO,
  MilestoneDTO,
  NudgeDTO,
  PersonSummary,
} from "@/shared/types"
import type { RelationshipType } from "@/shared/constants/relationship-types"

export interface Person extends PersonSummary {
  howWeMet: string | null
  phone: string | null
  birthday: string | null
  knownSince: string | null
  createdAt: string | Date
  milestones?: MilestoneDTO[]
  _count?: { interactions: number; memories: number }
}

export interface PersonDetail extends Person {
  memories: MemoryDTO[]
  interactions: InteractionDTO[]
  nudges: NudgeDTO[]
  followUps: Array<{ id: string; content: string; createdAt: string | Date }>
}

export interface CreatePersonInput {
  name: string
  avatar?: string | null
  relationship: RelationshipType
  location?: string | null
  tags?: string | null
  howWeMet?: string | null
  currentSituation?: string | null
  whatMattersToThem?: string | null
  phone?: string | null
  birthday?: string | null
  knownSince?: string | null
}

export type UpdatePersonInput = Partial<CreatePersonInput>
