import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Container,
  Paper,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  History as HistoryIcon,
  Construction as ConstructionIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from '@mui/icons-material';
import { getSettings, updateSettings, setMaintenanceMode } from '../../services/settings';
import DashboardBackButton from '../../components/DashboardBackButton';
import { useMaintenance } from '../../hooks/useMaintenance';
import { supabase } from '../../services/supabase';
import { useTheme as useMuiTheme } from '@mui/material/styles';

interface SettingsChange {
  date?: string;
  changed_at?: string;
  field: string;
  changed_by: string;
  newValue?: any;
  oldValue?: any;
}

interface Settings {
  id: string;
  site_name: string;
  site_email: string;
  matching_threshold: number;
  auto_match_enabled: boolean;
  email_notifications: boolean;
  maintenance_mode: boolean;
  language: string;
  created_at: string;
  updated_at: string;
  change_history: SettingsChange[];
}

const commonFlexStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1
};

// Composant principal pour la gestion des paramètres du site
const DashboardSettings: React.FC = () => {
  const { isMaintenance, isLoading: maintenanceLoading } = useMaintenance();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    id: '',
    site_name: '',
    site_email: '',
    matching_threshold: 80,
    auto_match_enabled: true,
    email_notifications: true,
    maintenance_mode: false,
    language: 'fr',
    created_at: '',
    updated_at: '',
    change_history: []
  });
  const [history, setHistory] = useState<SettingsChange[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [loadingUserNames, setLoadingUserNames] = useState(false);
  const muiTheme = useMuiTheme();
  const isDarkMode = muiTheme.palette.mode === 'dark';

  useEffect(() => {
    loadSettings();
    loadHistory();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await getSettings();
      setSettings(settingsData);
      setError(null);
    } catch (err: any) {
      console.error('❌ [Settings] Erreur lors du chargement:', err);
      setError(err.message || 'Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      console.log('📚 [Historique] Chargement de l\'historique...');
      
      const { data, error } = await supabase
        .from('settings')
        .select('change_history')
        .single();

      if (error) {
        console.error('❌ [Historique] Erreur lors du chargement:', error);
        throw error;
      }

      if (data?.change_history && Array.isArray(data.change_history)) {
        console.log('✅ [Historique] Données brutes:', data.change_history);
        setHistory(data.change_history.reverse()); // Afficher les plus récents en premier
      } else {
        console.log('ℹ️ [Historique] Aucun historique trouvé');
        setHistory([]);
      }
    } catch (err) {
      console.error('❌ [Historique] Erreur:', err);
      setError('Erreur lors du chargement de l\'historique');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleChange = (field: keyof typeof settings) => (
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
      setError(null);
      console.log('💾 [Settings] Sauvegarde des paramètres:', settings);
      await updateSettings(settings);
      setSuccess('Paramètres sauvegardés avec succès');
      await loadSettings(); // Recharger pour avoir l'historique à jour
    } catch (err: any) {
      console.error('❌ [Settings] Erreur lors de la sauvegarde:', err);
      setError(err.message || 'Erreur lors de la sauvegarde des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    try {
      if (!dateString) {
        return '---';
      }
      return new Date(dateString).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('❌ [Historique] Erreur de formatage de date:', err);
      return '---';
    }
  };

  /*const formatValue = (value: any): string => {
    if (value === undefined || value === null) return 'Non défini';
    if (typeof value === 'boolean') return value ? 'Activé' : 'Désactivé';
    return String(value);
  };*/

  const formatFieldName = (field: string): string => {
    const fieldNames: Record<string, string> = {
      'maintenance_mode': 'Mode maintenance',
      'site_name': 'Nom du site',
      'site_email': 'Email du site',
      'matching_threshold': 'Seuil de matching',
      'auto_match_enabled': 'Matching automatique',
      'email_notifications': 'Notifications email',
      'language': 'Langue',
      'updated_at': 'Dernière mise à jour',
      'change_history': 'Historique'
    };
    return fieldNames[field] || field;
  };

  const getChangedFields = (change: any) => {
    try {
      if (change.field === 'change_history') {
        return 'Mise à jour de l\'historique';
      }
      
      if (change.field === 'updated_at') {
        return `Dernière mise à jour: ${formatDate(change.oldValue)} → ${formatDate(change.newValue)}`;
      }

      if (change.field === 'maintenance_mode') {
        const oldValue = change.oldValue ? 'Activé' : 'Désactivé';
        const newValue = change.newValue ? 'Activé' : 'Désactivé';
        return `Mode maintenance: ${oldValue} → ${newValue}`;
      }

      // Pour les autres champs
      return `${formatFieldName(change.field)}: ${change.oldValue || '---'} → ${change.newValue || '---'}`;
    } catch (err) {
      console.error('❌ [Historique] Erreur lors du formatage des changements:', err);
      return 'Format de modification non reconnu';
    }
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
        background: muiTheme.palette.background.paper,
        border: `1px solid ${muiTheme.palette.divider}`,
        color: muiTheme.palette.text.primary,
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

  const handleMaintenanceToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔄 [Maintenance] Mise à jour du mode maintenance:', newValue);
      await setMaintenanceMode(newValue);
      await loadSettings(); // Recharger les paramètres pour avoir l'historique à jour
      setSuccess(`Mode maintenance ${newValue ? 'activé' : 'désactivé'} avec succès`);
    } catch (err: any) {
      console.error('❌ [Maintenance] Erreur:', err);
      setError(err.message || 'Erreur lors de la mise à jour du mode maintenance');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchUserNames = async () => {
      if (history.length > 0) {
        setLoadingUserNames(true);
        try {
          const userIds = [...new Set(history.map(change => change.changed_by))];
          
          if (userIds.length === 0) {
            setUserNames({});
            return;
          }

          // Ajout du rôle dans la requête
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, nom, prenom, role')
            .in('id', userIds);

          if (error) {
            console.error('❌ [Historique] Erreur lors de la récupération des profils:', error);
            setUserNames({});
            return;
          }

          const namesMap: Record<string, string> = {};
          
          // Traiter d'abord les profils trouvés
          profiles?.forEach(profile => {
            const isAdmin = profile.role === 'admin';
            namesMap[profile.id] = `${profile.prenom} ${profile.nom}${isAdmin ? ' (Admin)' : ''}`;
          });

          // Traiter les utilisateurs non trouvés
          const checkAdmin = async (id: string) => {
            const { data: adminCheck } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', id)
              .single();
            return adminCheck?.role === 'admin';
          };

          // Vérifier les utilisateurs manquants
          await Promise.all(userIds.map(async (id) => {
            if (!namesMap[id]) {
              if (id === '00000000-0000-0000-0000-000000000000') {
                namesMap[id] = 'Système';
              } else {
                const isAdmin = await checkAdmin(id);
                namesMap[id] = isAdmin ? 'Administrateur' : 'Utilisateur inconnu';
              }
            }
          }));

          setUserNames(namesMap);
        } catch (err) {
          console.error('❌ [Historique] Erreur lors du chargement des noms:', err);
          setUserNames({});
        } finally {
          setLoadingUserNames(false);
        }
      }
    };

    fetchUserNames();
  }, [history]);

  if (loading && maintenanceLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <DashboardBackButton />
      
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
        <SettingsIcon sx={{ fontSize: 40, mr: 2, color: '#FF4D8D' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Paramètres
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError(null)}
          icon={<ErrorIcon />}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Erreur
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }} 
          onClose={() => setSuccess(null)}
          icon={<CheckCircleIcon />}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Succès
          </Typography>
          <Typography variant="body2">
            {success}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: muiTheme.palette.background.paper,
              border: `1px solid ${muiTheme.palette.divider}`,
              color: muiTheme.palette.text.primary,
            }}
          >
            <SettingSection title="Mode Maintenance" icon={<ConstructionIcon />}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMaintenance}
                    onChange={handleMaintenanceToggle}
                    disabled={isUpdating || maintenanceLoading}
                  />
                }
                label={
                  isMaintenance 
                    ? "Le site est actuellement en maintenance" 
                    : "Le site est actuellement accessible"
                }
              />
              {(isUpdating || maintenanceLoading) && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Mise à jour en cours...
                  </Typography>
                </Box>
              )}
            </SettingSection>

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
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 4,
                background: isDarkMode ? muiTheme.palette.background.paper : 'linear-gradient(135deg, #9333EA 0%, #FF4D8D 100%)',
                color: isDarkMode ? muiTheme.palette.text.primary : 'white',
                border: `1px solid ${muiTheme.palette.divider}`,
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
                disabled={loading}
                sx={{
                  bgcolor: 'white',
                  color: '#9333EA',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                  mb: 2
                }}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: muiTheme.palette.background.paper,
                border: `1px solid ${muiTheme.palette.divider}`,
                color: muiTheme.palette.text.primary,
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
                  Historique des modifications
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
                <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {history.map((change, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        flexDirection: 'column', 
                        alignItems: 'flex-start',
                        p: 2,
                        mb: 2,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        color="primary" 
                        sx={{ 
                          ...commonFlexStyles,
                          fontWeight: 600
                        }}
                      >
                        <HistoryIcon sx={{ fontSize: 20 }} />
                        {formatDate(change.date || change.changed_at)}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{
                          ...commonFlexStyles,
                          mt: 0.5
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 16 }} />
                        Modifié par: {loadingUserNames ? (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
                            <CircularProgress size={12} sx={{ mr: 1 }} />
                            <span>Chargement...</span>
                          </Box>
                        ) : userNames[change.changed_by] || 'Utilisateur inconnu'}
                      </Typography>
                      <Box sx={{ mt: 1.5, width: '100%' }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            ...commonFlexStyles,
                            fontSize: '0.85rem', 
                            py: 0.5
                          }}
                        >
                          <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                          {getChangedFields(change)}
                        </Typography>
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