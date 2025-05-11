import React from 'react';
import { Box, Container, Grid } from '@mui/material';
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flex: 1, px: 1 }}>
        {/* Header */}
        <Box sx={{ pt: 2, pb: 1 }}>
          <ProfileCompletionProgressBar value={profileCompletion} />
          <QuickActions />
        </Box>
        {/* Content Area */}
        <Grid container spacing={2}>
          {/* Colonne latérale gauche */}
          <Grid item xs={12} md={4}>
            <UserProfileCard profile={profile} />
            <ActivityFeed />
            <DocumentSection cv={etudiant.cv_file?.cv} />
            <AvailabilitySection disponibilites={etudiant.disponibilite?.disponibilites} />
          </Grid>
          {/* Colonne principale */}
          <Grid item xs={12} md={8}>
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentHomeTab;
