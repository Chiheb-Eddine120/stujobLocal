export type NiveauPriorite = 'Essentiel' | 'Important' | 'Optionnel';
export type NiveauFlexibilite = 'Faible' | 'Moyen' | 'Élevé';
export type TypeMission = 'Stage' | 'Ponctuel' | 'Freelance' | 'Temps partiel' | 'Saisonnier';
export type NiveauCompetence = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';

export interface Competence {
  nom: string;
  priorite: NiveauPriorite;
  niveau?: NiveauCompetence;
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

export interface Experience {
  titre: string;
  entreprise: string;
  periode: string;
  description: string;
  competences: string[];
}

export interface Profile {
  id: string;
  role: 'admin' | 'student' | 'entreprise';
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  created_at: string;
  updated_at: string;
}

export interface Etudiant {
  id: string;
  profile_id: string;
  cv_url: string | null;
  lettre_motivation_url: string | null;
  competences_techniques: string[];
  competences_soft: string[];
  experiences: Experience[];
  disponibilite: boolean;
  niveau_etudes: string;
  ecole: string;
  created_at: string;
  updated_at: string;
}

export interface Demande {
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
  competences_requises: Competence[];
  niveau_priorite: NiveauPriorite;
  duree_mission: string;
  date_debut_souhaitee: string;
  budget: string;
  created_at: string;
}

export interface Match {
  id: string;
  demande_id: string;
  etudiant_id: string;
  statut: 'proposé' | 'accepté' | 'refusé';
  notes_admin: string | null;
  created_at: string;
  updated_at: string;
} 