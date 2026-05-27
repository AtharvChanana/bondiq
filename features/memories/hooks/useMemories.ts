"use client"

import { useEffect, useState } from "react"

import { MemoriesClientService } from "@/features/memories/services/memories.service"
import type { Memory } from "@/features/memories/types"

export function useMemories(personId: string) {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    MemoriesClientService.getByPerson(personId)
      .then(setMemories)
      .finally(() => setLoading(false))
  }, [personId])

  return { memories, loading }
}
