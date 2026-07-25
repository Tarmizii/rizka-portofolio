import { z } from "zod"

export const projectSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  year: z.number().min(1900, "Invalid year").max(new Date().getFullYear(), "Invalid year"),
  role: z.string().optional(),
  cover_url: z.string().min(1, "Cover image is required"),
  github_url: z.string().min(1, "GitHub URL is required").url("Invalid URL"),
  live_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  tech_stack: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().optional(),
  year: z.number().min(1900, "Invalid year").max(new Date().getFullYear(), "Invalid year"),
  cover_url: z.string().min(1, "Cover image is required"),
  pdf_url: z.string().min(1, "Certificate PDF is required"),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().optional(),
})

export type CertificateFormValues = z.infer<typeof certificateSchema>

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  visible: z.boolean().default(true),
  sort_order: z.number().optional(),
})

export type SkillFormValues = z.infer<typeof skillSchema>
