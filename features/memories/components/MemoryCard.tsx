import { MemoryCategoryBadge } from "@/features/memories/components/MemoryCategoryBadge"
import type { Memory } from "@/features/memories/types"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { formatDate } from "@/shared/utils/date.utils"

export function MemoryCard({ memory }: { memory: Memory }) {
  return (
    <Card className="rounded-none">
      <CardContent>
        <div className="mb-2 flex flex-wrap gap-2">
          <MemoryCategoryBadge category={memory.category} />
          <Badge variant="outline">{memory.importance}</Badge>
          <span className="text-xs text-muted-foreground">{formatDate(memory.createdAt)}</span>
        </div>
        <p>{memory.content}</p>
      </CardContent>
    </Card>
  )
}
