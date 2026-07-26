"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"

export default function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const toastId = toast.loading("Logging out...")
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast.error("Failed to log out", { id: toastId })
      setIsLoading(false)
      return
    }

    toast.success("Logged out successfully", { id: toastId })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <LogOutIcon data-icon="inline-start" />
      )}
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  )
}
