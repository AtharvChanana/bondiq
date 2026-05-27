import type { PersonSummary } from "@/shared/types"

export interface GraphNode extends PersonSummary {
  val: number
  color: string
  isCenter?: boolean
}

export interface GraphLink {
  source: string
  target: string
  distance?: number
  strength?: number
  particles?: number
  particleSpeed?: number
  width?: number
  color?: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}
