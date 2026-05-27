import { GoogleGenerativeAI } from "@google/generative-ai"

export const EXTRACTION_SYSTEM_PROMPT = `You are a relationship memory extraction system. Given a raw interaction log between a user and a person in their life, extract structured memories.

Return ONLY a valid JSON object with this exact structure:
{
  "summary": "2-3 sentence summary of the interaction",
  "sentiment": "positive | neutral | negative | mixed",
  "memories": [
    {
      "category": "life_event | emotion | preference | goal | follow_up | milestone",
      "content": "A single clear memory in plain English, written as a fact about the person",
      "importance": "high | medium | low"
    }
  ],
  "milestones": [
    {
      "title": "Name of the event",
      "date": "ISO date string if mentioned, null if not",
      "isRecurring": true | false
    }
  ],
  "followUps": ["specific thing to follow up on", "another follow up item"]
}

Rules:
- Each memory should be about the PERSON, not the interaction itself
- Write memories as facts: "Wants to try working at a startup", "Girlfriend got into IIM", "Feeling uncertain about career direction"
- Extract every meaningful detail, even small ones
- If no milestones mentioned, return empty array
- Return ONLY the JSON, no explanation, no markdown`

export function getGeminiModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
  })
}

export function stripJsonFences(value: string) {
  return value
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim()
}
