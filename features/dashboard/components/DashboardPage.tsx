"use client"

import Link from "next/link"
import { CalendarDays, Check, Copy, Plus, X, Zap } from "lucide-react"
import { toast } from "sonner"

import { RelationshipHealthOverview } from "@/features/dashboard/components/RelationshipHealthOverview"
import { WeeklyDigest } from "@/features/dashboard/components/WeeklyDigest"
import { useDashboard } from "@/features/dashboard/hooks/useDashboard"
import { Avatar } from "@/shared/components/Avatar"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { PageHeader } from "@/shared/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"
import { formatDate } from "@/shared/utils/date.utils"

export function DashboardPage() {
  const { copy } = useCopyToClipboard()
  const { data, loading, error, updateNudge } = useDashboard()

  async function markNudge(id: string, status: "acted" | "dismissed") {
    try {
      await updateNudge(id, status)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update nudge")
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '320px' }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '11px', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px' }}>
            LOADING INTEL...
          </p>
        </div>
      </div>
    )
  }

  if (error || !data) return (
    <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", color: '#FF3B3B', fontSize: '12px', textTransform: 'uppercase' }}>
      {error ?? "NO DATA"}
    </p>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div className="flex items-center gap-2 -mb-2 md:-mb-4">
        <svg className="w-5 h-5 md:w-7 md:h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
        <h1 
          className="text-[28px] md:text-[42px] font-black uppercase text-[#CCFF00] m-0 leading-none"
          style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)" }}
        >
          AI UPDATES & NUDGES
        </h1>
      </div>

      {/* Nudge Container */}
      <div style={{ background: '#000000', border: '2px solid #FFFFFF', padding: '0', boxShadow: '8px 8px 0px #CCFF00', display: 'flex', flexDirection: 'column' }}>
        {data.nudges.length ? (
          data.nudges.slice(0, 5).map((nudge) => (
            <div
              key={nudge.id}
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderBottom: '1px solid #333333'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '1px solid #CCFF00', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#CCFF00'
                }}>
                  {nudge.person?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingTop: '2px' }}>
                  <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#CCFF00', margin: '0 0 4px 0', letterSpacing: '0.05em' }}>
                    {nudge.person?.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '15px', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
                    {nudge.reason}
                  </p>
                </div>
              </div>

              {nudge.draftMessage && (
                <div style={{ border: '1px dashed #555555', padding: '16px', marginTop: '4px' }}>
                  <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', color: '#AAAAAA', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                    &ldquo;{nudge.draftMessage}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 flex-wrap mt-1">
                <button
                  onClick={() => markNudge(nudge.id, "acted")}
                  style={{
                    fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: '#CCFF00',
                    color: '#000000',
                    border: 'none',
                    flex: 1,
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Check size={14} strokeWidth={3} /> MARK DONE
                </button>
                
                {nudge.draftMessage && (
                  <button
                    onClick={() => copy(nudge.draftMessage!)}
                    style={{
                      fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: '#FFFFFF',
                      color: '#000000',
                      border: 'none',
                      flex: 1,
                      padding: '12px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Copy size={14} strokeWidth={2.5} /> COPY DRAFT
                  </button>
                )}

                <button
                  onClick={() => markNudge(nudge.id, "dismissed")}
                  style={{
                    fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: '#000000',
                    color: '#555555',
                    border: '1px solid #333333',
                    minWidth: '100px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <X size={14} /> SKIP
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '80px 20px', textAlign: 'center', border: '2px dashed #333333', margin: '2px' }}>
            <p style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', fontWeight: 900, color: '#555555', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
              YOU&apos;RE ALL CAUGHT UP
            </p>
            <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
              NO PENDING UPDATES. LOG A CONVERSATION TO GENERATE NEW INSIGHTS.
            </p>
          </div>
        )}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-white border-4 border-white">
        {[
          { label: 'PEOPLE', value: data.people.length, color: '#FFFFFF' },
          { label: 'NUDGES', value: data.nudges.length, color: '#FFFFFF' },
          { label: 'MILESTONES', value: data.milestones.length, color: '#FFFFFF' },
          { label: 'HEALTH AVG', value: data.people.length > 0 ? Math.round(data.people.reduce((s: number, p: { healthScore: number }) => s + p.healthScore, 0) / data.people.length) + '%' : '–', color: '#FFFFFF' },
        ].map((stat) => (
          <div key={stat.label} className="bg-black p-4 md:p-5 lg:p-6">
            <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#AAAAAA', marginBottom: '8px' }}>
              {stat.label}
            </p>
            <p style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '48px', lineHeight: 1, fontWeight: 900, color: stat.color, margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Grid (Milestones + Health + Digest) */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {/* Milestones */}
        <Card style={{ background: '#1A1A1A', color: '#FFFFFF', border: '4px solid #FFFFFF', boxShadow: '8px 8px 0px #FFFFFF' }}>
          <CardHeader style={{ borderBottom: '4px solid #333333', padding: '16px 20px' }}>
            <CardTitle style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={14} style={{ color: '#CCFF00' }} />
              MILESTONES THIS WEEK
            </CardTitle>
          </CardHeader>
          <CardContent style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.milestones.length ? (
              data.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  style={{
                    background: '#121212',
                    border: '2px solid #333333',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ width: '32px', height: '32px', background: '#CCFF00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CalendarDays size={16} style={{ color: '#000000' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#FFFFFF', margin: 0 }}>
                      {milestone.title}
                    </p>
                    <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#555555', margin: '4px 0 0 0' }}>
                      {milestone.person.name} · {formatDate(milestone.date)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '11px', color: '#555555', textTransform: 'uppercase', textAlign: 'center', padding: '24px 0' }}>
                NO MILESTONES THIS WEEK
              </p>
            )}
          </CardContent>
        </Card>

        <RelationshipHealthOverview overview={data.healthOverview} />
        <WeeklyDigest digest={data.weeklyDigest} />
      </div>

      {!data.people.length && (
        <div style={{ border: '4px solid #CCFF00', background: '#1A1A1A', padding: '32px', textAlign: 'center', boxShadow: '8px 8px 0px #FFFFFF' }}>
          <p style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '48px', fontWeight: 900, color: '#CCFF00', marginBottom: '16px', textTransform: 'uppercase' }}>START HERE</p>
          <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#888888', textTransform: 'uppercase', marginBottom: '24px' }}>
            Add your first person to begin tracking relationships
          </p>
          <Link
            href="/people"
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: '#CCFF00', color: '#000000', border: '4px solid #000000', boxShadow: '8px 8px 0px #000000', padding: '12px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={14} /> ADD PERSON
          </Link>
        </div>
      )}
    </div>
  )
}