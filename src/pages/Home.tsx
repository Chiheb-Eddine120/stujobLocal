import React, { useState } from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import HandshakeIcon from '@mui/icons-material/Handshake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Home: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Qui peut faire appel à Stujob ?",
      answer: "Toute personne ou entreprise ayant besoin des services d'un étudiant."
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
      answer: "Le service est ouvert aux entreprises et aux particuliers."
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
        <Typography variant="h3" component="h1" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2
          }}>
          Trouvez un étudiant fiable,
        </Typography>
        <Typography variant="h3" component="h1" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 4
          }}>
          sans perdre de temps
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#666', maxWidth: '600px', mx: 'auto' }}>
          Chez Stujob, nous vous simplifions la recherche d'un étudiant motivé et disponible. Dites-nous ce dont vous avez besoin, nous trouverons la bonne personne, sans perte de temps.
        </Typography>
        <Button
          component={RouterLink}
          to="/demande"
          variant="contained"
          sx={{
            bgcolor: '#9333EA',
            borderRadius: '25px',
            px: 4,
            py: 1.5,
            '&:hover': {
              bgcolor: '#7928CA'
            }
          }}
        >
          Introduire une demande
        </Button>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" 
          sx={{ 
            textAlign: 'center', 
            mb: 8,
            color: '#1F1F1F',
            fontSize: '2.5rem',
            fontWeight: 600
          }}>
          Nos services
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
                <WorkIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                Offres d'emploi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trouvez des opportunités adaptées à votre profil et à vos compétences
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
                <SchoolIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                Profils étudiants
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Découvrez des talents prometteurs pour votre projet d'entreprise
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
                color: '#FF6B6B',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#FFE8E8'
              }}>
                <HandshakeIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                Mise en relation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Notre algorithme vous aide à trouver le candidat idéal pour vos besoins
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
                <TrendingUpIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F1F1F' }}>
                Suivi personnalisé
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accompagnement tout au long du processus de recrutement
              </Typography>
            </Paper>
          </Grid>
        </Grid>
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
                      background: '#FDF8FF',
                      borderRadius: '0 0 8px 8px',
                      borderLeft: '4px solid #9333EA',
                      transform: expandedIndex === index ? 'translateY(0)' : 'translateY(-20px)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    <Typography sx={{ color: '#666' }}>{item.answer}</Typography>
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
                      background: '#FDF8FF',
                      borderRadius: '0 0 8px 8px',
                      borderLeft: '4px solid #FF4D8D',
                      transform: expandedIndex === index + 3 ? 'translateY(0)' : 'translateY(-20px)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    <Typography sx={{ color: '#666' }}>{item.answer}</Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Container>

      {/* Section CTA */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ 
          p: 6, 
          textAlign: 'center', 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #9333EA11 0%, #FF4D8D11 100%)',
          mb: 8 
        }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Prêt à commencer ?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', color: '#666' }}>
            Que vous soyez une entreprise à la recherche de talents ou un étudiant cherchant une opportunité, Stujob est là pour vous accompagner dans votre démarche.
          </Typography>
          <Button
            component={RouterLink}
            to="/demande"
            variant="contained"
            sx={{
              bgcolor: '#9333EA',
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: '#7928CA'
              }
            }}
          >
            Créer une demande
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;