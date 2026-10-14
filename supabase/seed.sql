-- ============================================================
--  Peace Days Dubaï 2027 — Données de démonstration (seed)
--
--  À exécuter APRÈS schema.sql et 02_comptes.sql, dans Supabase → SQL Editor.
--  Réexécutable : `on conflict do nothing` évite les doublons.
--  Aucun compte admin de démonstration n'est créé : activez `profiles.is_admin`
--  uniquement pour un compte Auth réel et autorisé.
--  (Les apostrophes du texte sont typographiques « ’ » : aucun
--   échappement de quote SQL n'est nécessaire.)
-- ============================================================

insert into public.engagements (id, auteur, pays, email, message, theme, statut, soumis_le) values
  ('VP-2048', 'Aïssatou Diallo', 'Sénégal', 'aissatou.d@example.com', 'La paix commence par l’écoute de celui qui ne pense pas comme nous.', 'Éducation & sensibilisation', 'en_attente', '2026-09-26T14:12:00+04:00'),
  ('VP-2047', 'Karim Benali', 'Maroc', 'k.benali@example.com', 'Cultiver le dialogue, c’est semer demain.', 'Culture & arts pour la paix', 'en_attente', '2026-09-26T11:40:00+04:00'),
  ('VP-2046', 'Chiara Romano', 'Italie', 'chiara.r@example.com', 'Le sport rassemble là où les mots divisent.', 'Sport pour la paix', 'publie', '2026-09-25T19:05:00+04:00'),
  ('VP-2045', 'Fatou Camara', 'Côte d’Ivoire', 'fatou.c@example.com', 'Les femmes bâtissent des ponts que les frontières ignorent.', 'Jeunesse & femmes', 'publie', '2026-09-25T09:22:00+04:00'),
  ('VP-2044', 'Omar Al Mansoori', 'Émirats arabes unis', 'o.mansoori@example.com', 'Dubaï accueille le monde : faisons-en la maison de la paix.', 'Culture & arts pour la paix', 'publie', '2026-09-24T16:48:00+04:00'),
  ('VP-2043', 'Jean-Marc Rivière', 'France', 'jm.riviere@example.com', 'Éduquer un enfant à la paix, c’est désarmer un futur conflit.', 'Éducation & sensibilisation', 'en_attente', '2026-09-24T08:30:00+04:00'),
  ('VP-2042', 'Amina Okafor', 'Nigéria', 'a.okafor@example.com', 'Planter un arbre pour chaque désaccord résolu.', 'Développement durable', 'refuse', '2026-09-23T13:15:00+04:00'),
  ('VP-2041', 'Youssef Haddad', 'Tunisie', 'y.haddad@example.com', 'La solidarité n’a pas de nationalité.', 'Action humanitaire', 'publie', '2026-09-23T10:02:00+04:00'),
  ('VP-2040', 'Sofía Herrera', 'Espagne', 's.herrera@example.com', 'L’art dit ce que la diplomatie n’ose pas.', 'Culture & arts pour la paix', 'en_attente', '2026-09-22T18:44:00+04:00'),
  ('VP-2039', 'David Cohen', 'USA', 'd.cohen@example.com', 'Nous héritons de la Terre, nous l’empruntons à la paix.', 'Développement durable', 'publie', '2026-09-22T12:11:00+04:00'),
  ('VP-2038', 'Mariam Traoré', 'Mali', 'm.traore@example.com', 'La jeunesse est le premier ambassadeur de la paix.', 'Jeunesse & femmes', 'en_attente', '2026-09-21T15:30:00+04:00'),
  ('VP-2037', 'Lucas Almeida', 'Brésil', 'l.almeida@example.com', 'Un ballon franchit les murs mieux qu’un discours.', 'Sport pour la paix', 'publie', '2026-09-21T09:58:00+04:00')
on conflict do nothing;
insert into public.candidatures (id, structure, contact, email, pays, categorie, stand, statut, soumis_le) values
  ('EXP-318', 'Atelier Sahel Textile', 'Bineta Sow', 'contact@sahel-textile.sn', 'Sénégal', 'Textile & mode', 'Stand M', 'soumis', '2026-09-26T10:20:00+04:00'),
  ('EXP-317', 'Maison du Cèdre', 'Rami Khoury', 'hello@maisonducedre.com', 'Liban', 'Gastronomie', 'Stand L', 'en_revue', '2026-09-25T14:05:00+04:00'),
  ('EXP-316', 'Argan & Co', 'Latifa Bennani', 'pro@arganandco.ma', 'Maroc', 'Cosmétique naturelle', 'Stand S', 'accepte', '2026-09-24T09:47:00+04:00'),
  ('EXP-315', 'Terres d’Ivoire', 'Koffi N’Guessan', 'terres@ivoire.ci', 'Côte d’Ivoire', 'Produits locaux', 'Stand M', 'soumis', '2026-09-24T08:12:00+04:00'),
  ('EXP-314', 'Verre & Lumière', 'Elena Bianchi', 'studio@verrelumiere.it', 'Italie', 'Art & décoration', 'Stand L', 'accepte', '2026-09-23T17:33:00+04:00'),
  ('EXP-313', 'Désert d’Or Bijoux', 'Noura Al Suwaidi', 'contact@desertdor.ae', 'Émirats arabes unis', 'Bijouterie', 'Stand M', 'en_revue', '2026-09-23T11:00:00+04:00'),
  ('EXP-312', 'Bamako Créations', 'Salif Diarra', 'salif@bamakocreations.ml', 'Mali', 'Artisanat', 'Stand S', 'refuse', '2026-09-22T13:26:00+04:00'),
  ('EXP-311', 'Provence Naturelle', 'Camille Faure', 'pro@provence-naturelle.fr', 'France', 'Cosmétique naturelle', 'Stand S', 'soumis', '2026-09-22T10:15:00+04:00'),
  ('EXP-310', 'Nile Heritage', 'Yara Fahmy', 'info@nileheritage.eg', 'Égypte', 'Art & décoration', 'Stand M', 'brouillon', '2026-09-21T19:40:00+04:00'),
  ('EXP-309', 'Kano Leather Guild', 'Ibrahim Musa', 'guild@kanoleather.ng', 'Nigéria', 'Artisanat', 'Stand L', 'accepte', '2026-09-21T09:05:00+04:00'),
  ('EXP-308', 'Andalus Spices', 'Marta Ruiz', 'ventas@andalusspices.es', 'Espagne', 'Gastronomie', 'Stand S', 'en_revue', '2026-09-20T15:52:00+04:00')
on conflict do nothing;

insert into public.reservations (id, nom, organisation, formule, couverts, montant, statut, soumis_le) values
  ('GALA-092', 'S.E. Ahmed Al Nahyan', 'Corps diplomatique', 'Table Diplomatique', 12, 84000, 'confirme', '2026-09-25T12:00:00+04:00'),
  ('GALA-091', 'Groupe Meridian', 'Meridian Investments', 'Table Prestige', 10, 60000, 'confirme', '2026-09-24T16:30:00+04:00'),
  ('GALA-090', 'Fondation Lumière', 'Fondation Lumière', 'Table Standard', 10, 40000, 'demande', '2026-09-24T09:10:00+04:00'),
  ('GALA-089', 'Claire Dubois', 'Invitée fondatrice', 'Place individuelle', 1, 4500, 'confirme', '2026-09-23T18:20:00+04:00'),
  ('GALA-088', 'Chambre de commerce Afrique-Golfe', 'CCAG', 'Table Prestige', 10, 60000, 'liste_attente', '2026-09-23T11:45:00+04:00'),
  ('GALA-087', 'Studio Yassine Arts', 'Yassine Arts Center', 'Table Standard', 10, 40000, 'demande', '2026-09-22T14:05:00+04:00'),
  ('GALA-086', 'Al Futtaim Family Office', 'Al Futtaim', 'Table Diplomatique', 12, 84000, 'confirme', '2026-09-21T10:30:00+04:00'),
  ('GALA-085', 'Marco Rossi', 'Rossi & Partners', 'Place individuelle', 2, 9000, 'annule', '2026-09-20T17:15:00+04:00')
on conflict do nothing;
insert into public.partenaires (id, organisation, type, contact, email, pays, statut, soumis_le) values
  ('PRT-054', 'Emirates Airlines', 'Sponsor', 'Hessa Al Marri', 'partners@emirates.example', 'Émirats arabes unis', 'en_discussion', '2026-09-25T13:20:00+04:00'),
  ('PRT-053', 'Ministère de la Culture', 'Institution', 'Direction des affaires internationales', 'international@culture.example', 'Maroc', 'engage', '2026-09-24T10:40:00+04:00'),
  ('PRT-052', 'Al Jazeera', 'Média', 'Desk partenariats', 'media@aljazeera.example', 'Qatar', 'nouveau', '2026-09-24T08:55:00+04:00'),
  ('PRT-051', 'Ambassade de France', 'Ambassade', 'Service culturel', 'culture@ambafrance.example', 'France', 'engage', '2026-09-23T15:10:00+04:00'),
  ('PRT-050', 'Fondation pour la Paix', 'Fondation', 'Awa Ndiaye', 'contact@fondationpaix.example', 'Sénégal', 'en_discussion', '2026-09-22T11:30:00+04:00'),
  ('PRT-049', 'Dubai Chamber', 'Institution', 'Partnerships office', 'partners@dubaichamber.example', 'Émirats arabes unis', 'nouveau', '2026-09-21T09:25:00+04:00'),
  ('PRT-048', 'RAI Cultura', 'Média', 'Redazione esteri', 'esteri@rai.example', 'Italie', 'decline', '2026-09-20T14:00:00+04:00')
on conflict do nothing;

insert into public.abonnes (id, email, langue, source, inscrit_le) values
  ('NL-1287', 'amina.k@example.com', 'FR', 'Accueil', '2026-09-26T15:02:00+04:00'),
  ('NL-1286', 'peace.watcher@example.com', 'EN', 'Programme', '2026-09-26T09:41:00+04:00'),
  ('NL-1285', 'sara.h@example.com', 'AR', 'Voix de la Paix', '2026-09-25T20:18:00+04:00'),
  ('NL-1284', 'thomas.b@example.com', 'FR', 'Événements', '2026-09-25T11:07:00+04:00'),
  ('NL-1283', 'global.news@example.com', 'EN', 'Accueil', '2026-09-24T18:33:00+04:00'),
  ('NL-1282', 'leila.m@example.com', 'FR', 'Foire', '2026-09-24T08:59:00+04:00')
on conflict do nothing;
