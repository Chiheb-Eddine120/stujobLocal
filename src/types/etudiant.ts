export interface Profile {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
}

export interface DocumentFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface CVFile {
  cv?: DocumentFile;
  lettre_motivation?: DocumentFile;
}

export interface Competence {
  nom: string;
  priorite: 'Essentiel' | 'Important' | 'Optionnel';
  niveau?: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  description?: string;
  label?: string;
}

export interface Experience {
  titre: string;
  entreprise: string;
  date_debut: string;
  date_fin?: string;
  description?: string;
}

export interface Disponibilite {
  jour: string;
  debut: string;
  fin: string;
  recurrence?: string;
}

export interface Langue {
  nom: string;
  niveau: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface Etudiant {
  id?: string;
  profile_id: string;
  cv_file?: CVFile;
  competences?: Competence[];
  competence_description?: { [key: string]: string };
  experiences?: Experience[];
  disponibilite?: {
    disponibilites: Disponibilite[];
  };
  langues?: Langue[];
  biographie?: string;
  niveau_etudes?: string;
  ecole?: string;
  created_at?: string;
  updated_at?: string;
  date_naissance?: string;
} 