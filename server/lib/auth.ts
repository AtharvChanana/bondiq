import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import { prisma } from "@/server/lib/prisma"

export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Server Components cannot always mutate cookies; middleware refreshes them.
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch {
            // Server Components cannot always mutate cookies; middleware refreshes them.
          }
        },
      },
    }
  )
}

export async function getServerSession() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const cookieStore = cookies()
    const isLoggedIn = cookieStore.get("bondiq_logged_in")?.value === "true"
    if (!isLoggedIn) return null

    const mockUserId = "local_dev_user_id"
    const dbUser = await prisma.user.upsert({
      where: { id: mockUserId },
      update: {
        email: "developer@bondiq.com",
        name: "Local Developer",
        avatar: null,
      },
      create: {
        id: mockUserId,
        email: "developer@bondiq.com",
        name: "Local Developer",
        avatar: null,
      },
    })
    return { user: dbUser, supabaseUser: { id: mockUserId, email: "developer@bondiq.com" } as any }
  }

  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return null

  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email,
      name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? null,
      avatar: user.user_metadata?.avatar_url ?? null,
    },
    create: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? null,
      avatar: user.user_metadata?.avatar_url ?? null,
    },
  })

  return { user: dbUser, supabaseUser: user }
}
