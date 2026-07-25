"use client"

import { motion } from "framer-motion"

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-36">
      {/* Background letter */}
      <div className="bg-letter absolute right-[-5%] top-[-5%]">?</div>

      <div className="relative z-10 px-6 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Headline */}
          <motion.h2
            className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            LOOKING FOR A{" "}
            <span className="text-[var(--accent)]">DEVELOPER</span>?
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="mb-12 text-base text-[var(--muted)] md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Let&apos;s build something amazing together
          </motion.p>

          {/* Contact links */}
          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a
              href="mailto:rizkaauliaa198@gmail.com"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--foreground)] px-8 text-sm font-medium tracking-wider text-[var(--background)] transition-all hover:bg-[var(--accent)] hover:text-white"
            >
              rizkaauliaa198@gmail.com
            </a>
            <a
              href="tel:+6281370617604"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border)] px-8 text-sm font-medium tracking-wider text-[var(--foreground)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              +62 813-7061-7604
            </a>
            <a
              href="https://github.com/rizkaauliaa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border)] px-8 text-sm font-medium tracking-wider text-[var(--foreground)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              GitHub ↗
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
