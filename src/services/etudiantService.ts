import { supabase } from './supabaseClient';
import { NiveauCompetence } from '../types';
import { Etudiant, Experience } from '../types/etudiant';

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
  async getEtudiant(profileId: string): Promise<Etudiant | null> {
    const { data, error } = await supabase
      .from('etudiants')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun étudiant trouvé pour ce profil
        return null;
      }
      console.error('Erreur lors de la récupération de l\'étudiant:', error);
      throw new Error('Impossible de récupérer les informations de l\'étudiant');
    }

    return data as Etudiant;
  },

  async saveEtudiant(etudiantData: Partial<Etudiant>): Promise<Etudiant> {
    const { data, error } = await supabase
      .from('etudiants')
      .upsert(etudiantData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la sauvegarde de l\'étudiant:', error);
      throw new Error('Impossible de sauvegarder les informations de l\'étudiant');
    }

    return data as Etudiant;
  },

  async updateEtudiant(etudiantId: string, etudiantData: Partial<Etudiant>): Promise<Etudiant> {
    const { data, error } = await supabase
      .from('etudiants')
      .update(etudiantData)
      .eq('id', etudiantId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'étudiant:', error);
      throw new Error('Impossible de mettre à jour les informations de l\'étudiant');
    }

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
    try {
      // Vérifier l'authentification
      const { data: { session } } = await supabase.auth.getSession();
      
      // D'abord, comptons les étudiants
      const { count, error: countError } = await supabase
        .from('etudiants')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        throw countError;
      }

      // Ensuite, récupérons les données
      const { data, error } = await supabase
        .from('etudiants')
        .select(`
          *,
          profile:profiles (
            id,
            nom,
            prenom,
            email,
            telephone
          )
        `);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
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
        throw new Error('Erreur lors de l\'ajout de l\'expérience');
      }
    } catch (error) {
      throw error;
    }
  },

  async updateCompetence(etudiantId: string, competence: { 
    nom: string; 
    niveau: NiveauCompetence;
    description?: string;
  }): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour mettre à jour vos compétences');
      }

      const { error } = await supabase
        .from('competences')
        .upsert([{ ...competence, etudiant_id: etudiantId }]);

      if (error) {
        throw new Error('Erreur lors de la mise à jour de la compétence');
      }
    } catch (error) {
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

      // Recherche dans les compétences techniques
      if (criteres.competences?.length) {
        // Nettoyer et valider les compétences
        const validCompetences = criteres.competences
          .filter(comp => comp && typeof comp === 'string' && comp.trim().length > 0)
          .map(comp => comp.trim());

        if (validCompetences.length > 0) {
          const filters = validCompetences.flatMap(comp => {
            const jsonValue = JSON.stringify([comp]); // Crée ["React"] par exemple
            return [
              `competences.cs.${jsonValue}`
            ];
          });

          const orClause = filters.join(',');
          query = query.or(orClause);
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
        throw new Error('Erreur lors de la recherche d\'étudiants');
      }

      // Post-traitement pour le niveau minimum si nécessaire
      let filteredData = data || [];
      if (criteres.niveauMin && filteredData.length > 0) {
        const niveauMinValue = niveauOrdre[criteres.niveauMin as NiveauCompetence];
        filteredData = filteredData.filter(etudiant => {
          // Vérifier le niveau pour chaque compétence demandée
          return criteres.competences?.every(comp => {
            const compTech = etudiant.competences.find((c: CompetenceWithLevel) => c.nom === comp);
            if (compTech?.niveau && niveauOrdre[compTech.niveau as NiveauCompetence] >= niveauMinValue) return true;
            return false;
          }) ?? true;
        });
      }

      return filteredData;
    } catch (error) {
      throw error;
    }
  }
}; 