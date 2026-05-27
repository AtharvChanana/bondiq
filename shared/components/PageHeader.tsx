import { cn } from "@/shared/utils/cn"

function PageHeader({
  title,
  description,
  className,
  actions,
}: {
  title: string
  description?: string
  className?: string
  actions?: React.ReactNode
}) {
  return (
    <div className={cn("mb-6", className)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)",
              fontWeight: 900,
              fontSize: 'clamp(48px, 8vw, 96px)',
              textTransform: 'uppercase',
              lineHeight: 0.88,
              color: '#CCFF00',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
                fontSize: '11px',
                color: '#777777',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginTop: '10px',
              }}
            >
              {description}
            </p>
          )}
        </div>
        {actions && <div style={{ flexShrink: 0, marginTop: '8px' }}>{actions}</div>}
      </div>
    </div>
  )
}

export { PageHeader }
