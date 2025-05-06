import React, { useState, useEffect, useCallback } from 'react';
import { Switch, FormControlLabel, Box, Typography, Alert } from '@mui/material';
import { getMaintenanceMode, setMaintenanceMode } from '../services/settings';
import LoadingSpinner from './loading/LoadingSpinner';

const MaintenanceToggle: React.FC = () => {
  const [isMaintenance, setIsMaintenance] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenanceMode = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const mode = await getMaintenanceMode();
      setIsMaintenance(mode);
    } catch (error) {
      console.error('Erreur lors de la récupération du mode maintenance:', error);
      setError('Erreur lors de la récupération du mode maintenance');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenanceMode();
  }, [fetchMaintenanceMode]);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newMode = !isMaintenance;
      await setMaintenanceMode(newMode);
      setIsMaintenance(newMode);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mode maintenance:', error);
      setError('Erreur lors de la mise à jour du mode maintenance');
      // Recharger l'état actuel en cas d'erreur
      await fetchMaintenanceMode();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Chargement du mode maintenance..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Mode Maintenance
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <FormControlLabel
        control={
          <Switch
            checked={isMaintenance}
            onChange={handleToggle}
            disabled={isLoading}
            color="primary"
          />
        }
        label={
          isMaintenance
            ? "Le site est en maintenance (seuls les administrateurs peuvent y accéder)"
            : "Le site est accessible à tous"
        }
      />
    </Box>
  );
};

export default MaintenanceToggle; 