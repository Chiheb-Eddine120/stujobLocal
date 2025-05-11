import React from 'react';
import { Box, Chip, Paper, Typography } from '@mui/material';

interface Skill {
  label: string;
  niveau?: string;
}

interface SkillsTagsProps {
  competences?: Skill[];
}

const SkillsTags: React.FC<SkillsTagsProps> = ({ competences }) => {
  if (!competences || competences.length === 0) return null;
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: '#FDF8FF', border: '1px solid #F3E8FF', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Compétences
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {competences.map((comp, i) => (
          <Chip
            key={i}
            label={`${comp.label}${comp.niveau ? ` - ${comp.niveau}` : ''}`}
            sx={{ bgcolor: '#F3E8FF', color: '#9333EA', fontWeight: 500 }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default SkillsTags; 