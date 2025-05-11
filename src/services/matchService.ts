import { supabase } from './supabaseClient';
import { Match, Demande, Etudiant, Competence } from '../types';
//import { etudiantService } from './etudiantService';

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
    let totalWeight = 0;
    
    // On prend les suggestions_competences et competences_personnalisees comme référence
    const requises = [...(demande.suggestions_competences || []), ...(demande.competences_personnalisees || [])];
    if (!etudiant.competences || etudiant.competences.length === 0 || requises.length === 0) {
      return 0;
    }

    // Définir les poids selon la priorité
    const poidsPriorite = {
      'Obligatoire': 3,
      'Flexible': 2,
      'Optionnel': 1
    };

    for (const requise of requises) {
      const match = etudiant.competences.some(comp => {
        if (!comp) return false;
        if (typeof comp === 'string') {
          return (comp as string).trim().toLowerCase() === requise.competence.trim().toLowerCase();
        }
        if (typeof comp === 'object' && (comp.label || comp.nom)) {
          // On vérifie label ou nom
          const nomComp = comp.label || comp.nom;
          return (nomComp as string).trim().toLowerCase() === requise.competence.trim().toLowerCase();
        }
        return false;
      });

      if (match) {
        score += poidsPriorite[requise.priorite];
      }
      totalWeight += poidsPriorite[requise.priorite];
    }

    return Math.round((score / totalWeight) * 100);
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

      const etudiants = await this.searchEtudiants(demande.suggestions_competences);

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

      // Créer les matches dans la base de données
      const matchesToCreate = potentialMatches.map(match => ({
        demande_id: demande.id,
        etudiant_id: match.etudiant.id,
        statut: 'proposé',
        score: match.score
      }));

      const { data: createdMatches, error } = await supabase
        .from('matches')
        .insert(matchesToCreate)
        .select();

      if (error) throw error;

      return createdMatches || [];
    } catch (error) {
      console.error('Erreur lors de la génération des matches:', error);
      throw error;
    }
  },

  async searchEtudiants(competencesRequises: Array<{ competence: string; priorite: 'Obligatoire' | 'Flexible' | 'Optionnel' }>) {
    try {
      // Filtrer les étudiants en fonction des compétences requises
      const { data: etudiants, error } = await supabase
        .from('etudiants')
        .select('*, profile:profiles(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filtrer les étudiants qui ont au moins une des compétences requises
      const filteredEtudiants = etudiants?.filter(etudiant => {
        if (!etudiant.competences || !etudiant.competences.length) return false;
        
        return competencesRequises.some(requise => 
          etudiant.competences.some((comp: string | Competence) => {
            if (!comp) return false;
            const compName = typeof comp === 'string' ? comp : (comp.label || comp.nom);
            return compName?.toLowerCase() === requise.competence.toLowerCase();
          })
        );
      });

      return filteredEtudiants || [];
    } catch (error) {
      console.error('Erreur lors de la recherche des étudiants:', error);
      return [];
    }
  }
};