import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { authService } from '../services/authService';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const message = (location.state as any)?.message;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.signIn(formData.email, formData.password);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Email ou mot de passe incorrect');
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        py: 0,
      }}>
        <Box sx={{
          minWidth: 400,
          maxWidth: 500,
          width: { xs: '100%', md: 450 },
          minHeight: 340,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          p: { xs: 2, md: 3.5 },
          boxSizing: 'border-box',
        }}>
          <Logo variant="students" />
          <Box sx={{ height: 6 }} />
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 900, fontSize: { xs: 20, md: 26 }, mb: 1, lineHeight: 1.1 }}>
            Connexion
          </Typography>
          {message && (
            <Alert severity="success" sx={{ mb: 3, fontSize: 17 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3, fontSize: 17 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{ style: { fontSize: 18 } }}
              InputLabelProps={{ style: { fontSize: 18 } }}
            />
            <TextField
              required
              fullWidth
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{ style: { fontSize: 18 } }}
              InputLabelProps={{ style: { fontSize: 18 } }}
            />
            <Button
              variant="text"
              fullWidth
              onClick={() => navigate('/reset-password')}
              disabled={loading}
              sx={{ mb: 2, fontSize: 16, color: '#9333EA', textTransform: 'none', fontWeight: 500 }}
            >
              Mot de passe oublié ?
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ fontSize: 22, py: 2, borderRadius: 3 }}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={() => navigate('/register')}
              disabled={loading}
              sx={{ mt: 2, fontSize: 19 }}
            >
              Pas encore inscrit ? Créer un compte
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Login; 