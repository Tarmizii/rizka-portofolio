"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLinkIcon, MenuIcon } from "lucide-react"

import { getActiveNavItem } from "@/components/admin/admin-nav"
import { Button, buttonVariants } from "@/components/ui/button"

type AdminHeaderProps = {
  onOpenNav: () => void
}

export default function AdminHeader({ onOpenNav }: AdminHeaderProps) {
  const pathname = usePathname()
  const active = getActiveNavItem(pathname)

  const title = active?.label ?? "Admin"
  const description = active?.description ?? "Manage your portfolio content"

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onOpenNav}
          className="size-10 shrink-0 md:hidden"
          aria-label="Open menu"
        >
          <MenuIcon />
        </Button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold leading-tight sm:text-xl">{title}</h1>
          <p className="hidden truncate text-sm text-muted-foreground sm:block">{description}</p>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm", className: "shrink-0" })}
        >
          <ExternalLinkIcon aria-hidden />
          <span className="hidden sm:inline">View site</span>
        </Link>
      </div>
    </header>
  )
}
