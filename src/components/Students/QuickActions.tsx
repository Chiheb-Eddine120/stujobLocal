import React, { useState } from 'react';
import { Box, Button, Snackbar } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import ReportProblemDialog from '../ReportProblemDialog';
import { authService } from '../../services/authService';

const QuickActions: React.FC = () => {
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const handleClick = (message: string) => {
    setSnackbar(message);
  };

  const handleReportClick = async () => {
    try {
      const user = await authService.getCurrentUser();
      setUserEmail(user?.email || '');
      setUserId(user?.id);
    } catch {
      setUserEmail('');
      setUserId(undefined);
    }
    setReportOpen(true);
  };

  const handleClose = () => {
    setSnackbar(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Button
        variant="contained"
        startIcon={<DescriptionIcon />}
        sx={{
          minHeight: 40,
          padding: '8px 16px',
          borderRadius: '8px',
          backgroundColor: '#673ab7',
          color: 'white',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#5e35b1',
          },
        }}
        onClick={() => handleClick('Fonctionnalité à venir : mise à jour du CV')}
      >
        Mettre à jour mon CV
      </Button>
      <Button
        variant="outlined"
        startIcon={<AssignmentIcon />}
        sx={{
          minHeight: 40,
          padding: '8px 16px',
          borderRadius: '8px',
          borderColor: '#f0f0f0',
          backgroundColor: '#f0f0f0',
          color: '#333',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#e0e0e0',
            borderColor: '#e0e0e0',
          },
        }}
        onClick={() => handleClick('Fonctionnalité à venir : voir mes candidatures')}
      >
        Voir mes candidatures
      </Button>
      <Button
        variant="outlined"
        startIcon={<WarningIcon />}
        sx={{
          minHeight: 40,
          padding: '8px 16px',
          borderRadius: '8px',
          borderColor: '#f0f0f0',
          backgroundColor: '#f0f0f0',
          color: '#333',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#e0e0e0',
            borderColor: '#e0e0e0',
          },
        }}
        onClick={handleReportClick}
      >
        Signaler un problème
      </Button>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2500}
        onClose={handleClose}
        message={snackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      <ReportProblemDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        userEmail={userEmail}
        userId={userId}
      />
    </Box>
  );
};

export default QuickActions; 