import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { supabase } from '../services/supabase';
import Logo from '../components/Logo';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password',
    });
    if (error) {
      setError("Erreur lors de l'envoi du mail : " + error.message);
    } else {
      setSuccess('Un email de réinitialisation a été envoyé si ce compte existe.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      py: 0,
    }}>
      <Box sx={{
        minWidth: 520,
        maxWidth: 650,
        width: { xs: '100%', md: 600 },
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        p: { xs: 5, md: 8 },
        boxSizing: 'border-box',
      }}>
        <Logo variant="students" fontSize={32} />
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 900, fontSize: { xs: 28, md: 34 }, mb: 1, lineHeight: 1.1 }}>
          Réinitialiser le mot de passe
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ fontWeight: 600, fontSize: 20, py: 2, borderRadius: 3 }}
          >
            Envoyer le lien de réinitialisation
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword; 