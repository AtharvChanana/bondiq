import type { LucideIcon } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '256px', border: '4px dashed #333333', padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ width: '56px', height: '56px', background: '#CCFF00', border: '4px solid #000000', boxShadow: '4px 4px 0px #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <Icon size={24} style={{ color: '#000000' }} />
      </div>
      <h2 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', fontWeight: 400, textTransform: 'uppercase', color: '#FFFFFF', margin: '0 0 8px', lineHeight: 0.9 }}>
        {title}
      </h2>
      <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '11px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em', maxWidth: '360px', lineHeight: 1.6 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
