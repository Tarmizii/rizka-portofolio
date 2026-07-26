-- Publish all existing content and remove manual ordering controls.
update public.projects
set status = 'published';

alter table public.projects
  alter column status set default 'published',
  drop column if exists sort_order;

update public.certificates
set status = 'published';

alter table public.certificates
  alter column status set default 'published',
  drop column if exists sort_order;

update public.skills
set visible = true;

alter table public.skills
  alter column visible set default true,
  alter column visible set not null,
  drop column if exists sort_order;

alter table public.project_images
  drop column if exists sort_order;
