-- Tabela de documentos (corresponde à página Documentos)
-- Executa isto no Supabase SQL Editor se a tabela ainda não existir.

create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  property_id uuid references properties(id) on delete cascade not null,
  file_name text not null,
  type text not null check (type in ('Contrato', 'Recibo', 'Manutenção', 'Outro')),
  upload_date timestamp with time zone default timezone('utc'::text, now()),
  tenant_name text,
  notes text,
  file_url text not null
);

-- Índices para filtrar por imóvel e data
create index if not exists documents_property_id_idx on documents(property_id);
create index if not exists documents_upload_date_idx on documents(upload_date desc);

-- RLS (opcional: se quiseres que cada user só veja docs dos seus imóveis)
-- alter table documents enable row level security;
-- create policy "Users see documents of their properties"
--   on documents for select
--   using (
--     property_id in (select id from properties where user_id = auth.uid())
--   );
-- create policy "Users can insert documents for their properties"
--   on documents for insert
--   with check (
--     property_id in (select id from properties where user_id = auth.uid())
--   );
-- create policy "Users can delete their documents"
--   on documents for delete
--   using (
--     property_id in (select id from properties where user_id = auth.uid())
--   );
