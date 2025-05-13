import React from 'react';
import { Box, LinearProgress } from '@mui/material';

interface ProfileCompletionProgressBarProps {
  value: number;
}

const ProfileCompletionProgressBar: React.FC<ProfileCompletionProgressBarProps> = ({ value }) => (
  <Box sx={{ width: '100%' }}>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
        '& .MuiLinearProgress-bar': {
          background: 'linear-gradient(90deg, #673ab7 0%, #9c27b0 100%)',
          borderRadius: 4,
        },
      }}
    />
  </Box>
);

export default ProfileCompletionProgressBar; 