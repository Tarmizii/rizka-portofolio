"use client"

import { useState } from "react"
import LogoutButton from "@/components/admin/LogoutButton"

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6A13] text-white shadow-lg md:hidden"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 h-[85vh] overflow-y-auto rounded-t-xl bg-[#050505] p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">Admin Menu</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded-full p-2 hover:bg-[#252525] text-[#888]"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-2">
              <div className="font-semibold text-sm mb-2 text-[#888]">Admin</div>
              <div className="space-y-1">
                <a href="/admin" className="block px-3 py-2 hover:bg-[#252525] rounded-md">Dashboard</a>
              </div>
              <div className="font-semibold text-sm mb-2 mt-4 text-[#888]">Content</div>
              <div className="space-y-1">
                <a href="/admin/projects" className="block px-3 py-2 hover:bg-[#252525] rounded-md">Projects</a>
                <a href="/admin/certificates" className="block px-3 py-2 hover:bg-[#252525] rounded-md">Certificates</a>
                <a href="/admin/skills" className="block px-3 py-2 hover:bg-[#252525] rounded-md">Skills</a>
              </div>
              <div className="font-semibold text-sm mb-2 mt-4 text-[#888]">General</div>
              <div className="space-y-1">
                <a href="/admin/profile" className="block px-3 py-2 hover:bg-[#252525] rounded-md">Profile</a>
                <a href="/admin/settings" className="block px-3 py-2 hover:bg-[#252525] rounded-md">Settings</a>
              </div>
              <div className="border-t border-[#252525] mt-4 pt-4">
                <LogoutButton />
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-background/20 p-4">
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
            <LogoutButton />
          </div>
        </nav>
      </aside>
    </>
  )
}
