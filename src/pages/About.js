import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import PeopleIcon from '@mui/icons-material/People';
import SpeedIcon from '@mui/icons-material/Speed';

const About = () => {
  const values = [
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
        <Typography variant="h4" component="h1" gutterBottom align="center">
          À propos de Stujob
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            Notre histoire
          </Typography>
          <Typography variant="body1" paragraph>
            Stujob est né d'une observation simple : les entreprises ont besoin de trouver rapidement des étudiants fiables,
            et les étudiants cherchent des opportunités de travail flexibles adaptées à leur emploi du temps.
          </Typography>
          <Typography variant="body1" paragraph>
            Fondé en 2024, notre projet a pour ambition de simplifier la mise en relation entre entreprises et étudiants,
            en proposant un service personnalisé et efficace.
          </Typography>
        </Paper>

        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
          Nos valeurs
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {values.map((value, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {value.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Notre équipe
          </Typography>
          <Typography variant="body1" paragraph>
            Stujob est porté par une équipe passionnée, déterminée à révolutionner le recrutement étudiant.
            Notre expertise dans le domaine du recrutement et notre connaissance du monde étudiant nous permettent
            d'offrir un service sur mesure à nos clients.
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Nos partenaires
          </Typography>
          <Typography variant="body1" paragraph>
            Stujob est fier d'être accompagné par YNCUBATOR, un incubateur qui nous permet de développer
            notre projet dans les meilleures conditions.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default About; 