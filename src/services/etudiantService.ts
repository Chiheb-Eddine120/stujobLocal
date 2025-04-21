import { supabase } from './supabaseClient';
import { Etudiant, Experience, NiveauCompetence } from '../types';

export interface CompetenceWithLevel {
  nom: string;
  niveau: NiveauCompetence;
}

export const niveauOrdre: Record<NiveauCompetence, number> = {
  'Débutant': 1,
  'Intermédiaire': 2,
  'Avancé': 3,
  'Expert': 4
};

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
        .select(`
          *,
          profiles (
            nom,
            prenom,
            email,
            telephone
          )
        `);

      // Recherche dans les compétences techniques et soft
      if (criteres.competences?.length) {
        // Nettoyer et valider les compétences
        const validCompetences = criteres.competences
          .filter(comp => comp && typeof comp === 'string' && comp.trim().length > 0)
          .map(comp => comp.trim());

        if (validCompetences.length > 0) {
          const filters = validCompetences.flatMap(comp => {
            const jsonValue = JSON.stringify([comp]); // Crée ["React"] par exemple
            return [
              `competences_techniques.cs.${jsonValue}`,
              `competences_soft.cs.${jsonValue}`
            ];
          });

          const orClause = filters.join(',');
          query = query.or(orClause);

          console.log('Recherche avec les filtres:', orClause);
        }
      }

      // Filtre de niveau minimum si spécifié
      if (criteres.niveauMin) {
        const niveauMinValue = niveauOrdre[criteres.niveauMin];
        const jsonNiveauValue = JSON.stringify({ niveau: niveauMinValue });
        query = query.gte('niveau_competence', jsonNiveauValue);
      }

      // Filtre de disponibilité
      if (criteres.disponibilites?.length) {
        query = query.eq('disponibilite', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la recherche d\'étudiants');
      }

      // Post-traitement pour le niveau minimum si nécessaire
      let filteredData = data || [];
      if (criteres.niveauMin && filteredData.length > 0) {
        const niveauMinValue = niveauOrdre[criteres.niveauMin as NiveauCompetence];
        filteredData = filteredData.filter(etudiant => {
          // Vérifier le niveau pour chaque compétence demandée
          return criteres.competences?.every(comp => {
            const compTech = etudiant.competences_techniques.find((c: CompetenceWithLevel) => c.nom === comp);
            const compSoft = etudiant.competences_soft.find((c: CompetenceWithLevel) => c.nom === comp);
            if (compTech?.niveau && niveauOrdre[compTech.niveau as NiveauCompetence] >= niveauMinValue) return true;
            if (compSoft?.niveau && niveauOrdre[compSoft.niveau as NiveauCompetence] >= niveauMinValue) return true;
            return false;
          }) ?? true;
        });
      }

      return filteredData;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'étudiants:', error);
      throw error;
    }
  }
}; 