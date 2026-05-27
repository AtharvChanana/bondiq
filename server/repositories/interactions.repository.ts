import type { Prisma } from "@prisma/client"

import { prisma } from "@/server/lib/prisma"

export const InteractionsRepository = {
  findByPerson(userId: string, personId: string) {
    return prisma.interaction.findMany({
      where: { userId, personId },
      orderBy: { createdAt: "desc" },
    })
  },

  findFailedForPerson(userId: string, personId: string) {
    return prisma.interaction.findMany({
      where: { userId, personId, extractionStatus: "failed" },
      orderBy: { createdAt: "asc" },
    })
  },

  findByIdForUser(userId: string, id: string) {
    return prisma.interaction.findFirst({ where: { userId, id } })
  },

  create(data: Prisma.InteractionUncheckedCreateInput) {
    return prisma.interaction.create({ data })
  },

  update(id: string, data: Prisma.InteractionUpdateInput) {
    return prisma.interaction.update({ where: { id }, data })
  },
}
