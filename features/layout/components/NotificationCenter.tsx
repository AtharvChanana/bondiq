"use client"

import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import type { NudgeDTO } from "@/shared/types"
import { formatDate } from "@/shared/utils/date.utils"

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<NudgeDTO[]>([])
  const [loading, setLoading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch history only when opening
  useEffect(() => {
    if (!isOpen) return
    let mounted = true
    setLoading(true)
    fetch("/api/nudges?history=true")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setHistory(data)
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative flex items-center" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:[box-shadow:4px_4px_0px_#CCFF00] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:1px_1px_0px_#CCFF00] transition-all"
        style={{
          width: '36px',
          height: '36px',
          background: isOpen ? '#CCFF00' : '#FFFFFF',
          border: '3px solid #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#000000',
        }}
      >
        <Bell size={16} strokeWidth={3} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-[120%] right-0 w-[320px] max-w-[calc(100vw-48px)] bg-white border-[4px] border-black shadow-[8px_8px_0px_#000000] z-50 flex flex-col"
          style={{ maxHeight: '400px' }}
        >
          <div className="bg-black text-white p-3 border-b-[4px] border-black flex justify-between items-center shrink-0">
            <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PAST NOTIFICATIONS
            </span>
          </div>

          <div className="overflow-y-auto flex-1 flex flex-col" style={{ background: '#F9F9F9' }}>
            {loading ? (
              <div className="p-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">
                LOADING HISTORY...
              </div>
            ) : history.length === 0 ? (
              <div className="p-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">
                NO PAST NOTIFICATIONS.
              </div>
            ) : (
              history.map((nudge) => (
                <div key={nudge.id} className="p-3 border-b-[2px] border-gray-200 last:border-b-0 hover:bg-white transition-colors flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '11px', fontWeight: 700, color: '#000000', textTransform: 'uppercase' }}>
                      {nudge.person?.name}
                    </span>
                    <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', fontWeight: 700, background: nudge.status === 'acted' ? '#CCFF00' : '#888888', padding: '2px 6px', border: '2px solid #000000', color: '#000000', textTransform: 'uppercase' }}>
                      {nudge.status}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '12px', color: '#333333', lineHeight: 1.4, margin: 0 }}>
                    {nudge.reason}
                  </p>
                  <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '9px', color: '#888888', textTransform: 'uppercase' }}>
                    {formatDate(nudge.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
