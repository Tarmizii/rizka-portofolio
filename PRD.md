# Product Requirements Document (PRD)
## Rizka Aulia Developer Portfolio & Portfolio CMS

**Version:** 1.0  
**Status:** Planning  
**Date:** July 2026

## 1. Document Overview

This Product Requirements Document defines the scope, product behavior, user experience, functional requirements, technical direction, data model, security model, and delivery criteria for the Rizka Aulia Developer Portfolio & Portfolio CMS.

| Field | Value |
| --- | --- |
| Product | Rizka Aulia Developer Portfolio & Portfolio CMS |
| Product Type | Personal developer portfolio website with a private content management dashboard |
| Primary Positioning | Full-Stack Developer |
| Public Website Language | English |
| Target Platform | Responsive web |
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Admin UI | shadcn/ui |
| Motion | Framer Motion + Lenis |
| Backend / Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Deployment | Vercel |
| Version | 1.0 |
| Status | Planning |

## 2. Executive Summary

The product is a visually distinctive personal portfolio for Rizka Aulia, positioned as a Full-Stack Developer. It combines an expressive, editorial-style public portfolio with a predictable, task-oriented admin dashboard.

The public experience is designed to create a strong first impression through dark editorial visuals, large typography, asymmetric layouts, diagonal marquees, controlled motion, parallax, and project-focused storytelling. The admin experience is intentionally different: it prioritizes clarity, familiar CRUD patterns, modal-based content management, structured forms, and explicit feedback for every action.

Supabase is used so key portfolio content can be managed without editing source code or redeploying the application. Only content that realistically changes over time is editable. Visual identity, layout composition, motion patterns, navigation structure, and page architecture remain controlled in code to prevent accidental design degradation.

## 3. Product Vision

Create a portfolio that feels like a premium digital experience to recruiters and technical reviewers while remaining simple for the owner to maintain.

> Creative on the outside. Structured on the inside.

The portfolio should communicate technical competence, product thinking, and attention to detail without resembling a generic developer template or an over-designed experimental website that sacrifices usability.

## 4. Background and Problem Statement

Many developer portfolios use the same pattern: hero, about, skill cards, project cards, and contact. Although functional, this structure often provides limited differentiation when recruiters evaluate many candidates.

Rizka needs a portfolio that is visually memorable, project-centric, and aligned with a Full-Stack Developer career path. At the same time, project data, certificates, skills, profile information, and the CV must be easy to update without modifying code.

- The public website needs a distinctive visual identity without compromising recruiter usability.
- Project information must be easy to scan on the homepage and available in more depth on dedicated project pages.
- Important content must be manageable from a private admin dashboard.
- The CMS must not become a full page builder or allow visual structure to be accidentally broken.
- CRUD interactions must feel familiar and provide progress, success, warning, and error feedback.
- The system must use secure authentication and authorization so only the owner can change content.

## 5. Product Goals

### 5.1 Primary Goals

- Position Rizka Aulia clearly as a Full-Stack Developer.
- Showcase selected projects in a strong visual hierarchy.
- Provide dedicated project detail pages with project overview, stack, features, screenshots, and GitHub links.
- Provide downloadable CV access from prominent locations.
- Display certificates with cover previews and direct PDF access.
- Provide a secure admin dashboard for managing key portfolio data.
- Allow project and certificate publishing workflows using Draft and Published states.
- Provide clear feedback for every create, update, upload, publish, unpublish, and delete action.

### 5.2 Secondary Goals

- Maintain strong responsive behavior across mobile, tablet, and desktop.
- Support SEO and social preview metadata.
- Keep public-page performance competitive despite motion and rich visuals.
- Make future project growth manageable without changing the application structure.
- Ensure the admin dashboard is usable without understanding Supabase directly.

## 6. Non-Goals

The first version intentionally excludes the following capabilities:

