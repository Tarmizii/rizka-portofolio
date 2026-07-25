import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function AdminSettings() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Settings</h2>
          <p className="text-muted-foreground">Settings management coming soon</p>
        </main>
      </div>
    </div>
  )
}