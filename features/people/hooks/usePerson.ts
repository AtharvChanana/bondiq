"use client"

import { useEffect, useState } from "react"

import { PeopleClientService } from "@/features/people/services/people.service"
import type { PersonDetail, UpdatePersonInput } from "@/features/people/types"

export function usePerson(personId: string) {
  const [person, setPerson] = useState<PersonDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRetryAttempted, setAutoRetryAttempted] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      setPerson(await PeopleClientService.getById(personId))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load person")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [personId])

  useEffect(() => {
    const hasFailedExtraction = person?.interactions.some(
      (interaction) => interaction.extractionStatus === "failed"
    )
    if (!person || !hasFailedExtraction || autoRetryAttempted) return

    setAutoRetryAttempted(true)
    fetch("/api/interactions/retry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId }),
    })
      .then((res) => {
        if (res.ok) return refresh()
      })
      .catch(() => {
        // The profile still renders with a manual retry option when AI is unavailable.
      })
  }, [autoRetryAttempted, person, personId])

  async function update(data: UpdatePersonInput) {
    await PeopleClientService.update(personId, data)
    await refresh()
  }

  async function remove() {
    await PeopleClientService.delete(personId)
  }

  return { person, loading, error, refresh, update, remove }
}
