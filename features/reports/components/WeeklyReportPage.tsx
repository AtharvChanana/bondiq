"use client"

import { useState } from "react"
import { BarChart2, Users, MessageSquare, Calendar, AlertTriangle, RefreshCw, Loader2, Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Avatar } from "@/shared/components/Avatar"

interface ReportData {
  narrative: string
  stats: {
    reconnected: number
    interactionsLogged: number
    upcomingMilestones: number
    atRiskCount: number
    totalPeople: number
  }
  reconnected: string[]
  upcomingMilestones: { title: string; personName: string; date: string | null }[]
  atRisk: { id: string; name: string; healthScore: number; lastContactedAt: string | null }[]
}

export function WeeklyReportPage() {
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/weekly-report")
      if (!res.ok) throw new Error("Could not generate report")
      setReport(await res.json())
    } catch {
      toast.error("Could not generate weekly report. Make sure your AI API key is configured.")
    } finally {
      setLoading(false)
    }
  }

  const statCards = report
    ? [
        { label: "RECONNECTED", value: report.stats.reconnected, icon: Users },
        { label: "INTERACTIONS", value: report.stats.interactionsLogged, icon: MessageSquare },
        { label: "MILESTONES", value: report.stats.upcomingMilestones, icon: Calendar },
        { label: "AT-RISK", value: report.stats.atRiskCount, icon: AlertTriangle },
      ]
    : []

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '64px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', borderBottom: '4px solid #FFFFFF', paddingBottom: '24px', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', margin: '0 0 8px 0', lineHeight: 0.9 }}>
            WEEKLY REPORT
          </h1>
          <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            YOUR AI-POWERED RELATIONSHIP ACTIVITY SUMMARY.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#CCFF00', color: '#000000', border: '4px solid #000000', boxShadow: '6px 6px 0px #000000', padding: '12px 24px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1, transition: 'transform 0.1s, box-shadow 0.1s' }}
          className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000]"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {report ? "REFRESH REPORT" : "GENERATE REPORT"}
        </button>
      </div>

      {!report && !loading && (
        <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '12px 12px 0px #333333', padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-4deg)', border: '4px solid #000000', boxShadow: '6px 6px 0px #CCFF00' }}>
            <BarChart2 size={40} color="#FFFFFF" />
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '48px', fontWeight: 900, color: '#000000', textTransform: 'uppercase', margin: '0 0 16px 0', lineHeight: 0.9 }}>
              READY FOR YOUR SUMMARY?
            </h3>
            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', fontWeight: 600, color: '#333333', maxWidth: '500px', margin: '0 auto', textTransform: 'uppercase' }}>
              GET AN AI-WRITTEN NARRATIVE OF YOUR RELATIONSHIP ACTIVITY THIS WEEK, PLUS INSIGHTS AND ACTION ITEMS.
            </p>
          </div>
          <button 
            onClick={generate} 
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#000000', color: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #CCFF00', padding: '16px 32px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', transition: 'transform 0.1s, box-shadow 0.1s' }}
            className="hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#CCFF00] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[4px_4px_0px_#CCFF00]"
          >
            <Sparkles size={18} /> GENERATE MY REPORT
          </button>
        </div>
      )}

      {loading && (
        <div style={{ background: '#111111', border: '4px solid #FFFFFF', padding: '80px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <Loader2 size={48} color="#CCFF00" className="animate-spin" />
          <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            BONDIQ AI IS ANALYZING YOUR NETWORK...
          </p>
        </div>
      )}

      {report && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* AI Narrative */}
          <div style={{ background: '#CCFF00', border: '4px solid #000000', boxShadow: '12px 12px 0px #333333', padding: '32px 40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-16px', left: '32px', background: '#000000', color: '#FFFFFF', border: '2px solid #000000', padding: '4px 16px', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', transform: 'rotate(-2deg)' }}>
              AI SYNTHESIS
            </div>
            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '18px', fontWeight: 700, color: '#000000', lineHeight: 1.6, margin: '16px 0 0 0' }}>
              {report.narrative}
            </p>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {statCards.map((s) => (
              <div key={s.label} style={{ background: '#111111', border: '4px solid #FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'transform 0.1s, box-shadow 0.1s' }} className="hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#CCFF00]">
                <s.icon size={24} color="#FFFFFF" />
                <p style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '56px', fontWeight: 900, color: '#FFFFFF', margin: 0, lineHeight: 0.9 }}>
                  {s.value}
                </p>
                <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            {report.upcomingMilestones.length > 0 && (
              <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', display: 'flex', flexDirection: 'column' }}>
                <div style={{ borderBottom: '4px solid #000000', padding: '16px 24px', background: '#000000', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={18} color="#CCFF00" />
                  <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                    UPCOMING THIS WEEK
                  </h3>
                </div>
                <div>
                  {report.upcomingMilestones.map((m, i) => (
                    <div key={i} style={{ padding: '16px 24px', borderBottom: '2px solid #EEEEEE', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '24px' }}>🎯</span>
                      <div>
                        <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', fontWeight: 700, color: '#000000', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                          {m.title}
                        </p>
                        <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#666666', margin: 0, textTransform: 'uppercase' }}>
                          {m.personName} · {m.date ? new Date(m.date).toLocaleDateString() : "DATE TBD"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.atRisk.length > 0 && (
              <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #FF3333', display: 'flex', flexDirection: 'column' }}>
                <div style={{ borderBottom: '4px solid #000000', padding: '16px 24px', background: '#FF3333', color: '#000000', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertTriangle size={18} color="#000000" />
                  <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                    NEEDS ATTENTION
                  </h3>
                </div>
                <div>
                  {report.atRisk.map((p) => (
                    <Link
                      key={p.id}
                      href={`/people/${p.id}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderBottom: '2px solid #EEEEEE', textDecoration: 'none', color: 'inherit' }}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <Avatar name={p.name} className="size-10 border-2 border-black" />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', fontWeight: 700, color: '#000000', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                          {p.name}
                        </p>
                      </div>
                      <div style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, color: '#FF3333', background: '#000000', padding: '4px 12px', border: '2px solid #000000' }}>
                        HEALTH: {p.healthScore}%
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
