import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
} from '@mui/icons-material';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { etudiantService } from '../services/etudiantService';
import StudentProfileForm from '../components/Students/StudentProfileForm';
import StudentProfileView from '../components/Students/StudentProfileView';
import { Profile, Etudiant } from '../types';
import StudentSubNav from '../components/Students/StudentSubNav';

const EspaceEtudiant: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const profileData = await profileService.getProfile(user.id);
      setProfile(profileData);

      const etudiantData = await etudiantService.getEtudiant(profileData.id);
      if (etudiantData) {
        // Convertir les langues au bon format
        const convertedEtudiant: Etudiant = {
          ...etudiantData,
          langues: etudiantData.langues?.map(langue => ({
            nom: langue.nom,
            niveau: langue.niveau as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
          })) || []
        };
        setEtudiant(convertedEtudiant);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger vos informations. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<Etudiant>) => {
    try {
      setSaveError(null);
      let savedEtudiant: Etudiant;

      if (etudiant?.id) {
        savedEtudiant = await etudiantService.updateEtudiant(etudiant.id, data);
      } else {
        savedEtudiant = await etudiantService.saveEtudiant(data);
      }

      setEtudiant(savedEtudiant);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setSaveError('Impossible de sauvegarder vos modifications. Veuillez réessayer plus tard.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <>
        <StudentSubNav selectedTab={selectedTab} onTabChange={setSelectedTab} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <StudentSubNav selectedTab={selectedTab} onTabChange={setSelectedTab} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">Profil non trouvé</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <StudentSubNav selectedTab={selectedTab} onTabChange={setSelectedTab} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Mon Espace Étudiant
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gérez votre profil et suivez vos opportunités
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            sx={{
              bgcolor: '#9333EA',
              '&:hover': { bgcolor: '#7928CA' }
            }}
          >
            {etudiant ? 'Modifier mon profil' : 'Compléter mon profil'}
          </Button>
        </Box>

        {saveError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {saveError}
          </Alert>
        )}

        {!etudiant && !isEditing && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Veuillez compléter votre profil pour accéder à toutes les fonctionnalités.
          </Alert>
        )}

        {isEditing ? (
          <StudentProfileForm
            profile={profile}
            etudiant={etudiant || undefined}
            onSubmit={handleSave}
          />
        ) : (
          <StudentProfileView profile={profile} etudiant={etudiant} />
        )}
      </Container>
    </>
  );
};

export default EspaceEtudiant;