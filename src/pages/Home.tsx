import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Testimonials from '../components/Testimonials.tsx';
import Stats from '../components/Stats';
import FAQ from '../components/FAQ';

interface Feature {
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features: Feature[] = [
    {
      title: 'Mise en relation humaine',
      description: 'Un accompagnement personnalisé pour trouver le bon étudiant',
    },
    {
      title: 'Réponse rapide',
      description: 'Une réponse sous 24h pour toutes vos demandes',
    },
    {
      title: 'Pas de tri de CV',
      description: 'Nous vous présentons directement les candidats adaptés',
    },
  ];

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(45deg, #2563EB 30%, #60A5FA 90%)',
          color: 'white',
          py: 8,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Trouvez un étudiant fiable, sans perdre de temps
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                La solution simple pour recruter des étudiants motivés
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  onClick={() => navigate('/demande')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  Faire une demande
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<LocalShippingIcon />}
                  onClick={() => navigate('/suivi')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Suivre une demande
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.png"
                alt="Illustration"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Stats />
      <Testimonials />
      <FAQ />
    </>
  );
};

export default Home; 