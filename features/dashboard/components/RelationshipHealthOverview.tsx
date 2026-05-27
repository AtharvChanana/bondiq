import { Heart, AlertTriangle, TrendingDown } from "lucide-react"

interface RelationshipHealthOverviewProps {
  overview: { healthy: number; atRisk: number; fading: number }
}

export function RelationshipHealthOverview({ overview }: RelationshipHealthOverviewProps) {
  const items = [
    {
      label: "HEALTHY",
      value: overview.healthy,
      icon: Heart,
    },
    {
      label: "AT RISK",
      value: overview.atRisk,
      icon: AlertTriangle,
    },
    {
      label: "FADING",
      value: overview.fading,
      icon: TrendingDown,
    },
  ]

  return (
    <div style={{ background: '#000000', border: '4px solid #FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid #FFFFFF', paddingBottom: '12px' }}>
        <div style={{ width: '24px', height: '24px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={14} color="#000000" />
        </div>
        <h2 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          RELATIONSHIP HEALTH
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              style={{ background: '#111111', border: '2px solid #FFFFFF', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.1s' }}
              className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#CCFF00]"
            >
              <Icon size={16} color="#FFFFFF" />
              <p style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '40px', fontWeight: 900, color: '#FFFFFF', lineHeight: 0.9, margin: 0 }}>
                {item.value}
              </p>
              <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                {item.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
