import { createClient } from "@/lib/supabase/server"
import PortfolioLayout from "@/components/portfolio/PortfolioLayout"
import { Project, Skill, Profile } from "@/types/database"

export default async function PortfolioPage() {
  const supabase = await createClient()

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .single()

  // Fetch published and featured projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  // Fetch visible skills
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true })

  return (
    <PortfolioLayout 
      profile={profile as Profile | null}
      projects={projects as Project[] || []} 
      skills={skills as Skill[] || []} 
    />
  )
}
