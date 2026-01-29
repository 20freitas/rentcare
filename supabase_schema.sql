-- Create Properties Table
create table properties (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null default auth.uid(),
  address text not null,
  rent_amount numeric not null,
  payment_day integer not null,
  tenant_name text,
  status text check (status in ('paid', 'late', 'pending')) default 'pending',
  image_url text -- New optional column for property image
);

-- Enable Row Level Security (RLS)
alter table properties enable row level security;

-- Policies
create policy "Users can view their own properties"
  on properties for select
  using (auth.uid() = user_id);

create policy "Users can insert their own properties"
  on properties for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own properties"
  on properties for update
  using (auth.uid() = user_id);

create policy "Users can delete their own properties"
  on properties for delete
  using (auth.uid() = user_id);

-- Storage (Bucket creation needs to be done in Supabase UI, but policies can be here)
-- We'll guide the user to create a 'property-images' bucket.
