# Configurar Login com Google (Supabase Auth)

Siga estes passos para ativar o login e criação de conta com Google na RentCare.

---

## 1. Google Cloud Console

1. Aceda a [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um projeto novo ou escolha um existente.
3. Vá a **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
4. Se for a primeira vez, configure o **OAuth consent screen**:
   - Tipo: **External** (para utilizadores com conta Google).
   - Preencha nome da aplicação, email de suporte e domínios (ex.: `localhost` para dev).
5. Ao criar o OAuth client ID:
   - **Application type**: **Web application**.
   - **Name**: ex. "RentCare".
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desenvolvimento)
     - `https://o-seu-dominio.vercel.app` (produção)
   - **Authorized redirect URIs**: use o URL que o Supabase indica (passo seguinte).
6. Copie o **Client ID** e o **Client Secret**.

---

## 2. Supabase Dashboard

1. Abra o seu projeto em [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá a **Authentication** → **Providers** → **Google**.
3. Ative **Enable Sign in with Google**.
4. Cole o **Client ID** e o **Client Secret** do Google.
5. Na mesma página (ou em **URL Configuration**) veja o **Callback URL** do Supabase. Deve ser algo como:
   - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
6. Volte ao Google Cloud Console e adicione esse URL em **Authorized redirect URIs** (em Credentials → o seu OAuth client).
   - Exemplo: `https://abcdefgh.supabase.co/auth/v1/callback`

---

## 3. Redirect URLs no Supabase

1. Em **Authentication** → **URL Configuration**.
2. Em **Redirect URLs** adicione as URLs para onde o utilizador pode ser redirecionado após login:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**`
   - Em produção: `https://o-seu-dominio.com/auth/callback` e `https://o-seu-dominio.com/**`
3. **Site URL** pode ficar como `http://localhost:3000` em dev e `https://o-seu-dominio.com` em produção.

---

## 4. Resumo de URLs

| Onde | URL a configurar |
|------|-------------------|
| Google – Authorized JavaScript origins | `http://localhost:3000`, `https://seu-dominio.com` |
| Google – Authorized redirect URIs | O **Callback URL** do Supabase (ex.: `https://XXX.supabase.co/auth/v1/callback`) |
| Supabase – Redirect URLs | `http://localhost:3000/auth/callback`, e em produção o mesmo com o seu domínio |

---

## 5. Testar

1. Reinicie o servidor de desenvolvimento (`npm run dev`).
2. Vá a `/login` ou `/signup`.
3. Clique em **Continuar com Google** e complete o fluxo no Google.
4. Deve ser redirecionado para `/auth/callback` e depois para o dashboard.

Se aparecer erro de redirect ou "redirect_uri_mismatch", confira que o redirect URI no Google é **exatamente** o Callback URL do Supabase (copie da dashboard do Supabase).

**"Código de autenticação em falta"**: A app aceita tanto o fluxo com `code` (PKCE) como o fluxo com tokens no URL. Se este erro aparecer, confirma que em **Supabase** → **Authentication** → **URL Configuration** está definido `http://localhost:3000/auth/callback` (ou o teu domínio) em **Redirect URLs**. Sem isto, o Supabase não redireciona para a nossa página com os dados de sessão.

---

## 6. Personalizar o ecrã "Continuar para..."

O texto **"Continuar para jaageaxescriaevwqwbx.supabase.co"** aparece porque o Google mostra o domínio para onde está a enviar o utilizador (o servidor de auth do Supabase). Para melhorar a experiência:

### Opção A – Marca no ecrã de consentimento do Google (recomendado)

1. No [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **OAuth consent screen**.
2. Edite o ecrã de consentimento:
   - **App name**: ex. "RentCare".
   - **User support email**: o teu email.
   - **App logo**: carrega o logo (ex. `public/logo.png`).
   - **App domain** (opcional): site da app, ex. `https://rentcare.vercel.app`.
   - **Developer contact**: o teu email.
3. Guarde. O utilizador passa a ver o nome e o logo da app no ecrã do Google; o texto "Continuar para..." continua a mostrar o domínio do Supabase, mas a página fica mais reconhecível.

### Opção B – Domínio próprio para Auth (avançado)

Para que apareça **"Continuar para rentcare.com"** (ou o teu domínio) em vez de `*.supabase.co`:

1. Configura um **custom domain** para o teu projeto Supabase (ex. `auth.rentcare.com` apontando para o endpoint de Auth do Supabase).
2. Segue a doc do Supabase: [Custom domains](https://supabase.com/docs/guides/platform/custom-domains).
3. No Google Cloud, em **Authorized redirect URIs**, usa o callback no teu domínio (ex. `https://auth.rentcare.com/auth/v1/callback`) em vez do URL do Supabase.
4. No Supabase, em **Authentication** → **URL Configuration**, configura o custom domain como base para Auth.

Isto exige domínio próprio e configuração DNS; para a maioria dos casos, a **Opção A** (nome + logo no OAuth consent screen) é suficiente.
