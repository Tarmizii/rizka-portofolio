"use client"

import { useCallback, useEffect, useState } from "react"
import {
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import ProjectModal, {
  ProjectFormValues,
} from "@/components/admin/ProjectModal"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import { collectStoragePaths, PORTFOLIO_BUCKET } from "@/lib/supabase/storage"
import { Project, ProjectImage } from "@/types/database"

function createUploadToken() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getProjectErrorMessage(
  error: { code?: string; message?: string } | null,
  fallback: string
) {
  if (error?.code === "23505") {
    return "That project slug is already in use"
  }
  return fallback
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingImages, setEditingImages] = useState<ProjectImage[]>([])
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState<number | null>(null)
  const supabase = createClient()

  const fetchProjects = useCallback(async () => {
    let query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })

    if (categoryFilter !== "all") {
      query = query.eq("category", categoryFilter)
    }
    if (yearFilter) {
      query = query.eq("year", yearFilter)
    }
    if (searchQuery.trim()) {
      query = query.ilike("title", `%${searchQuery.trim()}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load projects")
    } else {
      setProjects((data as Project[]) || [])
    }
    setIsLoading(false)
  }, [categoryFilter, searchQuery, supabase, yearFilter])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProjects()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchProjects])

  const fetchProjectImages = useCallback(
    async (projectId: string) => {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })

      if (error) {
        console.error("Error fetching project images:", error)
        toast.error("Failed to load the existing gallery images")
        return []
      }

      return (data as ProjectImage[]) || []
    },
    [supabase]
  )

  /** Best-effort cleanup: returns the error instead of throwing so a failed
   *  cleanup never rolls back a database change that already succeeded. */
  const removeStorageObjects = useCallback(
    async (paths: string[]) => {
      if (paths.length === 0) return null

      const { error } = await supabase.storage
        .from(PORTFOLIO_BUCKET)
        .remove(paths)

      if (error) {
        console.error("Failed to remove storage objects:", error, paths)
      }
      return error
    },
    [supabase]
  )

  const handleCreate = () => {
    setEditingProject(null)
    setEditingImages([])
    setIsModalOpen(true)
  }

  // Lets "Add a project" on the dashboard land straight in the form.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("new")) return
    window.history.replaceState(null, "", window.location.pathname)
    const timeoutId = window.setTimeout(() => {
      setEditingProject(null)
      setEditingImages([])
      setIsModalOpen(true)
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const handleEdit = async (project: Project) => {
    setEditingProject(project)
    setEditingImages([])
    setIsModalOpen(true)
    setEditingImages(await fetchProjectImages(project.id))
  }

  const handleDelete = async (project: Project) => {
    const actionKey = `delete:${project.id}`
    const toastId = toast.loading("Deleting project...")
    setPendingAction(actionKey)

    try {
      // Grab the image URLs first — the rows cascade away with the project.
      const images = await fetchProjectImages(project.id)
      const storagePaths = collectStoragePaths([
        project.cover_url,
        ...images.map((image) => image.image_url),
      ])

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id)
      if (error) throw error

      const removalError = await removeStorageObjects(storagePaths)
      if (removalError) {
        toast.warning(
          "Project deleted, but some image files could not be removed from storage",
          { id: toastId }
        )
      } else {
        toast.success("Project deleted successfully", { id: toastId })
      }

      setDeleteTarget(null)
      await fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project", { id: toastId })
    } finally {
      setPendingAction(null)
    }
  }

  const handleSave = async (
    formData: ProjectFormValues,
    coverFile?: File | null,
    galleryFiles?: File[] | null,
    removedImageIds?: string[] | null
  ) => {
    const isEditing = Boolean(editingProject)
    const toastId = toast.loading(
      isEditing ? "Updating project..." : "Creating project..."
    )
    const previousCoverUrl = editingProject?.cover_url || ""
    let coverUrl = previousCoverUrl
    let uploadedCoverPath: string | null = null

    try {
      if (coverFile) {
        const extension = coverFile.name.split(".").pop() || "bin"
        uploadedCoverPath = `projects/${formData.slug}/${createUploadToken()}-cover.${extension}`
        const { error: uploadError } = await supabase.storage
          .from("portfolio-assets")
          .upload(uploadedCoverPath, coverFile)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("portfolio-assets")
          .getPublicUrl(uploadedCoverPath)
        coverUrl = publicUrl
      }

      if (!coverUrl) {
        toast.error("A cover image is required", { id: toastId })
        return false
      }

      const projectData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        subtitle: formData.subtitle.trim() || null,
        description: formData.description.trim(),
        category: formData.category.trim(),
        year: formData.year,
        role: formData.role.trim() || null,
        cover_url: coverUrl,
        github_url: formData.github_url.trim(),
        live_url: formData.live_url.trim() || null,
        tech_stack: formData.tech_stack,
        features: formData.features,
        featured: formData.featured,
        status: "published" as const,
        updated_at: new Date().toISOString(),
      }

      const result = editingProject
        ? await supabase
            .from("projects")
            .update(projectData)
            .eq("id", editingProject.id)
            .select("id")
            .single()
        : await supabase
            .from("projects")
            .insert(projectData)
            .select("id")
            .single()

      if (result.error || !result.data) {
        if (uploadedCoverPath) {
          await supabase.storage
            .from("portfolio-assets")
            .remove([uploadedCoverPath])
        }
        throw result.error || new Error("Project ID was not returned")
      }

      // The cover was replaced, so the old file is no longer referenced.
      if (uploadedCoverPath && previousCoverUrl) {
        await removeStorageObjects(collectStoragePaths([previousCoverUrl]))
      }

      const removedIds = removedImageIds || []
      if (removedIds.length > 0) {
        const removedImages = editingImages.filter((image) =>
          removedIds.includes(image.id)
        )
        const { error: removeRowsError } = await supabase
          .from("project_images")
          .delete()
          .in("id", removedIds)

        if (removeRowsError) {
          console.error("Failed to remove gallery rows:", removeRowsError)
          toast.warning("Some gallery images could not be removed", {
            id: toastId,
          })
        } else {
          await removeStorageObjects(
            collectStoragePaths(removedImages.map((image) => image.image_url))
          )
        }
      }

      let galleryFailures = 0
      const uploadedGalleryPaths: string[] = []
      const galleryRows: Array<{
        project_id: string
        image_url: string
      }> = []

      for (const file of galleryFiles || []) {
        const extension = file.name.split(".").pop() || "bin"
        const path = `projects/${formData.slug}/gallery-${createUploadToken()}.${extension}`
        const { error: galleryUploadError } = await supabase.storage
          .from("portfolio-assets")
          .upload(path, file)

        if (galleryUploadError) {
          console.error(`Failed to upload gallery image ${file.name}:`, galleryUploadError)
          galleryFailures += 1
          continue
        }

        uploadedGalleryPaths.push(path)
        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio-assets").getPublicUrl(path)
        galleryRows.push({
          project_id: result.data.id,
          image_url: publicUrl,
        })
      }

      if (galleryRows.length > 0) {
        const { error: galleryInsertError } = await supabase
          .from("project_images")
          .insert(galleryRows)

        if (galleryInsertError) {
          console.error("Failed to save gallery rows:", galleryInsertError)
          galleryFailures += galleryRows.length
          await supabase.storage
            .from("portfolio-assets")
            .remove(uploadedGalleryPaths)
        }
      }

      if (galleryFailures > 0) {
        toast.warning(
          `Project saved, but ${galleryFailures} gallery image(s) could not be added`,
          { id: toastId }
        )
      } else {
        toast.success(
          isEditing
            ? "Project updated successfully"
            : "Project created successfully",
          { id: toastId }
        )
      }

      setIsModalOpen(false)
      setEditingProject(null)
      setEditingImages([])
      await fetchProjects()
      return true
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error(
        getProjectErrorMessage(
          error as { code?: string; message?: string },
          isEditing ? "Failed to update project" : "Failed to create project"
        ),
        { id: toastId }
      )
      return false
    }
  }

  const isRowPending = pendingAction !== null

  return (
    <>
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <p className="max-w-xl text-sm text-muted-foreground">
      Everything you have built. Projects go live on your site as soon as you save them.
    </p>
    <Button onClick={handleCreate}>
      <PlusIcon data-icon="inline-start" />
      Add Project
    </Button>
  </div>

  <div className="mb-6 flex flex-col gap-4 sm:flex-row">
    <Input
      placeholder="Search projects..."
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
      className="flex-1"
    />
    <div className="flex flex-wrap gap-4">
      <select
        value={categoryFilter}
        onChange={(event) => setCategoryFilter(event.target.value)}
        className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
      >
        <option value="all">All Categories</option>
        {Array.from(new Set(projects.map((project) => project.category))).map(
          (category) => (
            <option key={category} value={category}>
              {category}
            </option>
          )
        )}
      </select>
      <select
        value={yearFilter || ""}
        onChange={(event) =>
          setYearFilter(
            event.target.value
              ? Number.parseInt(event.target.value, 10)
              : null
          )
        }
        className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
      >
        <option value="">All Years</option>
        {Array.from(new Set(projects.map((project) => project.year)))
          .sort((a, b) => b - a)
          .map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
      </select>
    </div>
  </div>

  {isLoading ? (
    <div className="flex items-center justify-center gap-3 rounded-md border p-10 text-sm text-muted-foreground">
      <Spinner aria-hidden />
      Loading projects...
    </div>
  ) : (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">Title</th>
            <th className="p-3 text-left font-medium">Category</th>
            <th className="p-3 text-left font-medium">Year</th>
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
              <td className="p-3">{project.featured ? "Yes" : "No"}</td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleEdit(project)}
                    disabled={isRowPending}
                  >
                    <PencilIcon data-icon="inline-start" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(project)}
                    disabled={isRowPending}
                  >
                    <Trash2Icon data-icon="inline-start" />
                    {pendingAction === `delete:${project.id}`
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </div>
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

  {isModalOpen && (
    <ProjectModal
      isOpen
      onClose={() => setIsModalOpen(false)}
      initialData={editingProject}
      initialImages={editingImages}
      onSave={handleSave}
    />
  )}

  <ConfirmDialog
    open={deleteTarget !== null}
    onOpenChange={(open) => {
      if (!open) setDeleteTarget(null)
    }}
    onConfirm={() => {
      if (deleteTarget) void handleDelete(deleteTarget)
    }}
    isPending={pendingAction !== null}
    title="Delete this project?"
    description={
      <>
        <strong className="font-medium text-foreground">
          {deleteTarget?.title}
        </strong>{" "}
        will be removed from your site, together with its cover and gallery
        images. This cannot be undone.
      </>
    }
    confirmLabel="Delete project"
  />
    </>
  )
}
