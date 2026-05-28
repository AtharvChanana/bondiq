"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { NudgesClientService } from "@/features/nudges/services/nudges.service"
import type { Nudge } from "@/features/nudges/types"

export function useNudges() {
  const queryClient = useQueryClient()

  const { data: nudges = [], isLoading: loading } = useQuery({
    queryKey: ["nudges"],
    queryFn: () => NudgesClientService.getPending(),
  })

  async function update(id: string, status: "seen" | "acted" | "dismissed") {
    await NudgesClientService.update(id, status)
    queryClient.setQueryData<Nudge[]>(["nudges"], (current = []) =>
      current.filter((nudge) => nudge.id !== id)
    )
  }

  return { nudges, loading, update }
}

