import Image from "next/image"

interface BondiqLogoProps {
  /** Size of the icon in pixels. Defaults to 32. */
  size?: number
  /** Show the "BONDIQ" text label beside the icon. Defaults to true. */
  showLabel?: boolean
  /** Label colour. Defaults to "#000000". */
  labelColor?: string
  /** Font size of the label. Defaults to "22px". */
  labelSize?: string
}

/**
 * Shared BondIQ logo component — uses the AI-generated neon-green icon.
 * Drop this anywhere you need the brand mark.
 */
export function BondiqLogo({
  size = 32,
  showLabel = true,
  labelColor = "#000000",
  labelSize = "22px",
}: BondiqLogoProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <Image
        src="/icon-512.png"
        alt="BondIQ logo"
        width={size}
        height={size}
        priority
        style={{ display: "block", flexShrink: 0 }}
      />
      {showLabel && (
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: labelSize,
            color: labelColor,
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}
        >
          BONDIQ
        </span>
      )}
    </span>
  )
}
