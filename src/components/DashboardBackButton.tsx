import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const DashboardBackButton: React.FC = () => (
  <Box sx={{ position: 'absolute', top: 16, right: 24 }}>
    <Button
      component={RouterLink}
      to="/dashboard"
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      sx={{
        borderRadius: '25px',
        background: 'white',
        '&:hover': {
          background: '#f5f5f5',
        },
      }}
    >
      Retour au Dashboard
    </Button>
  </Box>
);

export default DashboardBackButton; 