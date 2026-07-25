"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { FileUpload } from "@/components/admin/FileUpload"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { Profile } from "@/types/database"

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("profiles").select("*").single()
      if (data) setProfile(data as Profile)
      setIsLoading(false)
    }
    load()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setIsSaving(true)
    
    let resume_url = profile.resume_url || ""
    
    if (cvFile) {
      const ext = cvFile.name.split(".").pop()
      const path = `resume/rizka-aulia-resume.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(path, cvFile, { upsert: true })
      if (uploadError) {
        toast.error("Failed to upload CV")
        setIsSaving(false)
        return
      }
      const { data: { publicUrl } } = supabase.storage.from("portfolio-assets").getPublicUrl(path)
      resume_url = publicUrl
    }
    
    const { error } = await supabase.from("profiles").update({
      ...profile,
      resume_url,
    }).eq("id", profile.id)
    
    if (error) toast.error("Failed to update profile")
    else toast.success("Profile updated successfully")
    setIsSaving(false)
  }

  if (isLoading) return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6"><p>Loading...</p></main>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile?.full_name || ""} onChange={(e) => setProfile({...profile!, full_name: e.target.value})} className="bg-[#18181c] border-[#2e2e38]" />
              </div>
              <div className="space-y-2">
                <Label>Professional Title</Label>
                <Input value={profile?.professional_title || ""} onChange={(e) => setProfile({...profile!, professional_title: e.target.value})} className="bg-[#18181c] border-[#2e2e38]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea value={profile?.bio || ""} onChange={(e) => setProfile({...profile!, bio: e.target.value})} rows={4} className="flex w-full rounded-md border border-[#2e2e38] bg-[#18181c] px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={profile?.email || ""} onChange={(e) => setProfile({...profile!, email: e.target.value})} className="bg-[#18181c] border-[#2e2e38]" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={profile?.phone || ""} onChange={(e) => setProfile({...profile!, phone: e.target.value})} className="bg-[#18181c] border-[#2e2e38]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input value={profile?.github_url || ""} onChange={(e) => setProfile({...profile!, github_url: e.target.value})} className="bg-[#18181c] border-[#2e2e38]" />
            </div>
            <div className="space-y-2">
              <Label>Resume CV (PDF)</Label>
              <FileUpload
                label=""
                file={cvFile}
                onFileChange={setCvFile}
                accept=".pdf,application/pdf"
              />
              {profile?.resume_url && !cvFile && (
                <p className="text-xs text-muted-foreground">
                  Current CV: {profile.resume_url}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <Input value={profile?.availability || ""} onChange={(e) => setProfile({...profile!, availability: e.target.value})} className="bg-[#18181c] border-[#2e2e38]" />
            </div>
            <div className="border-t border-[#2a2a32] pt-4">
              <h3 className="text-lg font-semibold mb-4">Education</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input value={profile?.institution || ""} onChange={(e) => setProfile({...profile!, institution: e.target.value})} className="bg-[#18181c] border-[#2e2e38]" />
                </div>
                <div className="space-y-2">
                  <Label>Study Program</Label>
                  <Input value={profile?.study_program || ""} onChange={(e) => setProfile({...profile!, study_program: e.target.value})} className="bg-[#18181c] border-[#2e2e38]" />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Graduation Year</Label>
                <Input type="number" value={profile?.graduation_year || ""} onChange={(e) => setProfile({...profile!, graduation_year: parseInt(e.target.value) || null})} className="bg-[#18181c] border-[#2e2e38]" />
              </div>
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={isSaving} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}