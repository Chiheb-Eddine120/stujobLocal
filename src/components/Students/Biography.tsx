import React from 'react';
import { Paper, Typography } from '@mui/material';

interface BiographyProps {
  biographie?: string;
}

const Biography: React.FC<BiographyProps> = ({ biographie }) => {
  if (!biographie) return null;
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: '#FDF8FF', border: '1px solid #F3E8FF', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Biographie
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
        {biographie}
      </Typography>
    </Paper>
  );
};

export default Biography; 