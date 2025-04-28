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
  Snackbar,
} from '@mui/material';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import LockIcon from '@mui/icons-material/Lock';
import { useMaintenance } from '../hooks/useMaintenance';

// Constantes pour la limitation des tentatives
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

const MaintenanceMode: React.FC = () => {
  const navigate = useNavigate();
  const { isMaintenance } = useMaintenance();
  const [mounted, setMounted] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Fonction pour vérifier si le compte est bloqué
  const checkLockStatus = () => {
    const lockData = localStorage.getItem('adminAccessLock');
    if (lockData) {
      const { attempts, timestamp } = JSON.parse(lockData);
      const now = Date.now();
      const timeElapsed = now - timestamp;

      if (attempts >= MAX_ATTEMPTS && timeElapsed < LOCKOUT_DURATION) {
        setIsLocked(true);
        setRemainingTime(Math.ceil((LOCKOUT_DURATION - timeElapsed) / 1000));
        return true;
      } else if (timeElapsed >= LOCKOUT_DURATION) {
        // Réinitialiser le verrouillage si le délai est écoulé
        localStorage.removeItem('adminAccessLock');
        setIsLocked(false);
        setRemainingTime(0);
      }
    }
    return false;
  };

  // Fonction pour mettre à jour le nombre de tentatives
  const updateAttempts = () => {
    const lockData = localStorage.getItem('adminAccessLock');
    const now = Date.now();
    
    if (lockData) {
      const { attempts } = JSON.parse(lockData);
      localStorage.setItem('adminAccessLock', JSON.stringify({
        attempts: attempts + 1,
        timestamp: now
      }));
    } else {
      localStorage.setItem('adminAccessLock', JSON.stringify({
        attempts: 1,
        timestamp: now
      }));
    }
  };

  // Vérifier le statut du verrouillage au chargement
  useEffect(() => {
    setMounted(true);
    checkLockStatus();
    return () => setMounted(false);
  }, []);

  // Mettre à jour le temps restant
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem('adminAccessLock');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, remainingTime]);

  // Vérifier si le mode maintenance est toujours actif
  useEffect(() => {
    if (!isMaintenance && mounted) {
      navigate('/');
    }
  }, [isMaintenance, mounted, navigate]);

  const handleAdminKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    
    if (checkLockStatus()) {
      setError(`Trop de tentatives. Veuillez réessayer dans ${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`);
      return;
    }

    if (adminKey === import.meta.env.VITE_ADMIN_SECRET) {
      setShowLoginForm(true);
      setError(null);
      // Réinitialiser les tentatives en cas de succès
      localStorage.removeItem('adminAccessLock');
    } else {
      updateAttempts();
      const attemptsLeft = MAX_ATTEMPTS - (JSON.parse(localStorage.getItem('adminAccessLock') || '{"attempts":0}').attempts);
      setError(`Clé secrète incorrecte. ${attemptsLeft} tentative(s) restante(s)`);
      setSnackbar({ open: true, message: `Clé secrète incorrecte. ${attemptsLeft} tentative(s) restante(s)` });
      
      if (attemptsLeft <= 0) {
        checkLockStatus();
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

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
        setSnackbar({ open: true, message: 'Connexion réussie' });
        // Attendre un court instant pour que le message s'affiche
        setTimeout(() => {
          // Forcer la mise à jour de la session
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              navigate('/dashboard', { replace: true });
            }
          });
        }, 1000);
      }
    } catch (err: any) {
      if (mounted) {
        setError(err.message);
        setSnackbar({ open: true, message: err.message });
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
                  disabled={isLocked}
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
                  disabled={loading || isLocked}
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
                  {loading ? <CircularProgress size={24} /> : isLocked ? `Réessayer dans ${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}` : 'Valider'}
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
                  {loading ? <CircularProgress size={24} /> : 'Se connecter'}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default MaintenanceMode; 