import { NextResponse } from "next/server"
import { getServerSession } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"
import { z } from "zod"

const ChatSchema = z.object({
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

  const { message, history } = parsed.data

  // Build relationship context
  const people = await prisma.person.findMany({
    where: { userId: session.user.id },
    include: {
      memories: { take: 5, orderBy: { createdAt: "desc" } },
      milestones: { take: 3, orderBy: { date: "asc" } },
    },
    orderBy: { lastContactedAt: "desc" },
    take: 20,
  })

  const contextLines = people.map((p) => {
    const daysSince = p.lastContactedAt
      ? Math.floor((Date.now() - p.lastContactedAt.getTime()) / 86_400_000)
      : null
    const memories = p.memories.map((m) => m.content).join("; ")
    const milestones = p.milestones.map((m) => m.title).join(", ")
    return `- ${p.name} (${p.relationship}): health ${p.healthScore}%, last contact ${daysSince !== null ? `${daysSince}d ago` : "never"}${memories ? `, memories: ${memories}` : ""}${milestones ? `, milestones: ${milestones}` : ""}`
  })

  const systemPrompt = `You are BondIQ, a warm and insightful personal relationship intelligence assistant. You help the user nurture and strengthen their personal relationships.

User's connections:
${contextLines.join("\n") || "No connections added yet."}

Guidelines:
- Be warm, concise, and actionable
- Reference specific people and details when relevant
- Suggest concrete next steps (e.g. "You could reach out to X about Y")
- Keep responses focused and under 150 words unless asked for detail
- Use emojis sparingly for warmth`

  // Save user message
  await prisma.chatMessage.create({
    data: { userId: session.user.id, role: "user", content: message },
  })

  const messages = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user" as const, content: message },
  ]

  // Use Groq with streaming
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

    // Stream response back
    const encoder = new TextEncoder()
    let fullContent = ""

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
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content ?? ""
                if (content) {
                  fullContent += content
                  controller.enqueue(encoder.encode(content))
                }
              } catch { /* ignore parse errors */ }
            }
          }
        } finally {
          reader.releaseLock()
          // Save assistant response
          if (fullContent) {
            await prisma.chatMessage.create({
              data: { userId: session.user.id, role: "assistant", content: fullContent },
            }).catch(() => {/* ignore save errors */})
          }
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    })
  }

  // Fallback: Gemini (non-streaming)
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash" })
    const fullPrompt = `${systemPrompt}\n\nConversation:\n${history.map((h) => `${h.role}: ${h.content}`).join("\n")}\nuser: ${message}\nassistant:`
    const result = await model.generateContent(fullPrompt)
    const text = result.response.text()

    await prisma.chatMessage.create({
      data: { userId: session.user.id, role: "assistant", content: text },
    })

    return NextResponse.json({ reply: text })
  }

  return NextResponse.json({ error: "No AI provider configured" }, { status: 500 })
}

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const messages = await prisma.chatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: 50,
  })
  return NextResponse.json(messages)
}

export async function DELETE() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await prisma.chatMessage.deleteMany({
    where: { userId: session.user.id },
  })
  return NextResponse.json({ success: true })
}

