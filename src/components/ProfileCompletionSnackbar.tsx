import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

// Types à adapter selon ton projet
import { Etudiant } from '../types';

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

const ProfileCompletionSnackbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEtudiant = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase
        .from('etudiants')
        .select('*')
        .eq('profile_id', session.user.id)
        .single();
      if (!error && data) {
        setEtudiant(data as Etudiant);
      }
    };
    fetchEtudiant();
  }, []);

  useEffect(() => {
    if (etudiant) {
      const completion = getProfileCompletion(etudiant);
      if (completion < 30) {
        setOpen(true);
      }
    }
  }, [etudiant]);

  if (!etudiant) return null;

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={(_, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
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
            onClick={() => navigate('/dashboard-etudiant')}
          >
            Compléter mon profil
          </Button>
        }
      >
        Votre profil est incomplet. Cliquez ici pour le compléter et accéder à toutes les fonctionnalités !
      </Alert>
    </Snackbar>
  );
};

export default ProfileCompletionSnackbar; 