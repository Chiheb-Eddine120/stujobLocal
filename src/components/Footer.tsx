import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer: React.FC = () => {
  const linkStyle = { color: 'white', opacity: 0.9, textDecoration: 'none', '&:hover': { opacity: 1 } };

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 3,
        mt: 'auto',
        background: 'linear-gradient(90deg, #9333EA 0%, #E355A3 50%, #FF8366 100%)',
        borderRadius: '30px',
        mx: 3,
        mb: 3,
        color: 'white'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Logo et description */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  '&::after': {
                    content: '""',
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'white',
                    transform: 'rotate(45deg)',
                    marginLeft: '6px',
                    marginBottom: '24px'
                  }
                }}
              >
                StuJob
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Trouvez un étudiant fiable, sans perdre de temps.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton 
                  aria-label="LinkedIn"
                  href="https://www.linkedin.com/company/stujob-official?trk=blended-typeahead"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: 'white',
                    p: 1,
                    '& svg': {
                      fontSize: '2.4rem'
                    },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton 
                  aria-label="Instagram"
                  href="https://www.instagram.com/stujob_official?igsh=MWVtYmtsYmV5NHUzeA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: 'white',
                    p: 1,
                    '& svg': {
                      fontSize: '2.4rem'
                    },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton 
                  aria-label="Facebook"
                  href="https://www.facebook.com/share/16gQdq1Z8d/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: 'white',
                    p: 1,
                    '& svg': {
                      fontSize: '2.4rem'
                    },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                >
                  <FacebookIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Pages */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2, fontSize: '1.25rem' }}>
              Pages
            </Typography>
            <Stack spacing={2}>
              <Link component={RouterLink} to="/" sx={{ ...linkStyle, fontSize: '1rem' }}>
                Accueil
              </Link>
              <Link component={RouterLink} to="/about" sx={{ ...linkStyle, fontSize: '1rem' }}>
                À propos
              </Link>
              <Link component={RouterLink} to="/contact" sx={{ ...linkStyle, fontSize: '1rem' }}>
                Contact
              </Link>
              <Link component={RouterLink} to="/privacy" sx={{ ...linkStyle, fontSize: '1rem' }}>
                Confidentialité
              </Link>
              <Link component={RouterLink} to="/terms" sx={{ ...linkStyle, fontSize: '1rem' }}>
                CGV/CGU
              </Link>
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2, fontSize: '1.25rem' }}>
              Contact
            </Typography>
            <Stack spacing={2}>
              <Typography sx={{ color: 'white', opacity: 0.9, fontSize: '1rem' }}>
                contact@stujob.be
              </Typography>
              <Typography sx={{ color: 'white', opacity: 0.9, fontSize: '1rem' }}>
                +33 6 XX XX XX XX
              </Typography>
              <Typography sx={{ color: 'white', opacity: 0.9, fontSize: '1rem' }}>
                Av. du Ciseau 15, 1348
              </Typography>
              <Typography sx={{ color: 'white', opacity: 0.9, fontSize: '1rem' }}>
                Ottignies-Louvain-la-Neuve
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;