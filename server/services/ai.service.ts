import { z } from "zod"

import {
  EXTRACTION_SYSTEM_PROMPT,
  getGeminiModel,
  stripJsonFences,
} from "@/server/lib/gemini"
import { prisma } from "@/server/lib/prisma"
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp.utils"

const ExtractedMemorySchema = z.object({
  category: z.enum([
    "life_event",
    "emotion",
    "preference",
    "goal",
    "follow_up",
    "milestone",
  ]),
  content: z.string(),
  importance: z.enum(["high", "medium", "low"]),
})

const ExtractedPayloadSchema = z.object({
  summary: z.string(),
  sentiment: z.enum(["positive", "neutral", "negative", "mixed"]),
  memories: z.array(ExtractedMemorySchema).default([]),
  milestones: z
    .array(
      z.object({
        title: z.string(),
        date: z.string().nullable(),
        isRecurring: z.boolean(),
      })
    )
    .default([]),
  followUps: z.array(z.string()).default([]),
})

export type ExtractedInteraction = z.infer<typeof ExtractedPayloadSchema>

async function generateText(prompt: string) {
  if (process.env.GROQ_API_KEY) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Groq API error: ${response.statusText} - ${errText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  }

  if (process.env.GEMINI_API_KEY) {
    const model = getGeminiModel()
    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  }

  throw new Error("Neither GEMINI_API_KEY nor GROQ_API_KEY is configured. Please add one to your .env file.")
}

export const AIService = {
  async extract(rawContent: string): Promise<ExtractedInteraction> {
    const response = await generateText(`${EXTRACTION_SYSTEM_PROMPT}

Interaction log:
${rawContent}`)

    const json = JSON.parse(stripJsonFences(response))
    return ExtractedPayloadSchema.parse(json)
  },

  async draftMessage(
    userId: string,
    personId: string,
    occasion = "checking_in",
    reason?: string
  ) {
    const person = await prisma.person.findFirst({
      where: { id: personId, userId },
      include: {
        memories: { orderBy: { createdAt: "desc" }, take: 20 },
        milestones: { orderBy: { date: "asc" }, take: 5 },
      },
    })

    if (!person) throw new Error("Person not found")

    const recentMemories = person.memories
      .slice(0, 8)
      .map((memory) => `- ${memory.content}`)
      .join("\n")

    const prompt = `Given what you know about ${person.name}:
Recent memories:
${recentMemories || "- No memories yet"}
Current situation: ${person.currentSituation ?? "Unknown"}
What matters to them: ${person.whatMattersToThem ?? "Unknown"}
Occasion: ${occasion}
Reason for reaching out: ${reason ?? "checking in"}

Draft a short, warm, natural message the user could send to this person over WhatsApp.
It should feel personal and reference something real from their life.
Do not start with "Hey" or "Hi ${person.name}". Be creative.
Return only the message text, nothing else.`

    const message = await generateText(prompt)
    return {
      message,
      whatsappUrl: buildWhatsAppUrl(message, person.phone),
    }
  },

  async brief(userId: string, personId: string) {
    const person = await prisma.person.findFirst({
      where: { id: personId, userId },
      include: {
        memories: { orderBy: { createdAt: "desc" }, take: 20 },
        interactions: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    })

    if (!person) throw new Error("Person not found")

    const memories = person.memories.map((memory) => `- ${memory.content}`).join("\n")
    const lastSpoke = person.lastContactedAt
      ? `${Math.floor((Date.now() - person.lastContactedAt.getTime()) / 86_400_000)} days ago`
      : "Never"

    return generateText(`Generate a pre-conversation brief for ${person.name}.
Last spoke: ${lastSpoke}
Relationship: ${person.relationship}
Current situation: ${person.currentSituation ?? "Unknown"}
What matters to them: ${person.whatMattersToThem ?? "Unknown"}
Key memories:
${memories || "- No memories yet"}

Return a concise brief with these exact sections:
Last spoke:
Key things to know:
Good topics to bring up:
Things to avoid:
Suggested questions to ask:`)
  },
}
