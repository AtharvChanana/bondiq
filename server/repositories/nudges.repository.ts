import type { Prisma } from "@prisma/client"

import { prisma } from "@/server/lib/prisma"

export const NudgesRepository = {
  findPendingByUser(userId: string) {
    return prisma.nudge.findMany({
      where: { userId, status: "pending" },
      include: { person: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    })
  },

  findHistoryByUser(userId: string) {
    return prisma.nudge.findMany({
      where: { userId, status: { not: "pending" } },
      include: { person: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
  },

  updateForUser(id: string, userId: string, data: Prisma.NudgeUpdateInput) {
    return prisma.nudge.update({ where: { id, userId }, data })
  },

  create(data: Prisma.NudgeUncheckedCreateInput) {
    const nudgeKey =
      data.nudgeKey ?? `${data.personId}-${data.reason}-${new Date().toISOString().slice(0, 10)}`

    return prisma.nudge.upsert({
      where: {
        personId_nudgeKey: {
          personId: data.personId,
          nudgeKey,
        },
      },
      create: { ...data, nudgeKey },
      update: {},
    })
  },
}
