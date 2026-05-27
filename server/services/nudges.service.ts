import { NudgesRepository } from "@/server/repositories/nudges.repository"
import type { UpdateNudgeInput } from "@/server/validators/nudges.validator"

export const NudgesService = {
  getPending(userId: string) {
    return NudgesRepository.findPendingByUser(userId)
  },

  getHistory(userId: string) {
    return NudgesRepository.findHistoryByUser(userId)
  },

  update(userId: string, id: string, data: UpdateNudgeInput) {
    return NudgesRepository.updateForUser(id, userId, { status: data.status })
  },
}