- Full visual page builder or drag-and-drop website builder.
- Multi-user CMS or public user registration.
- Blog or article publishing platform.
- E-commerce, payments, comments, or social features.
- Complex analytics dashboard.
- Recruitment CRM or application tracking.
- Resume builder or certificate generator.
- Admin control over core layout, color system, typography, navigation architecture, motion design, or page composition.

## 7. Target Users

### 7.1 Recruiter / HR

Primary needs: quickly understand who Rizka is, what role she is targeting, what she has built, and how to contact her.

```text
Homepage → Hero → Selected Projects → Project Detail → CV / GitHub / Contact
```

### 7.2 Technical Recruiter / Engineer

Primary needs: inspect project implementation context, technology stack, features, screenshots, and source repository.

```text
Selected Project → Project Detail → Tech Stack → Features → GitHub Repository
```

### 7.3 Portfolio Administrator

The administrator is Rizka. She needs to manage portfolio content through familiar CRUD interactions without editing source code.

## 8. Brand and Content Positioning

| Item | Value |
| --- | --- |
| Name | Rizka Aulia |
| Primary Role | Full-Stack Developer |
| Email | rizkaauliaa198@gmail.com |
| Phone | +62 813-7061-7604 |
| GitHub | https://github.com/rizkaauliaa |
| Education | Politeknik Negeri Lhokseumawe |
| Department | Information Technology and Computer |
| Graduation Year | 2025 |
| Profile Photo | Not displayed |
| Location | Not displayed |

> **Note:** The exact official study-program name should be confirmed before production release. The current education label is a working English translation based on the information provided.

## 9. Product Architecture

```text
Visitor
  ↓
Public Portfolio (Next.js)
  ↓
Supabase PostgreSQL / Storage

Administrator
  ↓
Admin Dashboard (Next.js + shadcn/ui)
  ↓
Supabase Auth / PostgreSQL / Storage
```

The public portfolio and admin dashboard live in the same Next.js application but are visually and functionally separated. Public pages optimize storytelling and presentation; admin pages optimize task completion and data management.

## 10. Route Architecture

### 10.1 Public Routes

```text
/
/projects/[slug]
/certificates
/resume
```

### 10.2 Admin Routes

```text
/admin/login
/admin
/admin/projects
/admin/certificates
/admin/skills
/admin/profile
/admin/settings
```

Standard create and edit operations should occur in modal interfaces rather than dedicated /new or /edit routes. This keeps the user within the current management context.

## 11. Public Website Information Architecture

1. Loader
2. Hero
3. About
4. Capabilities
5. Selected Projects
6. Tech Stack
7. Education
8. Certificates
9. Contact
10. Footer

## 12. Public Experience Requirements

### 12.1 Loading Experience

The loader appears only on the initial visit and should use the RA monogram or Rizka Aulia wordmark with a short progress counter. Target duration: approximately 1–1.5 seconds.

### 12.2 Hero

> FULL-STACK. WEB. PRODUCT. DEVELOPMENT.

The hero must communicate role positioning immediately and include a primary CTA to view work plus a secondary CTA to download the CV.

### 12.3 Diagonal Marquee

The hero or transition region may use two diagonal marquees moving in opposite directions. Example content: NEXT.JS • TYPESCRIPT • PHP • MYSQL • WEB DEVELOPMENT and FRONTEND • BACKEND • DATABASE • PRODUCT • DEVELOPMENT.

### 12.4 About

The About section uses large editorial typography rather than a profile card. It introduces Rizka as a Full-Stack Developer and summarizes her interest in building web products from interface through data and backend logic.

### 12.5 Capabilities

- Web Development — responsive and functional web applications.
- Backend & Database — application logic, CRUD workflows, data management, and relational databases.
- Product Development — translating requirements into usable digital products through structured implementation and iteration.

## 13. Selected Projects

Selected Projects is the highest-priority content section on the homepage.

