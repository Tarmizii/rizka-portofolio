import { createClient } from "@/lib/supabase/server"
import { LenisProvider } from "@/components/portfolio/LenisProvider"
import PortfolioHeader from "@/components/portfolio/PortfolioHeader"
import Footer from "@/components/portfolio/Footer"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single()

  if (!project) notFound()

  return (
    <LenisProvider>
      <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
        <PortfolioHeader />

        <main className="px-6 md:px-10 pt-28 pb-20 max-w-5xl mx-auto">
          {/* Back link */}
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#FF6A13] transition-colors mb-10">
            &larr; Back to Projects
          </Link>

          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm text-[#888] mb-4">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A13]" />
                {project.category}
              </span>
              {project.year && (
                <>
                  <span className="text-[#252525]">·</span>
                  <span>{project.year}</span>
                </>
              )}
              {project.role && (
                <>
                  <span className="text-[#252525]">·</span>
                  <span>{project.role}</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{project.title}</h1>
            {project.subtitle && (
              <p className="text-xl text-[#888]">{project.subtitle}</p>
            )}
          </div>

          {/* Cover image */}
          {project.cover_url && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-12 bg-[#18181c]">
              <Image
                src={project.cover_url}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}

          {/* Description */}
          <div className="max-w-3xl mb-12">
            <h2 className="text-sm font-semibold tracking-[0.3em] text-[#888] uppercase mb-4">About This Project</h2>
            <p className="text-base leading-relaxed text-[#ccc] whitespace-pre-line">{project.description}</p>
          </div>

          {/* Tech Stack */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mb-12">
              <h2 className="text-sm font-semibold tracking-[0.3em] text-[#888] uppercase mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech: string) => (
                  <span key={tech} className="rounded-full border border-[#252525] px-4 py-2 text-xs font-medium text-[#888]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-sm font-semibold tracking-[0.3em] text-[#888] uppercase mb-4">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-[#ccc]">
                    <span className="text-[#FF6A13] mt-0.5">&#x2022;</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-8 border-t border-[#252525]">
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#F5F5F5] px-8 text-sm font-medium tracking-wider text-[#050505] hover:bg-[#FF6A13] hover:text-white transition-all"
            >
              View on GitHub
            </a>
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#252525] px-8 text-sm font-medium tracking-wider text-[#F5F5F5] hover:border-[#FF6A13] hover:text-[#FF6A13] transition-all"
              >
                Live Demo
              </a>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </LenisProvider>
  )
}