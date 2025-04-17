import React, { useState, FormEvent } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { demandeService } from '../services/demandeService';
import { Demande } from '../types';

const SuiviDemande: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Demande | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const result = await demandeService.getDemandeByTrackingNumber(trackingNumber);
      if (result) {
        setSearchResult(result);
      } else {
        setError('Numéro de suivi non trouvé. Veuillez vérifier et réessayer.');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      console.error('Erreur lors de la recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): 'info' | 'warning' | 'success' | 'error' => {
    switch (status) {
      case 'en_attente':
        return 'info';
      case 'en_traitement':
        return 'warning';
      case 'etudiant_trouve':
        return 'success';
      case 'termine':
        return 'info';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'en_attente':
        return 'En attente de traitement';
      case 'en_traitement':
        return 'En cours de traitement';
      case 'etudiant_trouve':
        return 'Étudiant trouvé';
      case 'termine':
        return 'Demande terminée';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Suivre une demande
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <form onSubmit={handleSearch}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Numéro de suivi"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ex: STU-12345"
                disabled={loading}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Recherche en cours...' : 'Rechercher'}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {searchResult && (
            <Box sx={{ mt: 4 }}>
              <Alert severity={getStatusColor(searchResult.status)} sx={{ mb: 3 }}>
                {getStatusText(searchResult.status)}
              </Alert>
              <Typography variant="body1" paragraph>
                <strong>Entreprise:</strong> {searchResult.entreprise}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Secteur:</strong> {searchResult.secteur}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Profil recherché:</strong> {searchResult.profil}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Date de début souhaitée:</strong> {searchResult.urgence}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Localisation:</strong> {searchResult.ville}
              </Typography>
              {searchResult.remarques && (
                <Typography variant="body1" paragraph>
                  <strong>Remarques:</strong> {searchResult.remarques}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default SuiviDemande; 