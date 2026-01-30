 # Configurar Notificações por Email Gratuitamente
 
 Este guia rápida explica como ativar os emails de lembretes (5 dias e 1 dia) usando o endpoint já criado na aplicação.
 
 ## 1) Criar tabela de definições no Supabase
 - Abra o Supabase → SQL Editor
 - Copie o conteúdo do ficheiro [supabase_notification_settings.sql](file:///c:/Users/20dio/Desktop/rentcare/supabase_notification_settings.sql)
 - Execute para criar a tabela `notification_settings` e políticas RLS.
 
 ## 2) Definir variáveis de ambiente
 Defina estas variáveis na plataforma de deploy (Vercel, Railway, etc.) ou num `.env.local` para desenvolvimento:
 
 - `SUPABASE_URL` → URL do seu projeto no Supabase
 - `SUPABASE_SERVICE_ROLE_KEY` → Chave Service Role (NÃO partilhe; apenas no servidor)
 - `RESEND_API_KEY` → Chave da conta Resend (https://resend.com) – tem plano gratuito
 - `EMAIL_FROM` → Remetente, por ex. `RentCare <onboarding@resend.dev>`
 
 > Nota: A chave Service Role é necessária no servidor para ler os dados dos utilizadores ao gerar emails diários. Não use esta chave no cliente.
 
 ## 3) Criar uma conta gratuita de email (Resend)
 - Registe-se em https://resend.com (plano gratuito inclui um número razoável de emails por mês)
 - Crie um “Domain” (pode usar um domínio já seu, ou o domínio temporário do Resend)
 - Obtenha a `RESEND_API_KEY` e configure em “Environment Variables” (ver passo 2)
 
 ## 4) Agendar o envio diário (cron)
 O endpoint que prepara e envia os emails está disponível em:
 
 - `GET /api/notifications/trigger`
 
 Configure um cron para chamar este endpoint diariamente:
 
 - Vercel Cron (gratuito): Agende uma chamada diária ao endpoint público do seu deploy.
 - Alternativas: GitHub Actions com `curl`, Railway scheduler, ou qualquer cron externo.
 
 Exemplo (Vercel JSON):
 ```json
 {
   "cron": [
     {
       "path": "/api/notifications/trigger",
       "schedule": "0 8 * * *"
     }
   ]
 }
 ```
 Isto envia todos os dias às 08:00 UTC.
 
 ## 5) Ativar nas Definições
 - Abra “Dashboard → Definições”
 - Ative “Ativar emails”
 - Ative/desative “Aviso 5 dias antes” e “Aviso 1 dia antes” conforme preferir
 
 ## 6) Testar manualmente
 - No browser, aceda ao seu deploy e visite `https://SEU_DOMINIO/api/notifications/trigger`
 - Deve receber um `ok: true` em JSON; se houver eventos elegíveis, será enviado email.
 
 ## 7) Segurança e privacidade
 - Guarde a `SUPABASE_SERVICE_ROLE_KEY` apenas em ambiente server.
 - Não exponha chaves no cliente.
 
 ## 8) Solução alternativa (SMTP/Nodemailer)
 Se preferir, pode usar um SMTP gratuito (por ex. Gmail – com limites) e o Nodemailer.
 
 - Configure variáveis: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
 - Adapte o endpoint para enviar via SMTP em vez de Resend.
 
 Para começar, o Resend é mais simples e geralmente suficiente.
 
