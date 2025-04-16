import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Work as WorkIcon, 
  School as SchoolIcon, 
  Handshake as HandshakeIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import Testimonials from '../components/Testimonials.tsx';
import Stats from '../components/Stats';
import FAQ from '../components/FAQ';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ 
        py: 8, 
        textAlign: 'center',
        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
        color: 'white',
        borderRadius: 2,
        mb: 6
      }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Stujob
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
          La plateforme qui connecte les étudiants aux opportunités professionnelles
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large" 
          component={RouterLink} 
          to="/demande"
          sx={{ mr: 2 }}
        >
          Faire une demande
        </Button>
        <Button 
          variant="outlined" 
          color="inherit" 
          size="large" 
          component={RouterLink} 
          to="/etudiants"
        >
          Voir les profils
        </Button>
      </Box>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Nos services
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <WorkIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Offres d'emploi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Trouvez des opportunités adaptées à votre profil et à vos compétences
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Profils étudiants
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Découvrez des talents prometteurs pour vos projets et missions
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <HandshakeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Mise en relation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Notre algorithme vous aide à trouver le meilleur match pour vos besoins
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Suivi personnalisé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accompagnement tout au long du processus de recrutement
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* CTA Section */}
      <Box sx={{ 
        py: 6, 
        textAlign: 'center',
        background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
        borderRadius: 2,
        mb: 6
      }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Prêt à commencer ?
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          Que vous soyez une entreprise à la recherche de talents ou un étudiant cherchant une opportunité,
          Stujob est là pour vous accompagner dans votre démarche.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          component={RouterLink} 
          to="/demande"
          sx={{ mr: 2 }}
        >
          Créer une demande
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large" 
          component={RouterLink} 
          to="/contact"
        >
          Nous contacter
        </Button>
      </Box>

      <Stats />
      <Testimonials />
      <FAQ />
    </Container>
  );
};

export default Home; 