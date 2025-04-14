import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Stujob
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Trouvez un étudiant fiable, sans perdre de temps.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="Facebook" color="primary">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" color="primary">
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="Instagram" color="primary">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Liens utiles
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Accueil
            </Link>
            <Link component={RouterLink} to="/demande" color="inherit" display="block" sx={{ mb: 1 }}>
              Faire une demande
            </Link>
            <Link component={RouterLink} to="/suivi" color="inherit" display="block" sx={{ mb: 1 }}>
              Suivre une demande
            </Link>
            <Link component={RouterLink} to="/etudiants" color="inherit" display="block" sx={{ mb: 1 }}>
              Étudiants
            </Link>
            <Link component={RouterLink} to="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              À propos
            </Link>
            <Link component={RouterLink} to="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
              Contact
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                contact@stujob.fr
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                +33 6 XX XX XX XX
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                Paris, France
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Stujob. Tous droits réservés.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 