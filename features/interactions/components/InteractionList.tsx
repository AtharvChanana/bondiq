import type { Interaction } from "@/features/interactions/types"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { formatDate } from "@/shared/utils/date.utils"

import { SentimentBadge } from "./SentimentBadge"

export function InteractionList({ interactions }: { interactions: Interaction[] }) {
  return (
    <div className="space-y-3">
      {interactions.map((interaction) => (
        <Card key={interaction.id} className="rounded-none">
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{interaction.type}</Badge>
              <SentimentBadge sentiment={interaction.sentiment} />
              <span className="text-xs text-muted-foreground">
                {formatDate(interaction.createdAt)}
              </span>
            </div>
            {interaction.summary ? <p className="font-medium">{interaction.summary}</p> : null}
            <p className="text-sm text-muted-foreground">{interaction.rawContent}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