- Homepage cards or compositions show only cover, title, category, and year.
- Long descriptions do not appear on the homepage.
- Project presentation should avoid generic equal-sized card grids where possible.
- Desktop can use asymmetric or horizontal compositions; mobile should collapse to a clear vertical sequence.
- Hover state may display VIEW CASE -> using the custom cursor or project overlay.
- Clicking a project opens /projects/[slug].

### 13.1 Project Detail Content

- Project name
- Cover image
- Category
- Year
- Role
- Overview / description
- Technology stack
- Feature list
- Project screenshots
- GitHub repository URL
- Optional live demo URL
- Next project navigation

## 14. Certificates and CV

### 14.1 Certificates

Certificate cards display a cover preview, certificate title, issuer, and year. The source credential remains a PDF stored in Supabase Storage.

Featured certificates may appear on the homepage. A dedicated /certificates page can show the full published collection.

### 14.2 CV

The CV is stored as a PDF and can be replaced through the admin dashboard. Public download access should be available from the Hero and About sections, with an optional additional link in Contact or Footer.

## 15. Tech Stack and Education

### 15.1 Tech Stack

Skills are grouped by category rather than displayed as percentage proficiency bars. Initial categories: Frontend, Backend, Database, Tools, Other.

### 15.2 Education

Education is presented in a compact editorial layout. The current institution is Politeknik Negeri Lhokseumawe with graduation year 2025. The exact official English study-program label must be finalized before release.

## 16. Contact and Navigation

### 16.1 Contact

The contact area should be direct and recruiter-oriented, for example: LOOKING FOR A DEVELOPER? with email, phone, and GitHub links.

### 16.2 Navigation

The public header uses a minimal pattern such as RIZKA AULIA + MENU rather than a conventional multi-link navbar.

Opening MENU displays a fullscreen navigation layer with About, Projects, Capabilities, Certificates, Contact, GitHub, and Email.

## 17. Visual Design Direction

| Token | Value / Direction |
| --- | --- |
| Background | #050505 |
| Primary Text | #F5F5F5 |
| Secondary Text | #8A8A8A |
| Border | #252525 |
| Accent | #FF6A13 |
| Visual Style | Dark editorial / creative developer portfolio |
| Typography | Large display type + restrained body type |
| Primary Font Direction | Geist; final font subject to licensing and visual QA |

Orange is an accent, not a dominant surface color. It should be reserved for indicators, arrows, active elements, marquee separators, and selective interaction states.

## 18. Motion and Interaction

- Framer Motion handles page transitions, text reveals, project hover states, menu transitions, and scroll-linked motion.
- Lenis provides smooth scrolling on the public portfolio only.
- Admin pages use native scrolling for predictable interaction.
- Motion should rely primarily on transform and opacity for performance.
- Reduced-motion preferences must be respected.
- The custom cursor is desktop-only and disabled for touch devices.

### 18.1 Custom Cursor States

```text
Default: ○
Project hover: VIEW ->
Certificate hover: PDF ->
External link hover: OPEN ->
```

## 19. Responsive Behavior

The design is not required to preserve desktop composition exactly on smaller screens. Responsive behavior prioritizes content hierarchy and usability.

- Desktop: experimental asymmetric composition, diagonal marquees, richer motion.
- Tablet: simplified spacing and composition while retaining visual identity.
- Mobile: vertical project sequence, simplified marquee, reduced motion density, native touch interaction.
- Admin mobile: sidebar becomes a drawer/sheet; CRUD dialogs become full-screen or near-full-screen.

## 20. Admin Dashboard Product Principles

- Public portfolio = expressive.
- Admin dashboard = predictable.
- Content management = controlled.
- CRUD patterns should be familiar to non-technical users.
- The admin should never need to use the Supabase dashboard for routine content management.
- Core layout and motion remain source-controlled.

## 21. Admin Navigation and Dashboard

### 21.1 Admin Navigation

```text
Dashboard

Content
  Projects
  Certificates
  Skills

General
  Profile
  Settings

Logout
```

