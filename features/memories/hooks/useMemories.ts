"use client"

import { useQuery } from "@tanstack/react-query"
import { MemoriesClientService } from "@/features/memories/services/memories.service"

export function useMemories(personId: string) {
  const { data: memories = [], isLoading: loading } = useQuery({
    queryKey: ["memories", personId],
    queryFn: () => MemoriesClientService.getByPerson(personId),
    enabled: !!personId,
  })

  return { memories, loading }
}

