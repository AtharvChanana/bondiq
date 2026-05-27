"use client"

import { useState, useEffect } from "react"
import { Target, Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"

interface Goal {
  id: string
  title: string
  frequencyDays: number
  person: { name: string; lastContactedAt: string | null }
}

interface GoalTrackerProps {
  personId: string
  personName: string
  lastContactedAt?: string | Date | null
}

const PRESET_GOALS = [
  { label: "Weekly catch-up", frequencyDays: 7 },
  { label: "Bi-weekly check-in", frequencyDays: 14 },
  { label: "Monthly coffee", frequencyDays: 30 },
  { label: "Quarterly meetup", frequencyDays: 90 },
]

export function GoalTracker({ personId, personName, lastContactedAt }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [frequencyDays, setFrequencyDays] = useState(7)
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      const res = await fetch(`/api/goals?personId=${personId}`)
      setGoals(await res.json())
    } catch {
      toast.error("Could not load goals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [personId])

  async function addGoal() {
    if (!title.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId, title: title.trim(), frequencyDays }),
      })
      if (!res.ok) throw new Error("Could not add goal")
      toast.success("Goal added!")
      setTitle("")
      setFrequencyDays(7)
      setShowForm(false)
      load()
    } catch {
      toast.error("Could not add goal")
    } finally {
      setSaving(false)
    }
  }

  async function deleteGoal(id: string) {
    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" })
      setGoals((prev) => prev.filter((g) => g.id !== id))
      toast.success("Goal removed")
    } catch {
      toast.error("Could not remove goal")
    }
  }

  function getProgress(goal: Goal) {
    if (!lastContactedAt) return { daysSince: null, isOnTrack: false, percent: 0 }
    const daysSince = Math.floor((Date.now() - new Date(lastContactedAt).getTime()) / 86_400_000)
    const percent = Math.min(100, Math.round((daysSince / goal.frequencyDays) * 100))
    const isOnTrack = daysSince <= goal.frequencyDays
    return { daysSince, isOnTrack, percent }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
          <Target size={16} color="#000000" /> CONTACT GOALS
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: '#FFFFFF', color: '#000000', border: '2px solid #000000', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={12} /> ADD GOAL
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#EEEEEE', border: '4px solid #000000', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000' }}>GOAL TITLE</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.G. MONTHLY COFFEE CATCH-UP"
              style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, padding: '12px', background: '#FFFFFF', border: '2px solid #000000', color: '#000000', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000' }}>FREQUENCY</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {PRESET_GOALS.map((p) => {
                const isSelected = frequencyDays === p.frequencyDays
                return (
                  <button
                    key={p.frequencyDays}
                    onClick={() => { setFrequencyDays(p.frequencyDays); setTitle(p.label.toUpperCase()) }}
                    style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '12px', background: isSelected ? '#000000' : '#FFFFFF', color: isSelected ? '#FFFFFF' : '#000000', border: '2px solid #000000', cursor: 'pointer' }}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={addGoal}
              disabled={saving || !title.trim()}
              style={{ flex: 1, fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: '#CCFF00', color: '#000000', border: '4px solid #000000', padding: '12px', cursor: (saving || !title.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (saving || !title.trim()) ? 0.5 : 1 }}
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : "SET GOAL"}
            </button>
            <button 
              onClick={() => setShowForm(false)} 
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: 'transparent', color: '#000000', border: '4px solid #000000', padding: '12px 24px', cursor: 'pointer' }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <Loader2 className="animate-spin" size={24} color="#000000" />
        </div>
      ) : goals.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', background: '#FFFFFF', border: '4px dashed #000000' }}>
          <Target size={32} color="#000000" style={{ opacity: 0.2, margin: '0 auto 16px' }} />
          <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', margin: '0 0 8px 0' }}>NO GOALS SET YET</p>
          <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 500, color: '#555555', margin: 0 }}>SET A CONTACT FREQUENCY GOAL TO STAY CONNECTED WITH {personName.toUpperCase()}.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {goals.map((goal) => {
            const { daysSince, isOnTrack, percent } = getProgress(goal)
            return (
              <div key={goal.id} style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '18px', fontWeight: 800, color: '#000000', margin: '0 0 4px 0' }}>{goal.title}</p>
                    <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#555555', margin: 0 }}>EVERY {goal.frequencyDays} DAYS</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {daysSince !== null && (
                      isOnTrack
                        ? <CheckCircle2 size={24} color="#CCFF00" style={{ background: '#000000', borderRadius: '50%' }} />
                        : <AlertCircle size={24} color="#FF3333" style={{ background: '#000000', borderRadius: '50%' }} />
                    )}
                    <button
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 size={16} color="#FF3333" />
                    </button>
                  </div>
                </div>
                {daysSince !== null ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ height: '12px', width: '100%', background: '#EEEEEE', border: '2px solid #000000' }}>
                      <div
                        style={{ height: '100%', transition: 'width 0.5s', width: `${percent}%`, background: isOnTrack ? "#CCFF00" : "#FF3333", borderRight: '2px solid #000000' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#555555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={12} /> {daysSince}D SINCE LAST CONTACT
                      </span>
                      <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: isOnTrack ? '#000000' : '#FF3333' }}>
                        {isOnTrack
                          ? `${goal.frequencyDays - daysSince}D LEFT`
                          : `${daysSince - goal.frequencyDays}D OVERDUE`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#555555', margin: 0 }}>NEVER CONTACTED YET</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