### 21.2 Dashboard Overview

The overview displays lightweight operational summaries rather than decorative analytics.

- Total Projects
- Published Projects
- Certificates
- Featured Projects
- Recent Projects table

## 22. Projects Management

### 22.1 Data Table

Projects are managed from a searchable table with columns for Cover, Project, Category, Year, Status, Featured, and Actions.

Toolbar controls: Search, Status Filter, Category Filter, Year Filter, Add Project.

### 22.2 Row Actions

- View
- Edit
- Publish / Unpublish
- Duplicate
- Delete

## 23. CRUD Interaction Model

Create and edit actions use modal-based CRUD to keep the administrator within the same management context.

```text
Data Table
  ↓
Add / Edit
  ↓
Modal Form
  ↓
Validate
  ↓
Save / Publish
  ↓
Loading State
  ↓
Supabase Operation
  ↓
Success or Error Notification
  ↓
Refresh Data Table
```

If an operation fails, the modal must remain open and entered form data must be preserved.

## 24. Project Create / Edit Modal

The project form is long enough to require a large modal and a multi-step workflow.

| Step | Purpose | Core Fields |
| --- | --- | --- |
| 01 General | Identity and classification | Project Name, Slug, Category, Year |
| 02 Media | Project visuals | Cover Image, Project Gallery |
| 03 Details | Project narrative and links | Description, Role, Tech Stack, Features, GitHub URL, Live URL |
| 04 Publish | Final review and visibility | Featured, Status, Sort Order, Summary |

On create, Continue advances through the steps. On edit, all steps remain directly accessible so the user can jump to the section that needs changing.

## 25. Project Form Requirements

### 25.1 General

- Project Name is required.
- Slug is required and unique.
- Slug is generated automatically from Project Name but can be edited.
- Category is required.
- Year is required.

### 25.2 Media

- Cover image is required.
- Project gallery is optional and supports multiple screenshots.
- Screenshots support ordering.
- Image upload must display progress and completion state.

### 25.3 Details

- Description is required.
- Role is optional.
- Tech Stack is required and entered using tags, not a comma-separated text field.
- Features support multiple repeatable items.
- GitHub URL is required for the current portfolio direction.
- Live URL is optional.

### 25.4 Publish

- Featured toggle.
- Status: Draft or Published.
- Sort Order.
- Summary review before final submission.
- Actions: Previous, Save as Draft, Publish Project / Save Changes.

## 26. Certificate, Skills, and Profile Management

### 26.1 Certificates

Certificate CRUD uses a standard modal rather than a stepper.

- Certificate Title (required)
- Issuer
- Year
- Cover Image (required)
- Certificate PDF (required)
- Featured
- Status
- Sort Order

### 26.2 Skills

- Skill Name
- Category
- Visibility
- Sort Order

### 26.3 Profile

Profile uses a settings form rather than a CRUD table.

- Full Name
- Professional Title
- Short Bio
- Email
- Phone
- GitHub URL
- CV PDF
- Availability
- Education
- Graduation Year

## 27. Editable vs Non-Editable Content

### 27.1 Editable in CMS

- Projects and project images
- Certificates
- Skills
- Bio and selected profile information
- Contact information
- GitHub URL
- Education information
- CV PDF
- Availability
- Published status
- Featured status
- Sort order

### 27.2 Locked in Source Code

- Navigation architecture
- Hero composition and primary display headline
- Marquee structure
- Section names
- Color palette
- Typography system
- Animation logic
- Custom cursor behavior
- Page transitions
- Footer layout
- Project-detail page composition

## 28. Notification and Feedback System

Every meaningful admin action must communicate what is happening, whether it succeeded, and what the user should do if it failed.

