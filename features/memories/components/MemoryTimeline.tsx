import { MemoryCard } from "@/features/memories/components/MemoryCard"
import type { Memory } from "@/features/memories/types"

export function MemoryTimeline({ memories }: { memories: Memory[] }) {
  const pinned = memories.filter((memory) => memory.importance === "high")
  const rest = memories.filter((memory) => memory.importance !== "high")

  return (
    <div className="space-y-3">
      {[...pinned, ...rest].map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  )
}
