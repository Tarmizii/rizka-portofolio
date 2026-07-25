"use client"

import { motion } from "framer-motion"
import { ProjectCard } from "./ProjectCard"

import { Project } from "@/types/database"

interface SelectedProjectsProps {
  projects?: Project[]
}

// Placeholder projects for development
const placeholderProjects: Partial<Project>[] = [
  {
    id: "1",
    title: "Tailor Management System",
    category: "Web Application",
    year: 2025,
    cover_url: "",
    slug: "tailor-management-system",
  },
  {
    id: "2",
    title: "E-Commerce Platform",
    category: "Full-Stack",
    year: 2025,
    cover_url: "",
    slug: "e-commerce-platform",
  },
  {
    id: "3",
    title: "Portfolio CMS",
    category: "Web Development",
    year: 2024,
    cover_url: "",
    slug: "portfolio-cms",
  },
]

export default function SelectedProjects({
  projects,
}: SelectedProjectsProps) {
  const displayProjects = projects && projects.length > 0 ? projects : placeholderProjects

  return (
    <section
      id="projects"
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* Background letter */}
      <div className="bg-letter absolute right-[-10%] top-[0%]">P</div>

      <div className="relative z-10 px-6 md:px-10">
        {/* Section title */}
        <motion.h2
          className="section-title mb-20 text-sm font-semibold tracking-[0.3em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          SELECTED PROJECTS
        </motion.h2>

        {/* Horizontal scrollable projects */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide md:gap-8 lg:gap-10">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="w-[85vw] flex-shrink-0 sm:w-[60vw] md:w-[45vw] lg:w-[35vw]"
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
                  id={project.id!} 
                  title={project.title!} 
                  category={project.category!} 
                  year={project.year!} 
                  slug={project.slug!} 
                  coverUrl={project.cover_url || ""} 
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {(!projects || projects.length === 0) && displayProjects === placeholderProjects && (
          <p className="mt-4 text-center text-xs text-[var(--muted)]">
            Preview mode — projects will load from database
          </p>
        )}
      </div>
    </section>
  )
}
