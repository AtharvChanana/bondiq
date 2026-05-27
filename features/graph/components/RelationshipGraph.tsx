"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { GraphData, GraphNode } from "@/features/graph/types"
import { RELATIONSHIP_TYPE_META } from "@/shared/constants/relationship-types"

interface RelationshipGraphProps {
  data: GraphData
  onNodeSelect?: (node: GraphNode) => void
  selectedNodeId?: string | null
}

const NODE_R       = 26    // person node visual + click radius
const CENTER_R     = 32    // YOU node radius
const ORBIT        = 190   // initial orbit distance
const REPULSION    = 9000  // how strongly nodes push each other away
const LINK_DIST    = 200   // target distance from YOU to each person node
const LINK_STR     = 0.04  // link spring strength
const DAMPING      = 0.82  // velocity damping (friction)
const DRAG_THRESH  = 4     // px movement before mousedown counts as drag not click

interface NodeSim {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  isCenter: boolean
  data: GraphNode
  color: string
}

function initNodes(
  graphData: GraphData,
  cx: number,
  cy: number
): NodeSim[] {
  const personNodes = graphData.nodes.filter((n) => !n.isCenter)
  const total = personNodes.length

  return graphData.nodes.map((n) => {
    const color =
      RELATIONSHIP_TYPE_META[n.relationship as keyof typeof RELATIONSHIP_TYPE_META]
        ?.graphColor ?? "#6366f1"

    if (n.isCenter) {
      return { id: n.id, x: cx, y: cy, vx: 0, vy: 0, isCenter: true, data: n, color: "#CCFF00" }
    }

    const idx = personNodes.indexOf(n)
    const angle = -Math.PI / 2 + (2 * Math.PI * idx) / Math.max(total, 1)
    return {
      id: n.id,
      x: cx + Math.cos(angle) * ORBIT,
      y: cy + Math.sin(angle) * ORBIT,
      vx: 0,
      vy: 0,
      isCenter: false,
      data: n,
      color,
    }
  })
}

function tickSimulation(
  nodes: NodeSim[],
  cx: number,
  cy: number,
  draggingId: string | null
): NodeSim[] {
  return nodes.map((node) => {
    // Center node is always fixed at cx, cy
    if (node.isCenter) return { ...node, x: cx, y: cy, vx: 0, vy: 0 }
    // Dragged node: position is set externally, zero velocity
    if (node.id === draggingId) return { ...node, vx: 0, vy: 0 }

    let fx = 0
    let fy = 0

    // Repulsion from every other node (including center)
    for (const other of nodes) {
      if (other.id === node.id) continue
      const dx = node.x - other.x
      const dy = node.y - other.y
      const distSq = dx * dx + dy * dy || 0.01
      const dist = Math.sqrt(distSq)
      const force = REPULSION / distSq
      fx += (dx / dist) * force
      fy += (dy / dist) * force
    }

    // Link spring: pull toward center at target distance
    const dx = cx - node.x
    const dy = cy - node.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
    const diff = dist - LINK_DIST
    fx += (dx / dist) * diff * LINK_STR
    fy += (dy / dist) * diff * LINK_STR

    const vx = (node.vx + fx) * DAMPING
    const vy = (node.vy + fy) * DAMPING

    return { ...node, x: node.x + vx, y: node.y + vy, vx, vy }
  })
}

