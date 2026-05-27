"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { create } from "zustand"

import { AuthClientService } from "@/features/auth/services/auth.service"
import type { AuthState } from "@/features/auth/types"

// Build-time constants for Supabase configuration
// These are replaced at build time by Next.js, so they're always correct
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const HAS_SUPABASE = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))

export function useAuth() {
  const router = useRouter()
  const { user, loading, setUser, setLoading } = useAuthStore()

  const hasSupabase = HAS_SUPABASE

  useEffect(() => {
    if (!hasSupabase) {
      // Mock local session check (only used when no Supabase keys are configured)
      const isLoggedIn = typeof document !== "undefined" && document.cookie.includes("bondiq_logged_in=true")
      if (isLoggedIn) {
        setUser({ 
          id: "local_dev_user_id", 
          email: "developer@bondiq.com", 
          user_metadata: { name: "Local Developer" } 
        } as any)
      } else {
        setUser(null)
      }
      setLoading(false)
      return
    }

    let supabase
    try {
      supabase = AuthClientService.getClient()
    } catch {
      setUser(null)
      setLoading(false)
      return
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router, setLoading, setUser, hasSupabase])

  const mockLogin = async (email: string, password: string) => {
    document.cookie = "bondiq_logged_in=true; path=/; max-age=31536000"
    setUser({ 
      id: "local_dev_user_id", 
      email: email || "developer@bondiq.com", 
      user_metadata: { name: "Local Developer" } 
    } as any)
    router.push("/dashboard")
    router.refresh()
  }

  const mockSignup = async (email: string, password: string, name?: string) => {
    document.cookie = "bondiq_logged_in=true; path=/; max-age=31536000"
    setUser({ 
      id: "local_dev_user_id", 
      email: email || "developer@bondiq.com", 
      user_metadata: { name: name || "Local Developer" } 
    } as any)
    router.push("/dashboard")
    router.refresh()
  }

  const mockLogout = async () => {
    document.cookie = "bondiq_logged_in=false; path=/; max-age=31536000"
    setUser(null)
    router.push("/login")
    router.refresh()
  }

  const mockVerifySignupOtp = async (email: string, token: string) => {
    document.cookie = "bondiq_logged_in=true; path=/; max-age=31536000"
    setUser({ 
      id: "local_dev_user_id", 
      email: email || "developer@bondiq.com", 
      user_metadata: { name: "Local Developer" } 
    } as any)
    router.push("/dashboard")
    router.refresh()
  }

  const mockReauthenticate = async (email: string, password: string) => {
    // mock success
  }

  const mockUpdatePassword = async (password: string) => {
    // mock success
  }

  return {
    user,
    loading,
    login: hasSupabase ? AuthClientService.login : mockLogin,
    signup: hasSupabase ? AuthClientService.signup : mockSignup,
    verifySignupOtp: hasSupabase ? AuthClientService.verifySignupOtp : mockVerifySignupOtp,
    reauthenticate: hasSupabase ? AuthClientService.reauthenticate : mockReauthenticate,
    updatePassword: hasSupabase ? AuthClientService.updatePassword : mockUpdatePassword,
    loginWithGoogle: hasSupabase ? AuthClientService.loginWithGoogle : async () => mockLogin("google_user@gmail.com", ""),
    logout: hasSupabase ? AuthClientService.logout : mockLogout,
  }
}

