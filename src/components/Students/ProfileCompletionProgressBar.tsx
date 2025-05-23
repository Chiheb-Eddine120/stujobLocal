import React from 'react';
import { Box, LinearProgress } from '@mui/material';
import { Profile, Etudiant } from '../../types';

interface ProfileCompletionProgressBarProps {
  profile: Profile;
  etudiant: Etudiant;
}

const getProfileCompletion = (profile: Profile, etudiant: Etudiant): number => {
  const checks = [
    !!profile.prenom,
    !!profile.nom,
    !!profile.email,
    !!profile.telephone,
    !!etudiant.date_naissance,
    !!etudiant.niveau_etudes,
    !!etudiant.ecole,
    !!etudiant.biographie && etudiant.biographie.length > 30,
    Array.isArray(etudiant.competences) && etudiant.competences.length > 0,
    (etudiant.competence_description && Object.keys(etudiant.competence_description).length > 0) || (Array.isArray(etudiant.experiences) && etudiant.experiences.some(exp => exp.description && exp.description.length > 0)),
    Array.isArray(etudiant.experiences) && etudiant.experiences.length > 0,
    (etudiant.cv_file && (etudiant.cv_file.cv || etudiant.cv_file.lettre_motivation)),
    etudiant.disponibilite && Array.isArray(etudiant.disponibilite.disponibilites) && etudiant.disponibilite.disponibilites.length > 0,
    Array.isArray(etudiant.langues) && etudiant.langues.length > 0,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const ProfileCompletionProgressBar: React.FC<ProfileCompletionProgressBarProps> = ({ profile, etudiant }) => {
  const value = getProfileCompletion(profile, etudiant);
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #673ab7 0%, #9c27b0 100%)',
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
};

export default ProfileCompletionProgressBar; 