"use client"

import { useCallback, useEffect, useState } from "react"
import {
  PencilIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
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
import { createClient } from "@/lib/supabase/client"
import { Skill } from "@/types/database"

interface SkillFormValues {
  name: string
  category: string
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const fetchSkills = useCallback(async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })

    if (error) {
      console.error("Error fetching skills:", error)
      toast.error("Failed to load skills")
    } else {
      setSkills((data as Skill[]) || [])
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSkills()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchSkills])

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting skill...")
    setPendingAction(id)
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id)
      if (error) throw error

      toast.success("Skill deleted successfully", { id: toastId })
      setDeleteTarget(null)
      await fetchSkills()
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast.error("Failed to delete skill", { id: toastId })
    } finally {
      setPendingAction(null)
    }
  }

  const handleSave = async (formData: SkillFormValues) => {
    const isEditing = Boolean(editingSkill)
    const toastId = toast.loading(
      isEditing ? "Updating skill..." : "Creating skill..."
    )
    setIsSaving(true)

    try {
      const skillData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        visible: true,
        updated_at: new Date().toISOString(),
      }

      const { error } = editingSkill
        ? await supabase
            .from("skills")
            .update(skillData)
            .eq("id", editingSkill.id)
        : await supabase.from("skills").insert(skillData)

      if (error) throw error

      toast.success(
        isEditing ? "Skill updated successfully" : "Skill created successfully",
        { id: toastId }
      )
      setIsModalOpen(false)
      setEditingSkill(null)
      await fetchSkills()
      return true
    } catch (error) {
      console.error("Error saving skill:", error)
      toast.error(
        isEditing ? "Failed to update skill" : "Failed to create skill",
        { id: toastId }
      )
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <p className="max-w-xl text-sm text-muted-foreground">
      The tools you work with. Every skill you add is shown on your public site.
    </p>
    <Button
      onClick={() => {
        setEditingSkill(null)
        setIsModalOpen(true)
      }}
    >
      <PlusIcon data-icon="inline-start" />
      Add Skill
    </Button>
  </div>

  {isLoading ? (
    <div className="flex items-center justify-center gap-3 rounded-md border p-10 text-sm text-muted-foreground">
      <Spinner aria-hidden />
      Loading skills...
    </div>
  ) : (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">Name</th>
            <th className="p-3 text-left font-medium">Category</th>
            <th className="p-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id} className="border-b">
              <td className="p-3 font-medium">{skill.name}</td>
              <td className="p-3">{skill.category}</td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pendingAction !== null}
                    onClick={() => {
                      setEditingSkill(skill)
                      setIsModalOpen(true)
                    }}
                  >
                    <PencilIcon data-icon="inline-start" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={pendingAction !== null}
                    onClick={() => setDeleteTarget(skill)}
                  >
                    <Trash2Icon data-icon="inline-start" />
                    {pendingAction === skill.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {skills.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No skills yet
        </div>
      )}
    </div>
  )}

  {isModalOpen && (
    <SkillForm
      isOpen
      onClose={() => setIsModalOpen(false)}
      initialData={editingSkill}
      onSave={handleSave}
      isSaving={isSaving}
    />
  )}

  <ConfirmDialog
    open={deleteTarget !== null}
    onOpenChange={(open) => {
      if (!open) setDeleteTarget(null)
    }}
    onConfirm={() => {
      if (deleteTarget) void handleDelete(deleteTarget.id)
    }}
    isPending={pendingAction !== null}
    title="Delete this skill?"
    description={
      <>
        <strong className="font-medium text-foreground">
          {deleteTarget?.name}
        </strong>{" "}
        will be removed from your site. This cannot be undone.
      </>
    }
    confirmLabel="Delete skill"
  />
    </>
  )
}

function SkillForm({
  isOpen,
  onClose,
  initialData,
  onSave,
  isSaving,
}: {
  isOpen: boolean
  onClose: () => void
  initialData: Skill | null
  onSave: (data: SkillFormValues) => Promise<boolean>
  isSaving: boolean
}) {
  const [form, setForm] = useState<SkillFormValues>(() => ({
    name: initialData?.name || "",
    category: initialData?.category || "",
  }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSave(form)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose()
      }}
    >
      <DialogContent className="p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? "Edit Skill" : "Add Skill"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input
              id="skill-name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="skill-category">Category</Label>
            <Input
              id="skill-category"
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Skills are visible automatically.
          </p>
          <DialogFooter className="border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SaveIcon data-icon="inline-start" />
              )}
              {isSaving ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
