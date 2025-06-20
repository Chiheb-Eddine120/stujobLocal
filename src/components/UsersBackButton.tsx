import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const UsersBackButton: React.FC = () => (
  <Box sx={{ position: 'absolute', top: 16, right: 24 }}>
    <Button
      component={RouterLink}
      to="/dashboard/users"
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      sx={{
        borderRadius: '50px',
        color: '#9333EA',
        borderColor: '#9333EA',
        background: 'transparent',
        '&:hover': {
          borderColor: '#7928CA',
          background: 'rgba(147, 51, 234, 0.04)',
        },
      }}
    >
      Retour à la gestion des utilisateurs
    </Button>
  </Box>
);

export default UsersBackButton; 