| Feedback Type | Use |
| --- | --- |
| Inline Validation | Required fields, invalid URL, invalid file, duplicate slug |
| Button State | Saving…, Uploading…, Publishing…, Deleting… |
| Progress | Image/PDF upload progress |
| Success Toast | Action completed successfully |
| Error Toast | Action failed with actionable message |
| Warning / Alert | Consequential but reversible actions |
| AlertDialog | Destructive actions such as delete |

### 28.1 Example Messages

- Project created successfully.
- Changes saved successfully.
- Project published successfully.
- Project moved to draft.
- Certificate uploaded successfully.
- CV updated successfully.
- Failed to save project. Please check your connection and try again.
- Cover upload failed. Maximum file size is 5 MB.

## 29. Destructive Actions and Unsaved Changes

### 29.1 Delete

> Delete project? Are you sure you want to permanently delete “Tailor Management System”? This action cannot be undone.

Delete uses shadcn/ui AlertDialog. The destructive action button is disabled while deletion is processing.

### 29.2 Unpublish

Unpublish requires a lighter confirmation because it removes the project from the public portfolio without deleting the record.

### 29.3 Unsaved Changes

If the user attempts to close a dirty form through close button, backdrop, or Escape key, show a confirmation: Continue Editing or Discard Changes.

## 30. Empty, Loading, and Error States

- Empty project state: No projects yet. Add your first project to start building your portfolio.
- Async actions disable repeated submission.
- Tables and major panels use skeleton loading where appropriate.
- Public content failures should degrade gracefully instead of blanking the entire page.
- Example public fallback: Projects are temporarily unavailable.

## 31. Authentication and Authorization

The admin dashboard is private and uses Supabase Auth with Email + Password.

- No public registration.
- No social login required for V1.
- Admin routes require an authenticated session.
- Anonymous visitors have read-only access to public published content.
- Authenticated admin can create, read, update, delete, upload, publish, and unpublish.

## 32. Database Model

### 32.1 profiles

```text
id
full_name
professional_title
bio
email
phone
github_url
resume_url
availability
institution
study_program
graduation_year
created_at
updated_at
```

### 32.2 projects

```text
id UUID PRIMARY KEY
slug TEXT UNIQUE NOT NULL
title TEXT NOT NULL
subtitle TEXT
description TEXT NOT NULL
category TEXT NOT NULL
year INTEGER NOT NULL
role TEXT
cover_url TEXT NOT NULL
github_url TEXT NOT NULL
live_url TEXT
tech_stack TEXT[]
features TEXT[]
featured BOOLEAN DEFAULT false
status TEXT NOT NULL
sort_order INTEGER
deleted_at TIMESTAMP NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 32.3 project_images

```text
id UUID PRIMARY KEY
project_id UUID FOREIGN KEY
image_url TEXT NOT NULL
caption TEXT
sort_order INTEGER
created_at TIMESTAMP
```

### 32.4 certificates

```text
id UUID PRIMARY KEY
title TEXT NOT NULL
issuer TEXT
year INTEGER
cover_url TEXT NOT NULL
pdf_url TEXT NOT NULL
featured BOOLEAN DEFAULT false
status TEXT NOT NULL
sort_order INTEGER
deleted_at TIMESTAMP NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 32.5 skills

```text
id UUID PRIMARY KEY
name TEXT NOT NULL
category TEXT NOT NULL
visible BOOLEAN DEFAULT true
sort_order INTEGER
created_at TIMESTAMP
updated_at TIMESTAMP
```

## 33. Publishing and Ordering Model

Projects and certificates support Draft and Published states.

```text
Create → Draft → Review → Publish → Visible on public website
```

Unpublishing returns an item to Draft without deleting it.

Homepage-selected projects use a query conceptually equivalent to status = published AND featured = true AND deleted_at IS NULL ORDER BY sort_order.

## 34. Storage Model

Supabase Storage bucket: portfolio-assets.

```text
portfolio-assets/
  projects/
    [project-slug]/
      cover.webp
      01.webp
      02.webp
  certificates/
    [certificate-slug]/
      cover.webp
      certificate.pdf
  resume/
    rizka-aulia-resume.pdf
```

