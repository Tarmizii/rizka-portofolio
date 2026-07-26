import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <p className="text-sm uppercase tracking-widest text-[#FF6A13]">404</p>
      <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-[#252525] px-6 py-2 text-sm transition-colors hover:border-[#FF6A13] hover:text-[#FF6A13]"
      >
        Back to home
      </Link>
    </div>
  )
}
