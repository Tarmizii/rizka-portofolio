import {
  AwardIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UserIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react"

export type AdminNavItem = {
  href: string
  label: string
  /** Plain-language hint shown in the sidebar and page header. */
  description: string
  icon: LucideIcon
}

export type AdminNavSection = {
  title: string
  items: AdminNavItem[]
}

export const adminNav: AdminNavSection[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        description: "A summary of everything on your portfolio",
        icon: LayoutDashboardIcon,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        href: "/admin/projects",
        label: "Projects",
        description: "Add, edit and publish the work you want to show",
        icon: FolderKanbanIcon,
      },
      {
        href: "/admin/certificates",
        label: "Certificates",
        description: "Upload certificates and choose which ones stand out",
        icon: AwardIcon,
      },
      {
        href: "/admin/skills",
        label: "Skills",
        description: "Manage the tools and technologies you list",
        icon: WrenchIcon,
      },
    ],
  },
  {
    title: "Your account",
    items: [
      {
        href: "/admin/profile",
        label: "Profile",
        description: "Your name, bio and contact details",
        icon: UserIcon,
      },
      {
        href: "/admin/settings",
        label: "Settings",
        description: "Account email and password",
        icon: SettingsIcon,
      },
    ],
  },
]

export const adminNavItems: AdminNavItem[] = adminNav.flatMap((section) => section.items)

export function isNavItemActive(item: AdminNavItem, pathname: string): boolean {
  if (item.href === "/admin") return pathname === "/admin"
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function getActiveNavItem(pathname: string): AdminNavItem | undefined {
  // Longest match wins so /admin never shadows /admin/projects.
  return [...adminNavItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => isNavItemActive(item, pathname))
}
