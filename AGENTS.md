# AGENTS.md

## Project Overview

**Portfolio:** Rizka Aulia — Full-Stack Developer  
**Status:** Foundation, Database & Auth Complete  
**Framework:** Next.js 16 (App Router), TypeScript 5, Tailwind CSS v4  
**Backend:** Supabase (PostgreSQL + Auth + Storage)  
**Admin UI:** shadcn/ui (Base UI, Nova preset)  
**Motion:** Framer Motion + Lenis  

## Directory Structure

```
src/
  app/
    (portfolio)/
      page.tsx              # Public homepage with hero, about, projects
      projects/[slug]/
        page.tsx            # Project detail page
    certificates/           # Certificates page
    admin/
      login/                # Auth login page
      page.tsx              # Admin dashboard
      projects/             # Project CRUD
      certificates/         # Certificate CRUD
      skills/               # Skills management
      profile/              # Profile settings
      settings/             # General settings
    layout.tsx              # Root layout with metadata & LenisProvider
    globals.css             # Design tokens (dark theme)
  components/
    ui/                     # shadcn/ui components
      button.tsx, card.tsx, input.tsx, label.tsx, dialog.tsx
    portfolio/              # Public portfolio components
      Header, Hero, About, Capabilities, TechStack, Contact, Footer
      PageTransition (Framer Motion), LenisProvider
    admin/                  # Admin dashboard components
      AdminSidebar, AdminHeader, ProjectForm
  lib/
    supabase/               # Supabase client/ssr/middleware
      client.ts, server.ts, middleware.ts
    data/                   # Data access layer
      projects.ts
    validations/            # Zod schemas
      schemas.ts
    utils.ts                # Utility functions (cn, etc.)
  middleware.ts             # Session refresh middleware
  types/                    # TypeScript types
    database.ts, projects.ts, profile.ts, certificates.ts, skills.ts
supabase/
  migrations/               # Database migrations
    20260725000001_create_profiles_table.sql
    20260725000002_create_projects_table.sql
    20260725000003_create_project_images_table.sql
    20260725000004_create_certificates_table.sql
    20260725000005_create_skills_table.sql
    20260725000006_create_storage_policies.sql
    20260725000007_seed_profile.sql
```

## Dev Commands

```bash
# Install dependencies (npm only)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

## Key Configuration

- **PostCSS:** `@tailwindcss/postcss` + `autoprefixer`
- **Tailwind:** v4 CSS-first config in `globals.css`
- **Design tokens:** Dark theme per PRD - bg `#050505`, text `#F5F5F5`, border `#252525`, accent `#FF6A13`
- **Shadcn:** Base UI library with Nova preset
- **TypeScript:** Strict mode enabled

## Database Schema

Tables created in migrations:
- `profiles` - User profile information
- `projects` - Portfolio projects with status, featured flag, soft delete
- `project_images` - Project screenshots with ordering
- `certificates` - Certificates with PDF storage
- `skills` - Skills with categories and visibility

**Publishing workflow:** Draft → Review → Published (via `status` column)

## Next Steps

1. Configure Supabase credentials in `.env.local`
2. Apply database migrations (`supabase db push`)
3. Build project detail page with real data
4. Add public projects showcase section

## Notes

- Use `npm` for dependency management
- Design layout is source-controlled; content is editable via CMS
- Admin routes require Supabase Auth
- Build verified: ✓ 13 pages generated successfully
