"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Zap, User, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmModal } from "@/shared/components/ConfirmModal"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

const QUICK_PROMPTS = [
  "Who should I reach out to today?",
  "Any upcoming birthdays or milestones?",
  "Which relationships need the most attention?",
  "Draft a check-in message for someone I haven't spoken to in a while",
  "Summarise my strongest relationships",
]

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { loadHistory() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  async function loadHistory() {
    try {
      const res = await fetch("/api/ai/chat")
      if (res.ok) {
        const data = await res.json()
        setMessages(data.map((m: { id: string; role: "user" | "assistant"; content: string }) => ({ id: m.id, role: m.role, content: m.content })))
      }
    } catch { /* silent */ }
    finally { setLoadingHistory(false) }
  }

  async function sendMessage(text?: string) {
    const messageText = (text ?? input).trim()
    if (!messageText || loading) return

    const userMsg: Message = { role: "user", content: messageText, id: Date.now().toString() }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = { role: "assistant", content: "", id: assistantId }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput("")
    setLoading(true)

    const history = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, history }),
      })
      if (!res.ok) throw new Error("Could not send message")
      const contentType = res.headers.get("content-type") ?? ""
      if (contentType.includes("text/plain")) {
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)))
        }
      } else {
        const data = await res.json()
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: data.reply } : m)))
      }
    } catch {
      toast.error("Could not get a response")
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setLoading(false)
    }
  }

  async function handleClearChat() {
    setShowClearConfirm(false)
    try {
      setMessages([])
      await fetch("/api/ai/chat", { method: "DELETE" })
      toast.success("Chat history cleared")
    } catch {
      toast.error("Failed to clear chat history from server")
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '4px solid #333333', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: '#FFFFFF', border: '4px solid #000000', boxShadow: '6px 6px 0px #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={22} style={{ color: '#000000' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '36px', fontWeight: 400, textTransform: 'uppercase', color: '#FFFFFF', lineHeight: 1, margin: 0 }}>
              ASK BONDIQ
            </h1>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>
              AI KNOWS ALL YOUR RELATIONSHIPS
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#333333', color: '#888888', border: '2px solid #444444', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Trash2 size={12} /> CLEAR
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        title="CLEAR CHAT?"
        description="This will permanently delete your entire conversation history with BondIQ. This action cannot be undone."
        confirmText="CLEAR HISTORY"
        isDanger={true}
        onConfirm={handleClearChat}
        onCancel={() => setShowClearConfirm(false)}
      />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px' }}>
        {loadingHistory ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Loader2 size={24} style={{ color: '#FFFFFF', animation: 'spin 1s linear infinite' }} className="animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', gap: '32px', padding: '48px 0' }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '80px', color: '#FFFFFF', lineHeight: 0.9, marginBottom: '12px' }}>HELLO.</div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', maxWidth: '400px' }}>
                ASK ANYTHING ABOUT YOUR RELATIONSHIPS — REACH OUTS, BIRTHDAYS, GIFTS, ADVICE.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '8px', width: '100%', maxWidth: '520px' }}>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  style={{ textAlign: 'left', background: '#1A1A1A', color: '#FFFFFF', border: '2px solid #333333', padding: '12px 16px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 500, transition: 'border-color 0.1s, box-shadow 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFFFFF'; e.currentTarget.style.boxShadow = '4px 4px 0px #FFFFFF' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#333333'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  → {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', gap: '12px', justifyContent: msg.role === "user" ? 'flex-end' : 'flex-start' }}>
                {msg.role === "assistant" && (
                  <div style={{ width: '32px', height: '32px', background: '#FFFFFF', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                    <Zap size={14} style={{ color: '#000000' }} />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '78%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    ...(msg.role === "user"
                      ? { background: '#FFFFFF', color: '#000000', border: '4px solid #000000', boxShadow: '4px 4px 0px #000000' }
                      : { background: '#FFFFFF', color: '#000000', border: '4px solid #000000', boxShadow: '4px 4px 0px #000000' }
                    ),
                  }}
                >
                  {msg.content || (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888888' }}>
                      <Loader2 size={14} className="animate-spin" /> Thinking...
                    </span>
                  )}
                </div>
                {msg.role === "user" && (
                  <div style={{ width: '32px', height: '32px', background: '#333333', border: '2px solid #444444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                    <User size={14} style={{ color: '#888888' }} />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0, borderTop: '4px solid #333333', paddingTop: '16px' }}>
        {messages.length > 0 && !loading && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {QUICK_PROMPTS.slice(0, 3).map((p) => (
              <button key={p} onClick={() => sendMessage(p)} style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', background: '#1A1A1A', color: '#888888', border: '2px solid #333333', padding: '4px 10px', cursor: 'pointer' }}>
                {p.slice(0, 30)}…
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              e.target.style.height = "auto"
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="ASK ANYTHING... (ENTER TO SEND)"
            rows={1}
            disabled={loading}
            style={{ flex: 1, resize: 'none', background: '#FFFFFF', color: '#000000', border: '4px solid #000000', borderRadius: 0, fontFamily: "'Space Mono', monospace", fontSize: '13px', padding: '12px 14px', outline: 'none', minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{ width: '52px', height: '52px', background: '#FFFFFF', color: '#000000', border: '4px solid #000000', boxShadow: '6px 6px 0px #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer', opacity: (!input.trim() || loading) ? 0.5 : 1, flexShrink: 0 }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', marginTop: '8px' }}>
          SHIFT+ENTER FOR NEW LINE · AI HAS FULL RELATIONSHIP CONTEXT
        </p>
      </div>
    </div>
  )
}
