import { addDays, startOfDay } from "date-fns"

import { generateNudgesForUser } from "@/server/jobs/nudge-engine.job"
import { prisma } from "@/server/lib/prisma"

export const DashboardService = {
  async get(userId: string) {
    await generateNudgesForUser(userId)

    const now = startOfDay(new Date())
    const weekAhead = addDays(now, 7)
    const [people, nudges, milestones, weeklyDigest] = await Promise.all([
      prisma.person.findMany({ where: { userId }, orderBy: { healthScore: "asc" } }),
      prisma.nudge.findMany({
        where: { userId, status: "pending" },
        include: { person: { include: { interactions: { orderBy: { createdAt: "desc" }, take: 1 } } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.milestone.findMany({
        where: { person: { userId }, date: { gte: now, lte: weekAhead } },
        include: { person: true },
        orderBy: { date: "asc" },
      }),
      prisma.weeklyDigest.findFirst({
        where: { userId },
        orderBy: { weekStart: "desc" },
      }),
    ])

    return {
      people,
      nudges,
      milestones,
      weeklyDigest,
      healthOverview: {
        healthy: people.filter((person) => person.healthScore > 70).length,
        atRisk: people.filter((person) => person.healthScore <= 70 && person.healthScore >= 40).length,
        fading: people.filter((person) => person.healthScore < 40).length,
      },
    }
  },
}
