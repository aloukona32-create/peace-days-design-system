-- ============================================================
--  Peace Days Dubaï 2027 — Schéma back-office (Supabase / Postgres)
--
--  À exécuter dans : Supabase → SQL Editor → New query → Run.
--  Le public soumet via les formulaires + lit les engagements publiés ;
--  seuls les admins (table `admins`) lisent le privé et changent les statuts.
-- ============================================================

-- ---- Extensions ----
create extension if not exists pgcrypto;

-- ---- Séquences de références lisibles (VP-2049, EXP-319, …) ----
create sequence if not exists engagements_seq start 2049;
create sequence if not exists candidatures_seq start 319;
create sequence if not exists reservations_seq start 93;
create sequence if not exists partenaires_seq start 55;
create sequence if not exists abonnes_seq start 1288;

-- ---- Administrateurs (allowlist) ----
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  added_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---- Tables métier ----
create table if not exists public.engagements (
  id text primary key default ('VP-' || nextval('engagements_seq')),
  auteur text not null,
  pays text not null,
  email text not null,
  message text not null,
  theme text not null,
  statut text not null default 'en_attente'
    check (statut in ('en_attente','publie','refuse')),
  soumis_le timestamptz not null default now()
);
create table if not exists public.candidatures (
  id text primary key default ('EXP-' || nextval('candidatures_seq')),
  structure text not null,
  contact text not null,
  email text not null,
  pays text not null,
  categorie text not null,
  stand text not null default '',
  statut text not null default 'soumis'
    check (statut in ('brouillon','soumis','en_revue','accepte','refuse')),
  soumis_le timestamptz not null default now()
);

create table if not exists public.reservations (
  id text primary key default ('GALA-' || lpad(nextval('reservations_seq')::text, 3, '0')),
  nom text not null,
  organisation text not null default '',
  formule text not null,
  couverts integer not null default 1 check (couverts > 0),
  montant integer not null default 0 check (montant >= 0),
  statut text not null default 'demande'
    check (statut in ('demande','confirme','liste_attente','annule')),
  soumis_le timestamptz not null default now()
);

create table if not exists public.partenaires (
  id text primary key default ('PRT-' || lpad(nextval('partenaires_seq')::text, 3, '0')),
  organisation text not null,
  type text not null
    check (type in ('Sponsor','Institution','Média','Ambassade','Fondation')),
  contact text not null default '',
  email text not null,
  pays text not null,
  statut text not null default 'nouveau'
    check (statut in ('nouveau','en_discussion','engage','decline')),
  soumis_le timestamptz not null default now()
);

create table if not exists public.abonnes (
  id text primary key default ('NL-' || nextval('abonnes_seq')),
  email text not null unique,
  langue text not null default 'FR' check (langue in ('FR','EN','AR')),
  source text not null default '',
  inscrit_le timestamptz not null default now()
);
-- ---- Index (tri admin par date, filtre par statut) ----
create index if not exists engagements_soumis_le_idx  on public.engagements  (soumis_le desc);
create index if not exists candidatures_soumis_le_idx on public.candidatures (soumis_le desc);
create index if not exists reservations_soumis_le_idx on public.reservations (soumis_le desc);
create index if not exists partenaires_soumis_le_idx  on public.partenaires  (soumis_le desc);
create index if not exists abonnes_inscrit_le_idx     on public.abonnes      (inscrit_le desc);

-- ---- RLS : activation sur toutes les tables ----
alter table public.admins       enable row level security;
alter table public.engagements  enable row level security;
alter table public.candidatures enable row level security;
alter table public.reservations enable row level security;
alter table public.partenaires  enable row level security;
alter table public.abonnes      enable row level security;

-- ---- Grants (RLS reste le vrai garde-fou ; ces droits sont redondants avec
--       la config Supabase par défaut, on les pose explicitement par sûreté) ----
grant usage on schema public to anon, authenticated;

