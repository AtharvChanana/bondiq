"use client"

import { useEffect, useMemo, useState } from "react"

import { PeopleClientService } from "@/features/people/services/people.service"
import type { CreatePersonInput, Person } from "@/features/people/types"

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([])
  const [query, setQuery] = useState("")
  const [relationship, setRelationship] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    try {
      setPeople(await PeopleClientService.getAll())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load people")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

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
    setPeople((current) => [...current, person])
  }

  return {
    people,
    filteredPeople,
    loading,
    error,
    query,
    relationship,
    setQuery,
    setRelationship,
    addPerson,
    refresh,
  }
}
