"use client"

import { motion } from "framer-motion"

export default function Education() {
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
            <span className="text-xs font-medium tracking-widest text-[var(--muted)]">
              2025
            </span>
          </div>

          {/* Institution */}
          <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
            Politeknik Negeri Lhokseumawe
          </h3>

          {/* Department */}
          <p className="mb-2 text-base font-medium text-[var(--foreground)]">
            Information Technology and Computer
          </p>

          {/* Description */}
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Graduated with a focus on web development, database management, and
            software engineering. Applied technical knowledge through hands-on
            projects building full-stack web applications.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
