import React, { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ReportProblemDialog from '../ReportProblemDialog';
import { authService } from '../../services/authService';

const ReportProblemButton: React.FC = () => {
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string | undefined>(undefined);

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
    <>
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
    </>
  );
};

export default ReportProblemButton; 