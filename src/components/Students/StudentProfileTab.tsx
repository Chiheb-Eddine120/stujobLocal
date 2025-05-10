import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Button,
} from '@mui/material';
import { Profile, Etudiant } from '../../types';
import StudentProfileForm from './StudentProfileForm';

interface StudentProfileTabProps {
  profile: Profile;
  etudiant: Etudiant;
  onUpdate: (data: Partial<Etudiant>) => Promise<void>;
}

const steps = [
  'Informations personnelles',
  'Études',
  'Expériences',
  'Langues',
  'Documents',
  'Réseaux',
  'Disponibilité',
  'Compétences',
  'Recherche',
  'Bio',
];

const StudentProfileTab: React.FC<StudentProfileTabProps> = ({ profile, etudiant, onUpdate }) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

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
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Complétez votre profil
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{
            color: '#9333EA',
            '&:hover': {
              backgroundColor: 'rgba(147, 51, 234, 0.04)',
            },
          }}
        >
          Retour
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          sx={{
            backgroundColor: '#9333EA',
            '&:hover': {
              backgroundColor: '#7928CA',
            },
          }}
        >
          {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
        </Button>
      </Box>
    </Box>
  );
};

export default StudentProfileTab; 