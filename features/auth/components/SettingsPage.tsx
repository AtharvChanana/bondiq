"use client"

import { useRouter } from "next/navigation"
import { LogOut, KeyRound, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { ConfirmModal } from "@/shared/components/ConfirmModal"

export function SettingsPage() {
  const router = useRouter()
  const { user, logout, reauthenticate, updatePassword } = useAuth()
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Password change state
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  async function handleLogout() {
    setShowLogoutConfirm(false)
    await logout()
    router.push("/login")
    router.refresh()
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!oldPassword || !newPassword) {
      toast.error("Both fields are required.")
      return
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.")
      return
    }

    setLoading(true)
    try {
      // 1. Verify old password by reauthenticating
      if (user?.email) {
        await reauthenticate(user.email, oldPassword)
      } else {
        throw new Error("User email not found.")
      }
      
      // 2. Update to new password
      await updatePassword(newPassword)
      
      toast.success("Password updated successfully!")
      setOldPassword("")
      setNewPassword("")
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Could not update password"
      if (msg.toLowerCase().includes("invalid login credentials") || msg.toLowerCase().includes("invalid credentials")) {
        toast.error("Incorrect current password.")
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  // Get initial of email for user profile badge
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U"

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#FFFFFF', color: '#000000',
    border: '4px solid #000000', borderRadius: 0,
    fontFamily: "'Space Mono', monospace", fontSize: '13px',
    padding: '12px 14px', outline: 'none', display: 'block',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700,
    textTransform: 'uppercase' as const, letterSpacing: '0.1em',
    color: '#888888', display: 'block', marginBottom: '6px',
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '48px', borderBottom: '4px solid #FFFFFF', paddingBottom: '24px' }}>
        <h1 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', margin: '0 0 8px 0', lineHeight: 0.9 }}>
          SETTINGS
        </h1>
        <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          SYSTEM CONFIGURATION & ACCESS CONTROL.
        </p>
      </div>

      <div style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <h2 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '16px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', borderBottom: '2px solid #000000', paddingBottom: '12px', margin: 0 }}>
          ACCOUNT DOSSIER
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '64px', height: '64px', background: '#000000', color: '#FFFFFF', border: '4px solid #000000', boxShadow: '4px 4px 0px #CCFF00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', fontWeight: 900 }}>
            {userInitial}
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>REGISTERED USER</span>
            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '18px', fontWeight: 700, color: '#000000', margin: '4px 0 0 0' }}>
              {user?.email ?? "active_user@bondiq.com"}
            </p>
          </div>
        </div>

        {/* Password Management */}
        <div style={{ borderTop: '2px solid #EEEEEE', paddingTop: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={16} /> SECURITY & CREDENTIALS
            </h3>
            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '12px', color: '#555555', maxWidth: '400px', lineHeight: 1.5, margin: 0 }}>
              UPDATE YOUR AUTHENTICATION KEY TO MAINTAIN ACCOUNT SECURITY.
            </p>
          </div>
          
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <div>
              <label style={labelStyle} htmlFor="old-password">CURRENT PASSWORD</label>
              <input 
                id="old-password" 
                type="password" 
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="••••••••" 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="new-password">NEW PASSWORD</label>
              <input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="MIN. 6 CHARACTERS" 
                style={inputStyle} 
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#CCFF00', color: '#000000', border: '4px solid #000000', boxShadow: '4px 4px 0px #000000', padding: '12px 24px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.1s, box-shadow 0.1s', opacity: loading ? 0.7 : 1 }}
              className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000]"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "UPDATE PASSWORD"}
            </button>
          </form>
        </div>

        <div style={{ borderTop: '2px solid #EEEEEE', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', margin: '0 0 8px 0' }}>SESSION CONTROLS</h3>
            <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '12px', color: '#555555', maxWidth: '400px', lineHeight: 1.5 }}>
              TERMINATE ACTIVE SESSION. YOUR INTEL REMAINS SECURELY ENCRYPTED IN THE DATABANK.
            </p>
          </div>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#000000', color: '#FFFFFF', border: '4px solid #000000', boxShadow: '4px 4px 0px #FF3333', padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.1s, box-shadow 0.1s' }}
            className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FF3333] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#FF3333]"
          >
            <LogOut size={16} />
            LOG OUT
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '64px', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <p>© {new Date().getFullYear()} BONDIQ. SYSTEM v1.0.0</p>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="LOG OUT?"
        description="Are you sure you want to terminate your active session?"
        confirmText="LOG OUT"
        isDanger={true}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  )
}
