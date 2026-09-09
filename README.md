# Site / Blog — Letícia Oliveira Advocacia

Site institucional + blog para advocacia em leilões de imóveis (judiciais e
extrajudiciais), com painel editorial e assistente de IA para revisão de texto.

**Stack:** Next.js 15 (App Router) · React 19 · Supabase (Postgres + Auth + Storage) · Tailwind v4 · Claude (revisão editorial)

## Começar

```bash
npm install
cp .env.example .env.local   # preencher os campos vazios
npm run dev                  # http://localhost:3000
npm test                     # checagens unitárias
npm run build
```

Setup completo (Google OAuth, variáveis, banco, deploy, geração de assets): **[SETUP.md](SETUP.md)**.

## Estrutura

| Caminho | O quê |
|---|---|
| `app/` | rotas — site público, `/entrar` (login), `/admin` (painel), `/api/*` |
| `components/` | UI compartilhada e do painel |
| `lib/` | Supabase, acesso a dados, IA, helpers |
| `supabase/migrations/` | schema do banco (aplicado no projeto remoto) |
| `scripts/build-assets.mjs` | gera logo/favicon/fotos a partir dos originais |

## Pendências

- Texto real da página **Sobre** (hoje é placeholder).
- Config do Google OAuth no Supabase e `ANTHROPIC_API_KEY` (ver SETUP.md).
