import { supabase } from './supabaseClient';
import { Match, DemandeRecrutement, Etudiant, NiveauCompetence } from '../types';

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

  async calculateMatchScore(demande: DemandeRecrutement, etudiant: Etudiant): Promise<number> {
    let score = 0;

    // Vérification des compétences requises
    const competencesMatch = demande.competences.filter(reqComp => 
      etudiant.competences_techniques.includes(reqComp.nom)
    );

    // Score basé sur les compétences (60% du score total)
    const competencesScore = (competencesMatch.length / demande.competences.length) * 60;
    score += competencesScore;

    // Score basé sur le niveau des compétences (20% du score total)
    const niveauScore = competencesMatch.reduce((acc, reqComp) => {
      const niveauValues: Record<NiveauCompetence, number> = {
        'Débutant': 1,
        'Intermédiaire': 2,
        'Avancé': 3,
        'Expert': 4
      };

      return acc + (niveauValues[reqComp.priorite as NiveauCompetence] / 4);
    }, 0) * 20;

    score += niveauScore;

    // Score basé sur la disponibilité (20% du score total)
    const disponibiliteScore = etudiant.disponibilite ? 20 : 0;
    score += disponibiliteScore;

    return Math.round(score);
  }
}; 