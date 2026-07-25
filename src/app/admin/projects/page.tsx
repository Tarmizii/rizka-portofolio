"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
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
  tech_stack: string
  features: string
  featured: boolean
  status: "draft" | "published"
  sort_order: number
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load projects")
    } else {
      setProjects(data as Project[])
    }
    setIsLoading(false)
  }

  const handleCreate = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    
    const { error } = await supabase.from("projects").delete().eq("id", id)
    
    if (error) {
      toast.error("Failed to delete project")
    } else {
      toast.success("Project deleted successfully")
      fetchProjects()
    }
  }

  const handlePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "draft" ? "published" : "draft"
    const { error } = await supabase.from("projects").update({ status: newStatus }).eq("id", id)
    
    if (error) {
      toast.error(`Failed to ${newStatus === "draft" ? "unpublish" : "publish"} project`)
    } else {
      toast.success(`Project ${newStatus === "draft" ? "unpublished" : "published"} successfully`)
      fetchProjects()
    }
  }

  const handleSave = async (formData: ProjectFormValues) => {
    const techStack = formData.tech_stack.split(",").map(t => t.trim()).filter(t => t)
    const features = formData.features.split(",").map(f => f.trim()).filter(f => f)

    const data = {
      title: formData.title,
      slug: formData.slug,
      subtitle: formData.subtitle || null,
      description: formData.description,
      category: formData.category,
      year: formData.year,
      role: formData.role || null,
      github_url: formData.github_url,
      live_url: formData.live_url || null,
      tech_stack: techStack,
      features: features,
      featured: formData.featured,
      status: formData.status,
      sort_order: formData.sort_order,
    }

    const { error } = editingProject
      ? await supabase.from("projects").update(data).eq("id", editingProject.id)
      : await supabase.from("projects").insert(data)

    if (error) {
      toast.error(editingProject ? "Failed to update project" : "Failed to create project")
    } else {
      toast.success(editingProject ? "Project updated successfully" : "Project created successfully")
      setIsModalOpen(false)
      fetchProjects()
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Projects</h2>
            <Button onClick={handleCreate}>Add Project</Button>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Title</th>
                    <th className="p-3 text-left font-medium">Category</th>
                    <th className="p-3 text-left font-medium">Year</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Featured</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b">
                      <td className="p-3 font-medium">{project.title}</td>
                      <td className="p-3">{project.category}</td>
                      <td className="p-3">{project.year}</td>
                      <td className="p-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          project.status === "published"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-gray-500/10 text-gray-500"
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="p-3">{project.featured ? "Yes" : "No"}</td>
                      <td className="p-3 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePublish(project.id, project.status)}>
                          {project.status === "draft" ? "Publish" : "Unpublish"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No projects yet. Click "Add Project" to get started.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ProjectForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingProject}
        onSave={handleSave}
      />
    </div>
  )
}

function ProjectForm({ isOpen, onClose, initialData, onSave }: { 
  isOpen: boolean
  onClose: () => void
  initialData: Project | null
  onSave: (data: ProjectFormValues) => void
}) {
  const [formData, setFormData] = useState<ProjectFormValues>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    subtitle: initialData?.subtitle || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    year: initialData?.year || new Date().getFullYear(),
    role: initialData?.role || "",
    github_url: initialData?.github_url || "",
    live_url: initialData?.live_url || "",
    tech_stack: (initialData?.tech_stack || []).join(", "),
    features: (initialData?.features || []).join(", "),
    featured: initialData?.featured || false,
    status: initialData?.status || "draft",
    sort_order: initialData?.sort_order || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input id="github_url" value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="live_url">Live Demo URL</Label>
            <Input id="live_url" value={formData.live_url} onChange={(e) => setFormData({...formData, live_url: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
            <Input id="tech_stack" value={formData.tech_stack} onChange={(e) => setFormData({...formData, tech_stack: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input id="features" value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} required />
          </div>
          <div className="flex items-center space-x-2">
            <input id="featured" type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} />
            <Label htmlFor="featured">Featured</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as "draft" | "published"})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input id="sort_order" type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
