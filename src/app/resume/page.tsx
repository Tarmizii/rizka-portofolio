import { createClient } from "@/lib/supabase/server"
import { LenisProvider } from "@/components/portfolio/LenisProvider"
import ResumeHeader from "./ResumeHeader"
import Link from "next/link"

export default async function ResumePage() {
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("*").single()

  return (
    <LenisProvider>
      <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
        <ResumeHeader />

        <main className="px-6 md:px-10 py-24 max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              {profile?.full_name || "Rizka Aulia"}
            </h1>
            <p className="text-xl md:text-2xl text-[#FF6A13] font-medium mb-3">
              {profile?.professional_title || "Full-Stack Developer"}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-[#888]">
              {profile?.email && <span>{profile.email}</span>}
              {profile?.phone && <span>{profile.phone}</span>}
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-[#FF6A13] hover:underline">GitHub</a>
              )}
            </div>
          </div>

          {/* About */}
          {profile?.bio && (
            <section className="mb-16">
              <h2 className="text-sm font-semibold tracking-[0.3em] mb-6 text-[#888] uppercase">About</h2>
              <p className="text-base leading-relaxed text-[#ccc] max-w-3xl">{profile.bio}</p>
            </section>
          )}

          {/* Education */}
          <section className="mb-16">
            <h2 className="text-sm font-semibold tracking-[0.3em] mb-6 text-[#888] uppercase">Education</h2>
            <div className="border-l-2 border-[#FF6A13] pl-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#252525] px-3 py-1 text-xs text-[#888] mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A13]" />
                {profile?.graduation_year || "2025"}
              </div>
              <h3 className="text-xl font-bold mb-1">{profile?.institution || "Politeknik Negeri Lhokseumawe"}</h3>
              <p className="text-[#888]">{profile?.study_program || "Information Technology and Computer"}</p>
            </div>
          </section>

          {/* Skills - fetch and display */}
          <SkillsSection />

          {/* Contact CTA */}
          <section className="mt-20 pt-10 border-t border-[#252525] text-center">
            <p className="text-lg text-[#888] mb-4">Interested in working together?</p>
            <a
              href={`mailto:${profile?.email || "rizkaauliaa198@gmail.com"}`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#F5F5F5] px-8 text-sm font-medium tracking-wider text-[#050505] hover:bg-[#FF6A13] hover:text-white transition-all"
            >
              Get in Touch
            </a>
            <div className="mt-6">
              <Link href="/" className="text-sm text-[#888] hover:text-[#FF6A13] transition-colors">&larr; Back to Portfolio</Link>
            </div>
          </section>
        </main>
      </div>
    </LenisProvider>
  )
}

async function SkillsSection() {
  const supabase = await createClient()
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .eq("visible", true)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })

  if (!skills || skills.length === 0) return null

  const grouped = skills.reduce((acc: Record<string, string[]>, skill) => {
    const cat = skill.category || "Other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill.name)
    return acc
  }, {})

  return (
    <section className="mb-16">
      <h2 className="text-sm font-semibold tracking-[0.3em] mb-6 text-[#888] uppercase">Skills</h2>
      <div className="grid gap-8 sm:grid-cols-2">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6A13]" />
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span key={item} className="rounded-full border border-[#252525] px-3 py-1.5 text-xs text-[#888]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
