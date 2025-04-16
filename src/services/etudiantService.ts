import { supabase } from './supabaseClient';
import { Etudiant, Experience, NiveauCompetence } from '../types';

export const etudiantService = {
  async getEtudiant(profileId: string) {
    const { data, error } = await supabase
      .from('etudiants')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (error) throw error;
    return data as Etudiant;
  },

  async updateEtudiant(profileId: string, etudiant: Partial<Etudiant>) {
    const { data, error } = await supabase
      .from('etudiants')
      .update(etudiant)
      .eq('profile_id', profileId)
      .select()
      .single();

    if (error) throw error;
    return data as Etudiant;
  },

  async createEtudiant(etudiant: Etudiant) {
    const { data, error } = await supabase
      .from('etudiants')
      .insert([etudiant])
      .select()
      .single();

    if (error) throw error;
    return data as Etudiant;
  },

  async getAllEtudiants() {
    const { data, error } = await supabase
      .from('etudiants')
      .select(`
        *,
        profiles (
          nom,
          prenom,
          email,
          telephone
        )
      `);

    if (error) throw error;
    return data as (Etudiant & { profiles: { nom: string; prenom: string; email: string; telephone: string } })[];
  },

  async addExperience(etudiantId: string, experience: Experience): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour ajouter une expérience');
      }

      const { error } = await supabase
        .from('experiences')
        .insert([{ ...experience, etudiant_id: etudiantId }]);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de l\'ajout de l\'expérience');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'expérience:', error);
      throw error;
    }
  },

  async updateCompetence(etudiantId: string, competence: { nom: string; niveau: NiveauCompetence }): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour mettre à jour vos compétences');
      }

      const { error } = await supabase
        .from('competences')
        .upsert([{ ...competence, etudiant_id: etudiantId }]);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la mise à jour de la compétence');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la compétence:', error);
      throw error;
    }
  },

  async searchEtudiants(criteres: {
    competences?: string[];
    niveauMin?: NiveauCompetence;
    disponibilites?: string[];
  }): Promise<Etudiant[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour rechercher des étudiants');
      }

      let query = supabase
        .from('etudiants')
        .select('*');

      if (criteres.competences?.length) {
        query = query.contains('competences', criteres.competences);
      }

      if (criteres.disponibilites?.length) {
        query = query.overlaps('disponibilites', criteres.disponibilites);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la recherche d\'étudiants');
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'étudiants:', error);
      throw error;
    }
  }
}; 