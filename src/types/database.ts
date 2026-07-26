export type Project = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string
  category: string
  year: number
  role: string | null
  cover_url: string
  github_url: string
  live_url: string | null
  tech_stack: string[]
  features: string[]
  featured: boolean
  status: "draft" | "published"
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export type ProjectImage = {
  id: string
  project_id: string
  image_url: string
  caption: string | null
  created_at: string
}

export type Profile = {
  id: string
  full_name: string | null
  professional_title: string | null
  bio: string | null
  email: string | null
  phone: string | null
  github_url: string | null
  resume_url: string | null
  availability: string | null
  institution: string | null
  study_program: string | null
  graduation_year: number | null
  created_at: string
  updated_at: string
}

export type Certificate = {
  id: string
  title: string
  issuer: string | null
  year: number | null
  cover_url: string
  pdf_url: string
  featured: boolean
  status: "draft" | "published"
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export type Skill = {
  id: string
  name: string
  category: string
  visible: boolean
  created_at: string
  updated_at: string
}
