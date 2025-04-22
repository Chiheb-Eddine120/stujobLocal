import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Link,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Description as DescriptionIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { Profile, Etudiant } from '../types';

interface StudentProfileViewProps {
  profile: Profile;
  etudiant: Etudiant | null;
}

const StudentProfileView: React.FC<StudentProfileViewProps> = ({ profile, etudiant }) => {
  if (!etudiant) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: 4,
          background: '#FDF8FF',
          border: '1px solid #F3E8FF',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Aucune information d'étudiant disponible
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #9333EA 0%, #FF4D8D 100%)',
            color: 'white',
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {profile.prenom} {profile.nom}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <MailIcon sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {profile.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {profile.telephone}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 4,
            background: '#FDF8FF',
            border: '1px solid #F3E8FF'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Documents
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Link 
              href={etudiant.cv_url}
              target="_blank"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#9333EA',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <DescriptionIcon sx={{ mr: 1 }} />
              CV
            </Link>
            <Link 
              href={etudiant.lettre_motivation_url}
              target="_blank"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#9333EA',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <DescriptionIcon sx={{ mr: 1 }} />
              Lettre de motivation
            </Link>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 4,
            background: '#FDF8FF',
            border: '1px solid #F3E8FF',
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SchoolIcon sx={{ color: '#9333EA', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Formation
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {etudiant.niveau_etudes}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            École: {etudiant.ecole}
          </Typography>
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 4,
            background: '#FDF8FF',
            border: '1px solid #F3E8FF',
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <WorkIcon sx={{ color: '#9333EA', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Expériences
            </Typography>
          </Box>
          {etudiant.experiences.map((exp, index) => (
            <Box key={index} sx={{ mb: index !== etudiant.experiences.length - 1 ? 3 : 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {exp.titre}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {exp.entreprise} • {exp.date_debut} - {exp.date_fin || 'Présent'}
              </Typography>
              <Typography variant="body2">
                {exp.description}
              </Typography>
            </Box>
          ))}
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 4,
            background: '#FDF8FF',
            border: '1px solid #F3E8FF',
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <StarIcon sx={{ color: '#9333EA', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Compétences techniques
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {etudiant.competences_techniques.map((comp, index) => (
              <Chip
                key={index}
                label={`${comp.nom} - ${comp.niveau}`}
                sx={{ 
                  bgcolor: '#9333EA20',
                  color: '#9333EA',
                  border: '1px solid #9333EA40'
                }}
              />
            ))}
          </Box>
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 4,
            background: '#FDF8FF',
            border: '1px solid #F3E8FF'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <StarIcon sx={{ color: '#FF4D8D', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Soft skills
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {etudiant.competences_soft.map((comp, index) => (
              <Chip
                key={index}
                label={`${comp.nom} - ${comp.niveau}`}
                sx={{ 
                  bgcolor: '#FF4D8D20',
                  color: '#FF4D8D',
                  border: '1px solid #FF4D8D40'
                }}
              />
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StudentProfileView; 