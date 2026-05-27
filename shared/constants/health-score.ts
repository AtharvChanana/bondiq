import type { RelationshipType } from "./relationship-types"

export const HEALTH_THRESHOLDS = {
  healthy: 70,
  atRisk: 40,
  nudge: 60,
  fading: 30,
} as const

export const DECAY_RATE_BY_RELATIONSHIP: Record<RelationshipType, number> = {
  romantic: 3,
  family: 2,
  friend: 1.5,
  mentor: 1,
  colleague: 0.5,
}

export function getHealthTone(score: number) {
  if (score > HEALTH_THRESHOLDS.healthy) return "healthy"
  if (score >= HEALTH_THRESHOLDS.atRisk) return "at-risk"
  return "fading"
}

export function getHealthColor(score: number) {
  if (score > HEALTH_THRESHOLDS.healthy) return "#22c55e"
  if (score >= HEALTH_THRESHOLDS.atRisk) return "#f59e0b"
  return "#ef4444"
}

export function daysBetween(from: Date, to = new Date()) {
  const diff = to.getTime() - from.getTime()
  return Math.max(0, Math.floor(diff / 86_400_000))
}

export function calculateHealthScore(input: {
  relationship: string
  healthScore: number
  lastContactedAt?: Date | string | null
  createdAt?: Date | string | null
}) {
  const relationship = input.relationship as RelationshipType
  const dailyDecay = DECAY_RATE_BY_RELATIONSHIP[relationship] ?? 1
  const anchor = input.lastContactedAt ?? input.createdAt
  if (!anchor) return Math.max(0, Math.min(100, input.healthScore))

  const daysWithoutContact = daysBetween(new Date(anchor))
  const decayed = Math.round(100 - daysWithoutContact * dailyDecay)
  return Math.max(0, Math.min(100, decayed))
}

export function recoverHealthScore(score: number) {
  return Math.min(100, score + 20)
}
