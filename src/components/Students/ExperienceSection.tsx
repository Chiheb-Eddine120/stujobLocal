import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';

interface Experience {
  titre: string;
  entreprise: string;
  date_debut: string;
  date_fin?: string;
  description?: string;
}

interface ExperienceSectionProps {
  experiences?: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  if (!experiences || experiences.length === 0) return null;
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: '#FDF8FF', border: '1px solid #F3E8FF', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Expériences
      </Typography>
      <Box>
        {experiences.map((exp, i) => (
          <Box key={i} sx={{ mb: i !== experiences.length - 1 ? 3 : 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {exp.titre}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {exp.entreprise} • {exp.date_debut} - {exp.date_fin || 'Présent'}
            </Typography>
            {exp.description && (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {exp.description}
              </Typography>
            )}
            {i !== experiences.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ExperienceSection; 