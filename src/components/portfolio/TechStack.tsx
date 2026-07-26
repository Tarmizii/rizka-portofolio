"use client"

import { motion } from "framer-motion"

import { Skill } from "@/types/database"

interface TechStackProps {
  skills?: Skill[]
}

const placeholderTechCategories = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    items: ["Node.js", "PHP", "Express", "Supabase"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MySQL", "Supabase Auth"],
  },
  {
    category: "Tools",
    items: ["Git", "VS Code", "Figma", "Postman", "Docker"],
  },
]

export default function TechStack({ skills }: TechStackProps) {
  let displayCategories = placeholderTechCategories
  
  if (skills && skills.length > 0) {
    const grouped = skills.reduce((acc, skill) => {
      const cat = skill.category || "Other"
      if (!acc[cat]) {
        acc[cat] = []
      }
      acc[cat].push(skill.name)
      return acc
    }, {} as Record<string, string[]>)

    displayCategories = Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }))
  }
  return (
    <section
      id="tech-stack"
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* Background letter */}
      <div className="bg-letter absolute left-[-5%] top-[5%]">T</div>

      <div className="relative z-10 px-6 md:px-10">
        {/* Section title */}
        <motion.h2
          className="section-title mb-20 text-sm font-semibold tracking-[0.3em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          TECH STACK
        </motion.h2>

        {/* Categories grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {displayCategories.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              className="space-y-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: groupIndex * 0.1,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <h3 className="flex items-center gap-3 text-base font-bold">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
