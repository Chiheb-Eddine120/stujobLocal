import { supabase } from './supabaseClient';
import { Profile } from '../types';

export const profileService = {
  async getProfile(userId: string): Promise<Profile> {
    console.log('Tentative de récupération du profil pour userId:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erreur détaillée lors de la récupération du profil:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error('Impossible de récupérer le profil');
    }

    if (!data) {
      console.log('Aucun profil trouvé pour userId:', userId);
      throw new Error('Profil non trouvé');
    }

    console.log('Profil trouvé:', data);
    return data as Profile;
  },

  async updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
    try {
      // D'abord, récupérer le profil existant
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du profil:', fetchError);
        throw new Error('Impossible de récupérer le profil');
      }

      // Filtrer les champs valides
      const validFields = ['nom', 'prenom', 'telephone', 'avatar_url', 'email', 'role'] as const;
      const filteredData = Object.keys(profileData)
        .filter(key => validFields.includes(key as typeof validFields[number]))
        .reduce((obj, key) => {
          obj[key as keyof Profile] = profileData[key as keyof Profile];
          return obj;
        }, {} as Partial<Profile>);

      // Fusionner les données existantes avec les nouvelles données
      const mergedData = {
        ...existingProfile,
        ...filteredData,
        id: userId,
        updated_at: new Date().toISOString()
      };

      // Utiliser upsert avec les données fusionnées
      const { data: updatedProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert(mergedData)
        .select()
        .single();

      if (upsertError) {
        console.error('Erreur détaillée lors de la mise à jour du profil:', {
          code: upsertError.code,
          message: upsertError.message,
          details: upsertError.details,
          hint: upsertError.hint
        });
        throw new Error('Impossible de mettre à jour le profil');
      }

      return updatedProfile as Profile;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  async createProfile(profile: Profile) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }
}; 