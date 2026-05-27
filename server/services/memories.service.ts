import { MemoriesRepository } from "@/server/repositories/memories.repository"

export const MemoriesService = {
  getByPerson(userId: string, personId: string) {
    return MemoriesRepository.findByPerson(userId, personId)
  },
}
