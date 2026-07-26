"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-[#F5F5F5]">
      <p className="text-sm uppercase tracking-widest text-[#FF6A13]">Error</p>
      <h1 className="mt-4 text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-neutral-400">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="mt-8 rounded-full border border-[#252525] px-6 py-2 text-sm transition-colors hover:border-[#FF6A13] hover:text-[#FF6A13]"
      >
        Try again
      </button>
    </div>
  )
}
