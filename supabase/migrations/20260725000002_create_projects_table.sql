-- Projects table for portfolio projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text not null,
  category text not null,
  year integer not null,
  role text,
  cover_url text not null,
  github_url text not null,
  live_url text,
  tech_stack text[],
  features text[],
  featured boolean default false,
  status text not null default 'draft',
  sort_order integer,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table projects enable row level security;

create policy "Published projects are viewable by everyone"
  on projects for select
  using ( status = 'published' AND deleted_at IS NULL );

create policy "Admin can manage projects"
  on projects for all
  using ( auth.role() = 'authenticated' );

create policy "Admin can soft delete projects"
  on projects for update
  using ( auth.role() = 'authenticated' );

create policy "Admin can soft undelete projects"
  on projects for update
  with check ( auth.role() = 'authenticated' );
