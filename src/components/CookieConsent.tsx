import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

// Types de cookies
type CookieType = 'necessary' | 'analytics' | 'personalization' | 'advertising';

// État des préférences de cookies
interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  personalization: boolean;
  advertising: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé car nécessaire
    analytics: false,
    personalization: false,
    advertising: false
  });

  // Vérifier si le consentement a déjà été donné
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (e) {
        console.error('Erreur lors de la lecture des préférences de cookies:', e);
      }
    }
  }, []);

  // Sauvegarder les préférences
  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences));
    setShowBanner(false);
    setShowSettings(false);
    
    // Ici, vous pouvez ajouter la logique pour activer/désactiver les scripts en fonction des préférences
    // Par exemple, activer Google Analytics si analytics est true
  };

  // Accepter tous les cookies
  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      personalization: true,
      advertising: true
    };
    savePreferences(allAccepted);
  };

  // Refuser tous les cookies non essentiels
  const rejectAll = () => {
    const allRejected: CookiePreferences = {
      necessary: true, // Toujours activé
      analytics: false,
      personalization: false,
      advertising: false
    };
    savePreferences(allRejected);
  };

  // Gérer le changement d'une préférence
  const handleChange = (type: CookieType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({
      ...preferences,
      [type]: event.target.checked
    });
  };

  // Traduire les types de cookies en français
  const getCookieTypeLabel = (type: CookieType): string => {
    switch (type) {
      case 'necessary':
        return 'Cookies strictement nécessaires';
      case 'analytics':
        return 'Cookies de performance et d\'analyse';
      case 'personalization':
        return 'Cookies de personnalisation';
      case 'advertising':
        return 'Cookies publicitaires et de suivi';
      default:
        return '';
    }
  };

  // Description des types de cookies
  const getCookieTypeDescription = (type: CookieType): string => {
    switch (type) {
      case 'necessary':
        return 'Ces cookies sont indispensables au bon fonctionnement du site. Ils permettent d\'utiliser les fonctionnalités de base comme la navigation et l\'accès aux zones sécurisées.';
      case 'analytics':
        return 'Ces cookies nous permettent d\'analyser l\'utilisation du site pour en améliorer les performances et l\'expérience utilisateur.';
      case 'personalization':
        return 'Ces cookies permettent de mémoriser vos préférences et de personnaliser votre expérience sur notre site.';
      case 'advertising':
        return 'Ces cookies sont utilisés pour vous proposer des publicités pertinentes en fonction de vos centres d\'intérêt.';
      default:
        return '';
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Bannière de cookies */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: 600,
          p: 3,
          borderRadius: 4,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #FDF8FF 0%, #FFE8F3 100%)',
          border: '1px solid rgba(147, 51, 234, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
            Nous utilisons des cookies
          </Typography>
          <Button 
            size="small" 
            onClick={() => setShowBanner(false)}
            sx={{ color: '#666', minWidth: 'auto', p: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </Button>
        </Box>
        
        <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
          Ce site utilise des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. 
          En continuant à naviguer, vous acceptez notre utilisation des cookies.
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Button
            variant="contained"
            onClick={acceptAll}
            fullWidth
            sx={{
              background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
              borderRadius: '25px',
              py: 1,
              '&:hover': {
                background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
              }
            }}
          >
            Tout accepter
          </Button>
          
          <Button
            variant="outlined"
            onClick={rejectAll}
            fullWidth
            sx={{
              borderColor: '#9333EA',
              color: '#9333EA',
              borderRadius: '25px',
              py: 1,
              '&:hover': {
                borderColor: '#7928CA',
                backgroundColor: 'rgba(147, 51, 234, 0.04)',
              }
            }}
          >
            Tout refuser
          </Button>
          
          <Button
            variant="text"
            onClick={() => setShowSettings(true)}
            startIcon={<SettingsIcon />}
            fullWidth
            sx={{
              color: '#666',
              borderRadius: '25px',
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(147, 51, 234, 0.04)',
              }
            }}
          >
            Paramétrer
          </Button>
        </Box>
      </Paper>

      {/* Dialogue de paramétrage */}
      <Dialog 
        open={showSettings} 
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#1F1F1F',
          fontWeight: 600,
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          //color: 'transparent',
        }}>
          Paramètres des cookies
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Vous pouvez personnaliser vos préférences en matière de cookies. Les cookies strictement nécessaires sont toujours activés car ils sont essentiels au fonctionnement du site.
          </Typography>
          
          <FormGroup>
            {(['necessary', 'analytics', 'personalization', 'advertising'] as CookieType[]).map((type) => (
              <Box key={type} sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={preferences[type]} 
                      onChange={handleChange(type)}
                      disabled={type === 'necessary'}
                      sx={{
                        color: '#9333EA',
                        '&.Mui-checked': {
                          color: '#9333EA',
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                        {getCookieTypeLabel(type)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                        {getCookieTypeDescription(type)}
                      </Typography>
                    </Box>
                  }
                />
                {type !== 'advertising' && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </FormGroup>
          
          <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
            Pour plus d'informations, consultez notre{' '}
            <Link component={RouterLink} to="/privacy" sx={{ color: '#9333EA' }}>
              politique de confidentialité
            </Link>.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowSettings(false)}
            sx={{
              color: '#666',
              '&:hover': {
                background: '#F5F5F5'
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={() => savePreferences(preferences)} 
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
              borderRadius: '12px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(90deg, #7928CA 0%, #E6447E 100%)',
              }
            }}
          >
            Enregistrer mes préférences
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookieConsent; 