export function RelationshipGraph({ data, onNodeSelect, selectedNodeId }: RelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 800, h: 600 })
  const rafRef       = useRef<number>()
  const nodesRef     = useRef<NodeSim[]>([])
  const draggingRef  = useRef<string | null>(null)
  const dragOffsetRef = useRef({ dx: 0, dy: 0 })
  const mouseDownPos = useRef({ x: 0, y: 0 })
  const didDrag      = useRef(false)
  const [tick, setTick] = useState(0) // force re-render each frame
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const cx = size.w / 2
  const cy = size.h / 2

  // Measure container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) setSize({ w: r.width, h: r.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Re-init nodes when data or container size changes
  useEffect(() => {
    nodesRef.current = initNodes(data, cx, cy)
  }, [data, cx, cy])

  // Run simulation loop
  useEffect(() => {
    const loop = () => {
      nodesRef.current = tickSimulation(nodesRef.current, cx, cy, draggingRef.current)
      setTick((t) => t + 1)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [cx, cy])

  // SVG coordinate helper (accounts for container offset and pan)
  const svgPoint = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: clientX - pan.x, y: clientY - pan.y }
    return { x: clientX - rect.left - pan.x, y: clientY - rect.top - pan.y }
  }, [pan.x, pan.y])

  // Mouse handlers on individual nodes
  const handleNodeMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent, nodeId: string) => {
    e.stopPropagation()
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    const pt = svgPoint(clientX, clientY)
    const node = nodesRef.current.find((n) => n.id === nodeId)
    if (!node) return
    draggingRef.current = nodeId
    dragOffsetRef.current = { dx: node.x - pt.x, dy: node.y - pt.y }
    mouseDownPos.current = { x: clientX, y: clientY }
    didDrag.current = false
  }, [svgPoint])

  // Mouse handler on SVG background (panning)
  const handleSvgMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    draggingRef.current = "BACKGROUND"
    dragOffsetRef.current = { dx: pan.x - clientX, dy: pan.y - clientY }
    mouseDownPos.current = { x: clientX, y: clientY }
    didDrag.current = false
  }, [pan.x, pan.y])

  const handleSvgMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingRef.current) return
    
    // Prevent scrolling when dragging
    if ('touches' in e && draggingRef.current) {
      // Passive event listeners warning might show up, but for simple React touch handlers this is fine to stop basic drift if we were attached as non-passive. 
      // In React 18, touchmove is passive by default on window, but we just want to update position anyway.
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    
    const moved = Math.hypot(clientX - mouseDownPos.current.x, clientY - mouseDownPos.current.y)
    if (moved > DRAG_THRESH) didDrag.current = true

    if (draggingRef.current === "BACKGROUND") {
      setPan({
        x: clientX + dragOffsetRef.current.dx,
        y: clientY + dragOffsetRef.current.dy,
      })
      return
    }

    const pt = svgPoint(clientX, clientY)
    nodesRef.current = nodesRef.current.map((n) =>
      n.id === draggingRef.current
        ? { ...n, x: pt.x + dragOffsetRef.current.dx, y: pt.y + dragOffsetRef.current.dy, vx: 0, vy: 0 }
        : n
    )
  }, [svgPoint])

  const handleSvgMouseUp = useCallback(() => {
    draggingRef.current = null
  }, [])

  const handleNodeClick = useCallback((e: React.MouseEvent | React.TouchEvent, node: NodeSim) => {
    e.stopPropagation()
    if (didDrag.current) {
      didDrag.current = false // Reset
      return // was a drag, not a click
    }
    onNodeSelect?.(node.data)
  }, [onNodeSelect])

  const nodes = nodesRef.current

  // Build link paths
  const centerNode = nodes.find((n) => n.isCenter)
  const personNodes = nodes.filter((n) => !n.isCenter)

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", background: "#0A0A0A", position: "relative", overflow: "hidden" }}
    >
      <svg
        width={size.w}
        height={size.h}
        style={{ display: "block", userSelect: "none", cursor: draggingRef.current ? "grabbing" : "grab", touchAction: "none" }}
        onMouseDown={handleSvgMouseDown}
        onTouchStart={handleSvgMouseDown}
        onMouseMove={handleSvgMouseMove}
        onTouchMove={handleSvgMouseMove}
        onMouseUp={handleSvgMouseUp}
        onTouchEnd={handleSvgMouseUp}
        onMouseLeave={handleSvgMouseUp}
        onTouchCancel={handleSvgMouseUp}
      >
        <g transform={`translate(${pan.x}, ${pan.y})`}>
          {/* ── LINK LINES ─────────────────────────── */}
        {centerNode && personNodes.map((pn) => (
          <line
            key={`link-${pn.id}`}
            x1={centerNode.x} y1={centerNode.y}
            x2={pn.x} y2={pn.y}
            stroke={pn.color}
            strokeWidth={1.5}
            strokeOpacity={0.3}
          />
        ))}

        {/* ── ANIMATED PARTICLES ─────────────────── */}
        {centerNode && personNodes.map((pn, i) => {
          const pathId = `anim-path-${pn.id}`
          const d = `M${centerNode.x},${centerNode.y} L${pn.x},${pn.y}`
          return (
            <g key={`ptcl-${pn.id}`}>
              <defs><path id={pathId} d={d} /></defs>
              {[0, 1.2].map((offset, j) => (
                <circle key={j} r={2.5} fill={pn.color} opacity={0.85}>
                  <animateMotion dur="2.2s" repeatCount="indefinite" begin={`${i * 0.5 + offset}s`}>
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" repeatCount="indefinite" begin={`${i * 0.5 + offset}s`} />
                </circle>
              ))}
            </g>
          )
        })}

        {/* ── CENTER NODE (YOU) ──────────────────── */}
        {centerNode && (
          <g>
            <circle cx={centerNode.x} cy={centerNode.y} r={CENTER_R + 8} fill="#CCFF00" opacity={0.12} />
            <circle cx={centerNode.x} cy={centerNode.y} r={CENTER_R} fill="#CCFF00" stroke="#fff" strokeWidth={3} />
            <text
              x={centerNode.x} y={centerNode.y}
              textAnchor="middle" dominantBaseline="middle"
              fill="#000" fontSize={11} fontWeight={800}
              fontFamily="'Space Mono', monospace"
              style={{ pointerEvents: "none" }}
            >YOU</text>
          </g>
        )}

        {/* ── PERSON NODES ───────────────────────── */}
        {personNodes.map((pn) => {
          const isSelected = pn.id === selectedNodeId
          const displayName = pn.data.name.length > 13
            ? pn.data.name.slice(0, 13) + "…"
            : pn.data.name

          return (
            <g
              key={pn.id}
              style={{ cursor: "pointer" }}
              onMouseDown={(e) => handleNodeMouseDown(e, pn.id)}
              onTouchStart={(e) => handleNodeMouseDown(e, pn.id)}
              onClick={(e) => handleNodeClick(e, pn)}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle cx={pn.x} cy={pn.y} r={NODE_R + 10} fill="#CCFF00" />
              )}
              {/* Glow */}
              <circle cx={pn.x} cy={pn.y} r={NODE_R + 5} fill={pn.color} opacity={0.18} />
              {/* Main circle */}
              <circle cx={pn.x} cy={pn.y} r={NODE_R} fill={pn.color} stroke="#fff" strokeWidth={2.5} />
              {/* Label pill */}
              <rect
                x={pn.x - 46} y={pn.y + NODE_R + 5}
                width={92} height={18}
                fill="rgba(0,0,0,0.85)" stroke="#333" strokeWidth={0.5} rx={2}
              />
              <text
                x={pn.x} y={pn.y + NODE_R + 15}
                textAnchor="middle"
                fill="#fff" fontSize={9} fontWeight={700}
                fontFamily="'Space Mono', monospace"
                style={{ pointerEvents: "none" }}
              >
                {displayName}
              </text>
            </g>
          )
        })}
        </g>
      </svg>

      {/* ── LEGEND ─────────────────────────────── */}
      <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", flexWrap: "wrap", gap: 6, pointerEvents: "none" }}>
        {Object.entries(RELATIONSHIP_TYPE_META).map(([id, meta]) => (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#111", padding: "5px 10px", border: "2px solid #333" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.graphColor, border: "1px solid #555" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "#aaa", letterSpacing: "0.05em" }}>
              {meta.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}