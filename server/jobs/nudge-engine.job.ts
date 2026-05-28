import { endOfWeek, startOfWeek } from "date-fns"

import { prisma } from "@/server/lib/prisma"
import { NudgesRepository } from "@/server/repositories/nudges.repository"
import { AIService } from "@/server/services/ai.service"
import { EmailService } from "@/server/services/email.service"
import { calculateHealthScore, daysBetween } from "@/shared/constants/health-score"

function isWithinNextDays(date: Date, days: number) {
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86_400_000)
  return diffDays >= 0 && diffDays <= days
}

async function draftNudgeMessage(userId: string, personId: string, reason: string) {
  try {
    const draft = await AIService.draftMessage(userId, personId, "checking_in", reason)
    return draft.message
  } catch {
    return null
  }
}

async function createNudge(userId: string, personId: string, reason: string, nudgeKey: string) {
  const draftMessage = await draftNudgeMessage(userId, personId, reason)
  return NudgesRepository.create({ userId, personId, reason, draftMessage, nudgeKey })
}

async function generateWeeklyDigest(userId: string) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

  const [interactions, people, milestones] = await Promise.all([
    prisma.interaction.findMany({
      where: { userId, createdAt: { gte: weekStart, lte: weekEnd } },
      include: { person: true },
    }),
    prisma.person.findMany({ where: { userId }, include: { interactions: true } }),
    prisma.milestone.findMany({
      where: {
        person: { userId },
        date: {
          gte: new Date(weekEnd.getTime() + 1),
          lte: new Date(weekEnd.getTime() + 7 * 86_400_000),
        },
      },
      include: { person: true },
    }),
  ])

  const invested = interactions.map((interaction) => ({
    person: interaction.person.name,
    type: interaction.type,
    date: interaction.createdAt.toISOString(),
  }))
  const fading = people
    .filter((person) => !person.lastContactedAt || daysBetween(person.lastContactedAt) >= 14)
    .map((person) => ({ id: person.id, name: person.name, days: daysBetween(person.lastContactedAt ?? person.createdAt) }))
  const upcoming = milestones.map((milestone) => ({
    person: milestone.person.name,
    title: milestone.title,
    date: milestone.date?.toISOString() ?? null,
  }))
  const mostActive = people
    .map((person) => ({ id: person.id, name: person.name, count: person.interactions.length }))
    .sort((a, b) => b.count - a.count)[0]
  const recommendationTarget =
    people.sort((a, b) => a.healthScore - b.healthScore)[0] ?? null

  return prisma.weeklyDigest.upsert({
    where: { userId_weekStart: { userId, weekStart } },
    create: {
      userId,
      weekStart,
      weekEnd,
      invested,
      fading,
      upcoming,
      mostActive: mostActive ?? undefined,
      recommendation: recommendationTarget?.name ?? "Add your first relationship",
      recommendationReason: recommendationTarget
        ? `${recommendationTarget.name} has the lowest current health score.`
        : "BondIQ gets useful once you add a few people and log interactions.",
    },
    update: {
      weekEnd,
      invested,
      fading,
      upcoming,
      mostActive: mostActive ?? undefined,
      recommendation: recommendationTarget?.name ?? "Add your first relationship",
      recommendationReason: recommendationTarget
        ? `${recommendationTarget.name} has the lowest current health score.`
        : "BondIQ gets useful once you add a few people and log interactions.",
    },
  })
}

export async function generateNudgesForUser(userId: string) {
  const people = await prisma.person.findMany({
    where: { userId },
    include: {
      milestones: true,
      followUps: { where: { status: "open" } },
    },
  })

  const created = []

  for (const person of people) {
    const healthScore = calculateHealthScore(person)
    await prisma.person.update({ where: { id: person.id }, data: { healthScore } })

    if (healthScore < 60) {
      created.push(
        await createNudge(
          userId,
          person.id,
          `${person.name}'s relationship health dropped below 60.`,
          `health-below-60-${person.id}`
        )
      )
    }

    if (healthScore < 30) {
      created.push(
        await createNudge(
          userId,
          person.id,
          `${person.name}'s relationship health is fading below 30.`,
          `health-below-30-${person.id}-${new Date().toISOString().slice(0, 10)}`
        )
      )
    }

    const daysSinceContact = person.lastContactedAt ? daysBetween(person.lastContactedAt) : null
    if (daysSinceContact && [30, 60, 90].includes(daysSinceContact)) {
      created.push(
        await createNudge(
          userId,
          person.id,
          `It has been exactly ${daysSinceContact} days since you last contacted ${person.name}.`,
          `days-${daysSinceContact}-${person.id}`
        )
      )
    }

    for (const milestone of person.milestones) {
      if (milestone.date && isWithinNextDays(milestone.date, 7)) {
        created.push(
          await createNudge(
            userId,
            person.id,
            `${milestone.title} is coming up for ${person.name}.`,
            `milestone-${milestone.id}-${new Date().getFullYear()}`
          )
        )
      }
    }

    for (const followUp of person.followUps) {
      if (daysBetween(followUp.createdAt) > 14) {
        created.push(
          await createNudge(
            userId,
            person.id,
            `Follow up with ${person.name}: ${followUp.content}`,
            `follow-up-${followUp.id}`
          )
        )
      }
    }
  }

  await generateWeeklyDigest(userId)

  // ── Send nudge digest email ──────────────────────────────────────
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } })
    if (user?.email && created.length > 0) {
      const nudgesForEmail = created
        .filter((n) => !!n)
        .map((n) => ({
          personName: (n as any).person?.name ?? "Someone",
          reason: (n as any).reason ?? "",
          draftMessage: (n as any).draftMessage,
        }))
      await EmailService.sendNudgeDigest(user.email, user.name ?? "", nudgesForEmail)
    }

    // Inactivity alert — if user hasn't been seen for 7+ days (proxy: no interactions in 7d)
    if (user?.email) {
      const recentInteraction = await prisma.interaction.findFirst({
        where: { userId, createdAt: { gte: new Date(Date.now() - 7 * 86_400_000) } },
      })
      if (!recentInteraction) {
        const fadingPeople = people
          .filter((p) => p.lastContactedAt && daysBetween(p.lastContactedAt) > 14)
          .slice(0, 3)
          .map((p) => ({ name: p.name, days: daysBetween(p.lastContactedAt ?? p.createdAt) }))
        await EmailService.sendInactivityAlert(user.email, user.name ?? "", fadingPeople)
      }
    }
  } catch (emailErr) {
    console.error("[nudge-engine] Email send failed:", emailErr)
  }
  // ────────────────────────────────────────────────────────────────

  return created
}

export async function generateNudgesForAllUsers() {
  const users = await prisma.user.findMany({ select: { id: true } })
  const results = []
  for (const user of users) {
    results.push(await generateNudgesForUser(user.id))
  }
  return results.flat()
}
