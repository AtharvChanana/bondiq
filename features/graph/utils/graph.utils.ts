import type { GraphData, GraphNode, GraphLink } from "@/features/graph/types"
import { RELATIONSHIP_TYPE_META } from "@/shared/constants/relationship-types"
import type { PersonSummary } from "@/shared/types"

const CENTER_NODE_ID = "__YOU__"

export function personToNode(person: PersonSummary & { _count?: { interactions?: number } }): GraphNode {
  const relationship =
    RELATIONSHIP_TYPE_META[person.relationship as keyof typeof RELATIONSHIP_TYPE_META]
  return {
    ...person,
    val: Math.max(6, 8 + (person._count?.interactions ?? 0) * 1.5),
    color: relationship?.graphColor ?? "#6366f1",
  }
}

function createCenterNode(): GraphNode {
  return {
    id: CENTER_NODE_ID,
    name: "YOU",
    val: 18,
    color: "#000000",
    isCenter: true,
    healthScore: 100,
    relationship: "friend",
    avatar: null,
    location: null,
    tags: null,
    currentSituation: null,
    whatMattersToThem: null,
    lastContactedAt: null,
  }
}

function createLink(personNode: GraphNode): GraphLink {
  const health = personNode.healthScore
  const particles = health > 70 ? 3 : health > 40 ? 2 : 1

  return {
    source: CENTER_NODE_ID,
    target: personNode.id,
    particles,
    color: personNode.color,
  }
}

export function buildGraphData(people: Array<PersonSummary & { _count?: { interactions?: number } }>): GraphData {
  if (people.length === 0) return { nodes: [], links: [] }

  const centerNode = createCenterNode()
  const personNodes = people.map(personToNode)
  const nodes = [centerNode, ...personNodes]
  const links = personNodes.map(createLink)

  return { nodes, links }
}
