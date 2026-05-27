"use client"

import { Bell } from "lucide-react"

import { NudgeCard } from "@/features/nudges/components/NudgeCard"
import { useNudges } from "@/features/nudges/hooks/useNudges"
import { EmptyState } from "@/shared/components/EmptyState"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"

export function NudgeFeed() {
  const { nudges, loading, update } = useNudges()

  if (loading) return <LoadingSpinner />
  if (!nudges.length) {
    return (
      <EmptyState
        icon={Bell}
        title="No nudges today"
        description="Everyone is in a decent place for now. A quiet dashboard is sometimes good news."
      />
    )
  }

  return (
    <div className="space-y-3">
      {nudges.map((nudge) => (
        <NudgeCard
          key={nudge.id}
          nudge={nudge}
          onActed={() => update(nudge.id, "acted")}
          onDismiss={() => update(nudge.id, "dismissed")}
        />
      ))}
    </div>
  )
}
