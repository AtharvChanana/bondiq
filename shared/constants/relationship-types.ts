export const RELATIONSHIP_TYPES = [
  "friend",
  "family",
  "mentor",
  "colleague",
  "romantic",
] as const

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number]

export const RELATIONSHIP_TYPE_META: Record<
  RelationshipType,
  { label: string; className: string; graphColor: string }
> = {
  friend: {
    label: "Friend",
    className: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
    graphColor: "#3b82f6",
  },
  family: {
    label: "Family",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    graphColor: "#10b981",
  },
  mentor: {
    label: "Mentor",
    className:
      "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
    graphColor: "#8b5cf6",
  },
  colleague: {
    label: "Colleague",
    className:
      "bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200",
    graphColor: "#78716c",
  },
  romantic: {
    label: "Romantic",
    className: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200",
    graphColor: "#ec4899",
  },
}
