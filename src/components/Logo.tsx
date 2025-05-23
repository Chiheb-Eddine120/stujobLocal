import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface LogoProps {
  variant?: 'students' | 'partners';
  fontSize?: number | string;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'students', fontSize = 32, color = '#9333EA' }) => (
  <Box
    component={RouterLink}
    to="/"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mb: 2,
      cursor: 'pointer',
      textDecoration: 'none',
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        fontSize,
        letterSpacing: 0.5,
        color,
        display: 'flex',
        alignItems: 'center',
        mb: 0.5,
        textDecoration: 'none',
      }}
    >
      StuJob
      <Box component="span" sx={{ color, fontSize: fontSize, ml: 0.5, fontWeight: 700, position: 'relative', top: '-6px' }}>
        ◆
      </Box>
    </Typography>
    <Typography
      variant="subtitle1"
      sx={{
        color,
        fontSize: fontSize === 32 ? 22 : (typeof fontSize === 'number' ? fontSize / 1.5 : 22),
        fontWeight: 400,
        mt: -1,
        textDecoration: 'none',
      }}
    >
      {variant === 'partners' ? 'For Partners' : 'For Students'}
    </Typography>
  </Box>
);

export default Logo; 