grant select, insert on public.engagements  to anon, authenticated;
grant update, delete on public.engagements  to authenticated;
grant insert          on public.candidatures to anon, authenticated;
grant select, update, delete on public.candidatures to authenticated;
grant insert          on public.reservations to anon, authenticated;
grant select, update, delete on public.reservations to authenticated;
grant insert          on public.partenaires  to anon, authenticated;
grant select, update, delete on public.partenaires  to authenticated;
grant insert          on public.abonnes      to anon, authenticated;
grant select, update, delete on public.abonnes      to authenticated;
grant select          on public.admins       to authenticated;
-- ============================================================
--  Policies
--  Convention : anon (public) peut soumettre et lire le strict nécessaire ;
--  is_admin() ouvre tout le reste. On DROP avant CREATE pour réexécuter le
--  script sans erreur.
-- ============================================================

-- admins : consultable uniquement par les admins eux-mêmes
drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins
  for select to authenticated using (public.is_admin());

-- engagements : le public lit les publiés + soumet en 'en_attente' ; admin = tout
drop policy if exists engagements_read on public.engagements;
create policy engagements_read on public.engagements
  for select to anon, authenticated
  using (statut = 'publie' or public.is_admin());

drop policy if exists engagements_insert on public.engagements;
create policy engagements_insert on public.engagements
  for insert to anon, authenticated
  with check (statut = 'en_attente' or public.is_admin());

drop policy if exists engagements_update on public.engagements;
create policy engagements_update on public.engagements
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists engagements_delete on public.engagements;
create policy engagements_delete on public.engagements
  for delete to authenticated using (public.is_admin());
-- candidatures : soumission publique (brouillon/soumis) ; lecture/gestion admin
drop policy if exists candidatures_insert on public.candidatures;
create policy candidatures_insert on public.candidatures
  for insert to anon, authenticated
  with check (statut in ('brouillon','soumis') or public.is_admin());

drop policy if exists candidatures_read on public.candidatures;
create policy candidatures_read on public.candidatures
  for select to authenticated using (public.is_admin());

drop policy if exists candidatures_update on public.candidatures;
create policy candidatures_update on public.candidatures
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists candidatures_delete on public.candidatures;
create policy candidatures_delete on public.candidatures
  for delete to authenticated using (public.is_admin());

-- reservations : demande publique ('demande') ; lecture/gestion admin
drop policy if exists reservations_insert on public.reservations;
create policy reservations_insert on public.reservations
  for insert to anon, authenticated
  with check (statut = 'demande' or public.is_admin());

drop policy if exists reservations_read on public.reservations;
create policy reservations_read on public.reservations
  for select to authenticated using (public.is_admin());

drop policy if exists reservations_update on public.reservations;
create policy reservations_update on public.reservations
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists reservations_delete on public.reservations;
create policy reservations_delete on public.reservations
  for delete to authenticated using (public.is_admin());
-- partenaires : demande publique ('nouveau') ; lecture/gestion admin
drop policy if exists partenaires_insert on public.partenaires;
create policy partenaires_insert on public.partenaires
  for insert to anon, authenticated
  with check (statut = 'nouveau' or public.is_admin());

drop policy if exists partenaires_read on public.partenaires;
create policy partenaires_read on public.partenaires
  for select to authenticated using (public.is_admin());

drop policy if exists partenaires_update on public.partenaires;
create policy partenaires_update on public.partenaires
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists partenaires_delete on public.partenaires;
create policy partenaires_delete on public.partenaires
  for delete to authenticated using (public.is_admin());

-- abonnes : inscription newsletter publique ; lecture/gestion admin
drop policy if exists abonnes_insert on public.abonnes;
create policy abonnes_insert on public.abonnes
  for insert to anon, authenticated with check (true);

drop policy if exists abonnes_read on public.abonnes;
create policy abonnes_read on public.abonnes
  for select to authenticated using (public.is_admin());

drop policy if exists abonnes_update on public.abonnes;
create policy abonnes_update on public.abonnes
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists abonnes_delete on public.abonnes;
create policy abonnes_delete on public.abonnes
  for delete to authenticated using (public.is_admin());

-- ============================================================
--  Bootstrap admin (À FAIRE UNE FOIS, après avoir créé le compte)
--  1. Auth → Users → Add user → renseigner l'email + mot de passe de l'admin.
--  2. Copier son UID, puis exécuter (en remplaçant les valeurs) :
--       insert into public.admins (user_id, email)
--       values ('COLLER-UID-ICI', 'admin@exemple.com');
--  Sans cette ligne, aucun compte n'a accès aux données privées.
-- ============================================================
