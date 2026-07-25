export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-background/20 p-4">
      <nav className="space-y-2">
        <div className="font-semibold text-lg mb-4">Admin</div>
        <div className="space-y-1">
          <a href="/admin" className="px-3 py-2 hover:bg-accent/50 rounded-md block">Dashboard</a>
        </div>
        <div className="mt-4 font-semibold">Content</div>
        <div className="space-y-1 mt-1">
          <a href="/admin/projects" className="px-3 py-2 hover:bg-accent/50 rounded-md block">Projects</a>
          <a href="/admin/certificates" className="px-3 py-2 hover:bg-accent/50 rounded-md block">Certificates</a>
          <a href="/admin/skills" className="px-3 py-2 hover:bg-accent/50 rounded-md block">Skills</a>
        </div>
        <div className="mt-4 font-semibold">General</div>
        <div className="space-y-1 mt-1">
          <a href="/admin/profile" className="px-3 py-2 hover:bg-accent/50 rounded-md block">Profile</a>
          <a href="/admin/settings" className="px-3 py-2 hover:bg-accent/50 rounded-md block">Settings</a>
        </div>
        <div className="mt-4 pt-4 border-t border-background/20">
          <a href="/admin/login" className="px-3 py-2 hover:bg-accent/50 rounded-md block text-red-500">Logout</a>
        </div>
      </nav>
    </aside>
  )
}
