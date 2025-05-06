import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HandshakeIcon from '@mui/icons-material/Handshake';

const HomeEtudiant: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#ffffff' }}>
      {/* Section Hero */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2,
            mt: 3
          }}>
          Étudiant·e, trouve ta prochaine mission avec Stujob !
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#666', maxWidth: '600px', mx: 'auto' }}>
          Découvre des opportunités de jobs étudiants adaptées à ton profil, développe tes compétences et enrichis ton expérience professionnelle en toute simplicité.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            component={RouterLink}
            to="/offres"
            variant="contained"
            sx={{
              bgcolor: '#9333EA',
              borderRadius: '25px',
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: '#7928CA'
              }
            }}
          >
            Voir les offres
          </Button>
          <Button
            component={RouterLink}
            to="/profil-etudiant"
            variant="outlined"
            sx={{
              borderColor: '#9333EA',
              color: '#9333EA',
              borderRadius: '25px',
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: '#7928CA',
                color: '#7928CA',
                bgcolor: 'rgba(147, 51, 234, 0.04)'
              }
            }}
          >
            Créer mon profil
          </Button>
        </Box>
      </Container>

      {/* Section Avantages */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2"
          sx={{
            textAlign: 'center',
            mb: 8,
            color: '#1F1F1F',
            fontSize: '2.5rem',
            fontWeight: 600
          }}>
          Pourquoi choisir Stujob ?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                background: '#FDF8FF',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2
              }}
            >
              <Box sx={{
                color: '#9333EA',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#F3E8FF'
              }}>
                <SchoolIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                Missions variées
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accède à des jobs étudiants dans de nombreux secteurs selon tes envies et compétences.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                background: '#FDF8FF',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2
              }}
            >
              <Box sx={{
                color: '#FF4D8D',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#FFE8F3'
              }}>
                <WorkIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                Expérience valorisée
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Développe ton CV et tes compétences grâce à des missions concrètes et enrichissantes.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                background: '#FDF8FF',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2
              }}
            >
              <Box sx={{
                color: '#00B894',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#E0F7F1'
              }}>
                <TrendingUpIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                Flexibilité
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choisis tes missions selon ton emploi du temps et tes disponibilités.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                background: '#FDF8FF',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2
              }}
            >
              <Box sx={{
                color: '#E355A3',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#FFE8F3'
              }}>
                <HandshakeIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                Accompagnement
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Notre équipe t'accompagne à chaque étape pour t'aider à réussir tes missions.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomeEtudiant; 