Image formats for V1: JPG, PNG, WEBP. Recommended maximum: 5 MB per image. Documents: PDF, recommended maximum 10 MB per file. Final limits should be enforced in both client validation and server/storage policy.

## 35. Security Requirements

- Enable Row Level Security on relevant Supabase tables.
- Public users can SELECT only published, non-deleted public content.
- Write operations require authenticated admin access.
- Supabase service-role credentials must never be exposed in browser code.
- Client environment variables may include NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
- Validate file type, file size, URL shape, and required form fields.
- Admin routes must not rely only on hidden navigation; authorization is enforced server-side.
- Admin pages must be excluded from indexing.

## 36. Data Fetching and Rendering Strategy

Public pages should prefer Next.js Server Components for initial data loading so visitors receive rendered content without client-side loading spinners for every section.

```text
Server Component → Supabase → Rendered HTML
```

Client components are used only where interaction or animation requires them. Project detail pages query by slug on the server.

## 37. Validation Strategy

Recommended form stack: React Hook Form + Zod.

- Validate project title, slug, category, year, description, tech stack, GitHub URL, and cover.
- Validate certificate title, PDF type, and cover image.
- Validate email and URL fields.
- Check unique project slug before persistence.
- Perform validation on both client and server boundaries.

## 38. Technical Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Admin UI Components | shadcn/ui |
| Animation | Framer Motion |
| Smooth Scroll | Lenis |
| Forms | React Hook Form |
| Validation | Zod |
| Backend / Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |
| Version Control | Git + GitHub |

## 39. Proposed Application Structure

```text
src/
  app/
    (portfolio)/
      page.tsx
      projects/
        [slug]/
          page.tsx
    certificates/
    admin/
      login/
      projects/
      certificates/
      skills/
      profile/
      settings/
    api/
  components/
    portfolio/
    admin/
    ui/
  features/
    projects/
    certificates/
    skills/
    profile/
  lib/
    supabase/
    validations/
    utils/
  hooks/
  types/
```

## 40. Core Public Components

```text
PortfolioLoader
PortfolioHeader
FullscreenMenu
Hero
DiagonalMarquee
About
Capabilities
SelectedProjects
ProjectCard
TechStack
Education
Certificates
Contact
Footer
CustomCursor
```

## 41. Core Admin Components

```text
AdminSidebar
AdminHeader
DataTable
ProjectModal
ProjectStepper
ProjectFormGeneral
ProjectFormMedia
ProjectFormDetails
ProjectFormPublish
CertificateModal
SkillModal
DeleteConfirmation
UploadField
StatusBadge
Toast / Sonner feedback
```

## 42. Functional Requirements

| ID | Requirement |
| --- | --- |
| PUB-001 | The public website shall display Rizka Aulia's identity and Full-Stack Developer positioning. |
| PUB-002 | The homepage shall display published featured projects ordered by sort order. |
| PUB-003 | Each published project shall have a unique /projects/[slug] detail route. |
| PUB-004 | Project details shall provide a GitHub repository link. |
| PUB-005 | The public website shall provide a downloadable CV PDF. |
| PUB-006 | The public website shall display published certificates and allow PDF access. |
| PUB-007 | The public experience shall be responsive across supported breakpoints. |
| ADM-001 | The system shall provide a protected admin dashboard. |
| ADM-002 | The admin shall create projects using a modal workflow. |
| ADM-003 | The admin shall edit projects using the same modal structure. |
| ADM-004 | The admin shall delete projects after confirmation. |
| ADM-005 | The admin shall publish and unpublish projects. |
| ADM-006 | Project creation shall use a multi-step form. |
| ADM-007 | The system shall preserve form state when an API operation fails. |
| ADM-008 | The system shall show success and error notifications for CRUD operations. |
| ADM-009 | The system shall warn before discarding unsaved changes. |
| MED-001 | The admin shall upload project cover images. |
| MED-002 | The admin shall upload and order multiple project screenshots. |
| MED-003 | The admin shall upload certificate cover images and certificate PDFs. |
| MED-004 | The admin shall replace the CV PDF. |
| MED-005 | File uploads shall display progress feedback. |
| SEC-001 | Public users shall not have write access to portfolio data. |
| SEC-002 | Protected operations shall require authenticated admin access. |

