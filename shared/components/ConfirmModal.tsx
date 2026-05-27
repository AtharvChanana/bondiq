"use client"

import { AlertTriangle } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isDanger?: boolean
}

export function ConfirmModal({ 
  isOpen, 
  title, 
  description, 
  confirmText = "CONFIRM", 
  cancelText = "CANCEL", 
  onConfirm, 
  onCancel, 
  isDanger = true 
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)' }} onClick={onCancel} />
      <div 
        style={{ position: 'relative', background: '#FFFFFF', border: '4px solid #000000', boxShadow: '12px 12px 0px #000000', padding: '32px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: isDanger ? '#FF3333' : '#CCFF00', border: '4px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} color="#000000" />
          </div>
          <h2 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', margin: 0, lineHeight: 1 }}>
            {title}
          </h2>
        </div>
        
        {description && (
          <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#333333', marginBottom: '32px' }}>
            {description}
          </p>
        )}
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 'auto' }}>
          <button 
            onClick={onCancel} 
            className="hover:bg-gray-100 transition-colors"
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '10px 20px', background: '#FFFFFF', color: '#000000', border: '2px solid #000000', cursor: 'pointer' }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_#000000] transition-all"
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', padding: '10px 20px', background: isDanger ? '#FF3333' : '#000000', color: isDanger ? '#000000' : '#FFFFFF', border: '2px solid #000000', cursor: 'pointer' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
