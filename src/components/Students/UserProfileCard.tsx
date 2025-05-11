import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import { Profile } from '../../types';

interface UserProfileCardProps {
  profile: Profile;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 4,
      background: 'linear-gradient(135deg, #9333EA 0%, #FF4D8D 100%)',
      color: 'white',
      mb: 2,
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
);

export default UserProfileCard; 