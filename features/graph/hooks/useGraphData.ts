"use client"

import { useEffect, useState } from "react"

import type { GraphData } from "@/features/graph/types"
import { buildGraphData } from "@/features/graph/utils/graph.utils"

export function useGraphData() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/people")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load graph")
        return res.json()
      })
      .then((people) => setData(buildGraphData(people)))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}
