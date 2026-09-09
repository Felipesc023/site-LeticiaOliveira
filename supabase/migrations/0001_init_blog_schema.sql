-- Site/Blog Letícia Oliveira — initial schema
-- Applied to project capfxriewljazpfvfncc. Two admins via email allowlist (RF-001).
-- Public reads only published articles whose publish time has passed.

create extension if not exists moddatetime schema extensions;

-- ── admin_emails ──────────────────────────────────────────────────────────────
create table public.admin_emails (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admin_emails enable row level security;

create policy "admin_emails: authenticated read"
  on public.admin_emails for select
  to authenticated
  using (true);

-- ── articles ─────────────────────────────────────────────────────────────────
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  category text not null check (category in ('judicial', 'extrajudicial')),
  cover_url text,
  cover_credit text,
  meta_description text,
  keywords text[],
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_public_idx on public.articles (published_at desc)
  where status = 'published';
create index articles_category_idx on public.articles (category);

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function extensions.moddatetime(updated_at);

alter table public.articles enable row level security;

create policy "articles: public read published"
  on public.articles for select
  to anon, authenticated
  using (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  );

create policy "articles: admin read all"
  on public.articles for select
  to authenticated
  using ((auth.jwt() ->> 'email') in (select email from public.admin_emails));

create policy "articles: admin insert"
  on public.articles for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') in (select email from public.admin_emails));

create policy "articles: admin update"
  on public.articles for update
  to authenticated
  using ((auth.jwt() ->> 'email') in (select email from public.admin_emails))
  with check ((auth.jwt() ->> 'email') in (select email from public.admin_emails));

create policy "articles: admin delete"
  on public.articles for delete
  to authenticated
  using ((auth.jwt() ->> 'email') in (select email from public.admin_emails));

-- ── storage: article covers ──────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('article-covers', 'article-covers', true)
on conflict (id) do nothing;

create policy "covers: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'article-covers');

create policy "covers: admin write"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'article-covers'
    and (auth.jwt() ->> 'email') in (select email from public.admin_emails)
  );

create policy "covers: admin update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'article-covers'
    and (auth.jwt() ->> 'email') in (select email from public.admin_emails)
  )
  with check (
    bucket_id = 'article-covers'
    and (auth.jwt() ->> 'email') in (select email from public.admin_emails)
  );

create policy "covers: admin delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'article-covers'
    and (auth.jwt() ->> 'email') in (select email from public.admin_emails)
  );

-- ── seed ─────────────────────────────────────────────────────────────────────
insert into public.admin_emails (email) values
  ('felipesilvadecarvalho123@gmail.com')
on conflict do nothing;
