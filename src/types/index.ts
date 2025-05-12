export type NiveauPriorite = 'Essentiel' | 'Important' | 'Optionnel';
export type NiveauFlexibilite = 'Faible' | 'Moyen' | 'Élevé';
export type TypeMission = 'Stage' | 'Ponctuel' | 'Freelance' | 'Temps partiel' | 'Saisonnier';
export type NiveauCompetence = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
export type NiveauUrgence = 'Normal' | 'Urgent' | 'Très urgent';
export type Secteur = 'Restauration' | 'Vente' | 'Logistique' | 'IT' | 'Autre';
export type UserRole = 'admin' | 'student' | 'entreprise';

export interface Competence {
  nom: string;
  priorite: NiveauPriorite;
  niveau?: NiveauCompetence;
  description?: string;
  label?: string;
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
  date_debut: string;
  date_fin?: string;
  description?: string;
}

export interface Profile {
  id: string;
  role: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  created_at: string;
  updated_at: string;
}

export interface Disponibilite {
  jour: string;
  debut: string;
  fin: string;
}

export interface Etudiant {
  id?: string;
  profile_id: string;
  cv_file?: {
    cv?: {
      url: string;
      name: string;
      size: number;
      type: string;
    };
    lettre_motivation?: {
      url: string;
      name: string;
      size: number;
      type: string;
    };
  };
  competences?: Competence[];
  competence_description?: { [key: string]: string };
  experiences?: Experience[];
  disponibilite?: {
    disponibilites: Disponibilite[];
  };
  langues?: { nom: string; niveau: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' }[];
  biographie?: string;
  niveau_etudes?: string;
  ecole?: string;
  created_at?: string;
  updated_at?: string;
  profile?: Profile;
  date_naissance?: string;
}

export interface Demande {
  id: string;
  code_demande: string;
  entreprise: string;
  numero_entreprise: string;
  adresse: string;
  secteur: Secteur;
  email: string;
  delai_recrutement: string;
  duree_mission: string;
  nombre_personnes: number;
  remarques: string;
  status: 'en_attente' | 'en_traitement' | 'etudiant_trouve' | 'termine';
  description_demande: string;
  suggestions_competences: Array<{
    competence: string;
    priorite: 'Obligatoire' | 'Flexible' | 'Optionnel';
  }>;
  competences_personnalisees: Array<{
    competence: string;
    priorite: 'Obligatoire' | 'Flexible' | 'Optionnel';
  }>;
  created_at: string;
  telephone?: string;
  ville: string;
  description_projet?: string;
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

export interface City {
  name: string;
  postalCode: string;
  province: string;
} 