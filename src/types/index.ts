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
  description: string;
  date_debut: string;
  date_fin?: string;
}

export interface Profile {
  id: string;
  role: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  created_at: string;
  updated_at: string;
}

export interface Disponibilite {
  jour: string;
  debut: string;
  fin: string;
}

export interface Etudiant {
  id: string;
  profile_id: string;
  cv_url: string;
  lettre_motivation_url: string;
  competences: Competence[];
  experiences: Experience[];
  disponibilite: { disponibilites: Disponibilite[] };
  niveau_etudes: string;
  ecole: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  biographie?: string;
  langues?: { nom: string; niveau: string }[];
}

export interface Demande {
  id: string;
  entreprise: string;
  secteur: Secteur;
  profil: string;
  urgence: NiveauUrgence;
  ville: string;
  email: string;
  telephone: string;
  remarques: string;
  status: 'en_attente' | 'en_traitement' | 'etudiant_trouve' | 'termine';
  description_projet: string;
  competences_requises: Competence[];
  niveau_priorite: NiveauPriorite;
  duree_mission: string;
  date_debut_souhaitee: string;
  created_at: string;
  facturation_status?: 'en_attente' | 'en_cours' | 'termine';
  facturation_montant?: number;
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