"use client"

import { useEffect, useState } from "react"

import type { MilestoneDTO, NudgeDTO, PersonSummary } from "@/shared/types"

interface DashboardData {
  people: PersonSummary[]
  nudges: NudgeDTO[]
  milestones: Array<MilestoneDTO & { person: PersonSummary }>
  weeklyDigest: {
    invested: unknown
    fading: unknown
    upcoming: unknown
    recommendation: string
    recommendationReason: string
  } | null
  healthOverview: { healthy: number; atRisk: number; fading: number }
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard")
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard"))
      .finally(() => setLoading(false))
  }, [])

  async function updateNudge(id: string, status: "seen" | "acted" | "dismissed") {
    const res = await fetch(`/api/nudges/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error("Failed to update nudge")
    setData((current) =>
      current
        ? {
            ...current,
            nudges: current.nudges.filter((nudge) => nudge.id !== id),
          }
        : current
    )
  }

  return { data, loading, error, updateNudge }
}
