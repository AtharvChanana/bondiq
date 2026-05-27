"use client"

import { useState } from "react"
import Link from "next/link"
import { GitFork, X, Heart, Clock, MessageSquare, User, Activity, ChevronRight } from "lucide-react"

import { RelationshipGraph } from "@/features/graph/components/RelationshipGraph"
import { useGraphData } from "@/features/graph/hooks/useGraphData"
import type { GraphNode } from "@/features/graph/types"
import { EmptyState } from "@/shared/components/EmptyState"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { PageHeader } from "@/shared/components/PageHeader"
import { getHealthColor, getHealthTone } from "@/shared/constants/health-score"
import { RELATIONSHIP_TYPE_META } from "@/shared/constants/relationship-types"

function formatDate(d: string | Date | null): string {
  if (!d) return "Never"
  const date = new Date(d)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const days = Math.floor(diffMs / 86_400_000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

function HealthBar({ score }: { score: number }) {
  const color = getHealthColor(score)
  return (
    <div style={{ width: '100%', height: '6px', background: '#333333' }}>
      <div
        style={{
          width: `${score}%`,
          height: '100%',
          background: color,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  )
}

function DossierPanel({ node, onClose }: { node: GraphNode; onClose: () => void }) {
  const healthColor = getHealthColor(node.healthScore)
  const healthTone = getHealthTone(node.healthScore)
  const relMeta = RELATIONSHIP_TYPE_META[node.relationship as keyof typeof RELATIONSHIP_TYPE_META]

  const toneLabel = healthTone === "healthy" ? "HEALTHY" : healthTone === "at-risk" ? "AT RISK" : "FADING"

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#111111',
      borderLeft: '4px solid #FFFFFF',
      zIndex: 30,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-8px 0 0 #000000',
    }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '4px solid #333333', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '28px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', margin: 0, lineHeight: 1 }}>
            {node.name}
          </h2>
          {relMeta && (
            <span style={{
              fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '3px 8px',
              background: `${relMeta.graphColor}20`,
              color: relMeta.graphColor,
              border: `2px solid ${relMeta.graphColor}`,
              display: 'inline-block',
              marginTop: '8px',
            }}>
              {relMeta.label}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          style={{ background: '#FFFFFF', border: '2px solid #000000', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <X size={14} color="#000000" />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Health Score */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#777777' }}>
              HEALTH SCORE
            </span>
            <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 6px', color: healthColor, background: `${healthColor}15`, border: `1px solid ${healthColor}` }}>
              {toneLabel}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '48px', fontWeight: 900, color: healthColor, lineHeight: 1 }}>
              {node.healthScore}
            </span>
            <div style={{ flex: 1 }}>
              <HealthBar score={node.healthScore} />
            </div>
          </div>
        </div>

        {/* Info panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#1A1A1A', border: '2px solid #333333', padding: '14px' }}>
            <div style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555555', marginBottom: '6px' }}>
              LAST CONTACT
            </div>
            <div style={{ fontFamily: "var(--font-jakarta, sans-serif)", fontSize: '14px', color: '#FFFFFF' }}>
              {formatDate(node.lastContactedAt)}
            </div>
          </div>

          {node.currentSituation && (
            <div style={{ background: '#1A1A1A', border: '2px solid #333333', padding: '14px' }}>
              <div style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555555', marginBottom: '6px' }}>
                CURRENT SITUATION
              </div>
              <div style={{ fontFamily: "var(--font-jakarta, sans-serif)", fontSize: '13px', color: '#CCCCCC', lineHeight: 1.5 }}>
                {node.currentSituation}
              </div>
            </div>
          )}

          {node.whatMattersToThem && (
            <div style={{ background: '#1A1A1A', border: '2px solid #333333', padding: '14px' }}>
              <div style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555555', marginBottom: '6px' }}>
                WHAT MATTERS TO THEM
              </div>
              <div style={{ fontFamily: "var(--font-jakarta, sans-serif)", fontSize: '13px', color: '#CCCCCC', lineHeight: 1.5 }}>
                {node.whatMattersToThem}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '4px solid #333333' }}>
        <Link
          href={`/people/${node.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px',
            fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: '#CCFF00',
            color: '#000000',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px #000000',
            textDecoration: 'none',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          }}
        >
          <MessageSquare size={14} />
          VIEW FULL PROFILE
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export function GraphPage() {
  const { data, loading } = useGraphData()
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: '24px' }}>
        <PageHeader
          title="Relationship Graph"
          description="A living map of your social world. Click any node to explore."
        />
      </div>

      {/* Stats bar */}
      {!loading && data.nodes.length > 1 && (
        <div className="grid grid-cols-2 md:flex md:flex-wrap mb-6 border-4 border-white">
          {(() => {
            const people = data.nodes.filter((n) => !n.isCenter)
            const avgHealth = people.length
              ? Math.round(people.reduce((s, n) => s + n.healthScore, 0) / people.length)
              : 0
            const healthy = people.filter((n) => n.healthScore > 70).length
            const fading = people.filter((n) => n.healthScore < 40).length

            return (
              <>
                <div className="flex-1 p-3 md:p-4 border-r-4 border-white md:border-[#333] bg-[#1A1A1A]">
                  <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555555', display: 'block', marginBottom: '4px' }}>
                    CONNECTIONS
                  </span>
                  <span style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', fontWeight: 900, color: '#FFFFFF' }}>{people.length}</span>
                </div>
                <div className="flex-1 p-3 md:p-4 border-r-0 md:border-r-4 border-b-4 md:border-b-0 border-white md:border-[#333] bg-[#111111]">
                  <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555555', display: 'block', marginBottom: '4px' }}>
                    AVG HEALTH
                  </span>
                  <span style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', fontWeight: 900, color: getHealthColor(avgHealth) }}>{avgHealth}</span>
                </div>
                <div className={`flex-1 p-3 md:p-4 border-r-4 md:border-r-${fading > 0 ? '4' : '0'} border-white md:border-[#333] bg-[#1A1A1A]`}>
                  <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555555', display: 'block', marginBottom: '4px' }}>
                    HEALTHY
                  </span>
                  <span style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', fontWeight: 900, color: '#22c55e' }}>{healthy}</span>
                </div>
                {fading > 0 && (
                  <div className="flex-1 p-3 md:p-4 bg-[#111111]">
                    <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555555', display: 'block', marginBottom: '4px' }}>
                      FADING
                    </span>
                    <span style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', fontWeight: 900, color: '#ef4444' }}>{fading}</span>
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '500px', border: '4px solid #FFFFFF', background: '#0A0A0A' }}>
          <LoadingSpinner />
        </div>
      ) : data.nodes.length > 0 ? (
        <div className="flex flex-col md:flex-row border-4 border-white h-[calc(100vh-220px)] min-h-[500px] relative overflow-hidden">
          {/* Graph canvas — shrinks when panel opens */}
          <div className="flex-1 min-w-0 relative overflow-hidden w-full h-full">
            <RelationshipGraph
              data={data}
              onNodeSelect={setSelectedNode}
              selectedNodeId={selectedNode?.id ?? null}
            />
          </div>
          {/* Panel sits BESIDE the canvas on desktop, OVERLAYS on mobile */}
          {selectedNode && (
            <div className="absolute inset-x-0 bottom-0 md:relative md:w-[320px] md:h-full flex-shrink-0 md:border-l-4 border-t-4 md:border-t-0 border-white overflow-hidden flex flex-col h-[60%] md:h-auto z-40 bg-[#111111] shadow-[0_-8px_30px_rgba(0,0,0,0.8)] md:shadow-none animate-in slide-in-from-bottom-full md:slide-in-from-right duration-300">
              <DossierPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={GitFork}
          title="No graph yet"
          description="Add people and log interactions to make the graph come alive."
        />
      )}
    </div>
  )
}