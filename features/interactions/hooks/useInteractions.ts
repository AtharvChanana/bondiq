"use client"

import { useQuery } from "@tanstack/react-query"
import { InteractionsClientService } from "@/features/interactions/services/interactions.service"
import type { CreateInteractionInput } from "@/features/interactions/types"

export function useInteractions() {
  const { data: people = [], isLoading: loading } = useQuery({
    queryKey: ["interaction-people"],
    queryFn: () => InteractionsClientService.getPeople(),
  })

  async function logInteraction(data: CreateInteractionInput) {
    return InteractionsClientService.create(data)
  }

  return { people, loading, logInteraction }
}

