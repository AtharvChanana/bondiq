import type { Prisma } from "@prisma/client"

import { prisma } from "@/server/lib/prisma"

const importanceRank: Record<string, number> = { high: 0, medium: 1, low: 2 }

export const MemoriesRepository = {
  async findByPerson(userId: string, personId: string) {
    const person = await prisma.person.findFirst({ where: { id: personId, userId } })
    if (!person) return []

    const memories = await prisma.memory.findMany({
      where: { personId },
      orderBy: { createdAt: "desc" },
    })

    return memories.sort(
      (a, b) =>
        (importanceRank[a.importance] ?? 9) - (importanceRank[b.importance] ?? 9) ||
        b.createdAt.getTime() - a.createdAt.getTime()
    )
  },

  createMany(data: Prisma.MemoryCreateManyInput[]) {
    if (!data.length) return Promise.resolve({ count: 0 })
    return prisma.memory.createMany({ data })
  },
}
