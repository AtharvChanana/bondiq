import type { GraphNode } from "@/features/graph/types"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"

export function GraphNodeTooltip({ node }: { node: GraphNode }) {
  return (
    <Card className="pointer-events-none absolute right-4 top-4 z-10 w-64 rounded-none bg-background/95">
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{node.name}</p>
          <Badge variant="outline">{node.relationship}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Health score: <span className="font-medium text-foreground">{node.healthScore}</span>
        </p>
        {node.currentSituation ? (
          <p className="text-sm text-muted-foreground">{node.currentSituation}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
