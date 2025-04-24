import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useMaintenance = () => {
  const [isMaintenance, setIsMaintenance] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMaintenanceStatus = async () => {
    try {
      console.log('🔍 Récupération du mode maintenance...');
      const { data, error } = await supabase
        .from('settings_public')
        .select('maintenance_mode')
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      console.log('✅ Mode maintenance récupéré:', data?.maintenance_mode ?? false);
      setIsMaintenance(data?.maintenance_mode ?? false);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du mode maintenance:', error);
      setIsMaintenance(false); // En cas d'erreur, on considère que le site n'est pas en maintenance
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceStatus();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'settings'
        },
        (payload) => {
          console.log('🔄 Changement détecté dans les settings:', payload);
          if (payload.new && 'maintenance_mode' in payload.new) {
            setIsMaintenance(payload.new.maintenance_mode);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { isMaintenance, isLoading };
}; 