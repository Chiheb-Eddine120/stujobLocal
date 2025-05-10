import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

interface ConfirmLogoutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmLogoutDialog: React.FC<ConfirmLogoutDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle>Confirmer la déconnexion</DialogTitle>
      <DialogContent>
        <Typography>Voulez-vous vraiment vous déconnecter&nbsp;?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          Annuler
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          startIcon={<LogoutIcon />}
        >
          Déconnexion
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmLogoutDialog; 