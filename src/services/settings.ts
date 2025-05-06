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
    const { data, error } = await supabase
      .from('settings')
      .select('maintenance_mode')
      .single();

    if (error) {
      return false;
    }

    return data?.maintenance_mode ?? false;
  } catch (error) {
    return false;
  }
};

export const setMaintenanceMode = async (mode: boolean): Promise<void> => {
  try {
    const { data: current, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const newChange = {
      field: 'maintenance_mode',
      oldValue: current.maintenance_mode,
      newValue: mode,
      date: new Date().toISOString(),
      changed_by: (await supabase.auth.getSession()).data.session?.user.id || 'system'
    };

    const { error: updateError } = await supabase
      .from('settings')
      .update({
        maintenance_mode: mode,
        change_history: [...(current.change_history || []), newChange]
      })
      .eq('id', current.id);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
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
    throw error;
  }
};

export const updateSettings = async (settings: Partial<Settings>): Promise<void> => {
  try {
    const { maintenance_mode, ...settingsToUpdate } = settings;

    const { data: current, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const userId = (await supabase.auth.getSession()).data.session?.user.id || 'system';

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
        changes.push(change);
      }
    });

    if (changes.length === 0) {
      return;
    }

    const { error: updateError } = await supabase
      .from('settings')
      .update({
        ...settingsToUpdate,
        change_history: [...(current.change_history || []), ...changes]
      })
      .eq('id', current.id);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    throw error;
  }
}; 