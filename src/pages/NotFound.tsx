import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%',
            maxWidth: 500,
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: '6rem',
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
            }}
          >
            404
          </Typography>
          
          <Typography
            variant="h4"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 2,
            }}
          >
            Page non trouvée
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 4,
            }}
          >
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ px: 4 }}
            >
              Retour
            </Button>
            
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ px: 4 }}
            >
              Accueil
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound; 