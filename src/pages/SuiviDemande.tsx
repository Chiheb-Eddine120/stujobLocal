import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  //Paper,
  Box,
  CircularProgress,
  Alert,
  //Chip,
  Grid,
  Divider,
  TextField,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { demandeService } from '../services/demandeService';
import { Demande } from '../types';

const SuiviDemande: React.FC = () => {
  const { trackingNumber: demandeId } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [demande, setDemande] = useState<Demande | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    if (demandeId === searchId.trim()) {
      fetchDemande();
    } else {
      navigate(`/suivi/${searchId.trim()}`, { replace: true });
    }
  };

  const fetchDemande = async () => {
    if (!demandeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await demandeService.getDemandeByTrackingNumber(demandeId);
      if (data) {
        setDemande(data);
      } else {
        setError('Demande non trouvée. Veuillez vérifier votre numéro de suivi.');
      }
    } catch (err) {
      setError('Erreur lors de la récupération de la demande');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (demandeId) {
      setSearchId(demandeId);
      fetchDemande();
    }
  }, [demandeId]);

  const SearchForm = () => (
    <Box sx={{ 
      maxWidth: '800px', 
      mx: 'auto',
      p: 4,
      borderRadius: 4,
      background: 'white',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    }}>
      <form onSubmit={handleSearch}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1F1F1F', fontWeight: 600 }}>
          Rechercher une demande
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          mt: 3,
        }}>
          <TextField
            fullWidth
            label="Numéro de suivi"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Entrez votre numéro de suivi"
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#9333EA',
                },
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9333EA !important',
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!searchId.trim() || loading}
            startIcon={<SearchIcon />}
            sx={{
              background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
              borderRadius: '12px',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
              }
            }}
          >
            Rechercher
          </Button>
        </Box>
      </form>
    </Box>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return '#FFB547';
      case 'en_traitement':
        return '#33C2FF';
      case 'etudiant_trouve':
        return '#4CAF50';
      case 'termine':
        return '#9333EA';
      default:
        return '#666666';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'en_attente':
        return '#FFF4E5';
      case 'en_traitement':
        return '#E3F2FD';
      case 'etudiant_trouve':
        return '#E8F5E9';
      case 'termine':
        return '#F3E8FF';
      default:
        return '#F5F5F5';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        align="center"
        sx={{ 
          mb: 6,
          fontWeight: 700,
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Suivi de votre demande
      </Typography>

      <SearchForm />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#9333EA' }} />
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
            mt: 4,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {demande && (
        <Box sx={{ 
          maxWidth: '800px', 
          mx: 'auto',
          mt: 4,
          p: 4,
          borderRadius: 4,
          background: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 2 }}>
                Numéro de suivi
              </Typography>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: '#F8F9FA',
                border: '1px dashed #E0E0E0'
              }}>
                <Typography variant="body1" sx={{ color: '#666', fontFamily: 'monospace' }}>
                  {demande.id}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 2 }}>
                Statut de la demande
              </Typography>
              <Box sx={{ 
                display: 'inline-flex',
                px: 2,
                py: 1,
                borderRadius: '20px',
                bgcolor: getStatusBackground(demande.status),
                color: getStatusColor(demande.status),
                fontWeight: 500,
              }}>
                {demande.status}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 2 }}>
                Statut de facturation
              </Typography>
              <Box sx={{ 
                display: 'inline-flex',
                px: 2,
                py: 1,
                borderRadius: '20px',
                  bgcolor: getStatusBackground(demande.status || 'en_attente'),
                  color: getStatusColor(demande.status || 'en_attente'),
                  fontWeight: 500,
                }}>
                  {demande.status || 'En attente'}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 3 }}>
                Détails de la demande
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                    Entreprise
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1F1F1F', fontWeight: 500 }}>
                    {demande.entreprise}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                    Secteur
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1F1F1F', fontWeight: 500 }}>
                    {demande.secteur}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                    Ville
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1F1F1F', fontWeight: 500 }}>
                    {demande.ville}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                    Date de création
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1F1F1F', fontWeight: 500 }}>
                    {demande.created_at}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default SuiviDemande; 