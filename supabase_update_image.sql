-- Add image_url column to properties table
alter table properties 
add column image_url text;

-- (Optional) Create a storage bucket for properties if it doesn't exist
-- This part acts as documentation for the user since bucket creation is often easier in the UI
-- insert into storage.buckets (id, name, public) values ('properties', 'properties', true);

-- Enable public access to the properties bucket (if you want images to be publicly viewable)
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'properties' );

-- Allow authenticated users to upload images to the properties bucket
-- create policy "Authenticated users can upload" on storage.objects for insert with check ( bucket_id = 'properties' and auth.role() = 'authenticated' );
