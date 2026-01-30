-- Bucket e políticas para upload de documentos
-- Executa no Supabase: SQL Editor (Storage usa a mesma BD)

-- 1. Criar o bucket "documents" (público para poder ver os ficheiros via URL)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do update set public = true;

-- 2. Políticas no storage.objects (RLS já está ativo; não alteres storage.objects)

-- Qualquer pessoa pode ver (ler) ficheiros do bucket documents (URLs públicas)
drop policy if exists "Public read documents" on storage.objects;
create policy "Public read documents"
  on storage.objects for select
  using ( bucket_id = 'documents' );

-- Utilizadores autenticados podem fazer upload para documents
drop policy if exists "Authenticated upload documents" on storage.objects;
create policy "Authenticated upload documents"
  on storage.objects for insert
  with check ( bucket_id = 'documents' and auth.role() = 'authenticated' );

-- Utilizadores autenticados podem apagar os seus ficheiros (opcional)
drop policy if exists "Authenticated delete documents" on storage.objects;
create policy "Authenticated delete documents"
  on storage.objects for delete
  using ( bucket_id = 'documents' and auth.role() = 'authenticated' );
