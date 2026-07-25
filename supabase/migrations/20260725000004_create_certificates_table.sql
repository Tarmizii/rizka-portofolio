-- Certificates table
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  year integer,
  cover_url text not null,
  pdf_url text not null,
  featured boolean default false,
  status text not null default 'draft',
  sort_order integer,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table certificates enable row level security;

create policy "Published certificates are viewable by everyone"
  on certificates for select
  using ( status = 'published' AND deleted_at IS NULL );

create policy "Admin can manage certificates"
  on certificates for all
  using ( auth.role() = 'authenticated' );
