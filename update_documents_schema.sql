-- Adicionar coluna expiration_date à tabela documents
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS expiration_date date;

-- Criar índice para facilitar consultas futuras de notificações
CREATE INDEX IF NOT EXISTS documents_expiration_date_idx ON documents(expiration_date);
