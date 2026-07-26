"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProjectCard } from "./ProjectCard"
import { Project } from "@/types/database"

interface SelectedProjectsProps {
  projects?: Project[]
}

export default function SelectedProjects({
  projects,
}: SelectedProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Only show published projects
  const publishedProjects = projects?.filter(p => p.status === "published") || []

  if (publishedProjects.length === 0) {
    return (
      <section
        id="projects"
        className="relative overflow-hidden py-28 md:py-36"
      >
        <div className="bg-letter absolute right-[-10%] top-[0%]">P</div>
        <div className="relative z-10 px-6 md:px-10">
          <motion.h2
            className="section-title mb-20 text-sm font-semibold tracking-[0.3em]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            SELECTED PROJECTS
          </motion.h2>
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            No projects available yet
          </p>
        </div>
      </section>
    )
  }

  // How many cards to show at once
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }

  const visibleCount = typeof window !== "undefined" ? getVisibleCount() : 3
  const maxIndex = Math.max(0, publishedProjects.length - visibleCount)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  return (
    <section
      id="projects"
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* Background letter */}
      <div className="bg-letter absolute right-[-10%] top-[0%]">P</div>

      <div className="relative z-10 px-6 md:px-10">
        {/* Section header with navigation */}
        <div className="mb-20 flex items-end justify-between">
          <motion.h2
            className="section-title text-sm font-semibold tracking-[0.3em]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            SELECTED PROJECTS
          </motion.h2>

          {/* Navigation buttons */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="mr-3 text-xs font-medium tracking-wider text-[var(--muted-foreground)]">
              {String(currentIndex + 1).padStart(2, "0")} / {String(publishedProjects.length).padStart(2, "0")}
            </span>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--foreground)]"
              aria-label="Previous project"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--foreground)]"
              aria-label="Next project"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* Project cards grid */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6 md:gap-8"
            animate={{
              x: `-${currentIndex * (100 / visibleCount)}%`,
            }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <AnimatePresence mode="wait">
              {publishedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="w-full flex-shrink-0 sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                >
                  <ProjectCard
                    id={project.id}
                    title={project.title}
                    category={project.category}
                    year={project.year}
                    slug={project.slug}
                    coverUrl={project.cover_url || ""}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
