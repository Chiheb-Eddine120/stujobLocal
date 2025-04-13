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

const Home = () => {
  const navigate = useNavigate();

  const features = [
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
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Trouvez un étudiant fiable, sans perdre de temps
        </Typography>
        
        <Box sx={{ mt: 4, mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/demande')}
            sx={{ mr: 2 }}
          >
            Faire une demande
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<LocalShippingIcon />}
            onClick={() => navigate('/suivi')}
          >
            Suivre une demande
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 