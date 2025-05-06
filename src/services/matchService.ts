import { supabase } from './supabaseClient';
import { Match, Demande, Etudiant, Profile, Competence } from '../types';
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
    // On prend les suggestions_competences comme référence
    const requises = demande.suggestions_competences || [];
    if (!etudiant.competences || etudiant.competences.length === 0 || requises.length === 0) {
      return 0;
    }
    for (const requise of requises) {
      const match = etudiant.competences.some(comp => {
        if (!comp) return false;
        if (typeof comp === 'string') {
          return (comp as string).trim().toLowerCase() === (requise as string).trim().toLowerCase();
        }
        if (typeof comp === 'object' && comp.label) {
          return (comp.label as string).trim().toLowerCase() === (requise as string).trim().toLowerCase();
        }
        return false;
      });
      if (match) score += 1;
    }
    return Math.round((score / requises.length) * 100);
  },

  async generateMatchesForDemande(demande: Demande, minScore: number = 60) {
    try {
      if (!demande.id) {
        throw new Error('ID de demande manquant');
      }

      if (!demande.suggestions_competences || demande.suggestions_competences.length === 0) {
        throw new Error('Aucune compétence suggérée définie pour cette demande');
      }

      const existingMatches = await this.getMatchesByDemande(demande.id);
      if (existingMatches && existingMatches.length > 0) {
        return existingMatches;
      }
      
      const competencesRequises = demande.suggestions_competences.map(nom => ({ nom }));
      
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

      const { data: etudiants, error } = await supabase
        .from('etudiants')
        .select(`
          *,
          profile:profiles(*)
        `);

      if (error) throw error;

      // Filtrer les étudiants qui ont les compétences requises
      const etudiantsFiltres = etudiants?.filter(etudiant => {
        const competencesEtudiant = etudiant.competences || [];
        return competenceNoms.some(nom => 
          competencesEtudiant.some((comp: Competence) => comp.nom === nom)
        );
      }) || [];

      return etudiantsFiltres as EtudiantWithProfile[];
    } catch (error) {
      console.error('Erreur lors de la recherche des étudiants:', error);
      return [];
    }
  }
};