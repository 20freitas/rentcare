-- Opção para notificar quando um pagamento ultrapassa o prazo
alter table notification_settings
  add column if not exists notify_overdue boolean not null default true;

comment on column notification_settings.notify_overdue is 'Enviar email quando um pagamento está em atraso (prazo ultrapassado)';
