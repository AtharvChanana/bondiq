"use client"

interface Interaction {
  sentiment?: string | null
  createdAt: string | Date
}

interface SentimentChartProps {
  interactions: Interaction[]
}

const SENTIMENT_CONFIG = {
  positive: { color: "#CCFF00", emoji: "😊", label: "POSITIVE", height: 100 },
  negative: { color: "#FF3333", emoji: "😔", label: "NEGATIVE", height: 30 },
  mixed: { color: "#FFFFFF", emoji: "😐", label: "MIXED", height: 55 },
  neutral: { color: "#EEEEEE", emoji: "💬", label: "NEUTRAL", height: 65 },
}

export function SentimentChart({ interactions }: SentimentChartProps) {
  const withSentiment = interactions
    .filter((i) => i.sentiment)
    .slice(0, 10)
    .reverse()

  if (withSentiment.length === 0) return null

  const counts = withSentiment.reduce((acc, i) => {
    const key = i.sentiment as string
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  const config = SENTIMENT_CONFIG[dominant[0] as keyof typeof SENTIMENT_CONFIG] ?? SENTIMENT_CONFIG.neutral

  return (
    <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, color: '#000000' }}>EMOTIONAL TREND</h3>
        <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#555555' }}>
          LAST {withSentiment.length} INTERACTIONS
        </span>
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px', borderBottom: '4px solid #000000', paddingBottom: '8px' }}>
        {withSentiment.map((interaction, i) => {
          const key = (interaction.sentiment ?? "neutral") as keyof typeof SENTIMENT_CONFIG
          const c = SENTIMENT_CONFIG[key] ?? SENTIMENT_CONFIG.neutral
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%' }}>
              <div
                style={{ width: '100%', height: `${c.height}%`, background: c.color, minHeight: '8px', border: '2px solid #000000', borderBottom: 'none' }}
                title={`${c.label} · ${new Date(interaction.createdAt).toLocaleDateString()}`}
              />
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {Object.entries(counts).map(([key, count]) => {
            const c = SENTIMENT_CONFIG[key as keyof typeof SENTIMENT_CONFIG]
            if (!c) return null
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{c.emoji}</span>
                <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#555555' }}>{c.label} ({count})</span>
              </div>
            )
          })}
        </div>
        <div
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', background: config.color, padding: '4px 12px', border: '2px solid #000000', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          MOSTLY {config.label} {config.emoji}
        </div>
      </div>
    </div>
  )
}
