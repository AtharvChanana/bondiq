import type { Prisma } from "@prisma/client"

import { prisma } from "@/server/lib/prisma"

export const MilestonesRepository = {
  findByPerson(userId: string, personId: string) {
    return prisma.milestone.findMany({
      where: { personId, person: { userId } },
      orderBy: [{ date: "asc" }, { createdAt: "desc" }],
    })
  },

  create(data: Prisma.MilestoneUncheckedCreateInput) {
    return prisma.milestone.create({ data })
  },

  update(id: string, userId: string, data: Prisma.MilestoneUpdateInput) {
    return prisma.milestone.update({
      where: { id, person: { userId } },
      data,
    })
  },

  delete(id: string, userId: string) {
    return prisma.milestone.delete({ where: { id, person: { userId } } })
  },
}
