import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            Stujob
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/demande"
            >
              Faire une demande
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/suivi"
            >
              Suivre une demande
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/etudiants"
            >
              Étudiants
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/about"
            >
              À propos
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/contact"
            >
              Contact
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 