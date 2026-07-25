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
  sort_order: number | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export type ProjectImage = {
  id: string
  project_id: string
  image_url: string
  caption: string | null
  sort_order: number | null
  created_at: string
}
