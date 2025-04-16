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
  telephone text,
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

-- Table etudiants
create table etudiants (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references profiles(id) on delete cascade unique not null,
  cv_url text,
  lettre_motivation_url text,
  competences_techniques jsonb default '[]'::jsonb,
  competences_soft jsonb default '[]'::jsonb,
  experiences jsonb default '[]'::jsonb,
  disponibilite text,
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
  add column if not exists competences_requises jsonb default '[]'::jsonb,
  add column if not exists niveau_priorite text,
  add column if not exists duree_mission text,
  add column if not exists date_debut_souhaitee date,
  add column if not exists budget text;

create trigger update_demandes_updated_at
    before update on demandes
    for each row
    execute function update_updated_at_column();

-- Table matches
create table matches (
  id uuid default uuid_generate_v4() primary key,
  demande_id uuid references demandes(id) on delete cascade not null,
  etudiant_id uuid references etudiants(id) on delete cascade not null,
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

create policy "Les demandes sont visibles par les utilisateurs authentifiés"
  on demandes for select
  using (auth.role() = 'authenticated');

create policy "Les admins peuvent gérer toutes les demandes"
  on demandes for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  ); 