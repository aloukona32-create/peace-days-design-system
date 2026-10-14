-- ============================================================
--  Peace Days Dubaï 2027 — Comptes membres & profils
--
--  À exécuter APRÈS schema.sql, dans : Supabase → SQL Editor → Run.
--  Réexécutable sans erreur (create ... if not exists / drop policy avant create).
--  Après exécution, l'accès admin est piloté par `profiles.is_admin`.
--  Pour promouvoir un compte : mettre cette colonne à true dans le profil
--  correspondant (ou via `public.set_profile_admin` si un admin est connecté).
--
--  SÉCURITÉ — MOTS DE PASSE : ils ne sont JAMAIS stockés ici. Supabase Auth
--  les conserve, hachés (bcrypt), dans `auth.users.encrypted_password`. La
--  table `profiles` ci-dessous ne fait que prolonger `auth.users` avec les
--  infos métier (nom, téléphone, pays…), reliée par `id`.
-- ============================================================

-- ---- Profils membres (1 ligne ↔ 1 compte auth.users) ----
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  prenom        text,
  nom           text,
  telephone     text,
  pays          text,
  organisation  text,
  fonction      text,
  type_compte   text not null default 'visiteur'
                  check (type_compte in ('visiteur','exposant','partenaire','media')),
  interets      text[] not null default '{}',
  bio           text,
  newsletter    boolean not null default false,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists profiles_pays_idx on public.profiles (pays);
create index if not exists profiles_type_idx on public.profiles (type_compte);

-- L'ancienne table est temporairement lue pour migrer les admins existants.
do $$
begin
  if to_regclass('public.admins') is not null then
    alter table public.admins add column if not exists actif boolean not null default true;
  end if;
end;
$$;

-- Crée les profils manquants pour les comptes déjà présents avant l'installation
-- du trigger. Les métadonnées publiques ne peuvent jamais définir is_admin.
insert into public.profiles (id, prenom, nom, telephone, pays, organisation, fonction, type_compte, newsletter)
select
  u.id,
  u.raw_user_meta_data->>'prenom',
  u.raw_user_meta_data->>'nom',
  u.raw_user_meta_data->>'telephone',
  u.raw_user_meta_data->>'pays',
  u.raw_user_meta_data->>'organisation',
  u.raw_user_meta_data->>'fonction',
  case
    when u.raw_user_meta_data->>'type_compte' in ('visiteur','exposant','partenaire','media')
      then u.raw_user_meta_data->>'type_compte'
    else 'visiteur'
  end,
  case
    when lower(u.raw_user_meta_data->>'newsletter') in ('true','false')
      then (u.raw_user_meta_data->>'newsletter')::boolean
    else false
  end
from auth.users u
on conflict (id) do nothing;

-- ---- Droit d'administration dans le profil ----
-- Copie les admins existants une seule fois au moment de l'ajout de la colonne,
-- afin qu'une réexécution ne réactive pas un admin désactivé depuis.
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'is_admin'
  ) then
    alter table public.profiles
      add column is_admin boolean not null default false;

    if to_regclass('public.admins') is not null then
      update public.profiles p
      set is_admin = true
      from public.admins a
      where a.user_id = p.id
        and a.actif;
    end if;
  end if;
end;
$$;

create index if not exists profiles_is_admin_idx
  on public.profiles (id) where is_admin;

-- ---- updated_at automatique ----
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---- Création auto du profil à l'inscription ----
--  supabase.auth.signUp({ options: { data: {...} } }) range ces champs dans
--  auth.users.raw_user_meta_data. Ce trigger (security definer → contourne la
--  RLS) crée le profil, même en cas de confirmation d'e-mail (pas de session
--  côté client au moment de l'insert). Si l'utilisateur a coché la newsletter,
--  on l'ajoute aussi à la table `abonnes`.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, prenom, nom, telephone, pays, organisation, fonction, type_compte, newsletter)
  values (
    new.id,
    new.raw_user_meta_data->>'prenom',
    new.raw_user_meta_data->>'nom',
    new.raw_user_meta_data->>'telephone',
    new.raw_user_meta_data->>'pays',
    new.raw_user_meta_data->>'organisation',
    new.raw_user_meta_data->>'fonction',
    case
      when new.raw_user_meta_data->>'type_compte' in ('visiteur','exposant','partenaire','media')
        then new.raw_user_meta_data->>'type_compte'
      else 'visiteur'
    end,
    case
      when lower(new.raw_user_meta_data->>'newsletter') in ('true','false')
        then (new.raw_user_meta_data->>'newsletter')::boolean
      else false
    end
  )
  on conflict (id) do nothing;

  if lower(new.raw_user_meta_data->>'newsletter') = 'true' then
    insert into public.abonnes (email, langue, source)
    values (new.email, 'FR', 'inscription-compte')
    on conflict (email) do nothing;
  end if;

  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- RLS profils : chacun voit/édite le sien ; les admins voient tout ----
