"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

import { Profile } from "@/types/database"

export default function About({ profile }: { profile?: Profile | null }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const title = profile?.professional_title || "FULL-STACK WEB DEVELOPER"
  const bio = profile?.bio || "PASSIONATE ABOUT BUILDING WEB PRODUCTS FROM INTERFACE THROUGH DATA AND BACKEND LOGIC. WITH A STRONG FOUNDATION IN MODERN WEB TECHNOLOGIES LIKE NEXT.JS, TYPESCRIPT, PHP & POSTGRESQL, I CREATE SCALABLE, USER-CENTRIC APPLICATIONS THAT DELIVER EXCEPTIONAL DIGITAL EXPERIENCES."

  return (
    <section id="about" className="relative overflow-hidden py-28 md:py-36">
      {/* Background letter */}
      <div className="bg-letter absolute -left-[5%] top-[10%]">R</div>

      <div className="relative z-10 px-6 md:px-10">
        {/* Section title */}
        <motion.h2
          className="section-title mb-20 text-sm font-semibold tracking-[0.3em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          ABOUT
        </motion.h2>

        <div ref={ref} className="ml-auto max-w-4xl lg:ml-[30%]">
          {/* Headline */}
          <motion.h3
            className="mb-10 text-2xl font-bold uppercase tracking-wide md:text-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            I AM A {title}.
          </motion.h3>

          {/* Body */}
          <motion.p
            className="text-base font-medium uppercase leading-relaxed tracking-wide text-[var(--muted-foreground)] md:text-lg md:leading-[1.8]"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {bio}{" "}
            <span className="inline-block" role="img" aria-label="wave">
              👋
            </span>
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: "easeOut",
            }}
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 text-base font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
            >
              Contact Me
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
