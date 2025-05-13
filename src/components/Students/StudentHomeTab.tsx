import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Profile, Etudiant } from '../../types';
import ProfileCompletionProgressBar from './ProfileCompletionProgressBar';
import QuickActions from './QuickActions';
import ActivityFeed from './ActivityFeed';
import UserProfileCard from './UserProfileCard';
import Biography from './Biography';
import SkillsTags from './SkillsTags';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import AvailabilitySection from './AvailabilitySection';
import DocumentSection from './DocumentSection';
import LanguesSection from './LanguesSection';

interface StudentHomeTabProps {
  profile: Profile;
  etudiant: Etudiant;
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

const StudentHomeTab: React.FC<StudentHomeTabProps> = ({ profile, etudiant }) => {
  const profileCompletion = getProfileCompletion(etudiant);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
      <Container maxWidth="lg" sx={{ flex: 1, px: 1 }}>
        {/* Header avec barre de progression améliorée */}
        <Box sx={{ pt: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666', minWidth: '100px' }}>
            {profileCompletion}% complété
          </Typography>
          <Box sx={{ flex: 1 }}>
            <ProfileCompletionProgressBar value={profileCompletion} />
          </Box>
        </Box>

        {/* Actions rapides avec nouveaux styles */}
        <Box sx={{ mb: 3 }}>
          <QuickActions />
        </Box>

        {/* Content Area */}
        <Grid container spacing={3}>
          {/* Colonne latérale gauche améliorée */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              '& > *': { mb: 2 }
            }}>
              <UserProfileCard profile={profile} />
              <ActivityFeed />
              <DocumentSection cv={etudiant.cv_file?.cv} />
              <AvailabilitySection disponibilites={etudiant.disponibilite?.disponibilites} />
            </Box>
          </Grid>

          {/* Colonne principale améliorée */}
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              '& > *': { mb: 3 }
            }}>
              <Biography biographie={etudiant.biographie} />
              <SkillsTags
                competences={etudiant.competences
                  ?.filter((c) => !!c.label)
                  .map((c) => ({
                    label: c.label || '',
                    niveau: c.niveau,
                  }))}
              />
              <ExperienceSection experiences={etudiant.experiences} />
              <EducationSection niveau_etudes={etudiant.niveau_etudes} ecole={etudiant.ecole} />
              <LanguesSection langues={etudiant.langues} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentHomeTab;
