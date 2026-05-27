import { differenceInCalendarDays, format, formatDistanceToNow } from "date-fns"

export function formatDate(date?: string | Date | null, fallback = "Not set") {
  if (!date) return fallback
  return format(new Date(date), "MMM d, yyyy")
}

export function timeAgo(date?: string | Date | null) {
  if (!date) return "Never"
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function daysSince(date?: string | Date | null) {
  if (!date) return null
  return differenceInCalendarDays(new Date(), new Date(date))
}
