"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { OAuthButton } from "@/features/auth/components/OAuthButton"
import { useAuth } from "@/features/auth/hooks/useAuth"

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginInput = z.infer<typeof LoginSchema>

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#FFFFFF',
  color: '#000000',
  border: '4px solid #000000',
  borderRadius: 0,
  fontFamily: "'Space Mono', monospace",
  fontSize: '13px',
  padding: '12px 14px',
  outline: 'none',
  display: 'block',
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  color: '#888888',
  display: 'block',
  marginBottom: '6px',
}

const errorStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: '10px',
  color: '#FF3B3B',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginTop: '4px',
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/dashboard"
  const { login, loginWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const form = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) })

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

  async function onSubmit(values: LoginInput) {
    setLoading(true)
    try {
      await login(values.email, values.password)
      router.push(next)
      router.refresh()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Could not log in"
      if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("credentials")) {
        toast.error("Invalid email or password.")
      } else if (msg.toLowerCase().includes("email") && msg.toLowerCase().includes("confirm")) {
        toast.error("Please confirm your email before logging in.")
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
          <label style={labelStyle} htmlFor="login-email">EMAIL ADDRESS</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="YOU@EXAMPLE.COM"
            style={inputStyle}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p style={errorStyle}>{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label style={labelStyle} htmlFor="login-password">PASSWORD</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            style={inputStyle}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p style={errorStyle}>{form.formState.errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: '#FFFFFF',
            color: '#000000',
            border: '4px solid #000000',
            boxShadow: '8px 8px 0px #000000',
            padding: '14px 24px',
            width: '100%',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          }}
        >
          {loading ? <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> : "SIGN IN →"}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, height: '2px', background: '#333333' }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>OR</span>
        <div style={{ flex: 1, height: '2px', background: '#333333' }} />
      </div>

      <OAuthButton onClick={handleGoogleLogin} loading={loading} />

      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#666666', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        NEW HERE?{" "}
        <Link href="/signup" style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}>
          CREATE ACCOUNT
        </Link>
      </p>
    </div>
  )
}
