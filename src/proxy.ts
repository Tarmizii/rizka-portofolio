import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isLoginPage = request.nextUrl.pathname === "/admin/login"

    // Unauthenticated user trying to access admin (not login) → redirect to login
    if (!user && !isLoginPage) {
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Authenticated user on login page → redirect to dashboard
    if (user && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  } catch (error) {
    // If Supabase fails, allow the request through rather than blocking all routes
    console.error("Proxy auth error:", error)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
