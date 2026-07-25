-- Profiles table for user information
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  professional_title text,
  bio text,
  email text,
  phone text,
  github_url text,
  resume_url text,
  availability text,
  institution text,
  study_program text,
  graduation_year integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Admin can update profile"
  on profiles for update
  using ( auth.role() = 'authenticated' );

create policy "Admin can insert profile"
  on profiles for insert
  with check ( auth.role() = 'authenticated' );
