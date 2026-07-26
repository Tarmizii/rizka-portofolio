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
    certificates/           # Certificates page (+ loading.tsx)
    resume/                 # Resume page (+ loading.tsx)
    admin/
      layout.tsx            # Admin title template + noindex metadata
      login/                # Auth login page
      (dashboard)/
        layout.tsx          # AdminShell (sidebar/header) + loading.tsx
        page.tsx            # Admin dashboard
        projects/           # Project CRUD
        certificates/       # Certificate CRUD
        skills/             # Skills management
        profile/            # Profile settings
        settings/           # Account email & password
    layout.tsx              # Root layout with metadata & LenisProvider
    error.tsx, not-found.tsx
    robots.ts, sitemap.ts
    globals.css             # Design tokens + Tailwind v4 theme bridge
  components/
    ui/                     # shadcn/ui components
      button, card, input, label, dialog, confirm-dialog, sonner, spinner
    portfolio/              # Public portfolio components
      PortfolioHeader, Hero, About, Capabilities, TechStack, Contact, Footer
      PortfolioLoader, LenisProvider, ProjectGallery, FeaturedCertificates
    admin/                  # Admin dashboard components
      AdminShell, AdminSidebar, AdminHeader, admin-nav, ProjectModal, FileUpload
  lib/
    supabase/
      client.ts             # Browser client
      server.ts             # Server client (cookies)
      storage.ts            # Public URL → storage path, for file cleanup
    utils.ts                # Utility functions (cn, etc.)
  proxy.ts                  # Auth gate for /admin/* (Next 16 middleware)
  types/
    database.ts             # Row types for every table
supabase/
  migrations/               # Database migrations
```

No `tailwind.config.ts`: Tailwind v4 is configured CSS-first in `globals.css`, and a
config file is only read when a stylesheet imports it with `@config`. The
`@theme inline` block in `globals.css` is what maps the design tokens to utility
classes. For the same reason the `tailwindcss-animate` utilities
(`animate-in`, `fade-in-0`, …) are not available.

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
- `projects` - Portfolio projects with status and featured flag
- `project_images` - Project screenshots
- `certificates` - Certificates with PDF storage
- `skills` - Skills with categories and visibility

**Publishing workflow:** none — the CMS writes `status: 'published'` on save, so
everything goes live immediately. The `status` and `deleted_at` columns still exist
(and the public queries still filter on them), but nothing in the admin UI sets them.

**Deleting:** delete is permanent. The admin removes the database row *and* the files
it referenced in the `portfolio-assets` bucket (project cover + gallery, certificate
cover + PDF). Public URLs are mapped back to storage paths by
`src/lib/supabase/storage.ts`.

## Deploying

1. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
   `NEXT_PUBLIC_SITE_URL` in the host's environment (see `.env.example`).
   `NEXT_PUBLIC_SITE_URL` is what `robots.ts` and `sitemap.ts` use — without it they
   emit `http://localhost:3000`.
2. Apply migrations with `supabase db push`.
3. `npm run build` then `npm run start`.

## Notes

- Use `npm` for dependency management
- Design layout is source-controlled; content is editable via CMS
- Admin routes require Supabase Auth and are `noindex` + disallowed in `robots.txt`
- Build verified: ✓ 15 routes, `npm run build` exits 0
- Lint is `@next/eslint-plugin-next` + `typescript-eslint` + `eslint-plugin-react-hooks`
  composed directly in `eslint.config.mjs` — NOT `eslint-config-next`, whose bundled
  plugins pin a vulnerable `minimatch@3` chain. Don't reintroduce the wrapper.
- `package.json` `overrides` pin patched `postcss` and `sharp` for `next`; drop them
  once `next` ships versions that satisfy `npm audit` on its own.
