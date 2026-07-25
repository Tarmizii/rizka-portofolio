-- Project images table for project screenshots
create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer,
  created_at timestamptz default now()
);

alter table project_images enable row level security;

create policy "Project images are viewable with projects"
  on project_images for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_images.project_id
      and projects.status = 'published'
      and projects.deleted_at IS NULL
    )
  );

create policy "Admin can manage project images"
  on project_images for all
  using ( auth.role() = 'authenticated' );
