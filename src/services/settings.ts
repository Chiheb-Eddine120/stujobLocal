import { supabase } from './supabase';

export interface Settings {
  id: string;
  site_name: string;
  site_email: string;
  matching_threshold: number;
  auto_match_enabled: boolean;
  email_notifications: boolean;
  maintenance_mode: boolean;
  language: string;
  created_at: string;
  updated_at: string;
  change_history: any[];
}

interface ChangeEntry {
  field: string;
  oldValue: any;
  newValue: any;
  date: string;
  changed_by: string;
}

export const getMaintenanceMode = async (): Promise<boolean> => {
  try {
    console.log('🔍 Récupération du mode maintenance...');
    const { data, error } = await supabase
      .from('settings')
      .select('maintenance_mode')
      .single();

    if (error) {
      console.error('❌ Erreur lors de la récupération du mode maintenance:', error);
      return false;
    }

    console.log('✅ Mode maintenance actuel:', data?.maintenance_mode);
    return data?.maintenance_mode ?? false;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du mode maintenance:', error);
    return false;
  }
};

export const setMaintenanceMode = async (mode: boolean): Promise<void> => {
  try {
    console.log('🔄 Début de la mise à jour du mode maintenance vers:', mode);
    
    // Récupérer l'enregistrement existant
    const { data: current, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération des paramètres:', fetchError);
      throw fetchError;
    }

    console.log('📊 Paramètres actuels:', current);

    // Créer la nouvelle entrée d'historique
    const newChange = {
      field: 'maintenance_mode',
      oldValue: current.maintenance_mode,
      newValue: mode,
      date: new Date().toISOString(),
      changed_by: (await supabase.auth.getSession()).data.session?.user.id || 'system'
    };

    console.log('📝 Nouvelle entrée d\'historique:', newChange);

    // Mettre à jour uniquement le mode maintenance
    const { error: updateError } = await supabase
      .from('settings')
      .update({
        maintenance_mode: mode,
        change_history: [...(current.change_history || []), newChange]
      })
      .eq('id', current.id);

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError);
      throw updateError;
    }

    console.log('✅ Mode maintenance mis à jour avec succès vers:', mode);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du mode maintenance:', error);
    throw error;
  }
};

export const getSettings = async (): Promise<Settings> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    throw error;
  }
};

export const updateSettings = async (settings: Partial<Settings>): Promise<void> => {
  try {
    console.log('🔄 Début de la mise à jour des paramètres');
    console.log('📝 Paramètres à mettre à jour:', settings);

    // Exclure maintenance_mode des mises à jour
    const { maintenance_mode, ...settingsToUpdate } = settings;
    console.log('📝 Paramètres à mettre à jour (sans maintenance_mode):', settingsToUpdate);

    // Récupérer l'enregistrement existant
    const { data: current, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération des paramètres:', fetchError);
      throw fetchError;
    }

    console.log('📊 Paramètres actuels:', current);

    // Récupérer l'ID de l'utilisateur
    const userId = (await supabase.auth.getSession()).data.session?.user.id || 'system';
    console.log('👤 ID utilisateur:', userId);

    // Identifier les changements
    const changes: ChangeEntry[] = [];
    Object.keys(settingsToUpdate).forEach(key => {
      if (settingsToUpdate[key as keyof typeof settingsToUpdate] !== current[key as keyof Settings]) {
        const change = {
          field: key,
          oldValue: current[key as keyof Settings],
          newValue: settingsToUpdate[key as keyof typeof settingsToUpdate],
          date: new Date().toISOString(),
          changed_by: userId
        };
        console.log('📝 Changement détecté:', change);
        changes.push(change);
      }
    });

    if (changes.length === 0) {
      console.log('ℹ️ Aucun changement détecté');
      return;
    }

    console.log('📝 Nombre total de changements:', changes.length);

    // Mettre à jour les paramètres
    const { error: updateError } = await supabase
      .from('settings')
      .update({
        ...settingsToUpdate,
        change_history: [...(current.change_history || []), ...changes]
      })
      .eq('id', current.id);

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError);
      throw updateError;
    }

    console.log('✅ Paramètres mis à jour avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des paramètres:', error);
    throw error;
  }
}; 