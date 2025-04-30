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
  Snackbar,
  Grid,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
//import ConstructionIcon from '@mui/icons-material/Construction';
//import LockIcon from '@mui/icons-material/Lock';

// Constantes pour la limitation des tentatives
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

// Types pour le rôle sélectionné
type Role = 'student' | 'entreprise' | null;

export default function Maintenance() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showAdminKeyForm, setShowAdminKeyForm] = useState(false);
  const [showAdminLoginForm, setShowAdminLoginForm] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role>(null);

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

  useEffect(() => {
    setMounted(true);
    checkLockStatus();
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    let sequence: string[] = [];
    const secretSequence = import.meta.env.VITE_ADMIN_ACCESS_SEQUENCE.split(',');

    const handleKeyDown = (e: KeyboardEvent) => {
      sequence.push(e.key);
      sequence = sequence.slice(-secretSequence.length);
      if (sequence.join(",") === secretSequence.join(",")) {
        setShowAdminKeyForm(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('maintenance_notifications')
        .insert([
          {
            email,
            notified: false,
            role: selectedRole
          }
        ]);

      if (error) throw error;

      setEmailSent(true);
      setSnackbar({ open: true, message: 'Merci ! Vous serez prévenu dès notre retour.' });
    } catch (err: any) {
      setError(err.message);
      setSnackbar({ open: true, message: "Une erreur s'est produite lors de l'enregistrement de votre email." });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    
    if (checkLockStatus()) {
      setError(`Trop de tentatives. Veuillez réessayer dans ${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`);
      return;
    }

    if (adminKey === import.meta.env.VITE_ADMIN_SECRET) {
      setError(null);
      localStorage.removeItem('adminAccessLock');
      setShowAdminLoginForm(true);
      setShowAdminKeyForm(false);
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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailAdmin,
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
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
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

  const RoleCard = ({ role, title, icon, onClick }: { role: Role; title: string; icon: React.ReactNode; onClick: () => void }) => (
    <Paper
      elevation={selectedRole === role ? 3 : 1}
      sx={{
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: selectedRole === role ? 'scale(1.02)' : 'scale(1)',
        border: selectedRole === role ? '2px solid #9333EA' : '2px solid transparent',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 20px rgba(147, 51, 234, 0.2)',
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ color: '#9333EA', mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" sx={{ color: '#9333EA', fontWeight: 600 }}>
        {title}
      </Typography>
    </Paper>
  );

  const RoleDescription = ({ role }: { role: Role }) => {
    if (!role) return null;

    const content = {
      student: {
        title: "StuJob est votre partenaire pour :",
        items: [
          "Trouver des stages adaptés à votre formation",
          "Connecter directement avec les entreprises",
          "Gérer vos candidatures facilement",
          "Découvrir des opportunités exclusives"
        ]
      },
      company: {
        title: "StuJob vous permet de :",
        items: [
          "Trouver facilement des étudiants qualifiés",
          "Gérer vos offres de stage depuis un tableau de bord clair",
          "Accélérer le processus de recrutement",
          "Promouvoir votre entreprise auprès des jeunes talents"
        ]
      }
    };

    const roleContent = role === 'student' ? content.student : content.company;

    return (
      <Box sx={{ mt: 4, textAlign: 'left' }}>
        <Typography variant="h6" sx={{ color: '#666', mb: 2, fontWeight: 500 }}>
          {roleContent.title}
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 4, color: '#666' }}>
          {roleContent.items.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
          ))}
        </Box>
      </Box>
    );
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
    <>
      <Helmet>
        <title>Maintenance en cours | StuJob - La plateforme de stages pour étudiants</title>
        <meta name="description" content="StuJob est en maintenance. Notre plateforme de mise en relation entre étudiants et entreprises pour des stages revient bientôt avec de nouvelles fonctionnalités pour faciliter votre recherche de stage." />
        <meta name="keywords" content="stage étudiant, recherche stage, offre stage, plateforme stage, StuJob maintenance" />
        <meta property="og:title" content="Maintenance en cours | StuJob - La plateforme de stages pour étudiants" />
        <meta property="og:description" content="StuJob est en maintenance. Notre plateforme de mise en relation entre étudiants et entreprises pour des stages revient bientôt avec de nouvelles fonctionnalités." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Maintenance en cours | StuJob" />
        <meta name="twitter:description" content="StuJob est en maintenance. Revenez bientôt pour découvrir notre plateforme de stages améliorée." />
      </Helmet>

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #9333EA 0%, #E355A3 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '3rem',
              textAlign: 'center',
              mb: 4,
              display: 'inline-flex',
              alignItems: 'center',
              position: 'relative',
              justifyContent: 'center',
              width: '100%',
              '&::after': {
                content: '""',
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: 'white',
                transform: 'rotate(45deg)',
                marginLeft: '8px',
                marginBottom: '24px'
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
            <Typography variant="h4" component="h2" sx={{ color: '#9333EA', mb: 4, fontWeight: 700 }}>
              Nous sommes en maintenance, mais bientôt de retour !
            </Typography>

            {!showAdminKeyForm && !showAdminLoginForm && (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <RoleCard
                      role="student"
                      title="👨‍🎓 Étudiant"
                      icon={<SchoolIcon sx={{ fontSize: 40 }} />}
                      onClick={() => setSelectedRole('student')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RoleCard
                      role="entreprise"
                      title="🏢 Entreprise"
                      icon={<BusinessIcon sx={{ fontSize: 40 }} />}
                      onClick={() => setSelectedRole('entreprise')}
                    />
                  </Grid>
                </Grid>

                <RoleDescription role={selectedRole} />

                <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                  Laissez votre email pour être averti de notre retour et ne manquez pas nos nouvelles fonctionnalités !
                </Typography>

                {!emailSent ? (
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      type="email"
                      required
                      label="Votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '15px',
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
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
                      {loading ? <CircularProgress size={24} /> : 'S\'inscrire a la newsletter'}
                    </Button>
                  </Box>
                ) : (
                  <Alert severity="success" sx={{ borderRadius: '15px' }}>
                    Merci ! Vous serez prévenu dès notre retour.
                  </Alert>
                )}
              </>
            )}

            {showAdminKeyForm && !showAdminLoginForm && (
              <Box component="form" onSubmit={handleAdminKeySubmit} sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ color: '#9333EA', mb: 2 }}>
                  Accès administrateur
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  label="Clé secrète"
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

            {showAdminLoginForm && (
              <Box component="form" onSubmit={handleAdminLogin} sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ color: '#9333EA', mb: 2 }}>
                  Connexion administrateur
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={emailAdmin}
                  onChange={(e) => setEmailAdmin(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '15px',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Mot de passe"
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
                }}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          message={snackbar.message}
        />
      </Box>
    </>
  );
} 