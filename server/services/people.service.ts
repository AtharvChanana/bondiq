import { PeopleRepository } from "@/server/repositories/people.repository"
import type {
  CreatePersonInput,
  UpdatePersonInput,
} from "@/server/validators/people.validator"
import { calculateHealthScore } from "@/shared/constants/health-score"

function normalizeEmpty(value?: string | null) {
  return value?.trim() ? value.trim() : null
}

export const PeopleService = {
  async getAllByUser(userId: string) {
    const people = await PeopleRepository.findAllByUser(userId)
    await PeopleRepository.updateHealthScoresForUser(
      userId,
      people.map((person) => ({
        id: person.id,
        score: calculateHealthScore(person),
      }))
    )
    return PeopleRepository.findAllByUser(userId)
  },

  getById(userId: string, id: string) {
    return PeopleRepository.findByIdForUser(id, userId)
  },

  create(userId: string, data: CreatePersonInput) {
    return PeopleRepository.create({
      userId,
      name: data.name.trim(),
      avatar: normalizeEmpty(data.avatar),
      relationship: data.relationship,
      location: normalizeEmpty(data.location),
      tags: normalizeEmpty(data.tags),
      howWeMet: normalizeEmpty(data.howWeMet),
      currentSituation: normalizeEmpty(data.currentSituation),
      whatMattersToThem: normalizeEmpty(data.whatMattersToThem),
      phone: normalizeEmpty(data.phone),
    })
  },

  update(userId: string, id: string, data: UpdatePersonInput) {
    return PeopleRepository.update(id, userId, {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.avatar !== undefined ? { avatar: normalizeEmpty(data.avatar) } : {}),
      ...(data.relationship !== undefined ? { relationship: data.relationship } : {}),
      ...(data.location !== undefined ? { location: normalizeEmpty(data.location) } : {}),
      ...(data.tags !== undefined ? { tags: normalizeEmpty(data.tags) } : {}),
      ...(data.howWeMet !== undefined ? { howWeMet: normalizeEmpty(data.howWeMet) } : {}),
      ...(data.currentSituation !== undefined
        ? { currentSituation: normalizeEmpty(data.currentSituation) }
        : {}),
      ...(data.whatMattersToThem !== undefined
        ? { whatMattersToThem: normalizeEmpty(data.whatMattersToThem) }
        : {}),
      ...(data.phone !== undefined ? { phone: normalizeEmpty(data.phone) } : {}),
    })
  },

  delete(userId: string, id: string) {
    return PeopleRepository.delete(id, userId)
  },

  async recalculateHealthScore(personId: string) {
    const person = await PeopleRepository.findById(personId)
    if (!person) return null
    const score = calculateHealthScore(person)
    return PeopleRepository.updateHealthScore(personId, score)
  },
}
