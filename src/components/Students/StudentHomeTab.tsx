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
  onGoToProfil?: () => void;
  userRole?: string;
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

const StudentHomeTab: React.FC<StudentHomeTabProps> = ({ profile, etudiant, onGoToProfil, userRole }) => {
  const profileCompletion = getProfileCompletion(profile, etudiant);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
      <Container maxWidth="lg" sx={{ flex: 1, px: 1 }}>
        {/* Actions rapides avec nouveaux styles */}
        <Box sx={{ mb: 3 }}>
          <QuickActions onGoToProfil={onGoToProfil} />
        </Box>


        {/* Header avec barre de progression améliorée */}
        <Box sx={{ pt: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666', minWidth: '100px' }}>
            {profileCompletion}% complété
          </Typography>
          <Box sx={{ flex: 1 }}>
            <ProfileCompletionProgressBar profile={profile} etudiant={etudiant} />
          </Box>
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
              {userRole === 'admin' && (
                <UserProfileCard profile={profile} />
              )}
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
              {/* <UserProfileCard profile={profile} /> */}
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
