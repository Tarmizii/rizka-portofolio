"use client"

import { useState } from "react"
import Link from "next/link"
import FullscreenMenu from "./FullscreenMenu"

import { Profile } from "@/types/database"

export default function PortfolioHeader({ profile }: { profile?: Profile | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <div className="flex h-16 items-center justify-between px-6 md:px-10">
          {/* Social links - left */}
          <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-[var(--muted-foreground)]">
            <a
              href={profile?.github_url || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--foreground)]"
            >
              GH
            </a>
            <span className="text-[var(--accent)]">•</span>
            <a
              href="mailto:rizkaauliaa198@gmail.com"
              className="transition-colors hover:text-[var(--foreground)]"
            >
              EM
            </a>
          </div>

          {/* Center logo */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-medium tracking-[0.15em] text-[var(--foreground)] transition-opacity hover:opacity-80"
          >
            rizka aulia
          </Link>

          {/* Menu button - right */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-3 text-xs font-medium tracking-wider text-[var(--foreground)] transition-opacity hover:opacity-70"
            aria-label="Open menu"
          >
            <span className="hidden sm:inline">MENU</span>
            <div className="flex flex-col gap-[5px]">
              <span className="block h-[1.5px] w-5 bg-[var(--foreground)] transition-transform" />
              <span className="block h-[1.5px] w-5 bg-[var(--foreground)] transition-transform" />
            </div>
          </button>
        </div>
      </header>

      <FullscreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  )
}
