import { NextResponse } from "next/server"
import { startOfWeek, endOfWeek, format } from "date-fns"

import { prisma } from "@/server/lib/prisma"
import { EmailService } from "@/server/services/email.service"
import { daysBetween } from "@/shared/constants/health-score"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  })

  let sent = 0

  for (const user of users) {
    if (!user.email) continue

    try {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

      const [interactions, people, milestones] = await Promise.all([
        prisma.interaction.findMany({
          where: { userId: user.id, createdAt: { gte: weekStart, lte: weekEnd } },
          include: { person: true },
        }),
        prisma.person.findMany({
          where: { userId: user.id },
          include: { interactions: true },
          orderBy: { healthScore: "asc" },
        }),
        prisma.milestone.findMany({
          where: {
            person: { userId: user.id },
            date: {
              gte: new Date(),
              lte: new Date(Date.now() + 7 * 86_400_000),
            },
          },
          include: { person: true },
        }),
      ])

      const weekLabel = `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`

      const invested = interactions.map((i) => ({
        person: i.person.name,
        type: i.type,
      }))

      const fading = people
        .filter((p) => !p.lastContactedAt || daysBetween(p.lastContactedAt) >= 14)
        .map((p) => ({
          name: p.name,
          days: daysBetween(p.lastContactedAt ?? p.createdAt),
        }))

      const upcoming = milestones.map((m) => ({
        person: m.person.name,
        title: m.title,
        date: m.date?.toISOString() ?? null,
      }))

      const lowestHealthPerson = people[0]
      const recommendation = lowestHealthPerson?.name ?? "Add your first connection"
      const recommendationReason = lowestHealthPerson
        ? `${lowestHealthPerson.name} has the lowest relationship health score right now. A quick check-in would go a long way.`
        : "BondIQ gets more useful once you add a few people and log some interactions."

      await EmailService.sendWeeklyReport(user.email, user.name ?? "", {
        weekLabel,
        invested,
        fading,
        upcoming,
        recommendation,
        recommendationReason,
      })

      sent++
    } catch (err) {
      console.error(`[weekly-email] Failed for user ${user.id}:`, err)
    }
  }

  return NextResponse.json({ sent })
}
