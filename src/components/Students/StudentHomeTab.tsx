import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Profile, Etudiant } from '../../types';

interface StudentHomeTabProps {
  profile: Profile;
  etudiant: Etudiant;
}

const StudentHomeTab: React.FC<StudentHomeTabProps> = ({ profile, etudiant }) => {
  // Calcul du pourcentage de complétion du profil
  const calculateProfileCompletion = () => {
    const requiredFields = [
      etudiant.niveau_etudes,
      etudiant.ecole,
      etudiant.competences?.length,
      etudiant.langues?.length,
      etudiant.cv_file?.cv,
    ];

    const completedFields = requiredFields.filter(Boolean).length;
    return (completedFields / requiredFields.length) * 100;
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <Box>
      {/* En-tête avec résumé */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #9333EA 0%, #FF4D8D 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Bienvenue, {profile.prenom} !
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              {etudiant.niveau_etudes} à {etudiant.ecole}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {etudiant.competences?.slice(0, 3).map((competence, index) => (
                <Chip
                  key={index}
                  label={competence.nom}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Complétion du profil
              </Typography>
              <LinearProgress
                variant="determinate"
                value={profileCompletion}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                  },
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {Math.round(profileCompletion)}% complété
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistiques et actions rapides */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: '#FDF8FF',
              border: '1px solid #F3E8FF',
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Activité récente
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon sx={{ color: '#9333EA' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Nouvelle offre d'emploi"
                  secondary="Une offre correspond à votre profil"
                />
                <Chip
                  label="Nouveau"
                  size="small"
                  sx={{
                    backgroundColor: '#9333EA',
                    color: 'white',
                  }}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon sx={{ color: '#9333EA' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Profil mis à jour"
                  secondary="Vos compétences ont été mises à jour"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <StarIcon sx={{ color: '#9333EA' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Nouvelle recommandation"
                  secondary="Une entreprise a consulté votre profil"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: '#FDF8FF',
              border: '1px solid #F3E8FF',
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Actions rapides
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<TrendingUpIcon />}
                sx={{
                  backgroundColor: '#9333EA',
                  '&:hover': {
                    backgroundColor: '#7928CA',
                  },
                }}
              >
                Mettre à jour mon CV
              </Button>
              <Button
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                sx={{
                  color: '#9333EA',
                  borderColor: '#9333EA',
                  '&:hover': {
                    borderColor: '#7928CA',
                    backgroundColor: 'rgba(147, 51, 234, 0.04)',
                  },
                }}
              >
                Voir mes candidatures
              </Button>
              <Button
                variant="outlined"
                startIcon={<WarningIcon />}
                sx={{
                  color: '#9333EA',
                  borderColor: '#9333EA',
                  '&:hover': {
                    borderColor: '#7928CA',
                    backgroundColor: 'rgba(147, 51, 234, 0.04)',
                  },
                }}
              >
                Signaler un problème
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentHomeTab; 