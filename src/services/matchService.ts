import { supabase } from './supabaseClient';
import { Match, Demande, Etudiant, NiveauCompetence } from '../types';
import { etudiantService } from './etudiantService';

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

    // Vérification des compétences requises
    const competencesMatch = demande.competences_requises.filter(reqComp => 
      etudiant.competences_techniques.includes(reqComp.nom)
    );

    // Score basé sur les compétences (60% du score total)
    const competencesScore = (competencesMatch.length / demande.competences_requises.length) * 60;
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
  },

  async generateMatchesForDemande(demande: Demande, minScore: number = 60) {
    try {
      console.log('Début de la génération des matches pour la demande:', demande.id);
      
      // Vérifier si la demande a déjà des matches
      const existingMatches = await this.getMatchesByDemande(demande.id);
      if (existingMatches && existingMatches.length > 0) {
        console.log('Des matches existent déjà pour cette demande');
        return existingMatches;
      }
      
      // 1. Rechercher les étudiants ayant les compétences requises
      const competencesRequises = demande.competences_requises.map(comp => comp.nom);
      
      if (!competencesRequises.length) {
        console.log('Aucune compétence requise spécifiée dans la demande');
        return [];
      }

      console.log('Recherche d\'étudiants avec les compétences:', competencesRequises);
      const etudiants = await etudiantService.searchEtudiants({
        competences: competencesRequises
      });

      console.log('Nombre d\'étudiants trouvés avec les compétences requises:', etudiants.length);

      if (!etudiants.length) {
        console.log('Aucun étudiant trouvé avec les compétences requises');
        return [];
      }

      // 2. Calculer les scores et filtrer les meilleurs matches
      const matchesPromises = etudiants.map(async (etudiant) => {
        const score = await this.calculateMatchScore(demande, etudiant);
        return { etudiant, score };
      });

      const matchesScores = await Promise.all(matchesPromises);
      const potentialMatches = matchesScores
        .filter(match => match.score >= minScore)
        .sort((a, b) => b.score - a.score);

      console.log('Nombre de matches potentiels avec score ≥', minScore, ':', potentialMatches.length);

      if (!potentialMatches.length) {
        console.log('Aucun match ne dépasse le score minimum requis');
        return [];
      }

      // 3. Créer les matches dans la base de données
      const createdMatches = await Promise.all(
        potentialMatches.map(async ({ etudiant, score }) => {
          try {
            const match = await this.createMatch({
              demande_id: demande.id!,
              etudiant_id: etudiant.id,
              statut: 'proposé',
              notes_admin: `Score de compatibilité: ${score}%`
            });
            console.log('Match créé avec succès pour l\'étudiant:', etudiant.id, 'avec un score de:', score);
            return match;
          } catch (error) {
            console.error('Erreur lors de la création du match pour l\'étudiant:', etudiant.id, error);
            return null;
          }
        })
      );

      const successfulMatches = createdMatches.filter(match => match !== null);
      console.log('Nombre de matches créés avec succès:', successfulMatches.length);

      return successfulMatches;
    } catch (error) {
      console.error('Erreur lors de la génération des matches:', error);
      throw error;
    }
  }
}; 