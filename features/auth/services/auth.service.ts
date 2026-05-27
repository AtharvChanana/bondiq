"use client"

import { createBrowserClient } from "@supabase/ssr"

function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are not configured")
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const AuthClientService = {
  getClient: getSupabaseClient,

  async login(email: string, password: string) {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  async signup(email: string, password: string, name?: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    // If user is not confirmed (email confirmation required), signUp still succeeds
    // but the user will need to confirm their email before logging in
    return data
  },

  async verifySignupOtp(email: string, token: string) {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' })
    if (error) throw error
  },

  async reauthenticate(email: string, password: string) {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  async updatePassword(password: string) {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  },

  async loginWithGoogle() {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    })
    if (error) throw error
  },

  async logout() {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}
