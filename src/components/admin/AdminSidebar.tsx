"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLinkIcon, XIcon } from "lucide-react"

import LogoutButton from "@/components/admin/LogoutButton"
import { adminNav, isNavItemActive } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminUser = {
  name: string | null
  email: string | null
}

type AdminSidebarProps = {
  user: AdminUser
  isMobileOpen: boolean
  onCloseMobile: () => void
}

function getInitials(name: string | null, email: string | null) {
  const source = name?.trim() || email?.trim() || "Admin"
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "A"
}

function SidebarBrand() {
  return (
    <Link
      href="/admin"
      className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-hover"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-base font-bold text-accent-foreground">
        R
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">Portfolio CMS</span>
        <span className="block truncate text-xs text-muted-foreground">Manage your content</span>
      </span>
    </Link>
  )
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-6" aria-label="Admin sections">
      {adminNav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive = isNavItemActive(item, pathname)
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    title={item.description}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "bg-accent/10 font-semibold text-accent"
                        : "font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent"
                      />
                    )}
                    <Icon aria-hidden className="size-4.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function SidebarFooter({ user }: { user: AdminUser }) {
  return (
    <div className="space-y-3 border-t border-border pt-4">
      <Link
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <ExternalLinkIcon aria-hidden className="size-4 shrink-0" />
        View live site
      </Link>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
          {getInitials(user.name, user.email)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">
            {user.name || "Admin"}
          </span>
          {user.email && (
            <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
          )}
        </span>
      </div>

      <LogoutButton />
    </div>
  )
}

export default function AdminSidebar({ user, isMobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="p-4">
          <SidebarBrand />
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <SidebarNav pathname={pathname} />
        </div>
        <div className="px-3 pb-4">
          <SidebarFooter user={user} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm animate-fade-in-fast"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
            className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r border-border bg-surface shadow-2xl animate-slide-in-left"
          >
            <div className="flex items-center justify-between gap-2 p-4">
              <SidebarBrand />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onCloseMobile}
                className="size-9 shrink-0 rounded-full"
                aria-label="Close menu"
              >
                <XIcon />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <SidebarNav pathname={pathname} onNavigate={onCloseMobile} />
            </div>
            <div className="px-3 pb-4">
              <SidebarFooter user={user} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
