import React, { useState } from 'react';
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
import SearchIcon from '@mui/icons-material/Search';

// Simulation d'une base de données locale
const mockDatabase = {
  'STU-12345': {
    status: 'En traitement',
    date: '2024-04-13',
    details: 'Votre demande est en cours d\'analyse par notre équipe.',
  },
  'STU-67890': {
    status: 'En cours de recherche',
    date: '2024-04-12',
    details: 'Nous recherchons activement des candidats correspondant à votre profil.',
  },
  'STU-24680': {
    status: 'Étudiant trouvé',
    date: '2024-04-11',
    details: 'Un étudiant correspondant à votre profil a été trouvé. Nous vous contacterons bientôt.',
  },
};

const SuiviDemande = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearchResult(null);

    // Simuler un délai de recherche
    setTimeout(() => {
      const result = mockDatabase[trackingNumber];
      if (result) {
        setSearchResult(result);
      } else {
        setError('Numéro de suivi non trouvé. Veuillez vérifier et réessayer.');
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En traitement':
        return 'info';
      case 'En cours de recherche':
        return 'warning';
      case 'Étudiant trouvé':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Suivre une demande
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              label="Numéro de suivi"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ex: STU-12345"
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={<SearchIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Rechercher'}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {searchResult && (
            <Box sx={{ mt: 4 }}>
              <Alert severity={getStatusColor(searchResult.status)} sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Statut : {searchResult.status}
                </Typography>
                <Typography variant="body2">
                  Date de mise à jour : {searchResult.date}
                </Typography>
              </Alert>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {searchResult.details}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default SuiviDemande; 