import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/utils/cn"

const sentimentClassName: Record<string, string> = {
  positive: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  neutral: "bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200",
  negative: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  mixed: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
}

export function SentimentBadge({ sentiment }: { sentiment?: string | null }) {
  if (!sentiment) return null
  return <Badge className={cn(sentimentClassName[sentiment])}>{sentiment}</Badge>
}
