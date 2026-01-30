-- Create Tenants Table
create table tenants (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  email text,
  phone text,
  nif text,
  property_id uuid references properties(id),
  rent_amount numeric,
  payment_day integer,
  notes text
);

-- Enable RLS for tenants
alter table tenants enable row level security;

-- Policies for tenants
create policy "Users can view their own tenants"
  on tenants for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tenants"
  on tenants for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tenants"
  on tenants for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tenants"
  on tenants for delete
  using (auth.uid() = user_id);

-- Create Rent Payments Table (for history)
create table rent_payments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null default auth.uid(),
  tenant_id uuid references tenants(id) not null,
  property_id uuid references properties(id),
  amount numeric not null,
  status text check (status in ('paid', 'late', 'pending')) default 'pending',
  due_date date not null,
  payment_date date,
  notes text
);

-- Enable RLS for rent_payments
alter table rent_payments enable row level security;

-- Policies for rent_payments
create policy "Users can view their own rent payments"
  on rent_payments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own rent payments"
  on rent_payments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own rent payments"
  on rent_payments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own rent payments"
  on rent_payments for delete
  using (auth.uid() = user_id);
