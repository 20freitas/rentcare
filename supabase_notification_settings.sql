 -- Tabela de definições de notificações por email
 create table if not exists notification_settings (
   user_id uuid primary key references auth.users not null,
   email_enabled boolean not null default false,
   notify_5days boolean not null default true,
   notify_1day boolean not null default true,
   email text
 );
 
 -- Ativar RLS
 alter table notification_settings enable row level security;
 
 -- Políticas: cada utilizador apenas vê/edita a sua própria linha
 drop policy if exists "Users can view their own notification settings" on notification_settings;
 create policy "Users can view their own notification settings"
   on notification_settings for select
   using ( auth.uid() = user_id );
 
 drop policy if exists "Users can insert their own notification settings" on notification_settings;
 create policy "Users can insert their own notification settings"
   on notification_settings for insert
   with check ( auth.uid() = user_id );
 
 drop policy if exists "Users can update their own notification settings" on notification_settings;
 create policy "Users can update their own notification settings"
   on notification_settings for update
   using ( auth.uid() = user_id );
 
