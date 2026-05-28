import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const protectedPrefixes = ["/dashboard", "/people", "/log", "/graph", "/settings"]
const authPrefixes = ["/login", "/signup"]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const hasSupabaseEnv =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!hasSupabaseEnv) {
    const isLoggedIn = request.cookies.get("bondiq_logged_in")?.value === "true"
    const path = request.nextUrl.pathname

    // Log analytics in the background (rate limited to once per hour)
    if (!path.startsWith("/api") && !path.startsWith("/_next") && !path.match(/\.(.*)$/)) {
      const isTracked = request.cookies.get("bondiq_tracked")?.value === "true"
      if (!isTracked) {
        const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "Unknown"
        const userAgent = request.headers.get("user-agent") ?? "Unknown"
        const baseUrl = request.nextUrl.origin
        fetch(`${baseUrl}/api/analytics/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path, ip, userAgent, userId: null }),
        }).catch(console.error)

        // Set tracking cookie
        response.cookies.set("bondiq_tracked", "true", { maxAge: 60 * 60 }) // 1 hour
      }
    }

    const isProtected = protectedPrefixes.some((prefix) => path === prefix || path.startsWith(prefix + "/"))
    const isAuthPage = authPrefixes.some((prefix) => path === prefix || path.startsWith(prefix + "/"))

    if (isProtected && !isLoggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("next", path)
      return NextResponse.redirect(url)
    }

    if (isAuthPage && isLoggedIn) {
      const url = request.nextUrl.clone()
      // We can't check email securely here without Supabase env, so default to dashboard.
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: "", ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Log analytics in the background (rate limited to once per hour)
  if (!path.startsWith("/api") && !path.startsWith("/_next") && !path.match(/\.(.*)$/)) {
    const isTracked = request.cookies.get("bondiq_tracked")?.value === "true"
    if (!isTracked) {
      const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "Unknown"
      const userAgent = request.headers.get("user-agent") ?? "Unknown"
      const baseUrl = request.nextUrl.origin
      fetch(`${baseUrl}/api/analytics/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, ip, userAgent, userId: user?.id ?? null }),
      }).catch(console.error)

      // Set tracking cookie
      response.cookies.set("bondiq_tracked", "true", { maxAge: 60 * 60 }) // 1 hour
    }
  }

  const isProtected = protectedPrefixes.some((prefix) => path === prefix || path.startsWith(prefix + "/"))
  const isAuthPage = authPrefixes.some((prefix) => path === prefix || path.startsWith(prefix + "/"))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", path)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = user.email === "bondiq.admin@gmail.com" ? "/admin" : "/dashboard"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/cron).*)"],
}
