"use client"

import { useEffect, useState } from "react"
import { createClient as createSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

interface Project {
  id: string
  title: string
  slug: string
  category: string
  year: number
  status: "draft" | "published"
  featured: boolean
}

interface Certificate {
  id: string
  title: string
  issuer: string | null
  year: number | null
  status: "draft" | "published"
  featured: boolean
}

interface Skill {
  id: string
  name: string
  category: string
  visible: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalCertificates: 0,
    publishedCertificates: 0,
    totalSkills: 0,
    activeSkills: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setIsLoading(true)
    try {
      // Fetch projects stats
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")

      if (projectsError) throw projectsError

      // Fetch certificates stats
      const { data: certificates, error: certificatesError } = await supabase
        .from("certificates")
        .select("*")

      if (certificatesError) throw certificatesError

      // Fetch skills stats
      const { data: skills, error: skillsError } = await supabase
        .from("skills")
        .select("*")

      if (skillsError) throw skillsError

      setStats({
        totalProjects: projects.length,
        publishedProjects: projects.filter(p => p.status === "published").length,
        totalCertificates: certificates.length,
        publishedCertificates: certificates.filter(c => c.status === "published").length,
        totalSkills: skills.length,
        activeSkills: skills.filter(s => s.visible).length,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <Button>Add New</Button>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
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
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">No recent projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  Add New Project
                </Button>
                <Button className="w-full" variant="outline">
                  Add New Certificate
                </Button>
                <Button className="w-full" variant="outline">
                  Add New Skill
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
