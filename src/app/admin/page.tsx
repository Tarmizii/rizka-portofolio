import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

interface Stats {
  totalProjects: number
  publishedProjects: number
  totalCertificates: number
  publishedCertificates: number
  totalSkills: number
  activeSkills: number
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: totalProjects }, { count: publishedProjects }, { count: totalCertificates }, { count: publishedCertificates }, { count: totalSkills }, { count: activeSkills }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact" }),
    supabase.from("projects").select("*", { count: "exact" }).eq("status", "published"),
    supabase.from("certificates").select("*", { count: "exact" }),
    supabase.from("certificates").select("*", { count: "exact" }).eq("status", "published"),
    supabase.from("skills").select("*", { count: "exact" }),
    supabase.from("skills").select("*", { count: "exact" }).eq("visible", true),
  ])

  const stats: Stats = {
    totalProjects: totalProjects || 0,
    publishedProjects: publishedProjects || 0,
    totalCertificates: totalCertificates || 0,
    publishedCertificates: publishedCertificates || 0,
    totalSkills: totalSkills || 0,
    activeSkills: activeSkills || 0,
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalProjects}</div>
                <div className="text-sm text-muted-foreground">
                  {stats.publishedProjects} published
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalCertificates}</div>
                <div className="text-sm text-muted-foreground">
                  {stats.publishedCertificates} published
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.activeSkills}</div>
                <div className="text-sm text-muted-foreground">
                  {stats.totalSkills} total
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.publishedProjects > 0 ? (
                  <div className="text-sm text-muted-foreground">View all projects in the Projects section</div>
                ) : (
                  <div className="text-sm text-muted-foreground">No projects yet</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href="/admin/projects">
                  <Button className="w-full" variant="outline">Manage Projects</Button>
                </a>
                <a href="/admin/certificates">
                  <Button className="w-full" variant="outline">Manage Certificates</Button>
                </a>
                <a href="/admin/skills">
                  <Button className="w-full" variant="outline">Manage Skills</Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
