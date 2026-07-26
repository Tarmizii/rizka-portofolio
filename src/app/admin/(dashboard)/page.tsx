import Link from "next/link"
import {
  ArrowRightIcon,
  AwardIcon,
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  FolderKanbanIcon,
  PlusIcon,
  SparklesIcon,
  UserIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export const metadata = { title: "Dashboard" }

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

type StatCardProps = {
  href: string
  label: string
  value: number
  hint: string
  icon: LucideIcon
}

function StatCard({ href, label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <Link href={href} className="group block focus-visible:outline-none">
      <Card className="h-full transition-colors group-hover:border-accent group-focus-visible:border-accent">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Icon aria-hidden className="size-4.5" />
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold leading-none">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-accent">
            Open <ArrowRightIcon aria-hidden className="size-3" />
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}

type QuickActionProps = {
  href: string
  title: string
  description: string
  icon: LucideIcon
}

function QuickAction({ href, title, description, icon: Icon }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
    </Link>
  )
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: totalCertificates },
    { count: publishedCertificates },
    { count: totalSkills },
    { count: visibleSkills },
    { data: recentProjects },
    { data: profile },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("status", "published"),
    supabase.from("certificates").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("status", "published"),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }).eq("visible", true),
    supabase
      .from("projects")
      .select("id, title, created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("profiles")
      .select("full_name, professional_title, bio, email, resume_url, availability")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const projectCount = totalProjects ?? 0
  const publishedProjectCount = publishedProjects ?? 0
  const certificateCount = totalCertificates ?? 0
  const skillCount = totalSkills ?? 0

  const firstName = profile?.full_name?.trim().split(/\s+/)[0]

  const checklist = [
    {
      label: "Fill in your name and job title",
      href: "/admin/profile",
      done: Boolean(profile?.full_name && profile?.professional_title),
    },
    {
      label: "Write a short bio",
      href: "/admin/profile",
      done: Boolean(profile?.bio && profile.bio.trim().length > 0),
    },
    {
      label: "Add a contact email",
      href: "/admin/profile",
      done: Boolean(profile?.email),
    },
    {
      label: "Upload your resume",
      href: "/admin/profile",
      done: Boolean(profile?.resume_url),
    },
    {
      label: "Publish at least one project",
      href: "/admin/projects",
      done: publishedProjectCount > 0,
    },
    {
      label: "Add your skills",
      href: "/admin/skills",
      done: skillCount > 0,
    },
  ]

  const completedSteps = checklist.filter((step) => step.done).length
  const isSetupComplete = completedSteps === checklist.length

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <section className="rounded-xl border border-border bg-gradient-to-br from-surface to-card p-6 sm:p-8">
        <p className="text-sm font-medium text-accent">
          {profile?.availability ? profile.availability : "Portfolio CMS"}
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          {firstName ? `Hi, ${firstName}!` : "Welcome back!"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This is where you update your portfolio. Anything you add here shows up on your public
          website — no coding needed. Start with one of the shortcuts below.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/projects?new=1" className={buttonVariants()}>
            <PlusIcon aria-hidden />
            Add a project
          </Link>
          <Link href="/admin/profile" className={buttonVariants({ variant: "outline" })}>
            <UserIcon aria-hidden />
            Edit my profile
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Your content at a glance
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            href="/admin/projects"
            label="Projects"
            value={projectCount}
            hint={
              projectCount === 0
                ? "Nothing added yet"
                : `${publishedProjectCount} live on your site`
            }
            icon={FolderKanbanIcon}
          />
          <StatCard
            href="/admin/certificates"
            label="Certificates"
            value={certificateCount}
            hint={
              certificateCount === 0
                ? "Nothing added yet"
                : `${publishedCertificates ?? 0} shown on your site`
            }
            icon={AwardIcon}
          />
          <StatCard
            href="/admin/skills"
            label="Skills"
            value={skillCount}
            hint={
              skillCount === 0 ? "Nothing added yet" : `${visibleSkills ?? 0} visible to visitors`
            }
            icon={WrenchIcon}
          />
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          What would you like to do?
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <QuickAction
            href="/admin/projects"
            title="Add or edit a project"
            description="Show off the work you have built, with images and links."
            icon={FolderKanbanIcon}
          />
          <QuickAction
            href="/admin/certificates"
            title="Upload a certificate"
            description="Add a course or award certificate as a PDF."
            icon={AwardIcon}
          />
          <QuickAction
            href="/admin/skills"
            title="Manage your skills"
            description="List the tools and technologies you work with."
            icon={WrenchIcon}
          />
          <QuickAction
            href="/admin/profile"
            title="Update your profile"
            description="Change your name, bio, contact details and resume."
            icon={UserIcon}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent projects */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClockIcon aria-hidden className="size-4 text-muted-foreground" />
              Recently added projects
            </CardTitle>
            {recentProjects && recentProjects.length > 0 && (
              <Link
                href="/admin/projects"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                See all
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {recentProjects && recentProjects.length > 0 ? (
              <ul className="divide-y divide-border">
                {recentProjects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href="/admin/projects"
                      className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface-hover"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{project.title}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Added {formatDate(project.created_at)}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                        Live
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
                <FolderKanbanIcon aria-hidden className="mx-auto size-8 text-muted-foreground/60" />
                <p className="mt-3 text-sm font-medium">No projects yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your first project is the fastest way to make the site feel alive.
                </p>
                <Link
                  href="/admin/projects?new=1"
                  className={buttonVariants({ size: "sm", className: "mt-4" })}
                >
                  <PlusIcon aria-hidden />
                  Add your first project
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup checklist */}
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-1.5">
            <CardTitle className="flex items-center gap-2 text-base">
              <SparklesIcon aria-hidden className="size-4 text-accent" />
              {isSetupComplete ? "Your portfolio is ready" : "Finish setting up"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isSetupComplete
                ? "Everything essential is filled in. Keep it fresh by adding new work."
                : `${completedSteps} of ${checklist.length} steps done.`}
            </p>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={completedSteps}
              aria-valuemin={0}
              aria-valuemax={checklist.length}
              aria-label="Setup progress"
            >
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${(completedSteps / checklist.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {checklist.map((step) => (
                <li key={step.label}>
                  <Link
                    href={step.href}
                    className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-surface-hover"
                  >
                    {step.done ? (
                      <CheckCircle2Icon aria-hidden className="size-4 shrink-0 text-success" />
                    ) : (
                      <CircleIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        step.done ? "text-muted-foreground line-through" : "font-medium"
                      )}
                    >
                      {step.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
