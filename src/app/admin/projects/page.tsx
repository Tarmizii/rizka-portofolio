"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { Project } from "@/types/database"
import ProjectModal from "@/components/admin/ProjectModal"

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

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const supabase = createClient()

  const fetchProjects = useCallback(async () => {
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
  }, [supabase])

  useEffect(() => {
    const load = async () => {
      await fetchProjects()
    }
    load()
  }, [fetchProjects])

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

  const handleDuplicate = async (project: Project) => {
    const { error } = await supabase.from("projects").insert({
        title: `${project.title} (Copy)`,
        slug: `${project.slug}-copy`,
        subtitle: project.subtitle,
        description: project.description,
        category: project.category,
        year: project.year,
        role: project.role,
        cover_url: project.cover_url,
        github_url: project.github_url,
        live_url: project.live_url,
        tech_stack: project.tech_stack,
        features: project.features,
        featured: false,
        status: "draft",
        sort_order: null,
      })

    if (error) {
      toast.error("Failed to duplicate project")
    } else {
      toast.success("Project duplicated successfully")
      fetchProjects()
    }
  }

  const handleSave = async (formData: ProjectFormValues, coverFile?: File | null, galleryFiles?: File[] | null) => {
    const galleryUrls: string[] = []

    // Upload cover image
    if (coverFile) {
      const ext = coverFile.name.split(".").pop()
      const path = `projects/${formData.slug || Date.now()}/cover.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(path, coverFile, { upsert: true })
      if (uploadError) {
        toast.error("Failed to upload cover image")
        return
      }
      void (await supabase.storage.from("portfolio-assets").getPublicUrl(path))
      // Public URL available if needed in future
    }

    // Upload gallery images
    if (galleryFiles && galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        const ext = file.name.split(".").pop()
        const path = `projects/${formData.slug || Date.now()}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from("portfolio-assets")
          .upload(path, file, { upsert: true })
        if (uploadError) {
          toast.error(`Failed to upload image: ${file.name}`)
          continue
        }
        const { data: { publicUrl } } = supabase.storage.from("portfolio-assets").getPublicUrl(path)
        galleryUrls.push(publicUrl)
      }
    }

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
      tech_stack: formData.tech_stack,
      features: formData.features,
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

      // Upload gallery images after project is created
      if (galleryUrls.length > 0) {
        const newProjectId = editingProject ? editingProject.id : (await supabase.from("projects").select("id").eq("title", formData.title).single()).data?.id
        if (newProjectId) {
          for (const imageUrl of galleryUrls) {
            await supabase.from("project_images").insert({
              project_id: newProjectId,
              image_url: imageUrl,
              sort_order: galleryUrls.indexOf(imageUrl),
            })
          }
        }
      }

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
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicate(project)}>Duplicate</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No projects yet. Click &quot;Add Project&quot; to get started.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingProject}
        onSave={handleSave}
      />
    </div>
  )
}