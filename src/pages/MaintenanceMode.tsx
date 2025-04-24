import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const MaintenanceMode: React.FC = () => {
  const navigate = useNavigate();
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === import.meta.env.VITE_ADMIN_SECRET) {
      setShowLoginForm(true);
      setError(null);
    } else {
      setError('Clé secrète incorrecte');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Connexion avec Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Vérification du rôle admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData.role !== 'admin') {
        throw new Error('Accès non autorisé. Seuls les administrateurs peuvent se connecter.');
      }

      // Redirection vers le dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #FDF8FF 0%, #F3E8FF 100%)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 4,
            background: 'white',
            border: '1px solid #F3E8FF',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#9333EA' }}>
            Maintenance en cours
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
            Le site est actuellement en maintenance. Nous revenons très bientôt !
          </Typography>

          {!showAdminForm && !showLoginForm && (
            <Button
              variant="contained"
              onClick={() => setShowAdminForm(true)}
              sx={{
                bgcolor: '#9333EA',
                color: 'white',
                '&:hover': {
                  bgcolor: '#7E22CE',
                },
              }}
            >
              Se connecter (admin)
            </Button>
          )}

          {showAdminForm && !showLoginForm && (
            <Box component="form" onSubmit={handleAdminKeySubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Clé secrète"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: '#9333EA',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#7E22CE',
                  },
                }}
              >
                Valider
              </Button>
            </Box>
          )}

          {showLoginForm && (
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: '#9333EA',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#7E22CE',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Se connecter'}
              </Button>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default MaintenanceMode; 