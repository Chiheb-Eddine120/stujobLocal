import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

/**
 * Hook personnalisé pour gérer le mode maintenance
 * Vérifie l'état de maintenance dans la table settings_public
 * et écoute les changements en temps réel
 */
export const useMaintenance = () => {
  const [isMaintenance, setIsMaintenance] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('settings_public')
        .select('maintenance_mode')
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // Si aucune donnée n'est trouvée, on considère que le site n'est pas en maintenance
      setIsMaintenance(data?.maintenance_mode ?? false);
      setError(null);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du mode maintenance:', error);
      setError('Impossible de vérifier le statut de maintenance');
      // En cas d'erreur, on considère que le site n'est pas en maintenance
      setIsMaintenance(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceStatus();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('settings_public_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'settings_public'
        },
        (payload) => {
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

  return { isMaintenance, isLoading, error };
}; 