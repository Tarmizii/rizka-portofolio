import AdminShell from "@/components/admin/AdminShell"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const [{ data: auth }, { data: profile }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("profiles")
      .select("full_name, email")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  return (
    <AdminShell
      user={{
        name: profile?.full_name ?? null,
        email: profile?.email ?? auth.user?.email ?? null,
      }}
    >
      {children}
    </AdminShell>
  )
}
