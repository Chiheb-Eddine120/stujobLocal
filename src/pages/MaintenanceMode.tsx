import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Container,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import LockIcon from '@mui/icons-material/Lock';

const MaintenanceMode: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleAdminKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    
    if (adminKey === import.meta.env.VITE_ADMIN_SECRET) {
      setShowLoginForm(true);
      setError(null);
    } else {
      setError('Clé secrète incorrecte');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    
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

      if (mounted) {
        // Redirection vers le dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (mounted) {
        setError(err.message);
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  if (!mounted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #9333EA 0%, #E355A3 50%, #FF8366 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #9333EA 0%, #E355A3 50%, #FF8366 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Motif de fond */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Logo STUJOB */}
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '4rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              '&::after': {
                content: '""',
                display: 'inline-block',
                width: '24px',
                height: '24px',
                backgroundColor: 'white',
                transform: 'rotate(45deg)',
                marginLeft: '8px',
                marginBottom: '32px'
              }
            }}
          >
            StuJob
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton
                sx={{
                  bgcolor: '#9333EA20',
                  mb: 2,
                  p: 2,
                  '&:hover': { bgcolor: '#9333EA30' },
                }}
              >
                <ConstructionIcon sx={{ fontSize: 40, color: '#9333EA' }} />
              </IconButton>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#9333EA' }}>
                Maintenance en cours
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280', maxWidth: '400px', mx: 'auto' }}>
                Notre équipe travaille actuellement sur l'amélioration de nos services.
                Nous serons de retour très bientôt !
              </Typography>
            </Box>

            {!showAdminForm && !showLoginForm && (
              <Button
                variant="contained"
                onClick={() => setShowAdminForm(true)}
                startIcon={<LockIcon />}
                sx={{
                  bgcolor: '#9333EA',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)',
                  '&:hover': {
                    bgcolor: '#7E22CE',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Accès administrateur
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
                      borderRadius: '15px',
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
                    py: 1.5,
                    borderRadius: '15px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
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
                      borderRadius: '15px',
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
                      borderRadius: '15px',
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
                    py: 1.5,
                    borderRadius: '15px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: '#7E22CE',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Se connecter'}
                </Button>
              </Box>
            )}

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  borderRadius: '15px',
                  '& .MuiAlert-icon': {
                    color: '#DC2626',
                  },
                }}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default MaintenanceMode; 