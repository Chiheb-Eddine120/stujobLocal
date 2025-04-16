export type NiveauPriorite = 'Essentiel' | 'Important' | 'Optionnel';
export type NiveauFlexibilite = 'Faible' | 'Moyen' | 'Élevé';
export type TypeMission = 'Stage' | 'Ponctuel' | 'Freelance' | 'Temps partiel' | 'Saisonnier';

export interface Competence {
  nom: string;
  priorite: NiveauPriorite;
}

export interface DemandeRecrutement {
  id?: string;
  entreprise: string;
  secteur: string;
  competences: Competence[];
  flexibilite: NiveauFlexibilite;
  description: string;
  typeMission: TypeMission;
  duree: string;
  dateDebut: string;
  ville: string;
  email: string;
  telephone: string;
  remarques?: string;
  status: 'en_attente' | 'en_traitement' | 'etudiant_trouve' | 'termine';
  created_at?: string;
}

export type NiveauCompetence = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';

export interface Experience {
  titre: string;
  entreprise: string;
  periode: string;
  description: string;
  competences: string[];
}

export type Profile = {
  id: string;
  role: 'admin' | 'student';
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  created_at: string;
  updated_at: string;
};

export type Etudiant = {
  id: string;
  profile_id: string;
  cv_url: string | null;
  lettre_motivation_url: string | null;
  competences_techniques: string[];
  competences_soft: string[];
  experiences: Array<{
    titre: string;
    entreprise: string;
    description: string;
    date_debut: string;
    date_fin: string;
  }>;
  disponibilite: string;
  niveau_etudes: string;
  ecole: string;
  created_at: string;
  updated_at: string;
};

export type Demande = {
  id: string;
  entreprise: string;
  secteur: string;
  profil: string;
  urgence: string;
  ville: string;
  email: string;
  telephone: string;
  remarques: string;
  status: string;
  description_projet: string;
  competences_requises: string[];
  niveau_priorite: string;
  duree_mission: string;
  date_debut_souhaitee: string;
  budget: string;
  created_at: string;
};

export type Match = {
  id: string;
  demande_id: string;
  etudiant_id: string;
  statut: 'proposé' | 'accepté' | 'refusé';
  notes_admin: string | null;
  created_at: string;
  updated_at: string;
}; 