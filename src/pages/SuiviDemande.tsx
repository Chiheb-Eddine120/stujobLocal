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
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { demandeService } from '../services/demandeService';
import { Demande } from '../types';

const statusMap = {
  en_attente: {
    label: 'En attente',
    color: '#FFB547',
    bg: '#FFF4E5',
    icon: <HourglassEmptyIcon sx={{ mr: 1 }} fontSize="small" />,
  },
  en_traitement: {
    label: 'En traitement',
    color: '#33C2FF',
    bg: '#E3F2FD',
    icon: <BuildCircleIcon sx={{ mr: 1 }} fontSize="small" />,
  },
  etudiant_trouve: {
    label: 'Étudiant trouvé',
    color: '#4CAF50',
    bg: '#E8F5E9',
    icon: <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" />,
  },
  termine: {
    label: 'Terminé',
    color: '#9333EA',
    bg: '#F3E8FF',
    icon: <DoneAllIcon sx={{ mr: 1 }} fontSize="small" />,
  },
  default: {
    label: 'Inconnu',
    color: '#666666',
    bg: '#F5F5F5',
    icon: <HourglassEmptyIcon sx={{ mr: 1 }} fontSize="small" />,
  },
};

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

const SuiviDemande: React.FC = () => {
  const { trackingNumber: demandeId } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [demande, setDemande] = useState<Demande | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    <Fade in timeout={800}>
      <Box sx={{ 
        maxWidth: '800px', 
        mx: 'auto',
        p: 4,
        borderRadius: 4,
        background: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}>
        <form onSubmit={handleSearch}>
          <Typography variant="h6" gutterBottom sx={{ 
            color: '#1F1F1F', 
            fontWeight: 600,
            mb: 2,
          }}>
            Rechercher une demande
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            mt: 2,
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
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
                  transform: 'scale(1.02)',
                }
              }}
            >
              Rechercher
            </Button>
          </Box>
        </form>
      </Box>
    </Fade>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Fade in timeout={1000}>
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
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Suivi de votre demande
        </Typography>
      </Fade>

      <SearchForm />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#9333EA' }} />
        </Box>
      )}

      {error && (
        <Zoom in timeout={500}>
          <Alert 
            severity="error" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              mt: 4,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {error}
          </Alert>
        </Zoom>
      )}

      {demande && (
        <Fade in timeout={800}>
          <Box sx={{ 
            maxWidth: '700px', 
            mx: 'auto',
            mt: 4,
            p: 4,
            borderRadius: 5,
            background: 'white',
            boxShadow: '0 8px 32px rgba(147, 51, 234, 0.08)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.01)',
            }
          }}>
            {/* Numéro de suivi avec bouton de copie */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#1F1F1F', fontWeight: 700, mr: 2 }}>
                Numéro de suivi
              </Typography>
              <Tooltip title={copied ? 'Copié !' : 'Copier'} placement="top">
                <IconButton
                  aria-label="Copier le numéro de suivi"
                  onClick={() => {
                    navigator.clipboard.writeText(demande.code_demande);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                  sx={{ ml: 1, color: copied ? '#9333EA' : '#888' }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: '#F8F9FA',
              border: '1px dashed #E0E0E0',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              letterSpacing: '0.5px',
              wordBreak: 'break-all',
              justifyContent: 'space-between',
            }}>
              {demande.code_demande}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Statuts */}
            <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <HourglassEmptyIcon sx={{ color: '#FFB547' }} fontSize="small" /> Statut de la demande
                </Typography>
                <Chip
                  icon={statusMap[demande.status]?.icon || statusMap.default.icon}
                  label={statusMap[demande.status]?.label || statusMap.default.label}
                  sx={{
                    bgcolor: statusMap[demande.status]?.bg || statusMap.default.bg,
                    color: statusMap[demande.status]?.color || statusMap.default.color,
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    fontSize: '1rem',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(147, 51, 234, 0.07)',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <MonetizationOnIcon sx={{ color: '#FFB547' }} fontSize="small" /> Statut de facturation
                </Typography>
                <Chip
                  icon={statusMap[demande.status]?.icon || statusMap.default.icon}
                  label={statusMap[demande.status]?.label || statusMap.default.label}
                  sx={{
                    bgcolor: statusMap[demande.status]?.bg || statusMap.default.bg,
                    color: statusMap[demande.status]?.color || statusMap.default.color,
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    fontSize: '1rem',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(147, 51, 234, 0.07)',
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Détails de la demande */}
            <Typography variant="h6" sx={{ color: '#1F1F1F', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ApartmentIcon sx={{ color: '#9333EA' }} fontSize="medium" /> Détails de la demande
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon sx={{ color: '#9333EA' }} fontSize="small" />
                  <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 500 }}>
                    Entreprise
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 2 }}>
                  {demande.entreprise}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ApartmentIcon sx={{ color: '#9333EA' }} fontSize="small" />
                  <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 500 }}>
                    Secteur
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 2 }}>
                  {demande.secteur}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationOnIcon sx={{ color: '#9333EA' }} fontSize="small" />
                  <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 500 }}>
                    Ville
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 2 }}>
                  {demande.ville}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarMonthIcon sx={{ color: '#9333EA' }} fontSize="small" />
                  <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 500 }}>
                    Date de création
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#1F1F1F', fontWeight: 600, mb: 2 }}>
                  {formatDate(demande.created_at)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default SuiviDemande; 