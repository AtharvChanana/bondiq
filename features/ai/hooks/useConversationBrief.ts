"use client"

import { useState } from "react"

import { AIClientService } from "@/features/ai/services/ai.service"

export function useConversationBrief(personId: string) {
  const [brief, setBrief] = useState("")
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const result = await AIClientService.brief(personId)
      setBrief(result)
      return result
    } finally {
      setLoading(false)
    }
  }

  return { brief, loading, generate }
}
