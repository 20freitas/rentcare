-- 1. Add Title Column
alter table properties 
add column title text;

-- 2. Storage Policies (Safeguard)
-- This ensures the 'properties' bucket is public and allows uploads
-- (Note: You still need to create the bucket 'properties' in the Supabase Dashboard if it doesn't exist!)

-- Allow public read access to 'properties' bucket
create policy "Public Access to Property Images"
on storage.objects for select
using ( bucket_id = 'properties' );

-- Allow authenticated users to upload to 'properties' bucket
create policy "Authenticated users can upload Property Images"
on storage.objects for insert
with check (
  bucket_id = 'properties' 
  and auth.role() = 'authenticated'
);
