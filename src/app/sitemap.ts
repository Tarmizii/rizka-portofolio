import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("slug, updated_at")
    .is("deleted_at", null)
    .eq("status", "published")

  const projectEntries: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  }))

  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/certificates`, lastModified: new Date() },
    ...projectEntries,
  ]
}
