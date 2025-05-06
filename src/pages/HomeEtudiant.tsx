import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Card, CardContent, CardMedia } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
//import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
//import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HomeEtudiant: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Comment fonctionne Stujob ?",
      answer: "Créez votre profil, indiquez vos compétences et centres d'intérêt, et nous vous mettons en relation avec des entreprises qui correspondent à votre profil."
    },
    {
      question: "Quels types de missions sont disponibles ?",
      answer: "Des missions variées dans différents secteurs : marketing, développement, communication, événementiel, et bien d'autres selon vos compétences."
    },
    {
      question: "Comment sont rémunérées les missions ?",
      answer: "Les rémunérations varient selon le type de mission et votre niveau d'expérience. Tous les détails sont précisés dans les offres."
    },
    {
      question: "Puis-je cumuler avec mes études ?",
      answer: "Absolument ! Les missions sont adaptées à votre emploi du temps et vos disponibilités."
    }
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff' }}>
      {/* Section Hero */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2,
            mt: 3
          }}>
          Étudiant·e, révèle ton potentiel avec Stujob !
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: '#666', maxWidth: '800px', mx: 'auto' }}>
          Plus qu'un simple travail, une opportunité de te révéler et de grandir professionnellement
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            component={RouterLink}
            to="/etudiants"
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
            Rejoindre le réseau étudiant
          </Button>
          <Button
            component={RouterLink}
            to="/offres"
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
            Découvrir les offres
          </Button>
        </Box>
      </Container>

      {/* Section Ce que tu y gagnes */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ mb: 4, color: '#1F1F1F' }}>
              Ce que tu y gagnes
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              Chez Stujob, nous croyons que chaque étudiant a un potentiel unique à révéler. Nous ne nous contentons pas de te trouver un job, nous t'aidons à te développer professionnellement et personnellement.
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              • Une expérience professionnelle enrichissante
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              • Un réseau professionnel qui grandit
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              • Des compétences concrètes et valorisables
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              • Des opportunités de développement
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="400"
                image="/images/student-success.jpg"
                alt="Étudiant en situation de réussite"
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Section Mise en avant de la personne */}
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: '#FDF8FF' }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, color: '#1F1F1F' }}>
          Plus qu'un CV, une personnalité
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: 'transparent' }}>
              <CardContent>
                <Box sx={{ 
                  color: '#9333EA',
                  fontSize: '2rem',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#F3E8FF'
                }}>
                  <PersonIcon />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: '#1F1F1F' }}>
                  Ta personnalité compte
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Nous valorisons qui tu es, pas seulement ce que tu sais faire. Ta personnalité et tes valeurs sont essentielles.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: 'transparent' }}>
              <CardContent>
                <Box sx={{ 
                  color: '#FF4D8D',
                  fontSize: '2rem',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#FFE8F3'
                }}>
                  <WorkIcon />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: '#1F1F1F' }}>
                  Ton développement
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Nous t'accompagnons dans ton développement professionnel et personnel.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: 'transparent' }}>
              <CardContent>
                <Box sx={{ 
                  color: '#FF6B6B',
                  fontSize: '2rem',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#FFE8E8'
                }}>
                  <HandshakeIcon />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: '#1F1F1F' }}>
                  Ton réseau
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Construis ton réseau professionnel et développe des relations durables.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Section Types de jobs */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, color: '#1F1F1F' }}>
          Des opportunités dans tous les secteurs
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: '#FDF8FF', borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: '#9333EA' }}>
                  Secteurs d'activité
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Marketing & Communication
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Développement & IT
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Événementiel
                </Typography>
                <Typography variant="body1">
                  • Et bien d'autres...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: '#FDF8FF', borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: '#FF4D8D' }}>
                  Types de missions
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Stages
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Jobs étudiants
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Projets ponctuels
                </Typography>
                <Typography variant="body1">
                  • Alternances
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Section FAQ */}
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: '#FDF8FF' }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, color: '#1F1F1F' }}>
          Questions fréquentes
        </Typography>
        <Grid container spacing={3} sx={{ maxWidth: 800, mx: 'auto' }}>
          {faqItems.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Button
                fullWidth
                onClick={() => handleToggle(index)}
                sx={{
                  mb: expandedIndex === index ? 0 : 2,
                  p: 2,
                  textAlign: 'left',
                  background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: expandedIndex === index ? '8px 8px 0 0' : 2,
                  justifyContent: 'space-between',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #8929BD 0%, #E6447E 100%)',
                  }
                }}
                endIcon={<ExpandMoreIcon sx={{ 
                  transform: expandedIndex === index ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.3s'
                }} />}
              >
                {item.question}
              </Button>
              <Box sx={{
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                maxHeight: expandedIndex === index ? '200px' : '0px',
                opacity: expandedIndex === index ? 1 : 0,
              }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2,
                    mb: 2,
                    background: '#FDF8FF',
                    borderRadius: '0 0 8px 8px',
                    borderLeft: '4px solid #9333EA',
                  }}
                >
                  <Typography sx={{ color: '#666' }}>{item.answer}</Typography>
                </Paper>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Section Contact */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ 
          p: 6, 
          textAlign: 'center', 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #9333EA11 0%, #FF4D8D11 100%)',
          mb: 8 
        }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Une question ? Contacte-nous !
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', color: '#666' }}>
            Notre équipe est là pour t'accompagner dans ta recherche de mission
          </Typography>
          <Button
            component={RouterLink}
            to="/contact"
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
            Nous contacter
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomeEtudiant; 