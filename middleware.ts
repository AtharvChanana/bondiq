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
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/cron).*)"],
}
