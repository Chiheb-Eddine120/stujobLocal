import { supabase } from './supabaseClient';
import { Demande } from '../types';

const generateUniqueCode = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DEM-${year}${month}${day}-${random}`;
};

export const demandeService = {
  async getDemande(id: string) {
    const { data, error } = await supabase
      .from('demandes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Demande;
  },

  async createDemande(demande: Omit<Demande, 'id' | 'created_at'>) {
    const demandeWithCode = {
      ...demande,
      code_demande: generateUniqueCode()
    };

    const { data, error } = await supabase
      .from('demandes')
      .insert([demandeWithCode])
      .select()
      .single();

    if (error) throw error;
    return data as Demande;
  },

  async updateDemande(id: string, demande: Partial<Demande>) {
    const { data, error } = await supabase
      .from('demandes')
      .update(demande)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Demande;
  },

  async getAllDemandes() {
    const { data, error } = await supabase
      .from('demandes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Demande[];
  },

  async getDemandeByTrackingNumber(code: string): Promise<Demande | null> {
    try {
      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .eq('code_demande', code)
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

  async updateDemandeStatus(id: string, status: Demande['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('demandes')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  async getDemandesEnAttente(): Promise<Demande[]> {
    try {
      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .eq('status', 'en_attente')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la récupération des demandes en attente');
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes en attente:', error);
      throw error;
    }
  },
}; 