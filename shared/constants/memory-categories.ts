import {
  CalendarHeart,
  Flag,
  Heart,
  ListTodo,
  Milestone,
  Sparkles,
} from "lucide-react"

export const MEMORY_CATEGORIES = [
  "life_event",
  "emotion",
  "preference",
  "goal",
  "follow_up",
  "milestone",
] as const

export type MemoryCategory = (typeof MEMORY_CATEGORIES)[number]

export const MEMORY_CATEGORY_META = {
  life_event: {
    label: "Life event",
    icon: CalendarHeart,
    className:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
  },
  emotion: {
    label: "Emotion",
    icon: Heart,
    className: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  },
  preference: {
    label: "Preference",
    icon: Sparkles,
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  goal: {
    label: "Goal",
    icon: Flag,
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  },
  follow_up: {
    label: "Follow up",
    icon: ListTodo,
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  },
  milestone: {
    label: "Milestone",
    icon: Milestone,
    className:
      "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  },
} satisfies Record<MemoryCategory, { label: string; icon: unknown; className: string }>
