import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { supabase } from '../services/supabaseClient';

interface ReportProblemDialogProps {
  open: boolean;
  onClose: () => void;
  userEmail?: string;
  userId?: string;
}

const ReportProblemDialog: React.FC<ReportProblemDialogProps> = ({ open, onClose, userEmail = '', userId }) => {
  const [email, setEmail] = useState(userEmail);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { error } = await supabase.from('tickets').insert([
        {
          user_id: userId || null,
          email,
          message,
        }
      ]);
      if (error) throw error;
      setSuccess(true);
      setMessage('');
    } catch (err: any) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Signaler un problème</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {success && <Alert severity="success">Votre problème a bien été signalé. Merci !</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Décrivez votre problème"
            multiline
            minRows={4}
            fullWidth
            margin="normal"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={loading || !email || !message}>
            {loading ? <CircularProgress size={20} /> : 'Envoyer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReportProblemDialog; 