import { Badge } from "@/shared/components/ui/badge"
import { MEMORY_CATEGORY_META } from "@/shared/constants/memory-categories"

export function MemoryCategoryBadge({ category }: { category: string }) {
  const meta = MEMORY_CATEGORY_META[category as keyof typeof MEMORY_CATEGORY_META]
  if (!meta) return <Badge variant="outline">{category}</Badge>
  return <Badge className={meta.className}>{meta.label}</Badge>
}
