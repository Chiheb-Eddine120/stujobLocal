import React from 'react';
import { Container, Typography, Box, Grid, Avatar } from '@mui/material';

const Brouillon: React.FC = () => {
  return (
    <>
      {/* Section Statistiques */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          borderRadius: 4,
          py: 6,
          px: 4,
          mb: 8,
          color: 'white',
        }}>
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>1000+</Typography>
              <Typography>Étudiants inscrits</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>500+</Typography>
              <Typography>Entreprises partenaires</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>2000+</Typography>
              <Typography>Missions réalisées</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>95%</Typography>
              <Typography>Taux de satisfaction</Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Section Témoignages */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" 
          sx={{ 
            textAlign: 'center', 
            mb: 8,
            fontSize: '2.5rem',
            fontWeight: 600
          }}>
          Ce qu'ils disent de nous
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 4, 
              background: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                {[1,2,3,4,5].map((star) => (
                  <span key={star} style={{ color: '#FFD700', marginRight: '4px' }}>★</span>
                ))}
              </Box>
              <Typography sx={{ mb: 3, fontStyle: 'italic', flex: 1 }}>
                "Grâce à Stujob, nous avons trouvé des étudiants motivés et fiables pour nos emplois saisonniers. Le processus est simple et efficace."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src="/path-to-image.jpg" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Marie Dubois</Typography>
                  <Typography variant="body2" color="text.secondary">Directrice RH, Restaurant Le Gourmet</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 4, 
              background: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                {[1,2,3,4,5].map((star) => (
                  <span key={star} style={{ color: '#FFD700', marginRight: '4px' }}>★</span>
                ))}
              </Box>
              <Typography sx={{ mb: 3, fontStyle: 'italic', flex: 1 }}>
                "J'ai trouvé plusieurs missions intéressantes qui correspondent parfaitement à mon emploi du temps étudiant. Un vrai gain de temps !"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src="/path-to-image.jpg" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Thomas Martin</Typography>
                  <Typography variant="body2" color="text.secondary">Étudiant en Marketing</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 4, 
              background: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                {[1,2,3,4,5].map((star) => (
                  <span key={star} style={{ color: '#FFD700', marginRight: '4px' }}>★</span>
                ))}
              </Box>
              <Typography sx={{ mb: 3, fontStyle: 'italic', flex: 1 }}>
                "La qualité des candidats proposés est excellente. Les étudiants sont bien préparés et professionnels dès le premier jour."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src="/path-to-image.jpg" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Gaspard Laurent</Typography>
                  <Typography variant="body2" color="text.secondary">Gérant, Boutique Fitness</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Brouillon; 