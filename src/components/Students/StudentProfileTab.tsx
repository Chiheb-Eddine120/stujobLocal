import React from 'react';
import {
  Box,
  Paper,
  Grid,
} from '@mui/material';
import { Profile, Etudiant } from '../../types';
import StudentProfileForm from './StudentProfileForm';
import ProfileCompletionProgressBar from './ProfileCompletionProgressBar';

interface StudentProfileTabProps {
  profile: Profile;
  etudiant: Etudiant;
  onUpdate: (data: Partial<Etudiant>) => Promise<void>;
}



const getProfileCompletion = (etudiant: Etudiant): number => {
  const fields = [
    etudiant.niveau_etudes,
    etudiant.ecole,
    etudiant.competences?.length,
    etudiant.langues?.length,
    etudiant.cv_file?.cv,
  ];
  const completed = fields.filter(Boolean).length;
  return (completed / fields.length) * 100;
};

const StudentProfileTab: React.FC<StudentProfileTabProps> = ({ profile, etudiant, onUpdate }) => {



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

        <ProfileCompletionProgressBar value={getProfileCompletion(etudiant)} />
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