"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ImagePlusIcon,
  RotateCcwIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { FileUpload } from "@/components/admin/FileUpload"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { Project, ProjectImage } from "@/types/database"

export interface ProjectFormValues {
  title: string
  slug: string
  subtitle: string
  description: string
  category: string
  year: number
  role: string
  github_url: string
  live_url: string
  tech_stack: string[]
  features: string[]
  featured: boolean
}

interface ProjectFormProps {
  isOpen: boolean
  onClose: () => void
  initialData: Project | null
  initialImages?: ProjectImage[]
  onSave: (
    data: ProjectFormValues,
    coverFile?: File | null,
    images?: File[] | null,
    removedImageIds?: string[] | null
  ) => Promise<boolean>
}

export default function ProjectModal({
  isOpen,
  onClose,
  initialData,
  initialImages = [],
  onSave,
}: ProjectFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ProjectFormValues>(() => ({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    subtitle: initialData?.subtitle || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    year: initialData?.year || new Date().getFullYear(),
    role: initialData?.role || "",
    github_url: initialData?.github_url || "",
    live_url: initialData?.live_url || "",
    tech_stack: initialData?.tech_stack || [],
    features: initialData?.features || [],
    featured: initialData?.featured || false,
  }))
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([])
  const [techStackInput, setTechStackInput] = useState(() =>
    (initialData?.tech_stack || []).join(", ")
  )
  const [featuresInput, setFeaturesInput] = useState(() =>
    (initialData?.features || []).join(", ")
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (
    field: keyof ProjectFormValues,
    value: string | number | boolean
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!formData.title.trim() || !formData.slug.trim() || !formData.category.trim()) {
        toast.error("Title, slug, and category are required")
        return false
      }
      if (!/^[a-z0-9-]+$/.test(formData.slug)) {
        toast.error("Slug must use lowercase letters, numbers, and hyphens only")
        return false
      }
      if (!Number.isInteger(formData.year) || formData.year < 1900) {
        toast.error("Enter a valid project year")
        return false
      }
    }

    if (step === 2 && !initialData?.cover_url && !coverFile) {
      toast.error("A cover image is required for a new project")
      return false
    }

    if (step === 3) {
      if (!formData.description.trim() || !formData.github_url.trim()) {
        toast.error("Description and GitHub URL are required")
        return false
      }

      try {
        new URL(formData.github_url)
        if (formData.live_url) new URL(formData.live_url)
      } catch {
        toast.error("Enter valid GitHub and live demo URLs")
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateCurrentStep() && step < 4) {
      setStep((current) => current + 1)
    }
  }

  const handleSave = async () => {
    if (!validateCurrentStep()) return

    const techStack = techStackInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    const features = featuresInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    setIsSaving(true)
    try {
      await onSave(
        {
          ...formData,
          tech_stack: techStack,
          features,
        },
        coverFile,
        galleryFiles.length > 0 ? galleryFiles : null,
        removedImageIds.length > 0 ? removedImageIds : null
      )
    } finally {
      setIsSaving(false)
    }
  }

  const toggleImageRemoval = (imageId: string) => {
    setRemovedImageIds((current) =>
      current.includes(imageId)
        ? current.filter((id) => id !== imageId)
        : [...current, imageId]
    )
  }

  const keptImageCount = initialImages.length - removedImageIds.length

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose()
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-bold">
              {initialData ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <div className="flex gap-2" aria-label={`Step ${step} of 4`}>
              {[1, 2, 3, 4].map((item) => (
                <span
                  key={item}
                  className={cn(
                    "size-2 rounded-full",
                    step >= item ? "bg-accent" : "bg-secondary"
                  )}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        {step === 1 && (
          <div className="flex flex-col gap-4 pt-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) => handleInputChange("title", event.target.value)}
                  placeholder="E-Commerce Platform"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(event) => handleInputChange("slug", event.target.value)}
                  placeholder="ecommerce-platform"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(event) => handleInputChange("category", event.target.value)}
                  placeholder="Full-Stack Application"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(event) =>
                    handleInputChange("year", Number.parseInt(event.target.value, 10))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(event) => handleInputChange("subtitle", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(event) => handleInputChange("role", event.target.value)}
                  placeholder="Full-Stack Developer"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5 pt-2">
            <FileUpload
              label={initialData?.cover_url ? "Replace Cover Image (Optional)" : "Cover Image"}
              file={coverFile}
              onFileChange={setCoverFile}
              accept="image/*"
            />
            {initialData?.cover_url && !coverFile && (
              <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Image
                    src={initialData.cover_url}
                    alt="Current cover"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
                <p className="text-xs text-muted-foreground">
                  This is the current cover. It will be retained unless you upload a
                  replacement.
                </p>
              </div>
            )}

            {initialImages.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>
                  Current Gallery ({keptImageCount} of {initialImages.length} kept)
                </Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {initialImages.map((image) => {
                    const isRemoved = removedImageIds.includes(image.id)
                    return (
                      <div
                        key={image.id}
                        className={cn(
                          "flex flex-col gap-2 rounded-lg border bg-card p-2 transition-opacity",
                          isRemoved && "border-destructive/50 opacity-50"
                        )}
                      >
                        <span className="relative aspect-video overflow-hidden rounded-md bg-secondary">
                          <Image
                            src={image.image_url}
                            alt={image.caption || "Gallery image"}
                            fill
                            sizes="(max-width: 640px) 50vw, 200px"
                            className="object-cover"
                          />
                        </span>
                        <Button
                          type="button"
                          variant={isRemoved ? "outline" : "destructive"}
                          size="sm"
                          onClick={() => toggleImageRemoval(image.id)}
                        >
                          {isRemoved ? (
                            <RotateCcwIcon data-icon="inline-start" />
                          ) : (
                            <Trash2Icon data-icon="inline-start" />
                          )}
                          {isRemoved ? "Undo" : "Remove"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
                {removedImageIds.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {removedImageIds.length} image(s) will be deleted permanently when
                    you save.
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="project-gallery">Project Gallery (Optional)</Label>
              <label
                htmlFor="project-gallery"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border bg-card p-6 text-center transition-colors hover:border-accent"
              >
                <ImagePlusIcon className="size-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to add one or more gallery images
                </span>
                {galleryFiles.length > 0 && (
                  <span className="text-sm font-medium text-accent">
                    {galleryFiles.length} image(s) selected
                  </span>
                )}
              </label>
              <input
                id="project-gallery"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) {
                    setGalleryFiles((current) => [
                      ...current,
                      ...Array.from(event.target.files || []),
                    ])
                  }
                }}
              />
            </div>

            {galleryFiles.length > 0 && (
              <div className="flex flex-col gap-2">
                {galleryFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-md border bg-card p-3"
                  >
                    <span className="truncate text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setGalleryFiles((current) =>
                          current.filter((_, fileIndex) => fileIndex !== index)
                        )
                      }
                    >
                      <Trash2Icon data-icon="inline-start" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(event) => handleInputChange("description", event.target.value)}
                rows={6}
                required
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={(event) => handleInputChange("github_url", event.target.value)}
                  placeholder="https://github.com/..."
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="live_url">Live Demo URL</Label>
                <Input
                  id="live_url"
                  type="url"
                  value={formData.live_url}
                  onChange={(event) => handleInputChange("live_url", event.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tech_stack">Tech Stack</Label>
              <Input
                id="tech_stack"
                value={techStackInput}
                onChange={(event) => setTechStackInput(event.target.value)}
                placeholder="Next.js, TypeScript, Supabase"
              />
              <p className="text-xs text-muted-foreground">Separate items with commas.</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="features">Key Features</Label>
              <Input
                id="features"
                value={featuresInput}
                onChange={(event) => setFeaturesInput(event.target.value)}
                placeholder="Authentication, Payments, Dashboard"
              />
              <p className="text-xs text-muted-foreground">Separate items with commas.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5 pt-2">
            <div className="flex items-center gap-2">
              <input
                id="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(event) => handleInputChange("featured", event.target.checked)}
                className="size-4 rounded border-border bg-background accent-[var(--accent)]"
              />
              <Label htmlFor="featured">Feature this project on the portfolio</Label>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
              <h3 className="font-semibold">Review</h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Title</dt>
                <dd>{formData.title}</dd>
                <dt className="text-muted-foreground">Category</dt>
                <dd>{formData.category}</dd>
                <dt className="text-muted-foreground">Year</dt>
                <dd>{formData.year}</dd>
                <dt className="text-muted-foreground">Cover</dt>
                <dd>{coverFile?.name || (initialData ? "Existing cover" : "Not selected")}</dd>
                <dt className="text-muted-foreground">Gallery</dt>
                <dd>
                  {initialImages.length > 0
                    ? `${keptImageCount} kept · ${removedImageIds.length} removed · ${galleryFiles.length} new`
                    : `${galleryFiles.length} new image(s)`}
                </dd>
                <dt className="text-muted-foreground">Visibility</dt>
                <dd className="font-medium text-accent">Published automatically</dd>
              </dl>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-border pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((current) => current - 1)}
              disabled={isSaving}
            >
              <ArrowLeftIcon data-icon="inline-start" />
              Previous
            </Button>
          )}

          {step < 4 ? (
            <Button type="button" onClick={handleNext} className="ml-auto">
              Next
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="ml-auto"
            >
              {isSaving ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SaveIcon data-icon="inline-start" />
              )}
              {isSaving
                ? "Saving..."
                : initialData
                  ? "Update Project"
                  : "Create Project"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
