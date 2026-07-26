export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="flex flex-col items-center justify-between gap-4 px-6 sm:flex-row md:px-10">
        {/* Left - copyright */}
        <p className="text-xs tracking-wider text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} Rizka Aulia. All rights reserved.
        </p>

        {/* Right - social links */}
        <div className="flex items-center gap-6 text-xs tracking-wider text-[var(--muted-foreground)]">
          <a
            href="https://github.com/rizkaauliaa"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--foreground)]"
          >
            GitHub
          </a>
          <a
            href="mailto:rizkaauliaa198@gmail.com"
            className="transition-colors hover:text-[var(--foreground)]"
          >
            Email
          </a>
          <a
            href="/resume"
            className="transition-colors hover:text-[var(--foreground)]"
          >
            Resume
          </a>
        </div>
      </div>
    </footer>
  )
}
