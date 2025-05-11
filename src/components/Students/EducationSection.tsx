import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface EducationSectionProps {
  niveau_etudes?: string;
  ecole?: string;
}

const EducationSection: React.FC<EducationSectionProps> = ({ niveau_etudes, ecole }) => {
  if (!niveau_etudes && !ecole) return null;
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: '#FDF8FF', border: '1px solid #F3E8FF', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Formation
      </Typography>
      <Box sx={{ pl: 2 }}>
        {niveau_etudes && (
          <Typography variant="body1" paragraph>
            {niveau_etudes}
          </Typography>
        )}
        {ecole && (
          <Typography variant="body1" color="text.secondary">
            École: {ecole}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default EducationSection; 