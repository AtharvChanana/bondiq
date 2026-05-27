import type {
  CreateInteractionInput,
  Interaction,
  InteractionPerson,
} from "@/features/interactions/types"

export const InteractionsClientService = {
  async getPeople(): Promise<InteractionPerson[]> {
    const res = await fetch("/api/people")
    if (!res.ok) throw new Error("Failed to fetch people")
    return res.json()
  },

  async create(data: CreateInteractionInput): Promise<Interaction> {
    const res = await fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to log interaction")
    return res.json()
  },
}
