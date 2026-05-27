"use client"

import { useRouter } from "next/navigation"
import { 
  Copy, 
  MessageCircle, 
  RotateCcw, 
  Trash2, 
  Calendar, 
  Sparkles, 
  Clock,
  Heart, 
  ArrowLeft, 
  Send, 
  Smile,
  AlertTriangle,
  Loader2,
  GitBranch,
  Target
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { ConfirmModal } from "@/shared/components/ConfirmModal"

import { EditPersonForm } from "@/features/people/components/EditPersonForm"
import { HealthScoreGauge } from "@/features/people/components/HealthScoreGauge"
import { SentimentChart } from "@/features/people/components/SentimentChart"
import { AddMilestoneModal } from "@/features/people/components/milestones/AddMilestoneModal"
import { RelationshipTimeline } from "@/features/timeline/components/RelationshipTimeline"
import { GoalTracker } from "@/features/goals/components/GoalTracker"
import { ConversationStarters } from "@/features/ai/components/ConversationStarters"
import { GiftIdeas } from "@/features/ai/components/GiftIdeas"
import { PersonChat } from "@/features/people/components/PersonChat"
import { usePerson } from "@/features/people/hooks/usePerson"
import { MilestonesClientService } from "@/features/people/services/milestones.service"
import { Avatar } from "@/shared/components/Avatar"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { Badge } from "@/shared/components/ui/badge"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { MEMORY_CATEGORY_META } from "@/shared/constants/memory-categories"
import { RELATIONSHIP_TYPE_META } from "@/shared/constants/relationship-types"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"
import { formatDate, timeAgo } from "@/shared/utils/date.utils"
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp.utils"

export function PersonProfilePage({ personId }: { personId: string }) {
  const router = useRouter()
  const { copy } = useCopyToClipboard()
  const { person, loading, error, refresh, update, remove } = usePerson(personId)
  const [draft, setDraft] = useState("")
  const [brief, setBrief] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  async function draftMessage() {
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai/draft-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId, occasion: "checking_in" }),
      })
      if (!res.ok) throw new Error("Could not draft message")
      const data = (await res.json()) as { message: string }
      setDraft(data.message)
      toast.success("AI draft message generated!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not draft message")
    } finally {
      setAiLoading(false)
    }
  }

  async function generateBrief() {
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId }),
      })
      if (!res.ok) throw new Error("Could not generate brief")
      const data = (await res.json()) as { brief: string }
      setBrief(data.brief)
      toast.success("AI brief updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate brief")
    } finally {
      setAiLoading(false)
    }
  }

  async function deletePerson() {
    setShowDeleteConfirm(false)
    await remove()
    router.push("/people")
    router.refresh()
  }

  async function retryFailedExtraction(interactionId?: string) {
    setAiLoading(true)
    try {
      const res = await fetch("/api/interactions/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interactionId ? { interactionId } : { personId }),
      })
      if (!res.ok) throw new Error("Could not retry extraction")
      await refresh()
      toast.success("AI extraction retried successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not retry extraction")
    } finally {
      setAiLoading(false)
    }
  }

  async function deleteMilestone(id: string) {
    try {
      await MilestonesClientService.delete(id)
      await refresh()
      toast.success("Milestone deleted")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete milestone")
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-80 place-items-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !person) return <p className="text-sm text-destructive font-medium p-4">{error ?? "Profile not found"}</p>

  const relationshipMeta =
    RELATIONSHIP_TYPE_META[person.relationship as keyof typeof RELATIONSHIP_TYPE_META]
  const failedExtractions = person.interactions.filter(
    (interaction) => interaction.extractionStatus === "failed"
  )

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '64px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '4px solid #FFFFFF', paddingBottom: '16px' }}>
        <Link 
          href="/people" 
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          className="hover:text-[#CCFF00] transition-colors"
        >
          <ArrowLeft size={16} /> BACK TO LIST
        </Link>
        <button 
          onClick={() => setShowDeleteConfirm(true)}
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: '#FF3333', color: '#000000', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000]"
        >
          <Trash2 size={14} /> DELETE PROFILE
        </button>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="DELETE PROFILE?"
        description={`Are you sure you want to permanently delete ${person?.name}'s profile? All logs, memories, and interactions will be lost.`}
        confirmText="DELETE PROFILE"
        isDanger={true}
        onConfirm={deletePerson}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Hero Section */}
      <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '12px 12px 0px #333333', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Avatar 
              name={person.name} 
              src={person.avatar} 
              style={{ width: '96px', height: '96px', border: '4px solid #000000', boxShadow: '6px 6px 0px #CCFF00', borderRadius: '0' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 
                  className="text-[32px] sm:text-[48px] font-black uppercase text-black m-0 leading-none"
                  style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)" }}
                >
                  {person.name}
                </h1>
                {relationshipMeta && (
                  <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: '#000000', color: '#FFFFFF', padding: '4px 12px', border: '2px solid #000000' }}>
                    {relationshipMeta.label}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#555555', textTransform: 'uppercase', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> LAST CONTACT: {timeAgo(person.lastContactedAt)}
                </span>
                {person.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageCircle size={14} /> {person.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ background: '#111111', border: '4px solid #000000', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>HEALTH SCORE</span>
            <HealthScoreGauge score={person.healthScore} size={80} />
          </div>

        </div>

        {person.currentSituation ? (
          <div style={{ background: '#000000', color: '#CCFF00', border: '4px solid #000000', padding: '16px', fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontStyle: 'italic', fontWeight: 600 }}>
            &ldquo;{person.currentSituation}&rdquo;
          </div>
        ) : (
          <div style={{ background: '#EEEEEE', color: '#555555', border: '2px dashed #000000', padding: '12px', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', textTransform: 'uppercase' }}>
            NO CURRENT SITUATION LOGGED.
          </div>
        )}
      </div>

      {/* Brutalist Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
          <TabsList style={{ display: 'inline-flex', background: '#111111', border: '4px solid #FFFFFF', padding: '4px', gap: '4px' }}>
            {['overview', 'timeline', 'goals', 'memories', 'interactions', 'brief', 'chat', 'edit'].map((tab) => {
              const tabLabels: Record<string, string> = {
                overview: 'OVERVIEW',
                timeline: 'TIMELINE',
                goals: 'GOALS',
                memories: `MEMORIES (${person.memories.length})`,
                interactions: `LOGS (${person.interactions.length})`,
                brief: 'AI BRIEF',
                chat: 'CHAT',
                edit: 'EDIT'
              }
              const isActive = activeTab === tab
              return (
                <TabsTrigger 
                  key={tab} 
                  value={tab} 
                  style={{ 
                    fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    padding: '8px 16px', 
                    borderRadius: 0, 
                    background: isActive ? '#CCFF00' : 'transparent',
                    color: isActive ? '#000000' : '#FFFFFF',
                    border: isActive ? '2px solid #000000' : '2px solid transparent',
                    transition: 'none'
                  }}
                  className={!isActive ? "hover:bg-[#222222] hover:text-[#CCFF00]" : ""}
                >
                  {tabLabels[tab]}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6 outline-none">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            
            {/* Context Card */}
            <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', display: 'flex', flexDirection: 'column' }}>
              <div style={{ borderBottom: '4px solid #000000', padding: '16px', background: '#000000', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Heart size={18} color="#CCFF00" />
                <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>CONTEXT & BACKGROUND</h3>
              </div>
              <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ borderLeft: '4px solid #CCFF00', paddingLeft: '16px' }}>
                  <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>HOW YOU MET</span>
                  <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', color: '#000000', fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
                    {person.howWeMet ?? "NOT ADDED YET."}
                  </p>
                </div>
                <div style={{ borderLeft: '4px solid #CCFF00', paddingLeft: '16px' }}>
                  <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>WHAT MATTERS TO THEM</span>
                  <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', color: '#000000', fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
                    {person.whatMattersToThem ?? "NOT ADDED YET."}
                  </p>
                </div>
                <div style={{ borderLeft: '4px solid #CCFF00', paddingLeft: '16px' }}>
                  <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>LAST CONVERSATION</span>
                  {person.interactions.length > 0 ? (
                    <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', color: '#000000', fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
                      {person.interactions[0].summary || person.interactions[0].rawContent}
                    </p>
                  ) : (
                    <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#555555', fontWeight: 700, textTransform: 'uppercase', margin: 0, lineHeight: 1.4 }}>
                      NO PREVIOUS CONVERSATIONS LOGGED.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Milestones */}
            <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', display: 'flex', flexDirection: 'column' }}>
              <div style={{ borderBottom: '4px solid #000000', padding: '16px', background: '#000000', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={18} color="#CCFF00" />
                  <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>MILESTONES</h3>
                </div>
                <AddMilestoneModal personId={person.id} onCreated={refresh} />
              </div>
              <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                {person.milestones?.length ? (
                  person.milestones.map((milestone) => (
                    <div key={milestone.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px', background: '#111111', border: '2px solid #000000', color: '#FFFFFF' }}>
                      <div>
                        <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>{milestone.title}</span>
                        {milestone.isRecurring && (
                          <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#CCFF00', marginTop: '4px', display: 'block' }}>RECURRING ANNUALLY</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, background: '#FFFFFF', color: '#000000', padding: '4px 8px' }}>
                          {formatDate(milestone.date)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#555555', textTransform: 'uppercase' }}>
                    NO SPECIAL DATES LOGGED.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Drafting Widget */}
          <div style={{ background: '#CCFF00', border: '4px solid #000000', boxShadow: '12px 12px 0px #333333', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-16px', left: '32px', background: '#000000', color: '#FFFFFF', border: '2px solid #000000', padding: '4px 16px', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', transform: 'rotate(-2deg)' }}>
              AI DRAFTER
            </div>
            <div>
              <h3 
                className="text-[28px] sm:text-[32px] font-black uppercase text-black m-0 mb-2 leading-none"
                style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)" }}
              >
                DRAFT A MESSAGE
              </h3>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#333333', maxWidth: '600px', margin: 0 }}>
                CRAFT A THOUGHTFUL CHECK-IN MESSAGE TAILORED TO THEIR RECENT MILESTONES AND MEMORIES.
              </p>
            </div>
            
            <button 
              onClick={draftMessage} 
              disabled={aiLoading}
              style={{ alignSelf: 'flex-start', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#000000', color: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '16px 32px', cursor: aiLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'transform 0.1s, box-shadow 0.1s' }}
              className="hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#333333] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[4px_4px_0px_#333333]"
            >
              {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
              {aiLoading ? "DRAFTING..." : "GENERATE DRAFT"}
            </button>

            {draft && (
              <div style={{ background: '#FFFFFF', border: '4px solid #000000', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', fontWeight: 600, color: '#000000', fontStyle: 'italic', margin: 0 }}>
                  &ldquo;{draft}&rdquo;
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => { copy(draft); toast.success("Copied to clipboard!") }}
                    style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: '#EEEEEE', color: '#000000', border: '2px solid #000000', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Copy size={14} /> COPY
                  </button>
                  <button 
                    onClick={() => window.open(buildWhatsAppUrl(draft, person.phone))}
                    style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', background: '#25D366', color: '#000000', border: '2px solid #000000', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Send size={14} /> WHATSAPP
                  </button>
                </div>
              </div>
            )}
          </div>

          {person.interactions.length > 0 && <SentimentChart interactions={person.interactions} />}
          <ConversationStarters personId={person.id} personName={person.name} />
          <GiftIdeas personId={person.id} personName={person.name} />
        </TabsContent>

        {/* Tab 2: Timeline */}
        <TabsContent value="timeline" className="space-y-4 outline-none">
          <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '32px' }}>
            <RelationshipTimeline interactions={person.interactions} memories={person.memories} milestones={person.milestones ?? []} personName={person.name} />
          </div>
        </TabsContent>

        {/* Tab 3: Goals */}
        <TabsContent value="goals" className="space-y-4 outline-none">
          <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '32px' }}>
            <GoalTracker personId={person.id} personName={person.name} lastContactedAt={person.lastContactedAt} />
          </div>
        </TabsContent>

        {/* Tab 4: Memories */}
        <TabsContent value="memories" className="space-y-4 outline-none">
          {person.memories.length ? (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {person.memories.map((memory) => {
                const meta = MEMORY_CATEGORY_META[memory.category as keyof typeof MEMORY_CATEGORY_META]
                return (
                  <div key={memory.id} style={{ background: '#111111', border: '4px solid #FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: '#FFFFFF', color: '#000000', padding: '4px 8px', border: '2px solid #000000' }}>
                          {meta?.label || memory.category}
                        </span>
                        <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: memory.importance === 'high' ? '#FF3333' : '#333333', color: memory.importance === 'high' ? '#000000' : '#FFFFFF', padding: '4px 8px', border: '2px solid #000000' }}>
                          {memory.importance} PRIORITY
                        </span>
                      </div>
                      <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#888888', textTransform: 'uppercase' }}>
                        {formatDate(memory.createdAt)}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#FFFFFF', margin: 0, lineHeight: 1.5 }}>
                      {memory.content}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ background: '#111111', border: '4px solid #FFFFFF', padding: '48px', textAlign: 'center' }}>
              <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>NO MEMORIES LOGGED YET.</p>
            </div>
          )}
        </TabsContent>

        {/* Tab 5: Interactions */}
        <TabsContent value="interactions" className="space-y-4 outline-none">
          {failedExtractions.length > 0 && (
            <div style={{ background: '#FF3333', border: '4px solid #000000', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#000000', fontWeight: 700, fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', textTransform: 'uppercase' }}>
                <AlertTriangle size={18} /> {failedExtractions.length} AI EXTRACTION(S) FAILED
              </div>
              <button onClick={() => retryFailedExtraction()} style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: '#000000', color: '#FFFFFF', border: '2px solid #000000', padding: '6px 12px', cursor: 'pointer' }}>
                RETRY ALL
              </button>
            </div>
          )}
          {person.interactions.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {person.interactions.map((interaction) => (
                <div key={interaction.id} style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: '#000000', color: '#FFFFFF', padding: '4px 8px' }}>
                        {interaction.type.replace("_", " ")}
                      </span>
                      {interaction.sentiment && (
                        <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: '#CCFF00', color: '#000000', padding: '4px 8px', border: '2px solid #000000' }}>
                          {interaction.sentiment}
                        </span>
                      )}
                    </div>
                    <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#555555', textTransform: 'uppercase' }}>
                      {formatDate(interaction.createdAt)}
                    </span>
                  </div>
                  {interaction.summary && (
                    <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '16px', fontWeight: 800, color: '#000000', margin: 0 }}>
                      {interaction.summary}
                    </p>
                  )}
                  <div style={{ background: '#EEEEEE', border: '2px solid #000000', padding: '16px', fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', color: '#333333', whiteSpace: 'pre-line' }}>
                    {interaction.rawContent}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: '#111111', border: '4px solid #FFFFFF', padding: '48px', textAlign: 'center' }}>
              <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>NO INTERACTIONS LOGGED YET.</p>
            </div>
          )}
        </TabsContent>

        {/* Tab 6: AI Brief */}
        <TabsContent value="brief" className="space-y-6 outline-none">
          <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 
                className="text-[28px] sm:text-[32px] font-black uppercase text-black m-0 mb-2 leading-none"
                style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)" }}
              >
                PRE-CONVERSATION BRIEF
              </h3>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#333333', margin: 0 }}>
                GENERATE A RAPID AI DOSSIER SUMMARIZING RECENT DEVELOPMENTS BEFORE YOU REACH OUT.
              </p>
            </div>
            
            <button 
              onClick={generateBrief} 
              disabled={aiLoading}
              style={{ alignSelf: 'flex-start', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#CCFF00', color: '#000000', border: '4px solid #000000', boxShadow: '6px 6px 0px #000000', padding: '16px 32px', cursor: aiLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'transform 0.1s, box-shadow 0.1s' }}
              className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000]"
            >
              {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {aiLoading ? "GENERATING..." : "GENERATE BRIEF"}
            </button>

            {brief && (
              <div style={{ background: '#111111', border: '4px solid #FFFFFF', padding: '24px', color: '#FFFFFF', fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {brief}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 7: Chat */}
        <TabsContent value="chat" className="outline-none">
          <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '24px' }}>
            <PersonChat personId={person.id} personName={person.name} personRelationship={person.relationship} />
          </div>
        </TabsContent>

        {/* Tab 8: Edit Profile */}
        <TabsContent value="edit" className="outline-none">
          <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '32px' }}>
            <EditPersonForm person={person} onSave={update} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
