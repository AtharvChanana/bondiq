import type { MilestoneDTO } from "@/shared/types"

export interface CreateMilestoneInput {
  personId: string
  title: string
  date?: string | null
  isRecurring: boolean
}

export const MilestonesClientService = {
  async create(data: CreateMilestoneInput): Promise<MilestoneDTO> {
    const res = await fetch("/api/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to create milestone")
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/milestones/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete milestone")
  },
}
