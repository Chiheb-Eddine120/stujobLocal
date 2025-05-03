import { supabase } from './supabaseClient';
import { Match, Demande, Etudiant, NiveauCompetence, Profile, Competence } from '../types';
//import { etudiantService } from './etudiantService';

interface EtudiantWithProfile extends Etudiant {
  profile: Profile;
  competences: Competence[];
}

export const matchService = {
  async createMatch(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('matches')
      .insert([match])
      .select()
      .single();

    if (error) throw error;
    return data as Match;
  },

  async updateMatch(id: string, match: Partial<Match>) {
    const { data, error } = await supabase
      .from('matches')
      .update(match)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Match;
  },

  async getMatchesByDemande(demandeId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        etudiants (
          *,
          profiles (
            nom,
            prenom,
            email,
            telephone
          )
        )
      `)
      .eq('demande_id', demandeId);

    if (error) throw error;
    return data;
  },

  async getMatchesByEtudiant(etudiantId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        demandes (*)
      `)
      .eq('etudiant_id', etudiantId);

    if (error) throw error;
    return data;
  },

  async getAllMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        demandes (*),
        etudiants (
          *,
          profiles (
            nom,
            prenom,
            email,
            telephone
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async calculateMatchScore(demande: Demande, etudiant: Etudiant): Promise<number> {
    let score = 0;

    const competencesMatch = demande.competences_requises.filter(reqComp => 
      etudiant.competences?.some(comp => comp.nom === reqComp.nom) || false
    );

    const competencesScore = (competencesMatch.length / demande.competences_requises.length) * 60;
    score += competencesScore;

    const niveauScore = competencesMatch.reduce((acc, reqComp) => {
      const etudiantComp = etudiant.competences?.find(comp => comp.nom === reqComp.nom);
      if (!etudiantComp?.niveau) return acc;

      const niveauValues: Record<NiveauCompetence, number> = {
        'Débutant': 1,
        'Intermédiaire': 2,
        'Avancé': 3,
        'Expert': 4
      };

      return acc + (niveauValues[etudiantComp.niveau] / 4);
    }, 0) * 20;

    score += niveauScore;

    const disponibiliteScore = etudiant.disponibilite ? 20 : 0;
    score += disponibiliteScore;

    return Math.round(score);
  },

  async generateMatchesForDemande(demande: Demande, minScore: number = 60) {
    try {
      if (!demande.id) {
        throw new Error('ID de demande manquant');
      }

      const existingMatches = await this.getMatchesByDemande(demande.id);
      if (existingMatches && existingMatches.length > 0) {
        return existingMatches;
      }
      
      const competencesRequises = demande.competences_requises.map(comp => ({ nom: comp.nom }));
      
      if (!competencesRequises.length) {
        return [];
      }

      const etudiants = await this.searchEtudiants(competencesRequises);

      if (!etudiants.length) {
        return [];
      }

      const matchesPromises = etudiants.map(async (etudiant) => {
        const score = await this.calculateMatchScore(demande, etudiant);
        return { etudiant, score };
      });

      const matchesScores = await Promise.all(matchesPromises);
      const potentialMatches = matchesScores
        .filter(match => match.score >= minScore)
        .sort((a, b) => b.score - a.score);

      if (!potentialMatches.length) {
        return [];
      }

      const createdMatches = await Promise.all(
        potentialMatches.map(async ({ etudiant, score }) => {
          try {
            if (!etudiant.id) {
              throw new Error('ID d\'étudiant manquant');
            }
            const match = await this.createMatch({
              demande_id: demande.id,
              etudiant_id: etudiant.id,
              statut: 'proposé',
              notes_admin: `Score de compatibilité: ${score}%`
            });
            return match;
          } catch (error) {
            console.error('Erreur lors de la création du match pour l\'étudiant:', etudiant.id, error);
            return null;
          }
        })
      );

      const successfulMatches = createdMatches.filter(match => match !== null);

      return successfulMatches;
    } catch (error) {
      console.error('Erreur lors de la génération des matches:', error);
      throw error;
    }
  },

  async searchEtudiants(competencesRequises: { nom: string }[]): Promise<EtudiantWithProfile[]> {
    try {
      const competenceNoms = competencesRequises.map(comp => comp.nom);
      console.log('Recherche d\'étudiants avec les compétences:', competenceNoms);

      const { data: etudiants, error } = await supabase
        .from('etudiants')
        .select(`
          *,
          profile:profiles(*),
          competences:etudiant_competences(
            competence:competences(*)
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      return (etudiants || []) as EtudiantWithProfile[];
    } catch (error) {
      console.error('Erreur lors de la recherche des étudiants:', error);
      return [];
    }
  }
};