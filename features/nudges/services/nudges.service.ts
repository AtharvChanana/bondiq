import type { Nudge } from "@/features/nudges/types"

export const NudgesClientService = {
  async getPending(): Promise<Nudge[]> {
    const res = await fetch("/api/nudges")
    if (!res.ok) throw new Error("Failed to fetch nudges")
    return res.json()
  },

  async update(id: string, status: "seen" | "acted" | "dismissed") {
    const res = await fetch(`/api/nudges/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error("Failed to update nudge")
    return res.json()
  },
}
