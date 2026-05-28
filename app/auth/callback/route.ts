import { NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"
import { EmailService } from "@/server/services/email.service"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = createSupabaseServerClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    
    // If we got a user, check if this is their first login
    if (data?.user?.email) {
      const existingUser = await prisma.user.findUnique({ where: { id: data.user.id } })
      
      if (!existingUser) {
        // Await the email so Vercel serverless doesn't kill the process prematurely
        const userName = data.user.user_metadata?.name ?? data.user.user_metadata?.full_name ?? "there"
        await EmailService.sendWelcomeEmail(data.user.email, userName)
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
