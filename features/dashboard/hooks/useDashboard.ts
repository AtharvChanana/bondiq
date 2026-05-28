"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
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

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard")
  if (!res.ok) throw new Error("Failed to load dashboard")
  return res.json()
}

export function useDashboard() {
  const queryClient = useQueryClient()

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  })

  async function updateNudge(id: string, status: "seen" | "acted" | "dismissed") {
    const res = await fetch(`/api/nudges/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error("Failed to update nudge")
    // Optimistically remove the nudge from the cache
    queryClient.setQueryData<DashboardData>(["dashboard"], (current) =>
      current
        ? { ...current, nudges: current.nudges.filter((n) => n.id !== id) }
        : current
    )
  }

  return {
    data: data ?? null,
    loading,
    error: error ? (error instanceof Error ? error.message : "Failed to load") : null,
    updateNudge,
  }
}

