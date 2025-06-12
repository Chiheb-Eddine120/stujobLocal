import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Link,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Description as DescriptionIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { Profile, Etudiant } from '../../types';

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
      {/* Colonne de gauche - Informations personnelles et documents */}
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
              {etudiant.date_naissance && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <CalendarIcon sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Date de naissance : {etudiant.date_naissance}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Documents */}
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
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Documents
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {etudiant.cv_file?.cv && (
              <Link 
                href={etudiant.cv_file.cv.url}
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
                Voir CV
              </Link>
            )}
          </Box>
        </Paper>

        {/* Disponibilités */}
        {etudiant.disponibilite && (
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 4,
              background: '#FDF8FF',
              border: '1px solid #F3E8FF'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ color: '#9333EA', mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Disponibilités
              </Typography>
            </Box>
            {etudiant.disponibilite.disponibilites?.map((dispo, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  {dispo.jour}: {dispo.debut} - {dispo.fin}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Grid>

      {/* Colonne de droite - Formation, expériences et compétences */}
      <Grid item xs={12} md={8}>
        {/* Biographie */}
        {etudiant.biographie && (
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
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Biographie
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {etudiant.biographie}
            </Typography>
          </Paper>
        )}
        {/* Formation */}
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
          <Box sx={{ pl: 4 }}>
            <Typography variant="body1" paragraph>
              {etudiant.niveau_etudes}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              École: {etudiant.ecole}
            </Typography>
          </Box>
        </Paper>

        {/* Expériences */}
        {etudiant.experiences && etudiant.experiences.length > 0 && (
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
            <Box sx={{ pl: 4 }}>
              {etudiant.experiences?.map((exp, index) => (
                <Box key={index} sx={{ mb: index !== (etudiant.experiences?.length ?? 0) - 1 ? 3 : 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {exp.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {exp.entreprise} • {exp.date_debut} - {exp.date_fin || 'Présent'}
                  </Typography>
                  {exp.description && (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {exp.description}
                    </Typography>
                  )}
                  {index !== (etudiant.experiences?.length ?? 0) - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Compétences */}
        {etudiant.competences && etudiant.competences.length > 0 && (
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
                Compétences
              </Typography>
            </Box>
            <Box sx={{ pl: 4 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {etudiant.competences.map((comp, index) => (
                  <Chip
                    key={index}
                    label={`${comp.label}${comp.niveau ? ` - ${comp.niveau}` : ''}`}
                    sx={{ 
                      bgcolor: '#F3E8FF',
                      color: '#9333EA',
                      '&:hover': {
                        bgcolor: '#9333EA',
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default StudentProfileView; 