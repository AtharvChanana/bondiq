import { prisma } from "@/server/lib/prisma"
import { InteractionsRepository } from "@/server/repositories/interactions.repository"
import type { CreateInteractionInput } from "@/server/validators/interactions.validator"
import { AIService } from "@/server/services/ai.service"
import { recoverHealthScore } from "@/shared/constants/health-score"

async function applyExtraction(input: {
  interactionId: string
  personId: string
  rawContent: string
}) {
  const extracted = await AIService.extract(input.rawContent)
  const operations = [
    prisma.memory.deleteMany({ where: { interactionId: input.interactionId } }),
    prisma.followUp.deleteMany({ where: { interactionId: input.interactionId } }),
    prisma.interaction.update({
      where: { id: input.interactionId },
      data: {
        summary: extracted.summary,
        sentiment: extracted.sentiment,
        extractionStatus: "completed",
        extractionError: null,
      },
    }),
  ]

  if (extracted.memories.length) {
    operations.push(
      prisma.memory.createMany({
      data: extracted.memories.map((memory) => ({
        personId: input.personId,
        interactionId: input.interactionId,
        category: memory.category,
        content: memory.content,
        importance: memory.importance,
      })),
      })
    )
  }

  if (extracted.milestones.length) {
    operations.push(
      prisma.milestone.createMany({
      data: extracted.milestones.map((milestone) => ({
        personId: input.personId,
        title: milestone.title,
        date: milestone.date ? new Date(milestone.date) : null,
        isRecurring: milestone.isRecurring,
      })),
      })
    )
  }

  if (extracted.followUps.length) {
    operations.push(
      prisma.followUp.createMany({
      data: extracted.followUps.map((content) => ({
        personId: input.personId,
        interactionId: input.interactionId,
        content,
      })),
      })
    )
  }

  await prisma.$transaction(operations)
}

export const InteractionsService = {
  findByPerson(userId: string, personId: string) {
    return InteractionsRepository.findByPerson(userId, personId)
  },

  async create(userId: string, data: CreateInteractionInput) {
    const person = await prisma.person.findFirst({
      where: { id: data.personId, userId },
    })
    if (!person) throw new Error("Person not found")

    const interaction = await InteractionsRepository.create({
      userId,
      personId: data.personId,
      type: data.type,
      rawContent: data.rawContent,
      extractionStatus: "pending",
    })

    try {
      const now = new Date()

      await prisma.$transaction([
        prisma.person.update({
          where: { id: data.personId },
          data: {
            lastContactedAt: now,
            healthScore: recoverHealthScore(person.healthScore),
          },
        }),
      ])

      await applyExtraction({
        interactionId: interaction.id,
        personId: data.personId,
        rawContent: data.rawContent,
      })

      return prisma.interaction.findUnique({ where: { id: interaction.id } })
    } catch (error) {
      await InteractionsRepository.update(interaction.id, {
        extractionStatus: "failed",
        extractionError: error instanceof Error ? error.message : "AI extraction failed",
      })

      await prisma.person.update({
        where: { id: data.personId },
        data: {
          lastContactedAt: new Date(),
          healthScore: recoverHealthScore(person.healthScore),
        },
      })

      return prisma.interaction.findUnique({ where: { id: interaction.id } })
    }
  },

  async retryFailedForPerson(userId: string, personId: string) {
    const person = await prisma.person.findFirst({ where: { id: personId, userId } })
    if (!person) throw new Error("Person not found")

    const failed = await InteractionsRepository.findFailedForPerson(userId, personId)
    const results = []

    for (const interaction of failed) {
      try {
        await InteractionsRepository.update(interaction.id, { extractionStatus: "pending" })
        await applyExtraction({
          interactionId: interaction.id,
          personId: interaction.personId,
          rawContent: interaction.rawContent,
        })
        results.push({ id: interaction.id, status: "completed" })
      } catch (error) {
        await InteractionsRepository.update(interaction.id, {
          extractionStatus: "failed",
          extractionError: error instanceof Error ? error.message : "AI extraction failed",
        })
        results.push({ id: interaction.id, status: "failed" })
      }
    }

    return results
  },

  async retryOne(userId: string, interactionId: string) {
    const interaction = await InteractionsRepository.findByIdForUser(userId, interactionId)
    if (!interaction) throw new Error("Interaction not found")
    if (interaction.extractionStatus === "completed") return interaction

    await InteractionsRepository.update(interaction.id, { extractionStatus: "pending" })
    await applyExtraction({
      interactionId: interaction.id,
      personId: interaction.personId,
      rawContent: interaction.rawContent,
    })
    return prisma.interaction.findUnique({ where: { id: interaction.id } })
  },
}
