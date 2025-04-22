import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import DashboardBackButton from '../components/DashboardBackButton';
import { settingsService, SiteSettings, SettingsChange } from '../services/settingsService';

// Composant principal pour la gestion des paramètres du site
const DashboardSettings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: '',
    site_email: '',
    matching_threshold: 80,
    auto_match_enabled: true,
    email_notifications: true,
    maintenance_mode: false,
    language: 'fr',
  });
  const [history, setHistory] = useState<SettingsChange[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadSettings();
    loadHistory();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des paramètres');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await settingsService.getSettingsHistory();
      setHistory(data);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleChange = (field: keyof SiteSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.type === 'number'
      ? Number(event.target.value)
      : event.target.value;

    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await settingsService.updateSettings(settings);
      setSaved(true);
      setError(null);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde des paramètres');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  };

  const getChangedFields = (oldData: any, newData: any) => {
    const changes: string[] = [];
    Object.keys(newData).forEach(key => {
      if (oldData[key] !== newData[key] && key !== 'updated_at' && key !== 'change_history') {
        let oldValue = oldData[key];
        let newValue = newData[key];

        // Formater les valeurs booléennes
        if (typeof oldValue === 'boolean') {
          oldValue = oldValue ? 'Activé' : 'Désactivé';
        }
        if (typeof newValue === 'boolean') {
          newValue = newValue ? 'Activé' : 'Désactivé';
        }

        // Formater les clés pour l'affichage
        const formattedKey = key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        changes.push(`${formattedKey}: ${oldValue} → ${newValue}`);
      }
    });
    return changes;
  };

  // Composant réutilisable pour les sections de paramètres
  const SettingSection = ({ 
    title, 
    icon, 
    children 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode; 
  }) => (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 4,
        background: '#FDF8FF',
        border: '1px solid #F3E8FF'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #9333EA 0%, #FF4D8D 100%)',
          mr: 2
        }}>
          {React.cloneElement(icon as React.ReactElement, { sx: { color: 'white' } })}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  );

  if (loading && !saved) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <DashboardBackButton />
      
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
        <SettingsIcon sx={{ 
          fontSize: 40, 
          mr: 2,
          color: '#FF4D8D'
        }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Paramètres
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {saved && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
        >
          Les paramètres ont été enregistrés avec succès.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <SettingSection title="Paramètres généraux" icon={<LanguageIcon />}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom du site"
                  value={settings.site_name}
                  onChange={handleChange('site_name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email du site"
                  value={settings.site_email}
                  onChange={handleChange('site_email')}
                />
              </Grid>
            </Grid>
          </SettingSection>

          <SettingSection title="Paramètres de matching" icon={<SecurityIcon />}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Seuil de matching (%)"
                  type="number"
                  value={settings.matching_threshold}
                  onChange={handleChange('matching_threshold')}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Seuil minimum pour considérer un match comme pertinent">
                        <IconButton size="small">
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.auto_match_enabled}
                      onChange={handleChange('auto_match_enabled')}
                    />
                  }
                  label="Activer le matching automatique"
                />
              </Grid>
            </Grid>
          </SettingSection>

          <SettingSection title="Notifications" icon={<NotificationsIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.email_notifications}
                  onChange={handleChange('email_notifications')}
                />
              }
              label="Activer les notifications par email"
            />
          </SettingSection>

          <SettingSection title="Maintenance" icon={<EmailIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenance_mode}
                  onChange={handleChange('maintenance_mode')}
                />
              }
              label="Mode maintenance"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Lorsque le mode maintenance est activé, seuls les administrateurs peuvent accéder au site.
            </Typography>
          </SettingSection>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #9333EA 0%, #FF4D8D 100%)',
                color: 'white'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Actions
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                sx={{
                  bgcolor: 'white',
                  color: '#9333EA',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                  mb: 2
                }}
              >
                Enregistrer les modifications
              </Button>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Les modifications seront appliquées immédiatement après l'enregistrement.
              </Typography>
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 4,
                background: '#FDF8FF',
                border: '1px solid #F3E8FF'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #9333EA 0%, #FF4D8D 100%)',
                  mr: 2
                }}>
                  <HistoryIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Historique
                </Typography>
              </Box>

              {loadingHistory ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : history.length === 0 ? (
                <Typography color="text.secondary">
                  Aucune modification enregistrée
                </Typography>
              ) : (
                <List sx={{ 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#9333EA',
                    borderRadius: '4px',
                  },
                }}>
                  {history.map((change, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        flexDirection: 'column', 
                        alignItems: 'flex-start',
                        p: 0,
                        mb: 2
                      }}
                    >
                      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                        {formatDate(change.changed_at)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Modifié par: {change.changed_by === '00000000-0000-0000-0000-000000000000' ? 'Système' : change.changed_by}
                      </Typography>
                      <Box sx={{ mt: 1, width: '100%' }}>
                        {getChangedFields(change.changes.old, change.changes.new).map((change, i) => (
                          <Typography 
                            key={i} 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: '0.85rem',
                              py: 0.5
                            }}
                          >
                            • {change}
                          </Typography>
                        ))}
                      </Box>
                      {index < history.length - 1 && (
                        <Divider sx={{ width: '100%', my: 1 }} />
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardSettings; 