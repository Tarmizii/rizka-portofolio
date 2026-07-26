import { createClient } from "@/lib/supabase/server"
import PortfolioLayout from "@/components/portfolio/PortfolioLayout"
import { Project, Skill, Profile, Certificate } from "@/types/database"

export default async function PortfolioPage() {
  const supabase = await createClient()

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .single()

  // Fetch projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })

  // Fetch visible skills
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .eq("visible", true)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })

  // Fetch certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .is("deleted_at", null)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })

  return (
    <PortfolioLayout 
      profile={profile as Profile | null}
      projects={projects as Project[] || []} 
      skills={skills as Skill[] || []}
      certificates={certificates as Certificate[] || []}
    />
  )
}
