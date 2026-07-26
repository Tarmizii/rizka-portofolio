"use client"

import { useEffect, useState } from "react"

export default function SideElements() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) return null

  return (
    <>
      {/* Watch Video Button - Bottom Right (decorative) */}
      <div className="fixed bottom-8 right-8 z-30 hidden lg:block">
        <div className="relative h-16 w-16">
          {/* Rotating text */}
          <svg
            className="animate-rotate h-full w-full"
            viewBox="0 0 70 70"
            style={{ animationDirection: "reverse", animationDuration: "12s" }}
          >
            <defs>
              <path
                id="smallCircle"
                d="M 35, 35 m -28, 0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0"
              />
            </defs>
            <text className="fill-[var(--muted)] text-[6.5px] font-medium uppercase tracking-[0.3em]">
              <textPath href="#smallCircle">
                VIEW WORK • PORTFOLIO •
              </textPath>
            </text>
          </svg>

          {/* Center play icon */}
          <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--foreground)]">
            <svg
              className="h-3 w-3 text-[var(--background)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}
