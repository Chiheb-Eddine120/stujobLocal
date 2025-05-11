import React, { useState } from 'react';
import { Box, Button, Snackbar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <Button
        variant="contained"
        startIcon={<TrendingUpIcon />}
        sx={{ background: 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)', color: 'white', fontWeight: 600 }}
        onClick={() => handleClick('Fonctionnalité à venir : mise à jour du CV')}
      >
        Mettre à jour mon CV
      </Button>
      <Button
        variant="outlined"
        startIcon={<CheckCircleIcon />}
        sx={{ color: '#9333EA', borderColor: '#9333EA', fontWeight: 600 }}
        onClick={() => handleClick('Fonctionnalité à venir : voir mes candidatures')}
      >
        Voir mes candidatures
      </Button>
      <Button
        variant="outlined"
        startIcon={<WarningIcon />}
        sx={{ color: '#9333EA', borderColor: '#9333EA', fontWeight: 600 }}
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