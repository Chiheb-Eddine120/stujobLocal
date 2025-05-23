import React from 'react';
import { Box, Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
//import ReportProblemButton from './ReportProblemButton';

interface QuickActionsProps {
  onGoToProfil?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onGoToProfil }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Button
        variant="contained"
        startIcon={<DescriptionIcon />}
        sx={{
          minHeight: 40,
          padding: '8px 16px',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, #ff5e62 0%, #ff9966 100%)',
          color: 'white',
          fontWeight: 600,
          '&:hover': {
            background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
          },
        }}
        onClick={onGoToProfil}
      >
        Mettre à jour mon profil
      </Button>
    </Box>
  );
};

export default QuickActions; 