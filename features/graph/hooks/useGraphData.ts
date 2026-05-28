"use client"

import { useQuery } from "@tanstack/react-query"
import type { GraphData } from "@/features/graph/types"
import { buildGraphData } from "@/features/graph/utils/graph.utils"

async function fetchGraphData(): Promise<GraphData> {
  const res = await fetch("/api/people")
  if (!res.ok) throw new Error("Failed to load graph")
  const people = await res.json()
  return buildGraphData(people)
}

export function useGraphData() {
  const { data, isLoading: loading } = useQuery({
    queryKey: ["graph"],
    queryFn: fetchGraphData,
  })

  return { data: data ?? { nodes: [], links: [] }, loading }
}

