import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import StudentDashboard from '../components/Students/StudentDashboard';
import { Profile, Etudiant } from '../types';
import { supabase } from '../services/supabase';

const StudentDashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [loading, setLoading] = useState(true);
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

        if (etudiantError) throw etudiantError;
        setEtudiant(etudiantData);

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
    <StudentDashboard
      profile={profile}
      etudiant={etudiant}
      onUpdate={handleUpdate}
    />
  );
};

export default StudentDashboardPage; 