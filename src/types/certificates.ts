export type Certificate = {
  id: string
  title: string
  issuer: string | null
  year: number | null
  cover_url: string
  pdf_url: string
  featured: boolean
  status: "draft" | "published"
  sort_order: number | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}
