import React from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';

interface ProfileCompletionProgressBarProps {
  value: number;
}

const ProfileCompletionProgressBar: React.FC<ProfileCompletionProgressBarProps> = ({ value }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Complétion du profil
      </Typography>
      <Tooltip title="Complétez votre profil pour augmenter vos chances d'être contacté !" arrow>
        <Typography variant="body2" sx={{ opacity: 0.9, cursor: 'help' }}>
          {Math.round(value)}% complété
        </Typography>
      </Tooltip>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        '& .MuiLinearProgress-bar': {
          backgroundColor: '#9333EA',
        },
      }}
    />
  </Box>
);

export default ProfileCompletionProgressBar; 