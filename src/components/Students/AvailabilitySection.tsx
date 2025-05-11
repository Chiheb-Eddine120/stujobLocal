import React from 'react';
import { Paper, Typography, Box, Chip, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Disponibilite {
  jour: string;
  debut: string;
  fin: string;
}

interface AvailabilitySectionProps {
  disponibilites?: Disponibilite[];
}

const PERIODES_LABELS: { [key: string]: string } = {
  matin: 'Matin',
  apres_midi: 'Après-midi',
  soir: 'Soir',
  journee: 'Journée complète'
};

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({ disponibilites }) => {
  if (!disponibilites || disponibilites.length === 0) return null;

  // Grouper les disponibilités par jour
  const disponibilitesParJour = disponibilites.reduce((acc, dispo) => {
    if (!acc[dispo.jour]) {
      acc[dispo.jour] = [];
    }
    acc[dispo.jour].push(dispo.debut);
    return acc;
  }, {} as { [key: string]: string[] });

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: '#FDF8FF', border: '1px solid #F3E8FF', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AccessTimeIcon sx={{ color: '#9333EA', mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Disponibilités
        </Typography>
      </Box>
      <Stack spacing={1}>
        {Object.entries(disponibilitesParJour).map(([jour, periodes]) => (
          <Box key={jour}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#6B7280' }}>
              {jour}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {periodes.map((periode, index) => (
                <Chip
                  key={index}
                  label={PERIODES_LABELS[periode]}
                  size="small"
                  sx={{
                    bgcolor: '#F3E8FF',
                    color: '#9333EA',
                    '&:hover': {
                      bgcolor: '#E9D5FF'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default AvailabilitySection; 