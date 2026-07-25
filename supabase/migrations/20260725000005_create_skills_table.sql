-- Skills table
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  visible boolean default true,
  sort_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table skills enable row level security;

create policy "Skills are viewable by everyone"
  on skills for select
  using ( visible = true );

create policy "Admin can manage skills"
  on skills for all
  using ( auth.role() = 'authenticated' );
