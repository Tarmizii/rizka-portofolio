-- Storage bucket for portfolio assets
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- Storage policies for portfolio assets (check if exists before creating)
do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Public users can read portfolio assets'
  ) then
    create policy "Public users can read portfolio assets"
      on storage.objects for select
      using ( bucket_id = 'portfolio-assets' );
  end if;

  if not exists (
    select 1 from pg_policies where policyname = 'Admin can upload portfolio assets'
  ) then
    create policy "Admin can upload portfolio assets"
      on storage.objects for insert
      with check ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );
  end if;

  if not exists (
    select 1 from pg_policies where policyname = 'Admin can update portfolio assets'
  ) then
    create policy "Admin can update portfolio assets"
      on storage.objects for update
      using ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );
  end if;

  if not exists (
    select 1 from pg_policies where policyname = 'Admin can delete portfolio assets'
  ) then
    create policy "Admin can delete portfolio assets"
      on storage.objects for delete
      using ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );
  end if;
end $$;