## 43. User Stories and Acceptance Criteria

### 43.1 Public

- As a recruiter, I can understand Rizka's professional role from the Hero without scrolling.
- As a recruiter, I can open a selected project and see its overview, stack, features, screenshots, and GitHub repository.
- As a recruiter, I can download the latest CV with no more than two interactions from the homepage.
- As a visitor, I can open a published certificate PDF from the website.

### 43.2 Admin

- As the administrator, I can sign in and access protected management pages.
- I can add a project without leaving the Projects page.
- I can save a project as Draft before making it public.
- I receive clear feedback when a save, upload, publish, or delete operation is running and when it completes.
- I cannot accidentally close a modified form without a discard warning.
- I can replace the CV without changing application code.

## 44. Performance Requirements

| Metric | Target |
| --- | --- |
| Largest Contentful Paint | < 2.5 s |
| Cumulative Layout Shift | < 0.1 |
| Interaction to Next Paint | < 200 ms |
| Lighthouse Performance | ≥ 90 target |
| Lighthouse Accessibility | ≥ 90 target |
| Lighthouse Best Practices | ≥ 90 target |
| Lighthouse SEO | ≥ 90 target |

> **Note:** These are product targets rather than guarantees. Final scores depend on production content, hosting conditions, browser, device, and network.

## 45. Accessibility Requirements

- Use semantic HTML structure.
- Provide visible keyboard focus states.
- Provide alt text for meaningful imagery.
- Ensure modal and fullscreen menu interactions are keyboard accessible.
- Maintain sufficient color contrast.
- Respect prefers-reduced-motion.
- Use labeled form controls and accessible validation messages.
- Use shadcn/Radix accessibility primitives correctly rather than removing built-in semantics.

## 46. SEO Requirements

- Homepage title: Rizka Aulia — Full-Stack Developer.
- Homepage description focused on full-stack and web product development.
- Dynamic project metadata: [Project Name] — Rizka Aulia.
- Open Graph image for homepage and project pages.
- Generate sitemap for public routes.
- Exclude /admin and /admin/login from indexing.
- Use canonical URLs where appropriate.

## 47. Browser and Device Support

- Latest Chrome
- Latest Microsoft Edge
- Latest Firefox
- Latest Safari
- Mobile Safari
- Chrome for Android

Minimum responsive width target: 320 px. Primary breakpoints: mobile 320+, tablet 768+, desktop 1024+, large desktop 1440+.

## 48. Testing Requirements

### 48.1 Unit Tests

- Validation schemas
- Slug generation
- Formatting and mapping helpers

### 48.2 Integration Tests

- Project CRUD
- Certificate CRUD
- File upload
- Authentication and authorization
- Publish/unpublish behavior

### 48.3 End-to-End Critical Paths

```text
Login → Add Project → Save Draft → Publish → Public Project Appears

Edit Project → Save → Public Content Updates

Upload Certificate → Publish → Open Certificate PDF

Replace CV → Download Latest CV
```

### 48.4 Manual UX Testing

- Modal close and unsaved-change behavior
- Upload progress
- API failure without form-state loss
- Duplicate slug handling
- Mobile dashboard
- Keyboard navigation
- Reduced-motion mode
- Slow network
- Invalid or oversized file

## 49. Deployment and Environments

```text
GitHub → Vercel → Next.js Application → Supabase
```

Recommended environments: Development and Production. A preview/staging environment can be added later if deployment workflows require it.

