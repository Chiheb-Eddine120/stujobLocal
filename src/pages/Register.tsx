import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { authService } from '../services/authService';
import SimpleHeader from '../components/SimpleHeader';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      await authService.signUp(
        formData.email,
        formData.password,
        {
          nom: formData.nom,
          prenom: formData.prenom,
        }
      );
      navigate('/login', { state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' } });
    } catch (err) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error('Erreur d\'inscription:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: 'auto', md: 'calc(100vh - 120px)' },
          width: '100%',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4 },
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 1300,
            px: 2,
          }}>
            {/* Bloc Comment ça marche */}
            <Paper elevation={8} sx={{
              bgcolor: 'white',
              color: '#222',
              borderRadius: 6,
              boxShadow: '0 8px 32px rgba(80, 36, 122, 0.10)',
              minWidth: 520,
              maxWidth: 650,
              width: { xs: '100%', md: 600 },
              minHeight: 650,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: { xs: 5, md: 8 },
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}>
              <Typography variant="h2" component="h2" gutterBottom sx={{ color: '#222', fontWeight: 900, fontSize: { xs: 32, md: 38 }, mb: 4, lineHeight: 1.1 }}>
                Comment ça marche ?
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <PersonIcon sx={{ color: '#9333EA', fontSize: 36, mt: 0.5, flexShrink: 0 }} />
                  <Box sx={{ pr: 1, flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#222', fontSize: 22, lineHeight: 1.2 }}>1. Créez votre compte</Typography>
                    <Typography variant="body1" sx={{ color: '#444', fontSize: 17, mt: 0.5, lineHeight: 1.5 }}>Remplissez le formulaire avec vos informations personnelles pour créer votre compte étudiant.</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircleIcon sx={{ color: '#9333EA', fontSize: 36, mt: 0.5, flexShrink: 0 }} />
                  <Box sx={{ pr: 1, flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#222', fontSize: 22, lineHeight: 1.2 }}>2. Complétez votre profil</Typography>
                    <Typography variant="body1" sx={{ color: '#444', fontSize: 17, mt: 0.5, lineHeight: 1.5 }}>Ajoutez vos compétences, expériences et centres d'intérêt pour vous démarquer.</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <WorkIcon sx={{ color: '#9333EA', fontSize: 36, mt: 0.5, flexShrink: 0 }} />
                  <Box sx={{ pr: 1, flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#222', fontSize: 22, lineHeight: 1.2 }}>3. Découvrez des opportunités</Typography>
                    <Typography variant="body1" sx={{ color: '#444', fontSize: 17, mt: 0.5, lineHeight: 1.5 }}>Accédez à des offres de stages et d'emplois adaptées à votre profil.</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <SchoolIcon sx={{ color: '#9333EA', fontSize: 36, mt: 0.5, flexShrink: 0 }} />
                  <Box sx={{ pr: 1, flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#222', fontSize: 22, lineHeight: 1.2 }}>4. Postulez facilement</Typography>
                    <Typography variant="body1" sx={{ color: '#444', fontSize: 17, mt: 0.5, lineHeight: 1.5 }}>Envoyez votre candidature en quelques clics et suivez son avancement.</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
            {/* Formulaire d'inscription */}
            <Box sx={{
              minWidth: 520,
              maxWidth: 650,
              width: { xs: '100%', md: 600 },
              minHeight: 650,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              p: { xs: 5, md: 8 },
              boxSizing: 'border-box',
            }}>
              <SimpleHeader />
              <Box sx={{ height: 24 }} />
              <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 900, fontSize: { xs: 32, md: 38 }, mb: 1, lineHeight: 1.1 }}>
                Inscription Étudiant
              </Typography>
              <Typography variant="subtitle1" align="center" sx={{ color: '#666', mb: 4, fontSize: 19, lineHeight: 1.4 }}>
                Créez votre compte en une étape.
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2, fontSize: 17 }}>
                  {error}
                </Alert>
              )}
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Grid container spacing={2} sx={{ width: '100%' }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Prénom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      disabled={loading}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{ style: { fontSize: 18 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      disabled={loading}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{ style: { fontSize: 18 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{ style: { fontSize: 18 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Mot de passe"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      disabled={loading}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{ style: { fontSize: 18 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Confirmer le mot de passe"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      disabled={loading}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{ style: { fontSize: 18 } }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{ mt: 4, fontSize: 22, py: 2, borderRadius: 3 }}
                >
                  {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                </Button>
                <Button
                  variant="text"
                  fullWidth
                  onClick={() => navigate('/login')}
                  disabled={loading}
                  sx={{ mt: 2, fontSize: 19 }}
                >
                  Déjà inscrit ? Se connecter
                </Button>
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Register; 