-- ============================================================
--  Peace Days Dubaï 2027 — Comptes membres & profils
--
--  À exécuter APRÈS schema.sql, dans : Supabase → SQL Editor → Run.
--  Réexécutable sans erreur (create ... if not exists / drop policy avant create).
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
    coalesce(new.raw_user_meta_data->>'type_compte', 'visiteur'),
    coalesce((new.raw_user_meta_data->>'newsletter')::boolean, false)
  )
  on conflict (id) do nothing;

  if coalesce((new.raw_user_meta_data->>'newsletter')::boolean, false) then
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
grant select, insert, update on public.profiles to authenticated;

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

-- ============================================================
--  Enrichissement de la table `admins` (additif, sans casser l'existant)
--  Rôles à deux niveaux + activation/désactivation d'un compte admin.
-- ============================================================
alter table public.admins add column if not exists nom               text;
alter table public.admins add column if not exists role              text not null default 'admin';
alter table public.admins add column if not exists actif             boolean not null default true;
alter table public.admins add column if not exists derniere_connexion timestamptz;

--  is_admin() ne reconnaît plus qu'un admin ACTIF (les lignes existantes ont
--  actif = true par défaut, donc l'accès en place n'est pas interrompu).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid() and actif
  );
$$;

-- ---- Confort : trace la dernière connexion d'un admin (appel optionnel) ----
create or replace function public.touch_admin_login()
returns void language sql security definer set search_path = public as $$
  update public.admins set derniere_connexion = now() where user_id = auth.uid();
$$;

-- ============================================================
--  Rappel : un compte membre = une ligne auth.users + profiles (créé auto).
--  Un compte ADMIN = en plus, une ligne dans `admins` (voir schema.sql).
--  Le rôle recommandé : 'superadmin' | 'admin' | 'editeur' (libre, non contraint).
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
