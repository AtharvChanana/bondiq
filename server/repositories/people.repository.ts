import type { Prisma } from "@prisma/client"

import { prisma } from "@/server/lib/prisma"

export const PeopleRepository = {
  findAllByUser(userId: string) {
    return prisma.person.findMany({
      where: { userId },
      include: {
        milestones: { orderBy: { date: "asc" } },
        _count: { select: { interactions: true, memories: true } },
      },
      orderBy: [{ healthScore: "asc" }, { name: "asc" }],
    })
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.person.findFirst({
      where: { id, userId },
      include: {
        memories: { orderBy: [{ importance: "asc" }, { createdAt: "desc" }] },
        interactions: { orderBy: { createdAt: "desc" } },
        milestones: { orderBy: { date: "asc" } },
        followUps: { where: { status: "open" }, orderBy: { createdAt: "desc" } },
        nudges: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    })
  },

  findById(id: string) {
    return prisma.person.findUnique({ where: { id } })
  },

  create(data: Prisma.PersonUncheckedCreateInput) {
    return prisma.person.create({ data })
  },

  update(id: string, userId: string, data: Prisma.PersonUpdateInput) {
    return prisma.person.update({ where: { id, userId }, data })
  },

  delete(id: string, userId: string) {
    return prisma.person.delete({ where: { id, userId } })
  },

  updateHealthScore(id: string, score: number) {
    return prisma.person.update({
      where: { id },
      data: { healthScore: score },
    })
  },

  async updateHealthScoresForUser(userId: string, scores: Array<{ id: string; score: number }>) {
    await Promise.all(
      scores.map((item) =>
        prisma.person.update({
          where: { id: item.id, userId },
          data: { healthScore: item.score },
        })
      )
    )
  },
}
