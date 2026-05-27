import { NextResponse } from "next/server"
import { getServerSession } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"

async function generateText(prompt: string) {
  if (process.env.GROQ_API_KEY) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    })
    const data = await response.json()
    return data.choices[0].message.content.trim()
  }
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  }
  throw new Error("No AI provider configured")
}

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 86_400_000)
  const nextWeek = new Date(now.getTime() + 7 * 86_400_000)

  const [people, interactions, milestones] = await Promise.all([
    prisma.person.findMany({
      where: { userId: session.user.id },
      orderBy: { lastContactedAt: "desc" },
    }),
    prisma.interaction.findMany({
      where: { userId: session.user.id, createdAt: { gte: weekAgo } },
      include: { person: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.milestone.findMany({
      where: { person: { userId: session.user.id }, date: { gte: now, lte: nextWeek } },
      include: { person: true },
      orderBy: { date: "asc" },
    }),
  ])

  const reconnected = Array.from(new Set(interactions.map((i) => i.person.name)))
  const atRisk = people.filter((p) => p.healthScore < 50).slice(0, 5)
  const neverContacted = people.filter((p) => !p.lastContactedAt).length

  const prompt = `You are BondIQ, a personal relationship intelligence assistant. Generate a warm, encouraging weekly relationship report in 3-4 sentences. Be specific and personal.

This week's data:
- Reconnected with: ${reconnected.join(", ") || "nobody"}
- Interactions logged: ${interactions.length}
- Upcoming milestones (next 7 days): ${milestones.map((m) => `${m.title} (${m.person.name})`).join(", ") || "none"}
- At-risk relationships (health < 50%): ${atRisk.map((p) => p.name).join(", ") || "none"}
- People never contacted: ${neverContacted}
- Total connections: ${people.length}

Write an encouraging 3-4 sentence narrative report. Mention specific names. End with one gentle, actionable suggestion.`

  let narrative = ""
  try {
    narrative = await generateText(prompt)
  } catch {
    narrative = `You have ${people.length} connections in BondIQ. ${reconnected.length > 0 ? `This week you connected with ${reconnected.join(", ")}.` : "No interactions logged this week."} ${atRisk.length > 0 ? `Consider reaching out to ${atRisk[0].name} soon.` : "Keep up the great work nurturing your relationships!"}`
  }

  return NextResponse.json({
    narrative,
    stats: {
      reconnected: reconnected.length,
      interactionsLogged: interactions.length,
      upcomingMilestones: milestones.length,
      atRiskCount: atRisk.length,
      totalPeople: people.length,
    },
    reconnected,
    upcomingMilestones: milestones.map((m) => ({
      title: m.title,
      personName: m.person.name,
      date: m.date,
    })),
    atRisk: atRisk.map((p) => ({
      id: p.id,
      name: p.name,
      healthScore: p.healthScore,
      lastContactedAt: p.lastContactedAt,
    })),
  })
}
