-- Tabela de ocorrências de manutenção
-- Executa no Supabase SQL Editor se a tabela ainda não existir.

create table if not exists maintenance_occurrences (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  property_id uuid references properties(id) on delete cascade not null,
  problem_type text not null check (problem_type in ('Canalização', 'Eletricidade', 'Eletrodoméstico', 'Estrutura', 'Outro')),
  description text not null,
  problem_date date not null,
  cost numeric,
  status text not null check (status in ('Por resolver', 'Em andamento', 'Resolvido')) default 'Por resolver',
  attachment_urls text[] default '{}'
);

create index if not exists maintenance_property_id_idx on maintenance_occurrences(property_id);
create index if not exists maintenance_problem_date_idx on maintenance_occurrences(problem_date desc);
create index if not exists maintenance_status_idx on maintenance_occurrences(status);
