import { Sparkles } from "lucide-react"

interface WeeklyDigestProps {
  digest: {
    recommendation: string
    recommendationReason: string
  } | null
}

export function WeeklyDigest({ digest }: WeeklyDigestProps) {
  return (
    <div style={{ background: '#000000', border: '4px solid #FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid #FFFFFF', paddingBottom: '12px' }}>
        <div style={{ width: '24px', height: '24px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={14} color="#000000" />
        </div>
        <h2 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          WEEKLY DIGEST
        </h2>
      </div>

      <div style={{ padding: '4px 0' }}>
        {digest ? (
          <div style={{ background: '#111111', border: '2px solid #FFFFFF', padding: '20px' }}>
            <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '13px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
              {digest.recommendation}
            </p>
            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '13px', color: '#888888', lineHeight: 1.6, margin: 0 }}>
              {digest.recommendationReason}
            </p>
          </div>
        ) : (
          <div style={{ background: '#111111', border: '2px dashed #555555', padding: '32px 20px', textAlign: 'center' }}>
            <Sparkles size={24} color="#555555" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '11px', fontWeight: 700, color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              YOUR FIRST DIGEST APPEARS AFTER BONDIQ HAS A WEEK OF ACTIVITY.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
