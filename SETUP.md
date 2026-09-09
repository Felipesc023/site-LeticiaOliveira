# Site/Blog Letícia Oliveira — setup

Stack: Next.js 15 (App Router) + Supabase (Postgres + Auth + Storage) + Claude para revisão editorial.

## Rodar local

```bash
npm install
cp .env.example .env.local   # e preencha os campos vazios
npm run dev                  # http://localhost:3000
npm test                     # checagens unitárias (lógica de publicação, slug, parse de IA)
npm run build                # build de produção
```

## Variáveis de ambiente (`.env.local`)

| Var | Onde obter | Obrigatória |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | já preenchida (projeto `capfxriewljazpfvfncc`) | sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | já preenchida (publishable key) | sim |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` | só para o cron de agendamento |
| `ADMIN_ALLOWLIST` | e-mails Google autorizados, separados por vírgula | sim |
| `ANTHROPIC_API_KEY` | console.anthropic.com | para o assistente de IA |
| `AI_MODEL` | opcional — padrão `claude-opus-5`; use `claude-sonnet-5` para baratear | não |
| `NEXT_PUBLIC_WHATSAPP` | número com DDI, só dígitos (ex. `5516998770441`) | sim |
| `NEXT_PUBLIC_GA_ID` | ID do Google Analytics (`G-XXXX`). Vazio = sem GA e sem banner | não |
| `NEXT_PUBLIC_SITE_URL` | URL pública (canonical/OG/sitemap) | em produção |
| `CRON_SECRET` | string aleatória; protege `/api/cron/publish` | se usar o cron |

O allowlist é verificado em **três** lugares: `ADMIN_ALLOWLIST` (middleware + rotas), e a tabela `admin_emails` no banco (RLS). Mantenha os dois em sincronia.

```sql
-- adicionar a Letícia como admin (rode no SQL editor do Supabase)
insert into admin_emails (email) values ('email-da-leticia@gmail.com');
```

## Google OAuth (login do painel)

1. **Google Cloud Console** → APIs & Services → Credentials → *Create OAuth client ID* → Web application.
   - Authorized redirect URI: `https://capfxriewljazpfvfncc.supabase.co/auth/v1/callback`
2. **Supabase** → Authentication → Providers → Google → *Enable*, cole Client ID e Client Secret.
3. **Supabase** → Authentication → URL Configuration:
   - Site URL: `http://localhost:3000` (dev) / a URL de produção
   - Additional Redirect URLs: `http://localhost:3000/**`, `https://SEU-DOMINIO/**`

Fluxo: `/entrar` → botão Google → `/auth/callback` (troca o code) → checa allowlist → `/admin`.
Conta fora do allowlist é deslogada e volta para `/entrar?denied=1`.

## Banco de dados

Schema em `supabase/migrations/0001_init_blog_schema.sql` (já aplicado no projeto remoto). Tabelas:

- `articles` — campos da §41 do documento de requisitos. RLS: leitura pública só de `status='published'` com `published_at <= now()`; escrita só para e-mail no `admin_emails`.
- `admin_emails` — allowlist.
- bucket `article-covers` (Storage) — capa por upload; leitura pública, escrita só admin.

3 artigos-semente já publicados.

## Publicação agendada (opcional)

As leituras públicas já filtram por data, então um post agendado nunca aparece antes da hora **mesmo sem cron**. O cron só serve para deixar o `status` e a lista do painel coerentes:

```
GET https://SEU-DOMINIO/api/cron/publish
Authorization: Bearer <CRON_SECRET>
```

Agende a cada ~10 min no Vercel Cron ou cron-job.org.

## Assets de marca e fotos

`node scripts/build-assets.mjs "C:/Users/felip/Downloads/Fotos"` regenera, a partir
das fotos originais (HEIC do iPhone incluídas):

- `public/brand/monogram.png` — símbolo, usado no header e no OG (recolorido via CSS para fundos escuros)
- `public/brand/lockup.png` — lockup creme, usado no rodapé
- `app/icon.png` / `app/apple-icon.png` — favicon e ícone iOS
- `public/leticia/{home,sobre,contato}.jpg` — retratos otimizados

## Notas do ambiente

- **Tailwind v4 + sem repositório git**: a detecção automática de conteúdo do
  Tailwind depende da raiz do git. Como o projeto ainda não é um repo, `app/globals.css`
  tem `@source "../app/**/*"` e `@source "../components/**/*"` explícitos. Ao rodar
  `git init`, isso pode ser removido, mas não atrapalha.
- **OneDrive**: a pasta está em `OneDrive\Documentos`. O OneDrive sincroniza arquivos
  parcialmente escritos de `node_modules/` e `.next/`, o que já causou binários nativos
  corrompidos (SWC, Tailwind) e falhas intermitentes de `next build` ("Cannot find
  module for page"). Recomendação: mover o projeto para fora do OneDrive
  (ex. `C:\dev\Site_Leticia`) ou excluir a pasta da sincronização. Paliativo: `rm -rf .next`
  e rodar o build de novo.

## Pendências de conteúdo/asset (não bloqueiam o dev)

- Retratos: já incluídos (`public/leticia/`). Tratamento sugerido na §12 (suavizar
  fundo de cortina/persiana) é polimento opcional de pós-produção.
- Logo: `public/brand/*` gerados a partir dos PNGs. Se a Letícia enviar um vetor
  nativo (§13), substitua os PNGs e rode `scripts/build-assets.mjs`.
- Texto real da página **Sobre** — hoje é placeholder marcado no código (`app/sobre/page.tsx`).

## Deploy (Vercel)

1. Importe o repositório na Vercel.
2. Configure todas as variáveis de ambiente (incluindo `NEXT_PUBLIC_SITE_URL` = domínio final).
3. Adicione o domínio; atualize as Redirect URLs no Supabase.
4. (Recomendado) Cloudflare na frente do domínio para rate limiting de borda (§33).