alter table public.profiles enable row level security;
grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;

-- `is_admin` n'est jamais modifiable directement via le client. Les autres
-- colonnes sont attribuées explicitement afin qu'un membre ne puisse pas se
-- promouvoir en insérant ou modifiant son propre profil.
revoke insert, update on public.profiles from authenticated;
grant insert (
  id, prenom, nom, telephone, pays, organisation, fonction, type_compte,
  interets, bio, newsletter, avatar_url
) on public.profiles to authenticated;
grant update (
  prenom, nom, telephone, pays, organisation, fonction, type_compte,
  interets, bio, newsletter, avatar_url
) on public.profiles to authenticated;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ---- is_admin() : source d'autorité unique = profiles.is_admin ----
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select p.is_admin
    from public.profiles p
    where p.id = auth.uid()
  ), false);
$$;

-- Permet aux admins de gérer ce droit depuis un client authentifié, sans
-- accorder de mise à jour directe de la colonne protégée.
create or replace function public.set_profile_admin(target_user_id uuid, admin_enabled boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Seuls les admins peuvent modifier le rôle administrateur.';
  end if;

  update public.profiles
  set is_admin = admin_enabled
  where id = target_user_id;

  if not found then
    raise exception 'Profil introuvable.';
  end if;
end;
$$;

revoke all on function public.set_profile_admin(uuid, boolean) from public, anon;
grant execute on function public.set_profile_admin(uuid, boolean) to authenticated;

-- ---- Retrait de l'ancienne liste d'admins après migration ----
drop function if exists public.touch_admin_login();
drop table if exists public.admins;

-- ============================================================
--  Rappel : un compte membre = une ligne auth.users + profiles (créé auto).
--  L'ancienne table `admins` est migrée puis supprimée ; l'accès est désormais
--  exclusivement défini par profiles.is_admin.
-- ============================================================

-- ============================================================
--  Demandes de participation (formulaire public de /peace-days)
--
--  Une seule « boîte de réception » pour toutes les demandes, quel que soit le
--  profil (visiteur, exposant, partenaire, média). Insertion ouverte au public
--  (anon) avec statut « nouveau » ; lecture/traitement réservés aux admins.
--  `user_id` est renseigné quand un membre connecté envoie sa demande.
-- ============================================================
create table if not exists public.demandes (
  id                 uuid primary key default gen_random_uuid(),
  prenom             text not null,
  nom                text not null,
  email              text not null,
  telephone          text not null default '',
  pays               text not null,
  organisation       text not null default '',
  fonction           text not null default '',
  type_participation text not null default 'visiteur'
                       check (type_participation in ('visiteur','exposant','partenaire','media')),
  categorie          text not null default '',
  message            text not null default '',
  newsletter         boolean not null default false,
  user_id            uuid references auth.users (id) on delete set null,
  statut             text not null default 'nouveau'
                       check (statut in ('nouveau','en_revue','traite','archive')),
  created_at         timestamptz not null default now()
);

create index if not exists demandes_created_idx on public.demandes (created_at desc);
create index if not exists demandes_type_idx    on public.demandes (type_participation);

alter table public.demandes enable row level security;
grant insert on public.demandes to anon, authenticated;
grant select, update, delete on public.demandes to authenticated;

drop policy if exists demandes_insert on public.demandes;
create policy demandes_insert on public.demandes
  for insert to anon, authenticated
  with check (statut = 'nouveau' or public.is_admin());

drop policy if exists demandes_read on public.demandes;
create policy demandes_read on public.demandes
  for select to authenticated using (public.is_admin());

drop policy if exists demandes_update on public.demandes;
create policy demandes_update on public.demandes
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists demandes_delete on public.demandes;
create policy demandes_delete on public.demandes
  for delete to authenticated using (public.is_admin());
