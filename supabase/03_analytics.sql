-- ============================================================
--  Peace Days Dubaï 2027 — Suivi d'audience (page_views)
--
--  À exécuter APRÈS schema.sql + 02_comptes.sql, dans :
--  Supabase → SQL Editor → Run. Réexécutable sans erreur.
--
--  Objectif : mesurer le trafic RÉEL du site (pages vues + visiteurs
--  uniques) sans dépendance externe. Chaque visite insère une ligne via
--  la clé anon ; seuls les admins lisent les agrégats (RLS).
--
--  Vie privée : aucune donnée personnelle. `visitor_id` est un UUID
--  aléatoire généré côté navigateur (localStorage), pas une identité.
-- ============================================================

create table if not exists public.page_views (
  id         bigint generated always as identity primary key,
  path       text not null,
  visitor_id uuid not null,
  referrer   text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_idx on public.page_views (created_at desc);
create index if not exists page_views_visitor_idx on public.page_views (visitor_id);

alter table public.page_views enable row level security;

grant usage  on schema public to anon, authenticated;
grant insert on public.page_views to anon, authenticated;
grant select on public.page_views to authenticated;

-- Insertion ouverte au public (le site enregistre les visites anonymes).
drop policy if exists page_views_insert on public.page_views;
create policy page_views_insert on public.page_views
  for insert to anon, authenticated with check (true);

-- Lecture réservée aux admins (agrégats du tableau de bord).
drop policy if exists page_views_read on public.page_views;
create policy page_views_read on public.page_views
  for select to authenticated using (public.is_admin());
