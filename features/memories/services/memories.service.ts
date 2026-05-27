import type { Memory } from "@/features/memories/types"

export const MemoriesClientService = {
  async getByPerson(personId: string): Promise<Memory[]> {
    const res = await fetch(`/api/memories?personId=${personId}`)
    if (!res.ok) throw new Error("Failed to fetch memories")
    return res.json()
  },
}
