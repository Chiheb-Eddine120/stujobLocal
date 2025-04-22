import { supabase } from './supabaseClient';

export interface SettingsChange {
  changed_at: string;
  changed_by: string;
  changes: {
    old: Partial<SiteSettings>;
    new: Partial<SiteSettings>;
  };
}

export interface SiteSettings {
  id?: string;
  site_name: string;
  site_email: string;
  matching_threshold: number;
  auto_match_enabled: boolean;
  email_notifications: boolean;
  maintenance_mode: boolean;
  language: string;
  updated_at?: string;
  change_history?: SettingsChange[];
}

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erreur lors de la récupération des paramètres:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        // Retourner les paramètres par défaut si aucune donnée n'est trouvée
        return {
          site_name: 'StuJob',
          site_email: 'contact@stujob.be',
          matching_threshold: 80,
          auto_match_enabled: true,
          email_notifications: true,
          maintenance_mode: false,
          language: 'fr'
        };
      }

      return data[0] as SiteSettings;
    } catch (error) {
      console.error('Erreur dans getSettings:', error);
      // Retourner les paramètres par défaut en cas d'erreur
      return {
        site_name: 'StuJob',
        site_email: 'contact@stujob.be',
        matching_threshold: 80,
        auto_match_enabled: true,
        email_notifications: true,
        maintenance_mode: false,
        language: 'fr'
      };
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    try {
      console.log('=== DÉBUT MISE À JOUR PARAMÈTRES ===');
      console.log('1. Paramètres à mettre à jour:', settings);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Vous devez être connecté pour modifier les paramètres');
      }

      // Vérifier si l'utilisateur est un admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        throw new Error('Seuls les administrateurs peuvent modifier les paramètres');
      }

      // Récupérer l'ID existant
      const { data: existingSettings } = await supabase
        .from('settings')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!existingSettings?.id) {
        throw new Error('Impossible de trouver les paramètres existants');
      }

      // Créer une copie des paramètres sans l'id
      const { id, ...settingsWithoutId } = settings;
      console.log('2. Paramètres sans ID:', settingsWithoutId);

      const { data, error } = await supabase
        .from('settings')
        .update({
          ...settingsWithoutId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
        throw error;
      }

      console.log('3. Réponse après mise à jour:', data);
      console.log('=== FIN MISE À JOUR PARAMÈTRES ===');
      return data as SiteSettings;
    } catch (error) {
      console.error('❌ Erreur dans updateSettings:', error);
      throw error;
    }
  },

  async getSettingsHistory(): Promise<SettingsChange[]> {
    try {
      console.log('=== DÉBUT RÉCUPÉRATION HISTORIQUE ===');
      
      // 1. Récupération des données
      console.log('1. Envoi de la requête à Supabase...');
      const { data, error } = await supabase
        .from('settings')
        .select('id, change_history, updated_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('2. Réponse brute de Supabase:', data);
      
      if (!data || data.length === 0) {
        console.log('❌ Aucune donnée trouvée dans la table settings');
        return [];
      }

      const settings = data[0];
      console.log('3. Premier enregistrement:', settings);
      console.log('4. Type de change_history:', typeof settings.change_history);
      console.log('5. Valeur de change_history:', settings.change_history);

      // Vérifier si change_history existe et n'est pas null
      if (!settings?.change_history) {
        console.log('❌ Pas d\'historique dans les données');
        return [];
      }

      // Convertir l'historique en tableau et le trier par date décroissante
      if (!Array.isArray(settings.change_history)) {
        return [];
      }

      // Récupérer tous les IDs d'utilisateurs uniques
      const userIds = settings.change_history
        .filter(change => change && typeof change === 'object' && change.changed_by)
        .map(change => change.changed_by)
        .filter(id => id !== '00000000-0000-0000-0000-000000000000');

      // Récupérer les informations des utilisateurs
      const { data: userData } = await supabase
        .from('profiles')
        .select('id, nom, prenom')
        .in('id', userIds);

      // Créer un map des noms d'utilisateurs
      const userNames = new Map(
        userData?.map(user => [user.id, `${user.prenom} ${user.nom}`]) || []
      );

      // Transformer l'historique
      const history = settings.change_history
        .filter(change => change && typeof change === 'object')
        .map(change => ({
          changed_at: change.changed_at || new Date().toISOString(),
          changed_by: change.changed_by === '00000000-0000-0000-0000-000000000000' 
            ? 'Système' 
            : userNames.get(change.changed_by) || 'Utilisateur inconnu',
          changes: {
            old: change.changes?.old || {},
            new: change.changes?.new || {}
          }
        }))
        .sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());

      console.log('8. Historique final formaté:', history);
      console.log('=== FIN RÉCUPÉRATION HISTORIQUE ===');
      return history;
    } catch (error) {
      console.error('❌ Erreur dans getSettingsHistory:', error);
      return [];
    }
  }
}; 