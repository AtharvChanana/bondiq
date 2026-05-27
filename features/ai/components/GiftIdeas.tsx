"use client"

import { useState } from "react"
import { Gift, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"

interface GiftIdea {
  emoji: string
  title: string
  reason: string
}

interface GiftIdeasProps {
  personId: string
  personName: string
}

export function GiftIdeas({ personId, personName }: GiftIdeasProps) {
  const [ideas, setIdeas] = useState<GiftIdea[]>([])
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/gift-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId }),
      })
      if (!res.ok) throw new Error()
      setIdeas((await res.json()).ideas)
    } catch {
      toast.error("Could not generate gift ideas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '4px solid #000000', padding: '16px', background: '#000000', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Gift size={18} color="#CCFF00" />
          <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>GIFT IDEAS</h3>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: '#FFFFFF', color: '#000000', border: '2px solid #000000', padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {loading ? <Loader2 className="animate-spin" size={12} /> : <RefreshCw size={12} />}
          {ideas.length ? "REFRESH" : "GENERATE"}
        </button>
      </div>
      <div style={{ padding: '32px' }}>
        {ideas.length === 0 && !loading && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', color: '#333333', fontWeight: 600, marginBottom: '24px' }}>
              GET PERSONALISED GIFT IDEAS FOR {personName.toUpperCase()} BASED ON THEIR INTERESTS AND MEMORIES.
            </p>
            <button
              onClick={generate}
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: '#000000', color: '#FFFFFF', border: '4px solid #000000', boxShadow: '4px 4px 0px #FF3333', padding: '12px 24px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Gift size={14} /> GENERATE IDEAS
            </button>
          </div>
        )}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '12px', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, color: '#555555' }}>
            <Loader2 className="animate-spin" size={16} /> FINDING GIFTS...
          </div>
        )}
        {ideas.length > 0 && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ideas.map((idea, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: '#EEEEEE', border: '2px solid #000000', padding: '16px' }}
              >
                <div style={{ background: '#FFFFFF', border: '2px solid #000000', fontSize: '24px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {idea.emoji}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', fontWeight: 800, color: '#000000', margin: 0 }}>
                    {idea.title.toUpperCase()}
                  </p>
                  <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 500, color: '#333333', margin: 0, lineHeight: 1.5 }}>
                    {idea.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
