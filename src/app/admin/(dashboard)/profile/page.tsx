"use client"

import { useState, useEffect } from "react"
import { SaveIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { FileUpload } from "@/components/admin/FileUpload"
import { Profile } from "@/types/database"

/** Lets the form be filled in even when no profile row exists yet. */
function createEmptyProfile(): Profile {
  return {
    id: "",
    full_name: null,
    professional_title: null,
    bio: null,
    email: null,
    phone: null,
    github_url: null,
    resume_url: null,
    availability: null,
    institution: null,
    study_program: null,
    graduation_year: null,
    created_at: "",
    updated_at: "",
  }
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle()
      if (error) {
        console.error("Error loading profile:", error)
        toast.error("Failed to load profile")
      }
      setProfile(data ? (data as Profile) : createEmptyProfile())
      setIsLoading(false)
    }
    load()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setIsSaving(true)
    const toastId = toast.loading("Saving profile...")
    
    let resume_url = profile.resume_url || ""
    
    if (cvFile) {
      const ext = cvFile.name.split(".").pop()
      const path = `resume/rizka-aulia-resume.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(path, cvFile, { upsert: true })
      if (uploadError) {
        toast.error("Failed to upload CV", { id: toastId })
        setIsSaving(false)
        return
      }
      const { data: { publicUrl } } = supabase.storage.from("portfolio-assets").getPublicUrl(path)
      resume_url = publicUrl
    }
    
    const values = {
      full_name: profile.full_name,
      professional_title: profile.professional_title,
      bio: profile.bio,
      email: profile.email,
      phone: profile.phone,
      github_url: profile.github_url,
      resume_url,
      availability: profile.availability,
      institution: profile.institution,
      study_program: profile.study_program,
      graduation_year: profile.graduation_year,
      updated_at: new Date().toISOString(),
    }

    // No row yet (fresh database) — create one instead of updating nothing.
    const { data, error } = profile.id
      ? await supabase.from("profiles").update(values).eq("id", profile.id).select().maybeSingle()
      : await supabase.from("profiles").insert(values).select().maybeSingle()

    if (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to update profile", { id: toastId })
      setIsSaving(false)
      return
    }

    if (data) setProfile(data as Profile)
    setCvFile(null)
    toast.success("Profile updated successfully", { id: toastId })
    setIsSaving(false)
  }

  if (isLoading) return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <Spinner />
      Loading your profile...
    </div>
  )

  return (
    <>
  <p className="mb-6 max-w-xl text-sm text-muted-foreground">
    These details appear across your public site — the hero, about section and contact links.
  </p>
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
      <Button type="submit" disabled={isSaving}>
        {isSaving ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <SaveIcon data-icon="inline-start" />
        )}
        {isSaving ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  </form>
    </>
  )
}
