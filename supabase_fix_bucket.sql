-- Ensure the 'properties' bucket exists
insert into storage.buckets (id, name, public)
values ('properties', 'properties', true)
on conflict (id) do nothing;

-- Ensure RLS is enabled for objects (it usually is by default, but good to ensure)
alter table storage.objects enable row level security;

-- Re-apply policies just in case (using DO block to avoid errors if they exist, or just drop and recreate)
drop policy if exists "Public Access for Properties" on storage.objects;
create policy "Public Access for Properties"
  on storage.objects for select
  using ( bucket_id = 'properties' );

drop policy if exists "Authenticated Upload for Properties" on storage.objects;
create policy "Authenticated Upload for Properties"
  on storage.objects for insert
  with check ( bucket_id = 'properties' and auth.role() = 'authenticated' );
