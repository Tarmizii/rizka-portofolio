"use client"

import { useCallback, useEffect, useState } from "react"
import {
  PencilIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { FileUpload } from "@/components/admin/FileUpload"
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
import { collectStoragePaths, PORTFOLIO_BUCKET } from "@/lib/supabase/storage"
import { Certificate } from "@/types/database"

interface CertificateFormValues {
  title: string
  issuer: string
  year: number
  featured: boolean
}

function createUploadToken() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certificate | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const fetchCertificates = useCallback(async () => {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })

    if (error) {
      console.error("Error fetching certificates:", error)
      toast.error("Failed to load certificates")
    } else {
      setCertificates((data as Certificate[]) || [])
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCertificates()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchCertificates])

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

  const handleDelete = async (certificate: Certificate) => {
    const toastId = toast.loading("Deleting certificate...")
    setPendingAction(certificate.id)
    try {
      const storagePaths = collectStoragePaths([
        certificate.cover_url,
        certificate.pdf_url,
      ])

      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", certificate.id)
      if (error) throw error

      const removalError = await removeStorageObjects(storagePaths)
      if (removalError) {
        toast.warning(
          "Certificate deleted, but its files could not be removed from storage",
          { id: toastId }
        )
      } else {
        toast.success("Certificate deleted successfully", { id: toastId })
      }

      setDeleteTarget(null)
      await fetchCertificates()
    } catch (error) {
      console.error("Error deleting certificate:", error)
      toast.error("Failed to delete certificate", { id: toastId })
    } finally {
      setPendingAction(null)
    }
  }

  const handleSave = async (
    formData: CertificateFormValues,
    coverFile?: File | null,
    pdfFile?: File | null
  ) => {
    const isEditing = Boolean(editingCert)
    const toastId = toast.loading(
      isEditing ? "Updating certificate..." : "Creating certificate..."
    )
    const newUploadPaths: string[] = []
    const replacedUrls: string[] = []
    let coverUrl = editingCert?.cover_url || ""
    let pdfUrl = editingCert?.pdf_url || ""
    setIsSaving(true)

    try {
      if (coverFile) {
        const extension = coverFile.name.split(".").pop() || "bin"
        const path = `covers/${createUploadToken()}.${extension}`
        const { error } = await supabase.storage
          .from("portfolio-assets")
          .upload(path, coverFile)
        if (error) throw error

        newUploadPaths.push(path)
        if (coverUrl) replacedUrls.push(coverUrl)
        coverUrl = supabase.storage
          .from("portfolio-assets")
          .getPublicUrl(path).data.publicUrl
      }

      if (pdfFile) {
        const extension = pdfFile.name.split(".").pop() || "pdf"
        const path = `pdfs/${createUploadToken()}.${extension}`
        const { error } = await supabase.storage
          .from("portfolio-assets")
          .upload(path, pdfFile)
        if (error) throw error

        newUploadPaths.push(path)
        if (pdfUrl) replacedUrls.push(pdfUrl)
        pdfUrl = supabase.storage
          .from("portfolio-assets")
          .getPublicUrl(path).data.publicUrl
      }

      if (!coverUrl || !pdfUrl) {
        throw new Error("Cover image and PDF are required")
      }

      const certificateData = {
        title: formData.title.trim(),
        issuer: formData.issuer.trim() || null,
        year: formData.year,
        cover_url: coverUrl,
        pdf_url: pdfUrl,
        featured: formData.featured,
        status: "published" as const,
        updated_at: new Date().toISOString(),
      }

      const { error } = editingCert
        ? await supabase
            .from("certificates")
            .update(certificateData)
            .eq("id", editingCert.id)
        : await supabase.from("certificates").insert(certificateData)

      if (error) {
        throw error
      }

      // The old files are no longer referenced once the row points elsewhere.
      await removeStorageObjects(collectStoragePaths(replacedUrls))

      toast.success(
        isEditing
          ? "Certificate updated successfully"
          : "Certificate created successfully",
        { id: toastId }
      )
      setIsModalOpen(false)
      setEditingCert(null)
      await fetchCertificates()
      return true
    } catch (error) {
      console.error("Error saving certificate:", error)
      if (newUploadPaths.length > 0) {
        await supabase.storage
          .from("portfolio-assets")
          .remove(newUploadPaths)
      }
      toast.error(
        error instanceof Error && error.message === "Cover image and PDF are required"
          ? error.message
          : isEditing
            ? "Failed to update certificate"
            : "Failed to create certificate",
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
      Upload a cover image and the certificate PDF. Certificates appear on your site as
      soon as you save them.
    </p>
    <Button
      onClick={() => {
        setEditingCert(null)
        setIsModalOpen(true)
      }}
    >
      <PlusIcon data-icon="inline-start" />
      Add Certificate
    </Button>
  </div>

  {isLoading ? (
    <div className="flex items-center justify-center gap-3 rounded-md border p-10 text-sm text-muted-foreground">
      <Spinner aria-hidden />
      Loading certificates...
    </div>
  ) : (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">Title</th>
            <th className="p-3 text-left font-medium">Issuer</th>
            <th className="p-3 text-left font-medium">Year</th>
            <th className="p-3 text-left font-medium">Featured</th>
            <th className="p-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((certificate) => (
            <tr key={certificate.id} className="border-b">
              <td className="p-3 font-medium">{certificate.title}</td>
              <td className="p-3">{certificate.issuer || "-"}</td>
              <td className="p-3">{certificate.year || "-"}</td>
              <td className="p-3">{certificate.featured ? "Yes" : "No"}</td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pendingAction !== null}
                    onClick={() => {
                      setEditingCert(certificate)
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
                    onClick={() => setDeleteTarget(certificate)}
                  >
                    <Trash2Icon data-icon="inline-start" />
                    {pendingAction === certificate.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {certificates.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No certificates yet
        </div>
      )}
    </div>
  )}

  {isModalOpen && (
    <CertificateForm
      isOpen
      onClose={() => setIsModalOpen(false)}
      initialData={editingCert}
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
      if (deleteTarget) void handleDelete(deleteTarget)
    }}
    isPending={pendingAction !== null}
    title="Delete this certificate?"
    description={
      <>
        <strong className="font-medium text-foreground">
          {deleteTarget?.title}
        </strong>{" "}
        will be removed from your site, together with its cover image and PDF.
        This cannot be undone.
      </>
    }
    confirmLabel="Delete certificate"
  />
    </>
  )
}

function CertificateForm({
  isOpen,
  onClose,
  initialData,
  onSave,
  isSaving,
}: {
  isOpen: boolean
  onClose: () => void
  initialData: Certificate | null
  onSave: (
    data: CertificateFormValues,
    coverFile?: File | null,
    pdfFile?: File | null
  ) => Promise<boolean>
  isSaving: boolean
}) {
  const [form, setForm] = useState<CertificateFormValues>(() => ({
    title: initialData?.title || "",
    issuer: initialData?.issuer || "",
    year: initialData?.year || new Date().getFullYear(),
    featured: initialData?.featured || false,
  }))
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!initialData && (!coverFile || !pdfFile)) {
      toast.error("Cover image and PDF are required")
      return
    }
    await onSave(form, coverFile, pdfFile)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose()
      }}
    >
      <DialogContent className="p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? "Edit Certificate" : "Add Certificate"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="certificate-title">Title</Label>
            <Input
              id="certificate-title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="certificate-issuer">Issuer</Label>
              <Input
                id="certificate-issuer"
                value={form.issuer}
                onChange={(event) => setForm({ ...form, issuer: event.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="certificate-year">Year</Label>
              <Input
                id="certificate-year"
                type="number"
                value={form.year}
                onChange={(event) =>
                  setForm({
                    ...form,
                    year: Number.parseInt(event.target.value, 10),
                  })
                }
                required
              />
            </div>
          </div>
          <FileUpload
            label={initialData ? "Replace Cover Image (Optional)" : "Cover Image"}
            file={coverFile}
            onFileChange={setCoverFile}
            accept="image/*"
          />
          <FileUpload
            label={initialData ? "Replace PDF (Optional)" : "PDF Certificate"}
            file={pdfFile}
            onFileChange={setPdfFile}
            accept=".pdf,application/pdf"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="certificate-featured"
              checked={form.featured}
              onChange={(event) =>
                setForm({ ...form, featured: event.target.checked })
              }
              className="size-4 rounded border-border accent-[var(--accent)]"
            />
            <Label htmlFor="certificate-featured">Featured</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Certificates are published automatically.
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
