"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--background)] px-6 pt-24 md:px-10">
      {/* Background letter R */}
      <div className="bg-letter absolute left-[10%] top-[5%]">R</div>

      <div className="relative z-10 flex min-h-[85vh] flex-col justify-center">
        {/* Main headline */}
        <div className="max-w-5xl">
          <motion.h1
            className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.95] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <span>Full-Stack</span>
            <span className="text-[var(--accent)]">.</span>
            <span>Web</span>
            <span className="text-[var(--accent)]">.</span>
            <span>Product</span>
            <span className="text-[var(--accent)]">.</span>
          </motion.h1>

          <motion.h1
            className="text-[clamp(2.5rem,8vw,7rem)] font-bold italic leading-[0.95] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            Development<span className="text-[var(--accent)]">.</span>
          </motion.h1>

          <motion.h1
            className="text-[clamp(2rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[var(--muted)]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            &amp;More
          </motion.h1>
        </div>

        {/* CTA buttons */}
        <motion.div
          className="mt-12 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          <Link
            href="#projects"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--foreground)] px-8 text-sm font-medium tracking-wider text-[var(--background)] transition-all hover:bg-[var(--accent)] hover:text-white"
          >
            VIEW WORK
          </Link>
          <Link
            href="/resume"
            className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border)] px-8 text-sm font-medium tracking-wider text-[var(--foreground)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            DOWNLOAD CV
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
