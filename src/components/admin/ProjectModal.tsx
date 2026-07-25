"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/admin/FileUpload"
import { Project } from "@/types/database"

interface ProjectFormValues {
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
  status: "draft" | "published"
  sort_order: number
}

interface ProjectFormProps {
  isOpen: boolean
  onClose: () => void
  initialData: Project | null
  onSave: (data: ProjectFormValues, coverFile?: File | null, images?: File[] | null) => void
}

export default function ProjectModal({ isOpen, onClose, initialData, onSave }: ProjectFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ProjectFormValues>({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    category: "",
    year: new Date().getFullYear(),
    role: "",
    github_url: "",
    live_url: "",
    tech_stack: [],
    features: [],
    featured: false,
    status: "draft",
    sort_order: 0,
  })

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [techStackInput, setTechStackInput] = useState("")
  const [featuresInput, setFeaturesInput] = useState("")
  const resetForm = () => {
    setStep(1)
    setFormData({
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
      status: initialData?.status || "draft",
      sort_order: initialData?.sort_order || 0,
    })
    setCoverFile(null)
    setGalleryFiles([])
    setTechStackInput((initialData?.tech_stack || []).join(", "))
    setFeaturesInput((initialData?.features || []).join(", "))
  }

  const handleInputChange = (field: keyof ProjectFormValues, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) setStep(s => s + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(s => s - 1)
  }

  const handleSaveDraft = () => {
    const techStack = techStackInput.split(",").map(t => t.trim()).filter(t => t)
    const features = featuresInput.split(",").map(f => f.trim()).filter(f => f)

    onSave({
      ...formData,
      tech_stack: techStack,
      features: features,
      status: "draft",
    }, coverFile, galleryFiles.length > 0 ? galleryFiles : null)
  }

  const handlePublish = () => {
    const techStack = techStackInput.split(",").map(t => t.trim()).filter(t => t)
    const features = featuresInput.split(",").map(f => f.trim()).filter(f => f)

    onSave({
      ...formData,
      tech_stack: techStack,
      features: features,
      status: "published",
    }, coverFile, galleryFiles.length > 0 ? galleryFiles : null)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetForm()
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-foreground">
              {initialData ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <div className="flex gap-2">
              <div className={`h-2 w-2 rounded-full ${step >= 1 ? "bg-accent" : "bg-gray-600"}`} />
              <div className={`h-2 w-2 rounded-full ${step >= 2 ? "bg-accent" : "bg-gray-600"}`} />
              <div className={`h-2 w-2 rounded-full ${step >= 3 ? "bg-accent" : "bg-gray-600"}`} />
              <div className={`h-2 w-2 rounded-full ${step >= 4 ? "bg-accent" : "bg-gray-600"}`} />
            </div>
          </div>
        </DialogHeader>

        {/* Step 1: General */}
        {step === 1 && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="bg-[#18181c] border-[#2e2e38]"
                  placeholder="e.g., E-Commerce Platform"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  required
                  className="bg-[#18181c] border-[#2e2e38]"
                  placeholder="e.g., ecommerce-platform"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  required
                  className="bg-[#18181c] border-[#2e2e38]"
                  placeholder="e.g., Full-Stack Web Application"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                  required
                  className="bg-[#18181c] border-[#2e2e38]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange("subtitle", e.target.value)}
                  className="bg-[#18181c] border-[#2e2e38]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="bg-[#18181c] border-[#2e2e38]"
                  placeholder="e.g., Full-Stack Developer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Media */}
        {step === 2 && (
          <div className="space-y-4 pt-2">
            <FileUpload
              label="Cover Image (Required)"
              file={coverFile}
              onFileChange={setCoverFile}
              accept="image/*"
            />

            <div className="space-y-2">
              <Label>Project Gallery (Optional)</Label>
              <p className="text-xs text-muted-foreground">
                Drag & drop multiple images or click to select. Images will be ordered by upload sequence.
              </p>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-[#2e2e38] hover:border-[#4a4a5a] bg-[#18181c]"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.multiple = true
                  input.accept = "image/*"
                  input.onchange = (e: Event) => {
                    const target = e.target as HTMLInputElement
                    if (target.files && target.files.length > 0) {
                      const newFiles = Array.from(target.files) as File[]
                      setGalleryFiles(prev => [...prev, ...newFiles])
                    }
                  }
                  input.click()
                }}
              >
                <p className="text-sm text-muted-foreground">Click to add gallery images</p>
                {galleryFiles.length > 0 && (
                  <p className="text-sm text-accent mt-2">{galleryFiles.length} image(s) selected</p>
                )}
              </div>
              {galleryFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium">Selected images:</p>
                  <div className="flex flex-wrap gap-2">
                    {galleryFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-[#252525] px-3 py-2 rounded text-xs">
                        <span className="w-2 h-2 rounded-full bg-[#FF6A13]" />
                        {file.name}
                        <button
                          type="button"
                          onClick={() => setGalleryFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-400 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={5}
                required
                className="flex w-full rounded-md border border-[#2e2e38] bg-[#18181c] px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                placeholder="Project overview, objectives, and key highlights..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange("github_url", e.target.value)}
                  required
                  className="bg-[#18181c] border-[#2e2e38]"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="live_url">Live Demo URL (Optional)</Label>
                <Input
                  id="live_url"
                  value={formData.live_url}
                  onChange={(e) => handleInputChange("live_url", e.target.value)}
                  className="bg-[#18181c] border-[#2e2e38]"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tech_stack">Tech Stack</Label>
              <Input
                id="tech_stack"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                className="bg-[#18181c] border-[#2e2e38]"
                placeholder="e.g., Next.js, React, TypeScript, PostgreSQL"
              />
              <p className="text-xs text-muted-foreground">
                Separate with commas: Next.js, React, TypeScript, PostgreSQL
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Key Features</Label>
              <Input
                id="features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="bg-[#18181c] border-[#2e2e38]"
                placeholder="e.g., Real-time dashboard, User authentication, Data visualization"
              />
              <p className="text-xs text-muted-foreground">
                Separate with commas: Real-time dashboard, User authentication, Data visualization
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Publish */}
        {step === 4 && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-[#18181c] rounded-lg border border-[#252525]">
              <h3 className="font-semibold mb-2 text-sm">Project Summary</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-[#888]">Title:</span> {formData.title}</p>
                <p><span className="text-[#888]">Category:</span> {formData.category}</p>
                <p><span className="text-[#888]">Year:</span> {formData.year}</p>
                <p><span className="text-[#888]">Status:</span> {formData.status}</p>
                <p><span className="text-[#888]">Featured:</span> {formData.featured ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="featured">Featured Project</Label>
                <input
                  id="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange("featured", e.target.checked)}
                  className="h-4 w-4 rounded border-[#2e2e38] bg-[#18181c] accent-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value as "draft" | "published")}
                  className="flex h-10 w-full rounded-md border border-[#2e2e38] bg-[#18181c] px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleInputChange("sort_order", parseInt(e.target.value))}
                className="bg-[#18181c] border-[#2e2e38]"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <DialogFooter className="pt-4 border-t border-[#2a2a32]">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handlePrev} className="border-[#2e2e38] hover:bg-[#1f1f24]">
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" onClick={handleNext} className="bg-accent text-accent-foreground hover:bg-accent/90 ml-auto">
              Next
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleSaveDraft} className="border-[#2e2e38] hover:bg-[#1f1f24]">
                Save as Draft
              </Button>
              <Button type="button" onClick={handlePublish} className="bg-accent text-accent-foreground hover:bg-accent/90 ml-auto">
                Publish Project
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}