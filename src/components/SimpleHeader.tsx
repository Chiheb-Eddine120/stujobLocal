import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const SimpleHeader: React.FC = () => {
  return (
    <Box sx={{ width: '100%', mt: 4, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        component={RouterLink}
        to="/etudiants"
        sx={{
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 900,
              fontSize: { xs: 32, md: 40 },
              color: '#9333EA',
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            StuJob
          </Typography>
          <Box
            sx={{
              width: 20,
              height: 20,
              background: '#9333EA',
              transform: 'rotate(45deg)',
              ml: 1,
              mb: 1,
              display: 'inline-block',
            }}
          />
        </Box>
        <Typography
          sx={{
            fontFamily: 'Pacifico, cursive',
            fontWeight: 400,
            fontSize: { xs: 22, md: 28 },
            color: '#9333EA',
            mt: 0.5,
            textShadow: '0 2px 8px rgba(0,0,0,0.10)',
            fontStyle: 'italic',
            lineHeight: 1.2,
          }}
        >
          For Students
        </Typography>
      </Box>
    </Box>
  );
};

export default SimpleHeader; 