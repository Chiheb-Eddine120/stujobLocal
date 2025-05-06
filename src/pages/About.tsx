import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import PeopleIcon from '@mui/icons-material/People';
import SpeedIcon from '@mui/icons-material/Speed';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link as RouterLink } from 'react-router-dom';

interface Value {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const About: React.FC = () => {
  const values: Value[] = [
    {
      icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />,
      title: 'Simplicité',
      description: 'Une approche directe et efficace pour mettre en relation entreprises et étudiants.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Proximité',
      description: 'Un accompagnement personnalisé et une relation de confiance avec nos clients.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Efficacité',
      description: 'Des résultats rapides et concrets pour répondre aux besoins des entreprises.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 8,
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          borderRadius: 4,
          p: 6,
          color: 'white'
        }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            À propos de Stujob
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9 }}>
            La plateforme qui révolutionne le recrutement étudiant en Belgique
          </Typography>
        </Box>

        {/* Notre histoire */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#9333EA', fontWeight: 600 }}>
            Notre histoire
          </Typography>
          <Typography variant="body1" paragraph>
            Stujob est né d'une observation simple : les entreprises ont besoin de trouver rapidement des étudiants fiables,
            et les étudiants cherchent des opportunités de travail flexibles adaptées à leur emploi du temps.
          </Typography>
          <Typography variant="body1" paragraph>
            Fondé en 2024, notre projet a pour ambition de simplifier la mise en relation entre entreprises et étudiants,
            en proposant un service personnalisé et efficace. Notre plateforme est née de la conviction que le recrutement
            étudiant mérite une approche plus moderne et plus humaine.
          </Typography>
        </Paper>

        {/* Statistiques */}
        <Box sx={{ 
          background: 'linear-gradient(90deg, #9333EA11 0%, #FF4D8D11 100%)',
          borderRadius: 4,
          p: 6,
          mb: 6
        }}>
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#9333EA' }}>1000+</Typography>
              <Typography>Étudiants inscrits</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#FF4D8D' }}>500+</Typography>
              <Typography>Entreprises partenaires</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#9333EA' }}>2000+</Typography>
              <Typography>Missions réalisées</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#FF4D8D' }}>95%</Typography>
              <Typography>Taux de satisfaction</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Nos valeurs */}
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, color: '#1F1F1F', fontWeight: 600 }}>
          Nos valeurs
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {values.map((value, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ color: '#9333EA', mb: 2 }}>
                    {value.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1F1F1F', fontWeight: 600 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Notre approche */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#9333EA', fontWeight: 600 }}>
            Notre approche
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ color: '#9333EA', mr: 2 }} />
                <Typography variant="h6">Pour les entreprises</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                • Sélection rigoureuse des profils étudiants
              </Typography>
              <Typography variant="body1" paragraph>
                • Accompagnement personnalisé dans le recrutement
              </Typography>
              <Typography variant="body1" paragraph>
                • Solutions adaptées à vos besoins spécifiques
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ color: '#FF4D8D', mr: 2 }} />
                <Typography variant="h6">Pour les étudiants</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                • Opportunités de travail flexibles
              </Typography>
              <Typography variant="body1" paragraph>
                • Développement professionnel
              </Typography>
              <Typography variant="body1" paragraph>
                • Expérience enrichissante
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Notre équipe */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#9333EA', fontWeight: 600 }}>
            Notre équipe
          </Typography>
          <Typography variant="body1" paragraph>
            Stujob est porté par une équipe passionnée, déterminée à révolutionner le recrutement étudiant.
            Notre expertise dans le domaine du recrutement et notre connaissance du monde étudiant nous permettent
            d'offrir un service sur mesure à nos clients.
          </Typography>
          <Typography variant="body1" paragraph>
            Nous croyons en l'importance de créer des connexions significatives entre les entreprises et les étudiants,
            en mettant l'accent sur la qualité des relations et la satisfaction des deux parties.
          </Typography>
        </Paper>

        {/* Nos partenaires */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#9333EA', fontWeight: 600 }}>
            Nos partenaires
          </Typography>
          <Typography variant="body1" paragraph>
            Stujob est fier d'être accompagné par YNCUBATOR, un incubateur qui nous permet de développer
            notre projet dans les meilleures conditions. Cette collaboration nous permet d'offrir un service
            toujours plus innovant et adapté aux besoins du marché.
          </Typography>
        </Paper>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#1F1F1F', fontWeight: 600 }}>
            Prêt à rejoindre l'aventure Stujob ?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/demande"
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
              Créer une demande
            </Button>
            <Button
              component="a"
              href="https://calendly.com/contact-stujob"
              target="_blank"
              variant="outlined"
              startIcon={<CalendarTodayIcon />}
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
              Prendre rendez-vous
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default About; 