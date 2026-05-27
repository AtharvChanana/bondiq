import type { Nudge } from "@/features/nudges/types"
import { Avatar } from "@/shared/components/Avatar"
import { Card, CardContent } from "@/shared/components/ui/card"

import { NudgeActions } from "./NudgeActions"

interface NudgeCardProps {
  nudge: Nudge
  onActed: () => void
  onDismiss: () => void
}

export function NudgeCard({ nudge, onActed, onDismiss }: NudgeCardProps) {
  return (
    <Card className="rounded-none">
      <CardContent className="space-y-3">
        <div className="flex gap-3">
          {nudge.person ? (
            <Avatar name={nudge.person.name} src={nudge.person.avatar} className="size-10" />
          ) : null}
          <div>
            <p className="font-medium">{nudge.person?.name ?? "Someone"}</p>
            <p className="text-sm text-muted-foreground">{nudge.reason}</p>
          </div>
        </div>
        {nudge.draftMessage ? (
          <p className="rounded-none bg-muted p-3 text-sm">{nudge.draftMessage}</p>
        ) : null}
        <NudgeActions message={nudge.draftMessage} onActed={onActed} onDismiss={onDismiss} />
      </CardContent>
    </Card>
  )
}
