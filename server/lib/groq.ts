/**
 * Groq helper with automatic model detection.
 * Calls /models to find an available chat model so the app never breaks
 * due to deprecated or inaccessible model names in env vars.
 */

// In-memory cache per serverless instance (re-fetches on cold start — fine)
let _cachedModel: string | null = null

// Chat models we prefer, in priority order (all verified as free-tier text models)
const PREFERRED_MODELS = [
  // Llama 4
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  // Llama 3.3
  "llama-3.3-70b-versatile",
  "llama-3.3-70b-specdec",
  // Llama 3.1
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  // Llama 3.2
  "llama-3.2-90b-text-preview",
  "llama-3.2-11b-text-preview",
  "llama-3.2-3b-preview",
  "llama-3.2-1b-preview",
  // Other open models
  "qwen-qwq-32b",
  "deepseek-r1-distill-llama-70b",
  "deepseek-r1-distill-qwen-32b",
  "gemma2-9b-it",
  "gemma-7b-it",
  "mixtral-8x7b-32768",
  // Legacy (may be decommissioned but worth trying)
  "llama3-70b-8192",
  "llama3-8b-8192",
]

// Keywords that identify non-chat models (TTS, STT, vision, guard, etc.)
const NON_CHAT_KEYWORDS = [
  "whisper", "tts", "speech", "audio", "vision", "guard",
  "arabic", "distil-whisper", "playai", "orpheus",
]

function isChatModel(id: string): boolean {
  const lower = id.toLowerCase()
  return !NON_CHAT_KEYWORDS.some((kw) => lower.includes(kw))
}

export async function getGroqModel(): Promise<string> {
  if (_cachedModel) return _cachedModel

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured")

  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (res.ok) {
      const data = await res.json()
      const availableArr: string[] = (data.data as { id: string }[])
        .map((m) => m.id)
        .filter(isChatModel)
      const available = new Set<string>(availableArr)

      console.log(`[Groq] Available chat models: ${availableArr.join(", ")}`)

      // Use env var only if it's a valid chat model on this account
      const envModel = process.env.GROQ_MODEL
      if (envModel && available.has(envModel)) {
        _cachedModel = envModel
        console.log(`[Groq] Using GROQ_MODEL env var: ${envModel}`)
        return _cachedModel
      }

      // Pick from preferred list in order
      for (const model of PREFERRED_MODELS) {
        if (available.has(model)) {
          _cachedModel = model
          console.log(`[Groq] Auto-selected model: ${model}`)
          return _cachedModel
        }
      }

      // Last resort: first chat model from the API (filtered — no TTS/STT/etc.)
      const firstChat = availableArr[0]
      if (firstChat) {
        _cachedModel = firstChat
        console.log(`[Groq] Falling back to first available chat model: ${firstChat}`)
        return firstChat
      }
    }
  } catch (err) {
    console.error("[Groq] Failed to fetch models list:", err)
  }

  // Absolute fallback
  const fallback = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant"
  console.log(`[Groq] Using hardcoded fallback: ${fallback}`)
  return fallback
}

export async function groqGenerateText(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured")

  const model = await getGroqModel()

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Groq API error (${response.status}): ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}
