-- Fonction pour la mise à jour automatique de updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Table profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'student')) not null default 'student',
  email text unique not null,
  nom text,
  prenom text,
  telephone text null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_profiles_updated_at
    before update on profiles
    for each row
    execute function update_updated_at_column();

alter table profiles enable row level security;

create policy "Les profils sont visibles par les utilisateurs authentifiés"
  on profiles for select
  using (auth.role() = 'authenticated');

create policy "Les utilisateurs peuvent modifier leur propre profil"
  on profiles for update
  using (auth.uid() = id);

create policy "Les utilisateurs peuvent créer leur propre profil"
  on profiles for insert
  with check (auth.uid() = id);

-- Table etudiants
create table etudiants (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references profiles(id) on delete cascade unique not null,
  cv_url text,
  lettre_motivation_url text,
  competences jsonb default '[]'::jsonb,
  experiences jsonb default '[]'::jsonb,
  disponibilite jsonb default '{}'::jsonb,
  niveau_etudes text,
  ecole text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_etudiants_updated_at
    before update on etudiants
    for each row
    execute function update_updated_at_column();

alter table etudiants enable row level security;

create policy "Les étudiants sont visibles par les utilisateurs authentifiés"
  on etudiants for select
  using (auth.role() = 'authenticated');

create policy "Les étudiants peuvent modifier leur propre profil"
  on etudiants for update
  using (auth.uid() = profile_id);

-- Table demandes (modification de la table existante)
alter table demandes 
  add column if not exists description_projet text,
  add column if not exists suggestions_competences jsonb default '[]'::jsonb,
  add column if not exists competences_personnalisees jsonb default '[]'::jsonb,
  drop column if exists priorite,
  add column if not exists duree_mission text,
  add column if not exists date_debut_souhaitee date,
  add column if not exists budget text;

-- Mise à jour des données existantes pour le nouveau format
UPDATE demandes 
SET suggestions_competences = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'competence', competence,
      'priorite', 'Flexible'
    )
  )
  FROM jsonb_array_elements_text(suggestions_competences) AS competence
)
WHERE suggestions_competences IS NOT NULL;

-- Ajout d'une contrainte pour s'assurer que le format est correct
ALTER TABLE demandes 
  ADD CONSTRAINT check_suggestions_competences_format 
  CHECK (
    suggestions_competences IS NULL OR 
    (
      jsonb_typeof(suggestions_competences) = 'array' AND
      NOT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(suggestions_competences) AS comp
        WHERE NOT (
          jsonb_typeof(comp->'competence') = 'string' AND
          jsonb_typeof(comp->'priorite') = 'string' AND
          (comp->>'priorite')::text IN ('Obligatoire', 'Flexible', 'Optionnel')
        )
      )
    )
  );

-- Ajout d'une contrainte pour s'assurer que le format des compétences personnalisées est correct
ALTER TABLE demandes 
  ADD CONSTRAINT check_competences_personnalisees_format 
  CHECK (
    competences_personnalisees IS NULL OR 
    (
      jsonb_typeof(competences_personnalisees) = 'array' AND
      NOT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(competences_personnalisees) AS comp
        WHERE NOT (
          jsonb_typeof(comp->'competence') = 'string' AND
          jsonb_typeof(comp->'priorite') = 'string' AND
          (comp->>'priorite')::text IN ('Obligatoire', 'Flexible', 'Optionnel')
        )
      )
    )
  );

create trigger update_demandes_updated_at
    before update on demandes
    for each row
    execute function update_updated_at_column();

-- Table matches
create table matches (
  id uuid default uuid_generate_v4() primary key,
  demande_id uuid references demandes(id) on delete cascade not null,
  etudiant_id uuid references all_students(id) on delete cascade not null,
  statut text check (statut in ('proposé', 'accepté', 'refusé')) not null default 'proposé',
  notes_admin text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_matches_updated_at
    before update on matches
    for each row
    execute function update_updated_at_column();

alter table matches enable row level security;

create policy "Les matches sont visibles par les utilisateurs authentifiés"
  on matches for select
  using (auth.role() = 'authenticated');

create policy "Seuls les admins peuvent créer/modifier les matches"
  on matches for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Ajout des politiques de sécurité pour la table demandes
alter table demandes enable row level security;

create policy "Les demandes sont visibles par tous"
  on demandes for select
  using (true);

create policy "Les admins peuvent gérer toutes les demandes"
  on demandes for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Les utilisateurs non authentifiés peuvent créer des demandes"
  on demandes for insert
  with check (true);

-- Table demandes_entreprises
create table demandes_entreprises (
  id uuid default uuid_generate_v4() primary key,
  numero_demande text unique not null,
  email text not null,
  telephone text not null,
  nom_entreprise text not null,
  prenom_contact text not null,
  nom_contact text not null,
  sexe_prefere text check (sexe_prefere in ('homme', 'femme', 'pas de préférence')),
  age_minimum integer,
  competences_requises jsonb default '[]'::jsonb,
  langues_requises jsonb default '[]'::jsonb,
  region text,
  type_etude text,
  description_projet text,
  duree_mission text,
  date_debut_souhaitee date,
  budget text,
  statut text check (statut in ('nouvelle', 'en cours', 'terminée', 'annulée')) not null default 'nouvelle',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_demandes_entreprises_updated_at
    before update on demandes_entreprises
    for each row
    execute function update_updated_at_column();

-- Fonction pour générer automatiquement le numéro de demande
create or replace function generate_numero_demande()
returns trigger as $$
begin
    new.numero_demande := 'DEM-' || to_char(current_date, 'YYYYMMDD') || '-' || 
                         lpad(cast(floor(random() * 1000) as text), 3, '0');
    return new;
end;
$$ language plpgsql;

create trigger generate_numero_demande_trigger
    before insert on demandes_entreprises
    for each row
    execute function generate_numero_demande();

-- Politiques de sécurité pour demandes_entreprises
alter table demandes_entreprises enable row level security;

create policy "Les demandes d'entreprises sont visibles par les admins"
    on demandes_entreprises for select
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

create policy "Les admins peuvent gérer toutes les demandes d'entreprises"
    on demandes_entreprises for all
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

-- Table tickets pour le support
create table tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete set null,
  email text not null,
  message text not null,
  statut text default 'ouvert' check (statut in ('ouvert', 'en_cours', 'resolu')),
  priorite text default 'normale' check (priorite in ('basse', 'normale', 'haute', 'critique')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_tickets_updated_at
    before update on tickets
    for each row
    execute function update_updated_at_column();

alter table tickets enable row level security;

create policy "Les admins peuvent voir tous les tickets"
  on tickets for select
  using (auth.role() = 'authenticated');

create policy "Un utilisateur peut créer un ticket"
  on tickets for insert
  with check (true);

create policy "Un admin peut modifier le statut d'un ticket"
  on tickets for update
  using (auth.role() = 'authenticated'); 