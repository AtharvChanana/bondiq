import { NextResponse } from "next/server"
import { getServerSession } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"
import { z } from "zod"

const ChatSchema = z.object({
  personId: z.string(),
  message: z.string().min(1),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional()
    .default([]),
})

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = ChatSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { personId, message, history } = parsed.data

  // Load deep context for this specific person
  const person = await prisma.person.findFirst({
    where: { id: personId, userId: session.user.id },
    include: {
      memories: { orderBy: { createdAt: "desc" }, take: 30 },
      milestones: { orderBy: { date: "asc" } },
      interactions: { orderBy: { createdAt: "desc" }, take: 10 },
      followUps: { where: { status: "open" }, orderBy: { createdAt: "desc" } },
      goals: true,
    },
  })

  if (!person) return NextResponse.json({ error: "Person not found" }, { status: 404 })

  const daysSince = person.lastContactedAt
    ? Math.floor((Date.now() - person.lastContactedAt.getTime()) / 86_400_000)
    : null

  const memoriesByCategory = person.memories.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = []
    acc[m.category].push(m.content)
    return acc
  }, {} as Record<string, string[]>)

  const memoriesText = Object.entries(memoriesByCategory)
    .map(([cat, items]) => `  [${cat}]: ${items.join("; ")}`)
    .join("\n")

  const systemPrompt = `You are BondIQ, a warm and deeply knowledgeable relationship assistant. You know everything about the user's relationship with ${person.name} and help them strengthen it.

PERSON PROFILE: ${person.name}
- Relationship type: ${person.relationship}
- How you met: ${person.howWeMet ?? "Not recorded"}
- Current situation: ${person.currentSituation ?? "Not recorded"}
- What matters to them: ${person.whatMattersToThem ?? "Not recorded"}
- Phone: ${person.phone ?? "Not recorded"}
- Relationship health: ${person.healthScore}%
- Last contact: ${daysSince !== null ? `${daysSince} days ago` : "Never"}

MEMORIES (${person.memories.length} total):
${memoriesText || "No memories yet"}

UPCOMING MILESTONES:
${person.milestones.map((m) => `- ${m.title}: ${m.date ? new Date(m.date).toLocaleDateString() : "No date"}`).join("\n") || "None"}

OPEN FOLLOW-UPS:
${person.followUps.map((f) => `- ${f.content}`).join("\n") || "None"}

RECENT INTERACTIONS:
${person.interactions.map((i) => `- ${new Date(i.createdAt).toLocaleDateString()}: ${i.summary ?? i.rawContent.slice(0, 100)}`).join("\n") || "None"}

CONTACT GOALS:
${person.goals.map((g) => `- ${g.title} (every ${g.frequencyDays} days)`).join("\n") || "None set"}

Guidelines:
- Be warm, specific, and reference ${person.name} by name
- Use memories and context to give personalised advice
- Help draft messages, suggest topics, recall details, give relationship advice
- Keep responses concise (under 150 words) unless detail is asked for
- If asked to draft a message, write it in full and make it warm and personal`

  const messages = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user" as const, content: message },
  ]

  // Groq streaming
  if (process.env.GROQ_API_KEY) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Groq error: ${err}` }, { status: 500 })
    }

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value)
            const lines = chunk.split("\n").filter((l) => l.startsWith("data: "))
            for (const line of lines) {
              const data = line.replace("data: ", "").trim()
              if (data === "[DONE]") continue
              try {
                const p = JSON.parse(data)
                const content = p.choices?.[0]?.delta?.content ?? ""
                if (content) {
                  controller.enqueue(encoder.encode(content))
                }
              } catch { /* ignore */ }
            }
          }
        } finally {
          reader.releaseLock()
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  }

  // Gemini fallback (non-streaming)
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash" })
    const fullPrompt = `${systemPrompt}\n\nConversation:\n${history.map((h) => `${h.role}: ${h.content}`).join("\n")}\nuser: ${message}\nassistant:`
    const result = await model.generateContent(fullPrompt)
    return NextResponse.json({ reply: result.response.text() })
  }

  return NextResponse.json({ error: "No AI provider configured" }, { status: 500 })
}
