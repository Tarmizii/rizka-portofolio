"use client"

import Link from "next/link"

interface ProjectCardProps {
  id: string
  title: string
  category: string
  year: number
  coverUrl: string
  slug: string
}

export function ProjectCard({
  title,
  category,
  year,
  coverUrl,
  slug,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--secondary)]">
        {coverUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={coverUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl font-bold text-[var(--border)]">
              {title.charAt(0)}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-500 group-hover:bg-black/40">
          <span className="translate-y-4 text-sm font-semibold tracking-[0.2em] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            VIEW CASE →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-5 space-y-1">
        <h3 className="text-lg font-semibold transition-colors group-hover:text-[var(--accent)]">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>{category}</span>
          {year && (
            <>
              <span className="text-[var(--border)]">·</span>
              <span>{year}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
