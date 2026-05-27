import type { DraftMessageResult, MessageOccasion } from "@/features/ai/types"

export const AIClientService = {
  async draftMessage(
    personId: string,
    occasion: MessageOccasion,
    reason?: string
  ): Promise<DraftMessageResult> {
    const res = await fetch("/api/ai/draft-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId, occasion, reason }),
    })
    if (!res.ok) throw new Error("Failed to draft message")
    return res.json()
  },

  async brief(personId: string): Promise<string> {
    const res = await fetch("/api/ai/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId }),
    })
    if (!res.ok) throw new Error("Failed to generate brief")
    const data = (await res.json()) as { brief: string }
    return data.brief
  },
}
