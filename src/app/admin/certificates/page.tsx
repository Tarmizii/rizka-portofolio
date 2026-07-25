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
import { Certificate } from "@/types/database"

interface CertificateFormValues {
  title: string
  issuer: string
  year: number
  featured: boolean
  status: "draft" | "published"
  sort_order: number
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certificate | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchCertificates()
  }, [])

  async function fetchCertificates() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Error fetching certificates:", error)
      toast.error("Failed to load certificates")
    } else {
      setCertificates(data as Certificate[])
    }
    setIsLoading(false)
  }

  const handleCreate = () => {
    setEditingCert(null)
    setIsModalOpen(true)
  }

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return
    const { error } = await supabase.from("certificates").delete().eq("id", id)
    if (error) toast.error("Failed to delete")
    else { toast.success("Deleted"); fetchCertificates() }
  }

  const handlePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "draft" ? "published" : "draft"
    const { error } = await supabase.from("certificates").update({ status: newStatus }).eq("id", id)
    if (error) toast.error(`Failed to ${newStatus === "draft" ? "unpublish" : "publish"}`)
    else { toast.success(`Certificate ${newStatus === "draft" ? "unpublished" : "published"}`); fetchCertificates() }
  }

  const handleSave = async (formData: CertificateFormValues) => {
    const data = {
      title: formData.title,
      issuer: formData.issuer || null,
      year: formData.year,
      featured: formData.featured,
      status: formData.status,
      sort_order: formData.sort_order,
    }

    const { error } = editingCert
      ? await supabase.from("certificates").update(data).eq("id", editingCert.id)
      : await supabase.from("certificates").insert(data)

    if (error) toast.error(editingCert ? "Update failed" : "Create failed")
    else { toast.success(editingCert ? "Updated" : "Created"); setIsModalOpen(false); fetchCertificates() }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Certificates</h2>
            <Button onClick={handleCreate}>Add Certificate</Button>
          </div>
          {isLoading ? <p>Loading...</p> : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Title</th>
                    <th className="p-3 text-left font-medium">Issuer</th>
                    <th className="p-3 text-left font-medium">Year</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Featured</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="border-b">
                      <td className="p-3 font-medium">{cert.title}</td>
                      <td className="p-3">{cert.issuer || "-"}</td>
                      <td className="p-3">{cert.year || "-"}</td>
                      <td className="p-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          cert.status === "published"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-gray-500/10 text-gray-500"
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="p-3">{cert.featured ? "Yes" : "No"}</td>
                      <td className="p-3 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(cert)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePublish(cert.id, cert.status)}>
                          {cert.status === "draft" ? "Publish" : "Unpublish"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cert.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {certificates.length === 0 && <div className="p-8 text-center text-muted-foreground">No certificates yet</div>}
            </div>
          )}
        </main>
      </div>
      <CertForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={editingCert} onSave={handleSave} />
    </div>
  )
}

function CertForm({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData: Certificate | null; onSave: (data: CertificateFormValues) => void }) {
  const [form, setForm] = useState<CertificateFormValues>({
    title: initialData?.title || "",
    issuer: initialData?.issuer || "",
    year: initialData?.year || new Date().getFullYear(),
    featured: initialData?.featured || false,
    status: initialData?.status || "draft",
    sort_order: initialData?.sort_order || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">{initialData ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required className="bg-[#18181c] border-[#2e2e38]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Issuer</Label>
              <Input value={form.issuer} onChange={(e) => setForm({...form, issuer: e.target.value})} className="bg-[#18181c] border-[#2e2e38]" />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input type="number" value={form.year} onChange={(e) => setForm({...form, year: parseInt(e.target.value)})} required className="bg-[#18181c] border-[#2e2e38]" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <Label>Status</Label>
              <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value as "draft" | "published"})} className="flex h-10 w-full rounded-md border border-[#2e2e38] bg-[#18181c] px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none">
                <option value="draft" className="bg-[#18181c]">Draft</option>
                <option value="published" className="bg-[#18181c]">Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: parseInt(e.target.value)})} className="bg-[#18181c] border-[#2e2e38]" />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <input type="checkbox" id="cert-featured" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})} className="h-4 w-4 rounded border-[#2e2e38] bg-[#18181c] accent-orange-500" />
            <Label htmlFor="cert-featured" className="cursor-pointer">Featured</Label>
          </div>
          <DialogFooter className="pt-4 border-t border-[#2a2a32]">
            <Button type="button" variant="outline" onClick={onClose} className="border-[#2e2e38] hover:bg-[#1f1f24]">Cancel</Button>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">{initialData ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
