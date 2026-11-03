/**
 * Groq helper with automatic model detection.
 * Calls /models to find an available model so the app never breaks
 * due to deprecated or inaccessible model names in env vars.
 */

// In-memory cache per serverless instance (re-fetches on cold start — fine)
let _cachedModel: string | null = null
// Models we prefer, in priority order
const PREFERRED_MODELS = [
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "llama-3.3-70b-versatile",
  "llama-3.3-70b-specdec",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "llama-3.2-3b-preview",
  "gemma2-9b-it",
  "gemma-7b-it",
  "mixtral-8x7b-32768",
]

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
      const available = new Set<string>(
        (data.data as { id: string }[]).map((m) => m.id)
      )

      // Use env var if it's actually available on this account
      const envModel = process.env.GROQ_MODEL
      if (envModel && available.has(envModel)) {
        _cachedModel = envModel
        return _cachedModel
      }

      // Otherwise pick from preferred list
      for (const model of PREFERRED_MODELS) {
        if (available.has(model)) {
          _cachedModel = model
          console.log(`[Groq] Auto-selected model: ${model}`)
          return _cachedModel
        }
      }

      // Last resort: first model Groq returns
      const first: string | undefined = data.data[0]?.id
      if (first) {
        _cachedModel = first
        console.log(`[Groq] Falling back to first available model: ${first}`)
        return first
      }
    }
  } catch (err) {
    console.error("[Groq] Failed to fetch models list:", err)
  }

  // Absolute fallback — will produce a clear error if wrong
  return process.env.GROQ_MODEL ?? "llama-3.1-8b-instant"
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

