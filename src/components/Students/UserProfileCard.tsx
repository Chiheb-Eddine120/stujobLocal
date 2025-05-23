import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
//import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import { Profile } from '../../types';

interface UserProfileCardProps {
  profile: Profile;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        {profile.avatar_url ? (
          <Avatar
            src={profile.avatar_url}
            sx={{ width: 64, height: 64, mb: 2 }}
          />
        ) : (
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mb: 2,
              bgcolor: '#dcdcdc',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            {getInitials(`${profile.prenom} ${profile.nom}`)}
          </Avatar>
        )}
        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
          {profile.prenom} {profile.nom}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Email */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <MailIcon sx={{ color: '#9e9e9e', mt: '2px' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Email :
            </Typography>
            <Typography variant="body2" sx={{ color: profile.email ? 'inherit' : '#9e9e9e', pl: 1 }}>
              {profile.email || 'Non renseigné ❌'}
            </Typography>
          </Box>
        </Box>
        {/* Téléphone */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <PhoneIcon sx={{ color: '#9e9e9e', mt: '2px' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Téléphone :
            </Typography>
            <Typography variant="body2" sx={{ color: profile.telephone ? 'inherit' : '#9e9e9e', pl: 1 }}>
              {profile.telephone || 'Non renseigné ❌'}
            </Typography>
          </Box>
        </Box>
        {/* Date de naissance (à ajouter plus tard dans le type Profile) */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <CakeIcon sx={{ color: '#9e9e9e', mt: '2px' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Date de naissance :
            </Typography>
            <Typography variant="body2" sx={{ color: '#9e9e9e', pl: 1 }}>
              Non renseignée ❌
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserProfileCard; 