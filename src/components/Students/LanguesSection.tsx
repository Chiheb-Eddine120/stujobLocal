import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface Langue {
  nom: string;
  niveau?: string;
}

interface LanguesSectionProps {
  langues?: Langue[];
}

// Fonction pour convertir le niveau en nombre d'étoiles
const getStars = (niveau?: string) => {
  const n = Number(niveau);
  if (!isNaN(n) && n > 0) {
    return Array.from({ length: n }, (_, i) => (
      <StarIcon key={i} sx={{ color: '#FFB400', fontSize: 18, ml: 0.5 }} />
    ));
  }
  const map: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 5 };
  if (niveau && map[niveau.toUpperCase()]) {
    return Array.from({ length: map[niveau.toUpperCase()] }, (_, i) => (
      <StarIcon key={i} sx={{ color: '#FFB400', fontSize: 18, ml: 0.5 }} />
    ));
  }
  return null;
};

const LanguesSection: React.FC<LanguesSectionProps> = ({ langues }) => {
  if (!langues || langues.length === 0) return null;
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: '#FDF8FF', border: '1px solid #F3E8FF', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Langues
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {langues.map((langue, i) => (
          <Chip
            key={i}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {langue.nom}
                {getStars(langue.niveau)}
              </Box>
            }
            sx={{ bgcolor: '#E3E8FF', color: '#9333EA', fontWeight: 500 }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default LanguesSection; 