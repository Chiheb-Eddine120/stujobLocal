import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Language as LanguageIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

interface StudentSettingsTabProps {
  settings: {
    profileVisibility: boolean;
    emailNotifications: boolean;
    language: string;
    jobOffers: boolean;
    relationships: boolean;
  };
  onSettingChange: (setting: string, value: any) => void;
}

const StudentSettingsTab: React.FC<StudentSettingsTabProps> = ({
  settings,
  onSettingChange,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState('');

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'SUPPRIMER') {
      // Logique de suppression du compte
      setOpenDeleteDialog(false);
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: '#FDF8FF',
          border: '1px solid #F3E8FF',
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Paramètres du compte
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <VisibilityIcon sx={{ color: '#9333EA' }} />
            </ListItemIcon>
            <ListItemText
              primary="Visibilité du profil"
              secondary="Rendre votre profil visible pour les entreprises"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.profileVisibility}
                  onChange={(e) => onSettingChange('profileVisibility', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#9333EA',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#9333EA',
                      },
                    },
                  }}
                />
              }
              label=""
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <EmailIcon sx={{ color: '#9333EA' }} />
            </ListItemIcon>
            <ListItemText
              primary="Notifications par email"
              secondary="Recevoir des notifications par email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => onSettingChange('emailNotifications', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#9333EA',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#9333EA',
                      },
                    },
                  }}
                />
              }
              label=""
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <LanguageIcon sx={{ color: '#9333EA' }} />
            </ListItemIcon>
            <ListItemText
              primary="Langue"
              secondary="Choisir la langue de l'interface"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.language === 'fr'}
                  onChange={(e) => onSettingChange('language', e.target.checked ? 'fr' : 'en')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#9333EA',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#9333EA',
                      },
                    },
                  }}
                />
              }
              label={settings.language === 'fr' ? 'Français' : 'English'}
            />
          </ListItem>
        </List>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: '#FDF8FF',
          border: '1px solid #F3E8FF',
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Paramètres de notification
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <EmailIcon sx={{ color: '#9333EA' }} />
            </ListItemIcon>
            <ListItemText
              primary="Emails"
              secondary="Recevoir des rappels de newsletter et nouveaux messages"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => onSettingChange('emailNotifications', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#9333EA',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#9333EA',
                      },
                    },
                  }}
                />
              }
              label=""
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <WorkIcon sx={{ color: '#9333EA' }} />
            </ListItemIcon>
            <ListItemText
              primary="Propositions d'emploi"
              secondary="Être notifié des nouvelles offres correspondant à votre profil"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.jobOffers}
                  onChange={(e) => onSettingChange('jobOffers', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#9333EA',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#9333EA',
                      },
                    },
                  }}
                />
              }
              label=""
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <PeopleIcon sx={{ color: '#9333EA' }} />
            </ListItemIcon>
            <ListItemText
              primary="Suivi des relations"
              secondary="Recevoir des mises à jour sur vos connexions et relations"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.relationships}
                  onChange={(e) => onSettingChange('relationships', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#9333EA',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#9333EA',
                      },
                    },
                  }}
                />
              }
              label=""
            />
          </ListItem>
        </List>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: '#FDF8FF',
          border: '1px solid #F3E8FF',
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Sécurité
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon sx={{ color: '#9333EA' }} />
            </ListItemIcon>
            <ListItemText
              primary="Changer le mot de passe"
              secondary="Mettre à jour votre mot de passe"
            />
            <Button
              variant="outlined"
              sx={{
                color: '#9333EA',
                borderColor: '#9333EA',
                '&:hover': {
                  borderColor: '#7928CA',
                  backgroundColor: 'rgba(147, 51, 234, 0.04)',
                },
              }}
            >
              Modifier
            </Button>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <DeleteIcon sx={{ color: '#9333EA' }} />
            </ListItemIcon>
            <ListItemText
              primary="Supprimer le compte"
              secondary="Supprimer définitivement votre compte et toutes vos données"
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenDeleteDialog(true)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.04)',
                },
              }}
            >
              Supprimer
            </Button>
          </ListItem>
        </List>
      </Paper>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle>Supprimer le compte</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Pour confirmer, veuillez taper "SUPPRIMER" ci-dessous :
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="SUPPRIMER"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={deleteConfirmation !== 'SUPPRIMER'}
            color="error"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.04)',
              },
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentSettingsTab; 