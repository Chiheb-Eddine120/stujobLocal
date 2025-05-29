import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Card, CardContent, CardMedia } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import HandshakeIcon from '@mui/icons-material/Handshake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { authService } from '../services/authService';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const Home: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  //const isDarkMode = muiTheme.palette.mode === 'dark';

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const isAuthenticated = await authService.isAuthenticated();
        if (isAuthenticated) {
          const user = await authService.getCurrentUser();
          if (user?.role === 'student') {
            navigate('/home-etudiant');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
      }
    };
    checkUserRole();
  }, [navigate]);

  const faqItems = [
    {
      question: "Qui peut faire appel à Stujob ?",
      answer: "Toute entreprise ayant besoin des services d'un étudiant."
    },
    {
      question: "Quelles missions sont possibles ?",
      answer: "De nombreux types de missions sont possibles, adaptées aux compétences des étudiants."
    },
    {
      question: "Comment sont choisis les étudiants ?",
      answer: "Les étudiants sont sélectionnés selon leurs compétences et leur disponibilité."
    },
    {
      question: "Qui peut utiliser Stujob ?",
      answer: "Le service est ouvert aux entreprises de toutes tailles."
    },
    {
      question: "Vais-je devoir lire des CV ?",
      answer: "Non, nous nous occupons de la sélection pour vous."
    },
    {
      question: "Combien ça coûte ?",
      answer: "Les tarifs varient selon le type de mission."
    }
  ];

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ bgcolor: '#ffffff' }}>
      {/* Hero Section */}
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
          Stujob : Votre partenaire pour l'emploi étudiant
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: '#666', maxWidth: '800px', mx: 'auto' }}>
          La plateforme qui connecte les entreprises aux meilleurs talents étudiants
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
      </Container>

      {/* Qui sommes-nous Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ mb: 4, color: '#1F1F1F' }}>
              Qui sommes-nous ?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              Stujob est une plateforme innovante spécialisée dans la mise en relation entre entreprises et étudiants. Notre mission est de faciliter l'accès au marché du travail pour les étudiants tout en offrant aux entreprises un accès privilégié à des talents prometteurs.
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Notre approche unique repose sur une compréhension approfondie des besoins spécifiques de chaque entreprise, tant au niveau des compétences techniques que des valeurs culturelles. Nous nous efforçons de trouver l'étudiant idéal qui correspondra parfaitement à votre vision et à vos exigences.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="400"
                image="/images/team-meeting.jpg"
                alt="Équipe Stujob"
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Nos Services Section */}
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: '#FDF8FF' }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, color: '#1F1F1F' }}>
          Nos Services
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 6, maxWidth: '800px', mx: 'auto', color: '#666' }}>
          Nous ne nous contentons pas de faire correspondre des compétences. Nous analysons en profondeur vos besoins, votre culture d'entreprise et vos valeurs pour trouver l'étudiant qui s'intégrera parfaitement dans votre équipe.
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
                  <WorkIcon />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: '#1F1F1F' }}>
                  Recrutement Ciblé
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Nous sélectionnons les meilleurs profils étudiants selon vos critères spécifiques et vos besoins.
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
                  <HandshakeIcon />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: '#1F1F1F' }}>
                  Accompagnement Personnalisé
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Un suivi personnalisé tout au long du processus de recrutement pour garantir votre satisfaction.
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
                  <TrendingUpIcon />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: '#1F1F1F' }}>
                  Solutions Flexibles
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Des solutions adaptées à vos besoins, que ce soit pour un stage, un CDD ou un CDI.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Comment ça marche Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, color: '#1F1F1F' }}>
          Comment ça marche ?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: '#FDF8FF', borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#9333EA', mb: 2 }}>1</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>Créez votre demande</Typography>
                <Typography variant="body1" color="text.secondary">
                  Décrivez votre besoin et vos critères de sélection
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: '#FDF8FF', borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#FF4D8D', mb: 2 }}>2</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>Nous sélectionnons</Typography>
                <Typography variant="body1" color="text.secondary">
                  Notre équipe analyse et sélectionne les meilleurs profils
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: '#FDF8FF', borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#FF6B6B', mb: 2 }}>3</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>Vous recrutez</Typography>
                <Typography variant="body1" color="text.secondary">
                  Rencontrez les candidats présélectionnés et faites votre choix
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Pourquoi nous Section */}
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: '#FDF8FF' }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, color: '#1F1F1F' }}>
          Pourquoi choisir Stujob ?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: 'white', borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: '#9333EA' }}>
                  Nos différences
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Expertise dans le recrutement étudiant
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Sélection rigoureuse basée sur les compétences ET les valeurs
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Accompagnement personnalisé
                </Typography>
                <Typography variant="body1">
                  • Tarifs compétitifs et transparents
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: '100%', bgcolor: 'white', borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: '#FF4D8D' }}>
                  Avantages par rapport aux autres solutions
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Plus rapide qu'une agence d'intérim traditionnelle
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Plus fiable qu'une marketplace classique
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • Meilleure qualité de profils
                </Typography>
                <Typography variant="body1">
                  • Service sur-mesure adapté à vos besoins
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>


      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ 
          p: 6, 
          textAlign: 'center', 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #9333EA11 0%, #FF4D8D11 100%)',
          mb: 8 
        }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Prêt à trouver l'étudiant idéal ?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', color: '#666' }}>
            Découvrez comment notre approche personnalisée peut vous aider à trouver le candidat parfait, qui correspondra à la fois à vos besoins techniques et à votre culture d'entreprise.
          </Typography>
          <Button
            component="a"
            href="https://calendly.com/contact-stujob"
            target="_blank"
            variant="contained"
            startIcon={<CalendarTodayIcon />}
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
            Prendre rendez-vous
          </Button>
        </Paper>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            color: '#9333EA',
            fontWeight: 600
          }}>
          Questions fréquentes
        </Typography>
        <Grid container spacing={3} sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Grid item xs={12} md={6}>
            {faqItems.slice(0, 3).map((item, index) => (
              <Box key={index}>
                <Button
                  fullWidth
                  onClick={() => handleToggle(index)}
                  sx={{
                    mb: expandedIndex === index ? 0 : 2,
                    p: 2,
                    textAlign: 'left',
                    background: 'linear-gradient(90deg, #9333EA 0%, #B724BB 100%)',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: expandedIndex === index ? '8px 8px 0 0' : 2,
                    justifyContent: 'space-between',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #8929BD 0%, #A31FA6 100%)',
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
                      background: muiTheme.palette.background.paper,
                      borderRadius: '0 0 8px 8px',
                      borderLeft: `4px solid ${muiTheme.palette.primary.main}`,
                      border: `1px solid ${muiTheme.palette.divider}`,
                      color: muiTheme.palette.text.primary,
                      transform: expandedIndex === index ? 'translateY(0)' : 'translateY(-20px)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    <Typography sx={{ color: muiTheme.palette.text.secondary }}>{item.answer}</Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            {faqItems.slice(3).map((item, index) => (
              <Box key={index + 3}>
                <Button
                  fullWidth
                  onClick={() => handleToggle(index + 3)}
                  sx={{
                    mb: expandedIndex === index + 3 ? 0 : 2,
                    p: 2,
                    textAlign: 'left',
                    background: 'linear-gradient(90deg, #B724BB 0%, #FF4D8D 100%)',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: expandedIndex === index + 3 ? '8px 8px 0 0' : 2,
                    justifyContent: 'space-between',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #A31FA6 0%, #E6447E 100%)',
                    }
                  }}
                  endIcon={<ExpandMoreIcon sx={{ 
                    transform: expandedIndex === index + 3 ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.3s'
                  }} />}
                >
                  {item.question}
                </Button>
                <Box sx={{
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  maxHeight: expandedIndex === index + 3 ? '200px' : '0px',
                  opacity: expandedIndex === index + 3 ? 1 : 0,
                }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      mb: 2,
                      background: muiTheme.palette.background.paper,
                      borderRadius: '0 0 8px 8px',
                      borderLeft: `4px solid ${muiTheme.palette.primary.main}`,
                      border: `1px solid ${muiTheme.palette.divider}`,
                      color: muiTheme.palette.text.primary,
                      transform: expandedIndex === index + 3 ? 'translateY(0)' : 'translateY(-20px)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    <Typography sx={{ color: muiTheme.palette.text.secondary }}>{item.answer}</Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;