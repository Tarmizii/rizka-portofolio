"use client"

import { motion } from "framer-motion"

import { Profile } from "@/types/database"

export default function Education({ profile }: { profile?: Profile | null }) {
  const institution = profile?.institution || "Politeknik Negeri Lhokseumawe"
  const program = profile?.study_program || "Information Technology and Computer"
  const year = profile?.graduation_year || 2025

  return (
    <section
      id="education"
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* Background letter */}
      <div className="bg-letter absolute right-[-5%] top-[5%]">E</div>

      <div className="relative z-10 px-6 md:px-10">
        {/* Section title */}
        <motion.h2
          className="section-title mb-20 text-sm font-semibold tracking-[0.3em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          EDUCATION
        </motion.h2>

        <motion.div
          className="ml-auto max-w-3xl border-l-2 border-[var(--accent)] pl-8 lg:ml-[25%]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Year badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            <span className="text-xs font-medium tracking-widest text-[var(--muted-foreground)]">
              {year}
            </span>
          </div>

          {/* Institution */}
          <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
            {institution}
          </h3>

          {/* Department */}
          <p className="mb-2 text-base font-medium text-[var(--foreground)]">
            {program}
          </p>

          {/* Description */}
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Graduated with a focus on web development, database management, and
            software engineering. Applied technical knowledge through hands-on
            projects building full-stack web applications.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
