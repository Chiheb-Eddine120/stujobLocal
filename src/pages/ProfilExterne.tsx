import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, CircularProgress, Alert } from '@mui/material';
import { profileService } from '../services/profileService';
import { etudiantService } from '../services/etudiantService';
import StudentProfileView from '../components/Students/StudentProfileView';
import { Profile, Etudiant } from '../types';
import UsersBackButton from '../components/UsersBackButton';

const ProfilExterne: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error('Aucun identifiant fourni');
        const prof = await profileService.getProfile(id);
        setProfile(prof);
        const etu = await etudiantService.getEtudiant(id);
        setEtudiant(etu);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
  }
  if (error || !profile) {
    return <Container sx={{ py: 4 }}><Alert severity="error">{error || 'Profil non trouvé'}</Alert></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pt: 10, position: 'relative' }}>
      <UsersBackButton />
      <StudentProfileView profile={profile} etudiant={etudiant} />
    </Container>
  );
};

export default ProfilExterne; 