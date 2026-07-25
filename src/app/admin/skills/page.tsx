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
import { Skill } from "@/types/database"

interface SkillFormValues {
  name: string
  category: string
  visible: boolean
  sort_order: number
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Error fetching skills:", error)
      toast.error("Failed to load skills")
    } else {
      setSkills(data as Skill[])
    }
    setIsLoading(false)
  }

  const handleCreate = () => {
    setEditingSkill(null)
    setIsModalOpen(true)
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return
    const { error } = await supabase.from("skills").delete().eq("id", id)
    if (error) toast.error("Failed to delete")
    else { toast.success("Deleted"); fetchSkills() }
  }

  const handleSave = async (formData: SkillFormValues) => {
    const data = {
      name: formData.name,
      category: formData.category,
      visible: formData.visible,
      sort_order: formData.sort_order,
    }

    const { error } = editingSkill
      ? await supabase.from("skills").update(data).eq("id", editingSkill.id)
      : await supabase.from("skills").insert(data)

    if (error) toast.error(editingSkill ? "Update failed" : "Create failed")
    else { toast.success(editingSkill ? "Updated" : "Created"); setIsModalOpen(false); fetchSkills() }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Skills</h2>
            <Button onClick={handleCreate}>Add Skill</Button>
          </div>
          {isLoading ? <p>Loading...</p> : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Name</th>
                    <th className="p-3 text-left font-medium">Category</th>
                    <th className="p-3 text-left font-medium">Visible</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill) => (
                    <tr key={skill.id} className="border-b">
                      <td className="p-3 font-medium">{skill.name}</td>
                      <td className="p-3">{skill.category}</td>
                      <td className="p-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          skill.visible
                            ? "bg-green-500/10 text-green-500"
                            : "bg-gray-500/10 text-gray-500"
                        }`}>
                          {skill.visible ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {skills.length === 0 && <div className="p-8 text-center text-muted-foreground">No skills yet</div>}
            </div>
          )}
        </main>
      </div>
      <SkillForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={editingSkill} onSave={handleSave} />
    </div>
  )
}

function SkillForm({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData: Skill | null; onSave: (data: SkillFormValues) => void }) {
  const [form, setForm] = useState<SkillFormValues>({
    name: initialData?.name || "",
    category: initialData?.category || "",
    visible: initialData?.visible !== undefined ? initialData.visible : true,
    sort_order: initialData?.sort_order || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Skill" : "Add Skill"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({...form, visible: e.target.checked})} />
            <Label>Visible</Label>
          </div>
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: parseInt(e.target.value)})} />
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
