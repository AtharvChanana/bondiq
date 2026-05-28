"use client"

import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { PeopleClientService } from "@/features/people/services/people.service"
import type { CreatePersonInput, Person } from "@/features/people/types"

export function usePeople() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState("")
  const [relationship, setRelationship] = useState("all")

  const { data: people = [], isLoading: loading, error, refetch: refresh } = useQuery({
    queryKey: ["people"],
    queryFn: () => PeopleClientService.getAll(),
  })

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const q = query.toLowerCase()
      const matchesQuery =
        person.name.toLowerCase().includes(q) ||
        (person.location?.toLowerCase().includes(q) ?? false) ||
        (person.tags?.toLowerCase().includes(q) ?? false)
      const matchesRelationship = relationship === "all" || person.relationship === relationship
      return matchesQuery && matchesRelationship
    })
  }, [people, query, relationship])

  async function addPerson(data: CreatePersonInput) {
    const person = await PeopleClientService.create(data)
    // Update cache directly — no re-fetch needed
    queryClient.setQueryData<Person[]>(["people"], (current = []) => [...current, person])
  }

  return {
    people,
    filteredPeople,
    loading,
    error: error ? (error instanceof Error ? error.message : "Failed to load people") : null,
    query,
    relationship,
    setQuery,
    setRelationship,
    addPerson,
    refresh,
  }
}

