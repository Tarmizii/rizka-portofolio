"use client"

import Link from "next/link"

export default function ResumeHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#050505]/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6 md:px-10">
        <Link href="/" className="text-lg font-medium tracking-[0.15em] hover:opacity-80 transition-opacity">
          rizka aulia
        </Link>
        <Link
          href="/"
          className="text-xs font-medium tracking-wider text-[#888] hover:text-[#F5F5F5] transition-colors"
        >
          Back to Portfolio
        </Link>
      </div>
    </header>
  )
}