### 49.1 Environment Variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Any future privileged server-only credentials must remain server-side and must never use a NEXT_PUBLIC_ prefix.

## 50. Development Phases

1. Foundation — Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase, base architecture, design tokens.
2. Database & Storage — tables, relationships, RLS, storage buckets, seed profile.
3. Authentication — login, protected routes, session management, logout.
4. Admin Dashboard — dashboard shell, project CRUD, certificate CRUD, skills, profile, notifications.
5. Public Portfolio — loader, hero, about, capabilities, project showcase, project detail, tech stack, certificates, contact.
6. Motion — page transitions, marquees, custom cursor, scroll reveals, parallax.
7. Optimization — images, fonts, SEO, accessibility, performance.
8. Testing & Deployment — functional QA, RLS tests, responsive review, production deployment.

## 51. MVP Scope

- Public homepage
- Project detail pages
- Certificate access
- Downloadable CV
- Admin login
- Dashboard overview
- Project modal CRUD
- Certificate modal CRUD
- Skills management
- Profile management
- CV upload
- Supabase PostgreSQL
- Supabase Storage
- Supabase Auth
- Draft / Published workflow
- Featured content
- Sort order
- Alert and toast notification system
- Responsive design
- Production deployment

## 52. Post-MVP Opportunities

- Drag-and-drop ordering
- Draft preview links
- Trash / restore interface
- Visitor analytics
- Project view statistics
- Automatic PDF thumbnail generation
- Automatic image compression pipeline
- Dynamic Open Graph image generation
- Admin command palette
- Optional admin dark mode

## 53. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Too much animation | Slow or distracting recruiter experience | Use selective motion, transform/opacity animation, reduced-motion support, performance testing. |
| CMS becomes too flexible | Visual identity can be broken | Keep layout and visual system source-controlled; expose only content that needs editing. |
| Weak project content | Strong visuals fail to prove technical ability | Require structured project overview, features, technology, screenshots, and repository links. |
| Supabase RLS misconfiguration | Unauthorized data modification | Test anonymous and authenticated policies before production. |
| Large media assets | Slow pages and expensive bandwidth | Enforce file limits, optimize images, use next/image, prefer WebP. |
| Long modal forms | Admin fatigue or accidental data loss | Use a stepper, sticky actions, autosave later if needed, and unsaved-change warnings. |

## 54. Pending Content Before Production

- Exact official study-program name
- Final biography
- Final project list
- Project names, categories, years, roles, descriptions, and GitHub repository URLs
- Project cover images and screenshots
- Final technology list
- Certificate titles, issuers, years, cover images, and PDFs
- Final CV PDF

## 55. Success Metrics

- A recruiter can identify Rizka's role within approximately 10 seconds of landing.
- Selected projects are discoverable without complex navigation.
- CV is reachable within two interactions from the homepage.
- GitHub is reachable within two interactions from the homepage or project page.
- Administrator can add and publish a project without editing code or opening Supabase Dashboard.
- Administrator receives explicit feedback for all primary content-management actions.
- Public pages remain usable on mobile and with reduced motion enabled.

## 56. Definition of Done

1. Feature behavior matches approved requirements.
2. Responsive behavior is verified on mobile, tablet, and desktop.
3. No uncaught console errors are present in production flows.
4. Async actions have loading, success, and error states.
5. Form validation is implemented on required client/server boundaries.
6. Supabase data persists correctly.
7. Authorization and RLS behavior are tested for anonymous and authenticated users.
8. Accessibility basics are verified.
9. Public performance is reviewed after real content is loaded.
10. Feature does not break existing critical flows.

## 57. Final Product Principles

> Public portfolio = expressive.

> Admin dashboard = predictable.

> Content management = controlled.

The final product should not be treated as a generic portfolio template with a CMS attached. It is a curated portfolio platform: the public experience demonstrates design and development quality, while the admin experience gives the owner a safe, efficient way to maintain important content over time.
