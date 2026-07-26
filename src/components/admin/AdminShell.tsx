"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import AdminHeader from "@/components/admin/AdminHeader"
import AdminSidebar from "@/components/admin/AdminSidebar"

type AdminShellProps = {
  user: { name: string | null; email: string | null }
  children: React.ReactNode
}

export default function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [renderedPathname, setRenderedPathname] = useState(pathname)

  // Close the drawer whenever the route changes (covers browser back/forward too).
  if (renderedPathname !== pathname) {
    setRenderedPathname(pathname)
    setIsMobileNavOpen(false)
  }

  useEffect(() => {
    if (!isMobileNavOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileNavOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMobileNavOpen])

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar
        user={user}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onOpenNav={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
