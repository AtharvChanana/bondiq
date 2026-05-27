"use client"

import { MessageSquare, Star, Brain, Calendar, ChevronDown } from "lucide-react"
import { useState } from "react"
import { formatDate } from "@/shared/utils/date.utils"

interface TimelineInteraction {
  id: string
  type: string
  summary?: string | null
  rawContent: string
  sentiment?: string | null
  createdAt: string | Date
}

interface TimelineMemory {
  id: string
  category: string
  content: string
  importance: string
  createdAt: string | Date
}

interface TimelineMilestone {
  id: string
  title: string
  date?: string | Date | null
  isRecurring: boolean
  createdAt?: string | Date | null
}

interface RelationshipTimelineProps {
  interactions: TimelineInteraction[]
  memories: TimelineMemory[]
  milestones: TimelineMilestone[]
  personName: string
}

type TimelineEvent =
  | { kind: "interaction"; date: Date; data: TimelineInteraction }
  | { kind: "memory"; date: Date; data: TimelineMemory }
  | { kind: "milestone"; date: Date; data: TimelineMilestone }

const sentimentConfig = {
  positive: { emoji: "😊", color: "#CCFF00", label: "POSITIVE" },
  negative: { emoji: "😔", color: "#FF3333", label: "NEGATIVE" },
  mixed: { emoji: "😐", color: "#FFFFFF", label: "MIXED" },
  neutral: { emoji: "💬", color: "#EEEEEE", label: "NEUTRAL" },
}

const importanceConfig = {
  high: { color: "#FF3333", label: "HIGH" },
  medium: { color: "#CCFF00", label: "MEDIUM" },
  low: { color: "#EEEEEE", label: "LOW" },
}

export function RelationshipTimeline({ interactions, memories, milestones, personName }: RelationshipTimelineProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const events: TimelineEvent[] = [
    ...interactions.map((i) => ({ kind: "interaction" as const, date: new Date(i.createdAt), data: i })),
    ...memories.map((m) => ({ kind: "memory" as const, date: new Date(m.createdAt), data: m })),
    ...milestones.map((ms) => ({ kind: "milestone" as const, date: ms.date ? new Date(ms.date) : ms.createdAt ? new Date(ms.createdAt) : new Date(), data: ms })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  if (events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 32px', background: '#FFFFFF', border: '4px dashed #000000' }}>
        <div style={{ width: '64px', height: '64px', background: '#000000', border: '2px solid #000000', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calendar size={32} color="#CCFF00" />
        </div>
        <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', margin: '0 0 8px 0' }}>NO TIMELINE EVENTS YET</p>
        <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 500, color: '#555555', margin: 0 }}>LOG AN INTERACTION WITH {personName.toUpperCase()} TO START BUILDING YOUR STORY.</p>
      </div>
    )
  }

  const grouped: Record<string, TimelineEvent[]> = {}
  for (const event of events) {
    const key = event.date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(event)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {Object.entries(grouped).map(([month, monthEvents]) => (
        <div key={month}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '4px', background: '#000000' }} />
            <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', background: '#CCFF00', border: '4px solid #000000', padding: '4px 16px', color: '#000000' }}>
              {month}
            </span>
            <div style={{ flex: 1, height: '4px', background: '#000000' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '22px', top: 0, bottom: 0, width: '4px', background: '#000000' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {monthEvents.map((event) => {
                const eventKey = `${event.kind}-${event.data.id}`
                const isExpanded = expanded === eventKey
                const toggle = () => setExpanded(isExpanded ? null : eventKey)

                if (event.kind === "interaction") {
                  const s = sentimentConfig[event.data.sentiment as keyof typeof sentimentConfig] ?? sentimentConfig.neutral
                  return (
                    <div key={event.data.id} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                      <div style={{ width: '48px', height: '48px', background: s.color, border: '4px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 10, fontSize: '20px' }}>
                        {s.emoji}
                      </div>
                      <div
                        style={{ flex: 1, background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                        onClick={toggle}
                      >
                        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', borderBottom: isExpanded ? '4px solid #000000' : 'none' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <MessageSquare size={14} color="#000000" />
                              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', background: s.color, padding: '2px 6px', border: '2px solid #000000' }}>INTERACTION</span>
                              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, color: '#555555' }}>{event.date.toLocaleDateString()}</span>
                            </div>
                            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', fontWeight: 700, color: '#000000', margin: 0, lineHeight: 1.4 }}>
                              {event.data.summary ?? event.data.rawContent.slice(0, 120) + (event.data.rawContent.length > 120 ? "..." : "")}
                            </p>
                          </div>
                          <ChevronDown size={20} color="#000000" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </div>
                        {isExpanded && (
                          <div style={{ padding: '16px', background: '#EEEEEE' }}>
                            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 500, color: '#333333', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{event.data.rawContent}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }

                if (event.kind === "memory") {
                  const imp = importanceConfig[event.data.importance as keyof typeof importanceConfig] ?? importanceConfig.medium
                  return (
                    <div key={event.data.id} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                      <div style={{ width: '48px', height: '48px', background: '#000000', border: '4px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 10 }}>
                        <Brain size={20} color="#FFFFFF" />
                      </div>
                      <div style={{ flex: 1, background: '#FFFFFF', border: '4px solid #000000', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#FFFFFF', background: '#000000', padding: '2px 6px', border: '2px solid #000000' }}>MEMORY</span>
                          <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, color: '#555555' }}>{event.date.toLocaleDateString()}</span>
                          <span style={{ marginLeft: 'auto', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', background: imp.color, padding: '2px 8px', border: '2px solid #000000' }}>{imp.label}</span>
                        </div>
                        <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', fontWeight: 700, color: '#000000', margin: 0, lineHeight: 1.4 }}>{event.data.content}</p>
                      </div>
                    </div>
                  )
                }

                if (event.kind === "milestone") {
                  return (
                    <div key={event.data.id} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                      <div style={{ width: '48px', height: '48px', background: '#CCFF00', border: '4px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 10 }}>
                        <Star size={20} color="#000000" />
                      </div>
                      <div style={{ flex: 1, background: '#FFFFFF', border: '4px solid #000000', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', background: '#CCFF00', padding: '2px 6px', border: '2px solid #000000' }}>MILESTONE</span>
                          {event.data.isRecurring && (
                            <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', border: '2px dashed #000000', padding: '2px 6px' }}>RECURRING</span>
                          )}
                          <span style={{ marginLeft: 'auto', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, color: '#555555' }}>{formatDate(event.data.date)}</span>
                        </div>
                        <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', fontWeight: 800, color: '#000000', margin: 0 }}>{event.data.title}</p>
                      </div>
                    </div>
                  )
                }

                return null
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
