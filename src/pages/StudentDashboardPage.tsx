import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Snackbar, Alert, Button } from '@mui/material';
import StudentDashboard from '../components/Students/StudentDashboard';
import { Profile, Etudiant } from '../types';
import { supabase } from '../services/supabase';

const StudentDashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Récupérer le profil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Récupérer les données de l'étudiant
        const { data: etudiantData, error: etudiantError } = await supabase
          .from('etudiants')
          .select('*')
          .eq('profile_id', session.user.id)
          .single();

        // Si l'étudiant n'existe pas, le créer
        if (etudiantError && etudiantError.code === 'PGRST116') {
          const { data: newEtudiant, error: createError } = await supabase
            .from('etudiants')
            .insert({
              profile_id: session.user.id
            })
            .select()
            .single();

          if (createError) throw createError;
          setEtudiant(newEtudiant);
        } else if (etudiantError) {
          throw etudiantError;
        } else {
          setEtudiant(etudiantData);
        }

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUpdate = async (data: Partial<Etudiant>) => {
    try {
      if (!etudiant?.id) return;

      const { error } = await supabase
        .from('etudiants')
        .update(data)
        .eq('id', etudiant.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setEtudiant(prev => prev ? { ...prev, ...data } : null);

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  };

  // Calcul du taux de complétion du profil
  function getProfileCompletion(etudiant: Etudiant): number {
    const fields = [
      etudiant.niveau_etudes,
      etudiant.ecole,
      etudiant.competences?.length,
      etudiant.langues?.length,
      etudiant.cv_file?.cv,
    ];
    const completed = fields.filter(Boolean).length;
    return (completed / fields.length) * 100;
  }

  useEffect(() => {
    if (etudiant) {
      const completion = getProfileCompletion(etudiant);
      if (completion < 30) {
        setShowProfileAlert(true);
      }
    }
  }, [etudiant]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress sx={{ color: '#9333EA' }} />
      </Box>
    );
  }

  if (!profile || !etudiant) {
    return null;
  }

  return (
    <>
      <StudentDashboard
        profile={profile}
        etudiant={etudiant}
        onUpdate={handleUpdate}
      />
      <Snackbar
        open={showProfileAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setShowProfileAlert(false);
        }}
        autoHideDuration={10000}
      >
        <Alert
          severity="info"
          sx={{ bgcolor: '#F3E8FF', color: '#9333EA', border: '1px solid #9333EA', boxShadow: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              variant="contained"
              sx={{ bgcolor: '#9333EA', ml: 2, '&:hover': { bgcolor: '#7928CA' }, color: '#fff' }}
              onClick={() => navigate('/espace-etudiant')}
            >
              Compléter mon profil
            </Button>
          }
        >
          Votre profil est incomplet. Cliquez ici pour le compléter et accéder à toutes les fonctionnalités !
        </Alert>
      </Snackbar>
    </>
  );
};

export default StudentDashboardPage; 