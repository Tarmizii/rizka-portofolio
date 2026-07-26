"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function AdminSettings() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [isLoadingEmail, setIsLoadingEmail] = useState(true)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "")
      setIsLoadingEmail(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." })
      return
    }

    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)

    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "success", text: "Password updated successfully." })
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <>
  <section className="mb-10">
    <h2 className="text-lg font-semibold mb-4">Account</h2>
    <div className="space-y-2">
      <Label>Email</Label>
      {isLoadingEmail ? (
        <div className="h-10 w-full animate-pulse rounded-md border border-[#2e2e38] bg-[#18181c]" />
      ) : (
        <Input value={email} disabled className="bg-[#18181c] border-[#2e2e38] opacity-70" />
      )}
      <p className="text-sm text-muted-foreground">
        Signed-in admin account. Email changes are managed via Supabase.
      </p>
    </div>
  </section>

  <section>
    <h2 className="text-lg font-semibold mb-4">Change Password</h2>
    <form onSubmit={handleChangePassword} className="space-y-4">
      <div className="space-y-2">
        <Label>New Password</Label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="bg-[#18181c] border-[#2e2e38]"
        />
      </div>
      <div className="space-y-2">
        <Label>Confirm New Password</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-[#18181c] border-[#2e2e38]"
        />
      </div>
      {message && (
        <p className={message.type === "error" ? "text-sm text-red-500" : "text-sm text-green-500"}>
          {message.text}
        </p>
      )}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Update Password"}
      </Button>
    </form>
  </section>
    </>
  )
}
