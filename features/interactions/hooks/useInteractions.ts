"use client"

import { useEffect, useState } from "react"

import { InteractionsClientService } from "@/features/interactions/services/interactions.service"
import type {
  CreateInteractionInput,
  InteractionPerson,
} from "@/features/interactions/types"

export function useInteractions() {
  const [people, setPeople] = useState<InteractionPerson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    InteractionsClientService.getPeople()
      .then(setPeople)
      .finally(() => setLoading(false))
  }, [])

  async function logInteraction(data: CreateInteractionInput) {
    return InteractionsClientService.create(data)
  }

  return { people, loading, logInteraction }
}
