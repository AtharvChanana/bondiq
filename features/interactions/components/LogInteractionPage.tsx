"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { Users, FileText, Mic, Send, Sparkles, ArrowLeft, Loader2 } from "lucide-react"

import { TextLogger } from "@/features/interactions/components/TextLogger"
import { VoiceLogger } from "@/features/interactions/components/VoiceLogger"
import { useInteractions } from "@/features/interactions/hooks/useInteractions"
import { EmptyState } from "@/shared/components/EmptyState"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { PageHeader } from "@/shared/components/PageHeader"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

export function LogInteractionPage() {
  const { people, loading, logInteraction } = useInteractions()
  const [personId, setPersonId] = useState("")
  const [mode, setMode] = useState<"text_log" | "voice_log">("text_log")
  const [rawContent, setRawContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (!personId || !rawContent.trim()) return
    setSubmitting(true)
    try {
      const interaction = await logInteraction({ personId, type: mode, rawContent })
      if (interaction.extractionStatus === "failed") {
        toast.warning("Saved the interaction, but AI memory extraction failed. You can retry it later on their profile page.")
      } else {
        toast.success("Interaction logged! AI extracted new memories.")
      }
      setRawContent("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not log interaction")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div style={{ marginBottom: '8px' }}>
        <Link 
          href="/people" 
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          ← BACK TO PEOPLE
        </Link>
      </div>

      <PageHeader
        title="Log Interaction"
        description="Capture catch-ups, coffee chats, or calls. BondIQ AI automatically synthesizes context, timelines, and important memories."
      />

      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '256px' }}>
          <LoadingSpinner />
        </div>
      ) : people.length ? (
        <div style={{ background: '#1A1A1A', border: '4px solid #FFFFFF', boxShadow: '8px 8px 0px #FFFFFF', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ borderBottom: '4px solid #FFFFFF', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#FFFFFF', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} style={{ color: '#000000' }} />
            </div>
            <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF' }}>CAPTURE CATCH-UP</span>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888888', display: 'block', marginBottom: '8px' }}>
                WHO DID YOU CONNECT WITH?
              </label>
              <select
                value={personId}
                onChange={(event) => setPersonId(event.target.value)}
                style={{ width: '100%', background: '#FFFFFF', color: '#000000', border: '4px solid #000000', borderRadius: 0, fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '13px', fontWeight: 700, padding: '10px 14px', outline: 'none', cursor: 'pointer', textTransform: 'uppercase', appearance: 'none' }}
              >
                <option value="">— SELECT A PERSON —</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>{person.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888888', display: 'block', marginBottom: '8px' }}>
                HOW WOULD YOU LIKE TO LOG IT?
              </label>
              <Tabs value={mode} onValueChange={(value: string) => setMode(value as "text_log" | "voice_log")} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <TabsList style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', background: 'transparent', borderBottom: '4px solid #333333', width: '100%' }}>
                  <TabsTrigger value="text_log" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    <FileText size={12} />
                    WRITE NOTES
                  </TabsTrigger>
                  <TabsTrigger value="voice_log" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    <Mic size={12} />
                    VOICE DICTATE
                  </TabsTrigger>
                </TabsList>
                <div style={{ border: '2px solid #333333', padding: '4px' }}>
                  <TabsContent value="text_log">
                    <TextLogger value={rawContent} onChange={setRawContent} />
                  </TabsContent>
                  <TabsContent value="voice_log">
                    <VoiceLogger value={rawContent} onTranscriptChange={setRawContent} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
            <button
              disabled={!personId || !rawContent.trim() || submitting}
              onClick={submit}
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: (!personId || !rawContent.trim() || submitting) ? '#333333' : '#FFFFFF', color: (!personId || !rawContent.trim() || submitting) ? '#666666' : '#000000', border: '4px solid #000000', boxShadow: (!personId || !rawContent.trim() || submitting) ? 'none' : '8px 8px 0px #000000', padding: '14px 24px', width: '100%', cursor: (!personId || !rawContent.trim() || submitting) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.1s ease' }}
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> SYNTHESIZING MEMORIES...</>
              ) : (
                <><Send size={16} /> SAVE + EXTRACT MEMORIES</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No Connections Found"
          description="ADD YOUR FIRST PERSON TO START LOGGING INTERACTIONS."
          actionLabel="Add new connection"
          onAction={() => { window.location.href = "/people" }}
        />
      )}
    </div>
  )
}

