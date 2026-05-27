"use client"

import { useEffect, useState } from "react"

import { NudgesClientService } from "@/features/nudges/services/nudges.service"
import type { Nudge } from "@/features/nudges/types"

export function useNudges() {
  const [nudges, setNudges] = useState<Nudge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    NudgesClientService.getPending()
      .then(setNudges)
      .finally(() => setLoading(false))
  }, [])

  async function update(id: string, status: "seen" | "acted" | "dismissed") {
    await NudgesClientService.update(id, status)
    setNudges((current) => current.filter((nudge) => nudge.id !== id))
  }

  return { nudges, loading, update }
}
