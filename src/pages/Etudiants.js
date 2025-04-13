import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EuroIcon from '@mui/icons-material/Euro';
import PersonIcon from '@mui/icons-material/Person';

const Etudiants = () => {
  const features = [
    {
      icon: <WorkIcon />,
      title: 'Missions variées',
      description: 'Des opportunités dans différents secteurs d\'activité',
    },
    {
      icon: <SchoolIcon />,
      title: 'Flexibilité',
      description: 'Adapté à votre emploi du temps étudiant',
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Gain de temps',
      description: 'Nous gérons la recherche de missions pour vous',
    },
    {
      icon: <EuroIcon />,
      title: 'Rémunération attractive',
      description: 'Des tarifs compétitifs pour vos services',
    },
  ];

  const handleJoinClick = () => {
    // Redirection vers le formulaire Google (à remplacer par votre lien)
    window.open('https://forms.gle/your-form-link', '_blank');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Rejoignez notre réseau d'étudiants
        </Typography>
        
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Devenez un étudiant Stujob et accédez à des opportunités de travail flexibles
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Comment ça marche ?
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="1. Inscription"
                secondary="Remplissez notre formulaire d'inscription pour rejoindre le réseau"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WorkIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="2. Validation du profil"
                secondary="Nous vérifions vos informations et validons votre profil"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SchoolIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="3. Mise en relation"
                secondary="Nous vous proposons des missions adaptées à votre profil"
              />
            </ListItem>
          </List>
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleJoinClick}
            sx={{ px: 4, py: 2 }}
          >
            Je suis étudiant, je veux faire partie du réseau
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Etudiants; 