import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import Logo from '../components/Logo';

const Sitemap: React.FC = () => {
  const pages = [
    { title: 'Accueil', path: '/' },
    { title: 'À propos', path: '/about' },
    { title: 'Contact', path: '/contact' },
    { title: 'Espace Étudiant', path: '/etudiants' },
    { title: 'Connexion', path: '/login' },
    { title: 'Inscription', path: '/register' },
    { title: 'Politique de Confidentialité', path: '/privacy' },
    { title: 'Conditions Générales d\'Utilisation', path: '/cgu' },
    { title: 'Conditions Générales de Vente', path: '/cgv' },
    { title: 'Politique des Cookies', path: '/cookies' },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Logo variant="students" />
        <Typography variant="h1" component="h1" sx={{ 
          mt: 2,
          fontWeight: 900,
          fontSize: { xs: 28, md: 36 },
          textAlign: 'center',
          background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Plan du Site
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F' }}>
          Pages Principales
        </Typography>
        <List>
          {pages.map((page) => (
            <ListItem key={page.path} sx={{ py: 1 }}>
              <ListItemText
                primary={
                  <Link
                    href={page.path}
                    sx={{
                      color: '#9333EA',
                      textDecoration: 'none',
                      fontSize: '1.1rem',
                      '&:hover': {
                        color: '#7928CA',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {page.title}
                  </Link>
                }
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="h2" sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: '#1F1F1F', mt: 4 }}>
          À propos des Sitemaps
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          Les sitemaps sont des fichiers qui aident les moteurs de recherche à mieux comprendre et indexer votre site web. Ils existent sous deux formats principaux :
        </Typography>
        <Typography variant="h3" sx={{ fontSize: 20, fontWeight: 600, mb: 2, color: '#1F1F1F', mt: 3 }}>
          Sitemap XML
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • Format technique utilisé par les moteurs de recherche<br/>
          • Contient des informations sur la fréquence de mise à jour et la priorité des pages<br/>
          • Aide à l'indexation automatique du site<br/>
          • Accessible à l'adresse : <Link href="/sitemap.xml" sx={{ color: '#9333EA' }}>/sitemap.xml</Link>
        </Typography>

        <Typography variant="h3" sx={{ fontSize: 20, fontWeight: 600, mb: 2, color: '#1F1F1F', mt: 3 }}>
          Sitemap HTML
        </Typography>
        <Typography paragraph sx={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>
          • Version conviviale pour les utilisateurs<br/>
          • Aide à la navigation sur le site<br/>
          • Liste toutes les pages importantes<br/>
          • Utile pour le référencement naturel (SEO)
        </Typography>
      </Paper>
    </Container>
  );
};

export default Sitemap; 