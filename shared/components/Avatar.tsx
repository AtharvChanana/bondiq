import { cn } from "@/shared/utils/cn"

interface AvatarProps {
  name: string
  className?: string
  src?: string | null
  style?: React.CSSProperties
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getColor(name: string) {
  // Deterministic volt/white/black rotation based on name
  const options = ["#CCFF00", "#FFFFFF", "#1A1A1A"]
  const textOptions = ["#000000", "#000000", "#CCFF00"]
  const idx = name.charCodeAt(0) % 3
  return { bg: options[idx], text: textOptions[idx] }
}

export function Avatar({ name, className, src, style }: AvatarProps) {
  const { bg, text } = getColor(name)
  const initials = getInitials(name)

  return (
    <div
      className={cn("flex items-center justify-center flex-shrink-0", className)}
      style={{
        background: src ? 'transparent' : bg,
        color: text,
        border: '4px solid #000000',
        borderRadius: 0,
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: '11px',
        letterSpacing: '0.05em',
        overflow: 'hidden',
        ...style,
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials
      )}
    </div>
  )
}
