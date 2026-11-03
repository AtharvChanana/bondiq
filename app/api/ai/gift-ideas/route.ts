import { NextResponse } from "next/server"
import { getServerSession } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"
import { z } from "zod"

export const maxDuration = 30

async function generateText(prompt: string) {
  if (process.env.GROQ_API_KEY) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    })
    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Groq API error (${response.status}): ${errText}`)
    }
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

const Schema = z.object({ personId: z.string(), occasion: z.string().optional() })

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const person = await prisma.person.findFirst({
    where: { id: parsed.data.personId, userId: session.user.id },
    include: { memories: { take: 15, orderBy: { createdAt: "desc" } } },
  })
  if (!person) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const prompt = `Suggest 5 thoughtful, specific gift ideas for ${person.name}.

Context:
- Relationship: ${person.relationship}
- Current situation: ${person.currentSituation ?? "unknown"}
- What matters to them: ${person.whatMattersToThem ?? "unknown"}
- Key memories/interests: ${person.memories.map((m) => m.content).join("; ") || "none"}
- Occasion: ${parsed.data.occasion ?? "general / thinking of them"}

Return ONLY a JSON array of 5 objects, each with: { "emoji": string, "title": string, "reason": string }
The reason should reference something specific about them. No extra text outside the JSON.
Example: [{"emoji":"🎵","title":"Concert tickets","reason":"Since they mentioned loving live music recently"}]`

  let raw: string
  try {
    raw = await generateText(prompt)
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI error"
    console.error("[/api/ai/gift-ideas]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  let ideas: { emoji: string; title: string; reason: string }[] = []
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    ideas = JSON.parse(match ? match[0] : raw)
  } catch {
    ideas = [{ emoji: "🎁", title: "Thoughtful gift", reason: "Based on their interests and memories" }]
  }

  return NextResponse.json({ ideas })
}
