"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { OAuthButton } from "@/features/auth/components/OAuthButton"
import { useAuth } from "@/features/auth/hooks/useAuth"

const SignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

type SignupInput = z.infer<typeof SignupSchema>

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
const errorStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#FF3B3B',
  textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginTop: '4px',
}

export function SignupForm() {
  const router = useRouter()
  const { signup, loginWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const form = useForm<SignupInput>({ resolver: zodResolver(SignupSchema) })

  async function handleGoogleLogin() {
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Could not sign in with Google"
      toast.error(msg)
      setLoading(false)
    }
  }

  async function onSubmit(values: SignupInput) {
    setLoading(true)
    try {
      await signup(values.email, values.password, values.name)
      toast.success(`Welcome to BondIQ, ${values.name}!`)
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Could not sign up"
      if (msg.toLowerCase().includes("already")) {
        toast.error("Account already exists. Try logging in.")
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <label style={labelStyle} htmlFor="signup-name">YOUR NAME</label>
          <input id="signup-name" type="text" autoComplete="name" placeholder="FULL NAME" style={inputStyle} {...form.register("name")} />
          {form.formState.errors.name && <p style={errorStyle}>{form.formState.errors.name.message}</p>}
        </div>
        <div>
          <label style={labelStyle} htmlFor="signup-email">EMAIL ADDRESS</label>
          <input id="signup-email" type="email" autoComplete="email" placeholder="YOU@EXAMPLE.COM" style={inputStyle} {...form.register("email")} />
          {form.formState.errors.email && <p style={errorStyle}>{form.formState.errors.email.message}</p>}
        </div>
        <div>
          <label style={labelStyle} htmlFor="signup-password">PASSWORD</label>
          <input id="signup-password" type="password" autoComplete="new-password" placeholder="MIN. 6 CHARACTERS" style={inputStyle} {...form.register("password")} />
          {form.formState.errors.password && <p style={errorStyle}>{form.formState.errors.password.message}</p>}
        </div>
        <button
          type="submit" disabled={loading}
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#FFFFFF', color: '#000000', border: '4px solid #000000', boxShadow: '8px 8px 0px #000000', padding: '14px 24px', width: '100%', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> : "CREATE ACCOUNT →"}
        </button>
      </form>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, height: '2px', background: '#333333' }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>OR</span>
        <div style={{ flex: 1, height: '2px', background: '#333333' }} />
      </div>
      <OAuthButton onClick={handleGoogleLogin} loading={loading} />
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#666666', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        ALREADY HAVE AN ACCOUNT?{" "}
        <Link href="/login" style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}>SIGN IN</Link>
      </p>
    </div>
  )
}
