import { supabase } from './supabaseClient';
import { Demande } from '../types';

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
    const { data, error } = await supabase
      .from('demandes')
      .insert([{
        ...demande,
        facturation_status: 'en_attente',
        facturation_montant: 0
      }])
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

  async getDemandeByTrackingNumber(id: string): Promise<Demande | null> {
    try {
      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .eq('id', id)
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour mettre à jour le statut');
      }

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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour voir les demandes en attente');
      }

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

  async updateFacturationStatus(id: string, status: Demande['facturation_status'], montant?: number): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour mettre à jour le statut de facturation');
      }

      const updateData: Partial<Demande> = {
        facturation_status: status
      };

      if (montant !== undefined) {
        updateData.facturation_montant = montant;
      }

      const { error } = await supabase
        .from('demandes')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de la mise à jour du statut de facturation');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de facturation:', error);
      throw error;
    }
  }
}; 