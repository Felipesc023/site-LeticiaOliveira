-- Leads captured from the public contact form / hero CTA.
-- Public (anon) can only insert — never read, update or delete their own or
-- anyone else's row. Only the admin allowlist can read/update.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  reason text not null check (reason in ('arrematacao', 'outro')),
  investment_range text,
  source text,
  status text not null default 'novo' check (status in ('novo', 'contatado')),
  created_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

create policy "leads: public insert"
  on public.leads for insert
  to anon, authenticated
  with check (true);

create policy "leads: admin read"
  on public.leads for select
  to authenticated
  using ((auth.jwt() ->> 'email') in (select email from public.admin_emails));

create policy "leads: admin update"
  on public.leads for update
  to authenticated
  using ((auth.jwt() ->> 'email') in (select email from public.admin_emails))
  with check ((auth.jwt() ->> 'email') in (select email from public.admin_emails));
