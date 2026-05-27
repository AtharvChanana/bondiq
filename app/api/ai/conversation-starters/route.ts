import { NextResponse } from "next/server"
import { getServerSession } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"
import { z } from "zod"

async function generateText(prompt: string) {
  if (process.env.GROQ_API_KEY) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
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

const Schema = z.object({ personId: z.string() })

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const person = await prisma.person.findFirst({
    where: { id: parsed.data.personId, userId: session.user.id },
    include: {
      memories: { take: 10, orderBy: { createdAt: "desc" } },
      milestones: { take: 5, orderBy: { date: "asc" } },
    },
  })
  if (!person) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const daysSince = person.lastContactedAt
    ? Math.floor((Date.now() - person.lastContactedAt.getTime()) / 86_400_000)
    : null

  const prompt = `Generate 5 natural, personalized conversation starters for reconnecting with ${person.name}.

Context:
- Relationship: ${person.relationship}
- Last spoke: ${daysSince !== null ? `${daysSince} days ago` : "never"}
- Current situation: ${person.currentSituation ?? "unknown"}
- What matters to them: ${person.whatMattersToThem ?? "unknown"}
- How you met: ${person.howWeMet ?? "unknown"}
- Recent memories: ${person.memories.map((m) => m.content).join("; ") || "none"}
- Upcoming milestones: ${person.milestones.map((m) => m.title).join(", ") || "none"}

Return ONLY a JSON array of 5 strings. Each should be a specific, natural question or opening line. No numbering, no extra text.
Example format: ["Question 1?", "Question 2?", "Statement 3.", "Question 4?", "Question 5?"]`

  const raw = await generateText(prompt)
  let starters: string[] = []
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    starters = JSON.parse(match ? match[0] : raw)
  } catch {
    starters = raw.split("\n").filter((l: string) => l.trim()).slice(0, 5)
  }

  return NextResponse.json({ starters })
}
