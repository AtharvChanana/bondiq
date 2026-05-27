"use client"

import { useState } from "react"

import { AIClientService } from "@/features/ai/services/ai.service"
import type { DraftMessageResult, MessageOccasion } from "@/features/ai/types"

export function useMessageDraft(personId: string) {
  const [draft, setDraft] = useState<DraftMessageResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function generate(occasion: MessageOccasion, reason?: string) {
    setLoading(true)
    try {
      const result = await AIClientService.draftMessage(personId, occasion, reason)
      setDraft(result)
      return result
    } finally {
      setLoading(false)
    }
  }

  return { draft, setDraft, loading, generate }
}
