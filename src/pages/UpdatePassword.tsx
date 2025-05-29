import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      // Rediriger vers la page de connexion avec un message de succès
      navigate('/login', {
        state: { message: 'Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.' }
      });
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour du mot de passe');
    } finally {
      setLoading(false);
    }
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
          Mettre à jour votre mot de passe
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Confirmer le mot de passe"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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
            Mettre à jour le mot de passe
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default UpdatePassword; 