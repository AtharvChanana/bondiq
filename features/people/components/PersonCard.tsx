"use client"

import Link from "next/link"
import { HealthScoreGauge } from "@/features/people/components/HealthScoreGauge"
import type { Person } from "@/features/people/types"
import { Avatar } from "@/shared/components/Avatar"
import { timeAgo } from "@/shared/utils/date.utils"

export function PersonCard({ person }: { person: Person }) {
  const healthScore = person.healthScore ?? 0
  const healthColor = healthScore >= 70 ? '#FFFFFF' : healthScore >= 40 ? '#888888' : '#444444'

  return (
    <Link href={`/people/${person.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: '#1A1A1A',
          border: '4px solid #FFFFFF',
          boxShadow: '8px 8px 0px #FFFFFF',
          padding: '0',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-4px, -4px)'; e.currentTarget.style.boxShadow = '12px 12px 0px #FFFFFF'; e.currentTarget.style.borderColor = '#FFFFFF' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '8px 8px 0px #FFFFFF'; e.currentTarget.style.borderColor = '#FFFFFF' }}
      >
        {/* Health bar strip at top */}
        <div style={{ height: '6px', background: '#222222', borderBottom: '2px solid #333333' }}>
          <div style={{ height: '100%', width: `${healthScore}%`, background: healthColor, transition: 'width 0.4s ease' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
          <Avatar name={person.name} src={person.avatar} style={{ width: '52px', height: '52px', flexShrink: 0 }} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '13px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                {person.name}
              </h2>
              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: '#333333', color: '#888888', padding: '2px 6px', border: '1px solid #444444', flexShrink: 0 }}>
                {person.relationship}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              LAST: {timeAgo(person.lastContactedAt)}
            </p>
          </div>

          {/* Score badge */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', lineHeight: 1, color: healthColor }}>
              {healthScore}
            </div>
            <div style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '8px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
              HEALTH
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
