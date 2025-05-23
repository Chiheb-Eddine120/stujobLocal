import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
} from '@mui/material';
import { Profile, Etudiant } from '../../types';
import StudentProfileForm from './StudentProfileForm';
import ProfileCompletionProgressBar from './ProfileCompletionProgressBar';

interface StudentProfileTabProps {
  profile: Profile;
  etudiant: Etudiant;
  onUpdate: (data: Partial<Etudiant>) => Promise<void>;
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

const StudentProfileTab: React.FC<StudentProfileTabProps> = ({ profile, etudiant, onUpdate }) => {
  const profileCompletion = getProfileCompletion(profile, etudiant);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: '#FDF8FF',
          border: '1px solid #F3E8FF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666', minWidth: '100px' }}>
            {profileCompletion}% complété
          </Typography>
          <Box sx={{ flex: 1 }}>
            <ProfileCompletionProgressBar profile={profile} etudiant={etudiant} />
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <StudentProfileForm
            profile={profile}
            etudiant={etudiant}
            onSubmit={onUpdate}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentProfileTab; 