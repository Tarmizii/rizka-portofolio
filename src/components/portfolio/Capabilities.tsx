"use client"

import { motion } from "framer-motion"

const capabilities = [
  {
    title: "Web Development.",
    description:
      "Building responsive and functional web applications using modern frameworks like Next.js, React, and TypeScript. Creating seamless user experiences that work across all devices and browsers.",
  },
  {
    title: "Backend & Database.",
    description:
      "Developing application logic, CRUD workflows, data management, and relational databases with PostgreSQL, MySQL, and Supabase. Designing efficient APIs and secure data architectures.",
  },
  {
    title: "Product Development.",
    description:
      "Translating requirements into usable digital products through structured implementation and iterative development. From concept to deployment, delivering solutions that solve real problems.",
  },
]

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* Background letter */}
      <div className="bg-letter absolute -left-[5%] top-[5%]">C</div>

      <div className="relative z-10 px-6 md:px-10">
        {/* Section title */}
        <motion.h2
          className="section-title mb-20 text-sm font-semibold tracking-[0.3em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          CAPABILITIES
        </motion.h2>

        {/* 3-column grid */}
        <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              className="space-y-5"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
                {cap.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                {cap.description}
              </p>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
              >
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* THE DEV3LOPER - large outlined text */}
      <div className="mt-24 overflow-hidden md:mt-32">
        <div className="flex animate-outlined-marquee whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="text-outlined shrink-0 px-8 text-[clamp(5rem,15vw,14rem)] leading-none"
            >
              THE DEV3LOPER
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
