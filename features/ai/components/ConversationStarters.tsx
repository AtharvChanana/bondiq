"use client"

import { useState } from "react"
import { MessageCircle, RefreshCw, Loader2, Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"

interface ConversationStartersProps {
  personId: string
  personName: string
}

export function ConversationStarters({ personId, personName }: ConversationStartersProps) {
  const [starters, setStarters] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { copy } = useCopyToClipboard()

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/conversation-starters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStarters(data.starters)
    } catch {
      toast.error("Could not generate conversation starters")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '4px solid #000000', padding: '16px', background: '#000000', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageCircle size={18} color="#CCFF00" />
          <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>CONVERSATION STARTERS</h3>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: '#FFFFFF', color: '#000000', border: '2px solid #000000', padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {loading ? <Loader2 className="animate-spin" size={12} /> : <RefreshCw size={12} />}
          {starters.length ? "REFRESH" : "GENERATE"}
        </button>
      </div>
      <div style={{ padding: '32px' }}>
        {starters.length === 0 && !loading && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', color: '#333333', fontWeight: 600, marginBottom: '24px' }}>
              GET PERSONALISED CONVERSATION STARTERS FOR {personName.toUpperCase()} BASED ON THEIR MEMORIES AND RECENT ACTIVITY.
            </p>
            <button
              onClick={generate}
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: '#000000', color: '#FFFFFF', border: '4px solid #000000', boxShadow: '4px 4px 0px #CCFF00', padding: '12px 24px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <MessageCircle size={14} /> GENERATE STARTERS
            </button>
          </div>
        )}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '12px', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, color: '#555555' }}>
            <Loader2 className="animate-spin" size={16} /> THINKING OF TOPICS...
          </div>
        )}
        {starters.length > 0 && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {starters.map((s, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: '#EEEEEE', border: '2px solid #000000', padding: '16px' }}
              >
                <div style={{ background: '#CCFF00', border: '2px solid #000000', color: '#000000', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#000000', margin: 0, flex: 1, lineHeight: 1.5 }}>
                  {s}
                </p>
                <button
                  onClick={() => { copy(s); toast.success("Copied to clipboard!") }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#555555' }}
                >
                  <Copy size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
