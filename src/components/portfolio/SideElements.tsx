"use client"

import { useEffect, useState } from "react"

const sidebarLabels = ["FULL-STACK", "WEB DEV", "BACKEND"]

export default function SideElements() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      {/* Rotating Badge - Top Left */}
      <div className="fixed left-6 top-24 z-30 hidden lg:block md:left-8">
        <div className="relative h-28 w-28">
          {/* Rotating text */}
          <svg
            className="animate-rotate h-full w-full"
            viewBox="0 0 120 120"
          >
            <defs>
              <path
                id="circlePath"
                d="M 60, 60 m -48, 0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
              />
            </defs>
            <text
              className="fill-[var(--muted)] text-[9.5px] font-medium uppercase tracking-[0.35em]"
            >
              <textPath href="#circlePath">
                Rizka Aulia • Developer • Full-Stack •
              </textPath>
            </text>
          </svg>

          {/* Center monogram */}
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)]">
            <span className="text-xs font-bold tracking-wider text-[var(--foreground)]">
              RA
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Sidebar Labels - Left */}
      <div className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-16 lg:flex md:left-8">
        {sidebarLabels.map((label) => (
          <div key={label} className="vertical-text">
            {label}
          </div>
        ))}
      </div>

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
