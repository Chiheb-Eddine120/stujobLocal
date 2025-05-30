-- Supprimer la contrainte de clé étrangère existante
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_etudiant_id_fkey;

-- Ajouter la nouvelle contrainte de clé étrangère
ALTER TABLE matches 
  ADD CONSTRAINT matches_etudiant_id_fkey 
  FOREIGN KEY (etudiant_id) 
  REFERENCES all_students(id) 
  ON DELETE CASCADE; 