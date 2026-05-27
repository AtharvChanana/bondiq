import { prisma } from "@/server/lib/prisma"
import { MilestonesRepository } from "@/server/repositories/milestones.repository"
import type {
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from "@/server/validators/milestones.validator"

function parseDate(date?: string | null) {
  return date ? new Date(date) : null
}

export const MilestonesService = {
  getByPerson(userId: string, personId: string) {
    return MilestonesRepository.findByPerson(userId, personId)
  },

  async create(userId: string, data: CreateMilestoneInput) {
    const person = await prisma.person.findFirst({ where: { id: data.personId, userId } })
    if (!person) throw new Error("Person not found")

    return MilestonesRepository.create({
      personId: data.personId,
      title: data.title.trim(),
      date: parseDate(data.date),
      isRecurring: data.isRecurring,
    })
  },

  update(userId: string, id: string, data: UpdateMilestoneInput) {
    return MilestonesRepository.update(id, userId, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.date !== undefined ? { date: parseDate(data.date) } : {}),
      ...(data.isRecurring !== undefined ? { isRecurring: data.isRecurring } : {}),
    })
  },

  delete(userId: string, id: string) {
    return MilestonesRepository.delete(id, userId)
  },
}
