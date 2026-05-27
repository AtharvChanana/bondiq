export function capitalise(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " ")
}

export function truncate(value: string, maxLength = 120) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1)}...`
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}
