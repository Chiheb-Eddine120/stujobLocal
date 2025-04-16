import { supabase } from '../lib/supabase';

export interface DemandeRecrutement {
  id?: string;
  entreprise: string;
  secteur: string;
  profil: string;
  urgence: string;
  ville: string;
  email: string;
  telephone: string;
  remarques?: string;
  status: 'en_attente' | 'en_traitement' | 'etudiant_trouve' | 'termine';
  created_at?: string;
}

export const demandeService = {
  async createDemande(demande: Omit<DemandeRecrutement, 'id' | 'status' | 'created_at'>): Promise<DemandeRecrutement> {
    try {
      const { data, error } = await supabase
        .from('demandes')
        .insert([
          {
            ...demande,
            status: 'en_attente',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la création de la demande');
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      throw error;
    }
  },

  async getDemandeByTrackingNumber(trackingNumber: string): Promise<DemandeRecrutement | null> {
    try {
      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .eq('id', trackingNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la récupération de la demande');
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la demande:', error);
      throw error;
    }
  },

  async updateDemandeStatus(trackingNumber: string, status: DemandeRecrutement['status']): Promise<void> {
    try {
      // Vérifier d'abord si l'utilisateur est authentifié
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour mettre à jour le statut');
      }

      const { error } = await supabase
        .from('demandes')
        .update({ status })
        .eq('id', trackingNumber);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  // Nouvelle méthode pour récupérer toutes les demandes (admin seulement)
  async getAllDemandes(): Promise<DemandeRecrutement[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour voir toutes les demandes');
      }

      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la récupération des demandes');
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  }
}; 