"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Sparkles, User, Trash2, Bot, Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface PersonChatProps {
  personId: string
  personName: string
  personRelationship: string
}

function getQuickPrompts(name: string) {
  return [
    `Draft a casual check-in message for ${name}`,
    `What should I talk to ${name} about?`,
    `When did I last see ${name} and what did we discuss?`,
    `Remind me of important things about ${name}`,
    `What upcoming milestones does ${name} have?`,
  ]
}

export function PersonChat({ personId, personName, personRelationship }: PersonChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { copy } = useCopyToClipboard()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function send(text?: string) {
    const messageText = (text ?? input).trim()
    if (!messageText || loading) return

    const userMsg: Message = { role: "user", content: messageText, id: Date.now().toString() }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = { role: "assistant", content: "", id: assistantId }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput("")
    setLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    const history = messages.slice(-12).map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch("/api/ai/person-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId, message: messageText, history }),
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
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
          )
        }
      } else {
        const data = await res.json()
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: data.reply } : m))
        )
      }
    } catch {
      toast.error("Could not get a response")
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setLoading(false)
    }
  }

  const prompts = getQuickPrompts(personName)
  const isEmpty = messages.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 18rem)', minHeight: '400px' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px' }}>
        {isEmpty ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '32px 0', gap: '32px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '80px', height: '80px', background: '#000000', border: '4px solid #CCFF00', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '8px 8px 0px #333333' }}>
                <Sparkles size={32} color="#CCFF00" />
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', margin: '0 0 8px 0' }}>
                CHAT ABOUT {personName.toUpperCase()}
              </p>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 500, color: '#555555', maxWidth: '300px', margin: '0 auto', lineHeight: 1.5 }}>
                I KNOW EVERYTHING ABOUT YOUR RELATIONSHIP WITH {personName.toUpperCase()}. ASK ME ANYTHING — MEMORIES, MESSAGE DRAFTS, ADVICE, REMINDERS.
              </p>
            </div>
            <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  style={{ width: '100%', textAlign: 'left', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '16px', background: '#FFFFFF', color: '#000000', border: '4px solid #000000', cursor: 'pointer', boxShadow: '4px 4px 0px #333333' }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{ display: 'flex', gap: '16px', justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
              >
                {msg.role === "assistant" && (
                  <div style={{ width: '32px', height: '32px', background: '#CCFF00', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                    <Bot size={16} color="#000000" />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '80%', alignItems: msg.role === "user" ? "flex-end" : "flex-start", position: 'relative' }}>
                  <div
                    style={{
                      padding: '16px',
                      fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
                      fontSize: '14px',
                      fontWeight: 600,
                      lineHeight: 1.5,
                      background: msg.role === "user" ? "#000000" : "#FFFFFF",
                      color: msg.role === "user" ? "#FFFFFF" : "#000000",
                      border: msg.role === "user" ? "4px solid #000000" : "4px solid #000000",
                      boxShadow: msg.role === "user" ? "4px 4px 0px #CCFF00" : "4px 4px 0px #333333"
                    }}
                  >
                    {msg.content || (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: msg.role === "user" ? '#CCCCCC' : '#555555' }}>
                        <Loader2 className="animate-spin" size={14} />
                        <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>THINKING...</span>
                      </span>
                    )}
                  </div>
                  {msg.role === "assistant" && msg.content && (
                    <button
                      onClick={() => { copy(msg.content); toast.success("Copied to clipboard!") }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#555555', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}
                    >
                      <Copy size={12} /> COPY
                    </button>
                  )}
                </div>

                {msg.role === "user" && (
                  <div style={{ width: '32px', height: '32px', background: '#000000', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                    <User size={16} color="#FFFFFF" />
                  </div>
                )}
              </div>
            ))}

            {!loading && messages.length >= 2 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 0 16px 0' }}>
                {prompts.slice(0, 3).map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '8px 12px', background: '#FFFFFF', color: '#000000', border: '2px solid #000000', cursor: 'pointer' }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input + clear */}
      <div style={{ flexShrink: 0, paddingTop: '16px', borderTop: '4px solid #000000' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              e.target.style.height = "auto"
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={`ASK ABOUT ${personName.toUpperCase()}... (ENTER TO SEND)`}
            rows={1}
            disabled={loading}
            style={{ flex: 1, resize: 'none', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', minHeight: '52px', maxHeight: '100px', outline: 'none' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{ width: '52px', height: '52px', background: '#CCFF00', border: '4px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer', opacity: (!input.trim() || loading) ? 0.5 : 1, boxShadow: '4px 4px 0px #333333' }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} color="#000000" /> : <Send size={20} color="#000000" />}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
          <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#555555', margin: 0 }}>
            AI KNOWS ALL MEMORIES, MILESTONES & INTERACTIONS WITH {personName.toUpperCase()}
          </p>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#FF3333', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
            >
              <Trash2 size={12} /> CLEAR
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
