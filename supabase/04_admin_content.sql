-- ============================================================
-- Peace Days — Paramètres de l'événement et programme éditable
--
-- À exécuter après schema.sql et 02_comptes.sql.
-- Les valeurs initiales ne sont insérées qu'une fois ; les modifications
-- faites dans l'administration ne sont pas écrasées lors d'une réexécution.
-- ============================================================

create table if not exists public.site_settings (
  id text primary key check (id = 'default'),
  event_name text not null,
  edition text not null,
  dates_label text not null,
  location text not null,
  tagline text not null,
  contact_email text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, event_name, edition, dates_label, location, tagline)
values (
  'default',
  'Peace Days',
  'Dubaï 2027',
  '18 — 25 janvier 2027',
  'Dubaï, Émirats arabes unis',
  'Un rendez-vous international autour de la paix, du dialogue, de la culture et des connexions économiques.'
)
on conflict (id) do nothing;

create table if not exists public.program_days (
  id text primary key,
  day text not null,
  weekday text not null,
  label text not null,
  sort_order integer not null default 0
);

create table if not exists public.program_sessions (
  id text primary key,
  day_id text not null references public.program_days(id) on delete cascade,
  time text not null,
  type text not null check (type in ('foire','forum','art','sport','gala')),
  title text not null,
  place text not null,
  speaker text,
  blurb text not null,
  sort_order integer not null default 0
);

create index if not exists program_sessions_day_sort_idx
  on public.program_sessions (day_id, sort_order);

alter table public.site_settings enable row level security;
alter table public.program_days enable row level security;
alter table public.program_sessions enable row level security;

grant select on public.site_settings, public.program_days, public.program_sessions to anon, authenticated;
grant update on public.site_settings to authenticated;
grant insert, update, delete on public.program_days, public.program_sessions to authenticated;

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists site_settings_admin_update on public.site_settings;
create policy site_settings_admin_update on public.site_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists program_days_public_read on public.program_days;
create policy program_days_public_read on public.program_days
  for select to anon, authenticated using (true);

drop policy if exists program_days_admin_insert on public.program_days;
create policy program_days_admin_insert on public.program_days
  for insert to authenticated with check (public.is_admin());
drop policy if exists program_days_admin_update on public.program_days;
create policy program_days_admin_update on public.program_days
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists program_days_admin_delete on public.program_days;
create policy program_days_admin_delete on public.program_days
  for delete to authenticated using (public.is_admin());

drop policy if exists program_sessions_public_read on public.program_sessions;
create policy program_sessions_public_read on public.program_sessions
  for select to anon, authenticated using (true);

drop policy if exists program_sessions_admin_insert on public.program_sessions;
create policy program_sessions_admin_insert on public.program_sessions
  for insert to authenticated with check (public.is_admin());
drop policy if exists program_sessions_admin_update on public.program_sessions;
create policy program_sessions_admin_update on public.program_sessions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists program_sessions_admin_delete on public.program_sessions;
create policy program_sessions_admin_delete on public.program_sessions
  for delete to authenticated using (public.is_admin());

insert into public.program_days (id, day, weekday, label, sort_order) values
  ('18', '18', 'Lun', '18 janvier', 18),
  ('19', '19', 'Mar', '19 janvier', 19),
  ('20', '20', 'Mer', '20 janvier', 20),
  ('21', '21', 'Jeu', '21 janvier', 21),
  ('22', '22', 'Ven', '22 janvier', 22),
  ('23', '23', 'Sam', '23 janvier', 23),
  ('24', '24', 'Dim', '24 janvier', 24),
  ('25', '25', 'Lun', '25 janvier', 25)
on conflict (id) do nothing;

insert into public.program_sessions (id, day_id, time, type, title, place, speaker, blurb, sort_order) values
  ('18-1', '18', '10:00', 'foire', 'Ouverture de la Foire', 'Hall principal', 'Cérémonie officielle', 'Inauguration de la Foire des produits locaux et de l’artisanat en présence des autorités.', 1),
  ('18-2', '18', '18:18', 'foire', 'La Minute de la Paix', 'Scène centrale', null, 'Un moment collectif synchronisé avec les relais Peace Caravan à travers le monde.', 2),
  ('19-1', '19', '09:30', 'forum', 'Ouverture du Forum économique', 'Auditorium', 'Panel d’ouverture', 'Promouvoir l’économie de la paix : investissement, partenariats et développement durable.', 1),
  ('19-2', '19', '11:00', 'forum', 'Rencontres B2B / B2G', 'Espace matchmaking', null, 'Créneaux qualifiés entre décideurs, investisseurs et institutions.', 2),
  ('19-3', '19', '15:00', 'forum', 'Afrique — Golfe : bâtir des ponts', 'Salle A', 'Table ronde', 'Connecter les territoires par le commerce, l’innovation et la diplomatie.', 3),
  ('20-1', '20', '10:00', 'forum', 'Entrepreneuriat & jeunesse', 'Salle B', 'Panel', 'Soutenir les projets à impact social et l’entrepreneuriat des jeunes.', 1),
  ('20-2', '20', '14:00', 'forum', 'Rendez-vous d’affaires', 'Espace matchmaking', null, 'Deuxième vague de rencontres, circuit protocolaire pour les autorités.', 2),
  ('21-1', '21', '11:00', 'art', 'Vernissage « Voix de la Paix »', 'Galerie', 'Artistes sélectionnés', 'Exposition internationale : l’art comme langage universel de paix.', 1),
  ('21-2', '21', '17:00', 'art', 'Rencontre avec les artistes', 'Galerie', null, 'Échanges autour des œuvres inspirées par la réconciliation et l’espoir.', 2),
  ('22-1', '22', '19:00', 'sport', 'Match de Gala pour la Paix', 'Stade', 'Ambassadeurs & dirigeants', 'Le sport au service du dialogue : une soirée de fraternité et de coopération.', 1),
  ('23-1', '23', '20:00', 'gala', 'Dîner de Gala & Médailles de la Paix', 'Salle de réception', 'Cérémonie de clôture', 'Remise des Médailles de la Paix et reconnaissance des Ambassadeurs.', 1),
  ('24-1', '24', '10:00', 'foire', 'Foire — journée grand public', 'Hall principal', null, 'Stands ouverts, démonstrations d’artisanat et rencontres avec les exposants.', 1),
  ('25-1', '25', '17:00', 'foire', 'Clôture de la Foire', 'Hall principal', 'Mot de clôture', 'Bilan de la semaine et perspectives pour les prochaines éditions.', 1)
on conflict (id) do nothing;
