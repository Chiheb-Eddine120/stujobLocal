import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Divider } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      icon: <WorkIcon sx={{ color: '#9333EA' }} />,
      title: "Nouvelle offre d'emploi",
      subtitle: 'Une offre correspond à votre profil',
      chip: 'Nouveau',
    },
    {
      icon: <SchoolIcon sx={{ color: '#9333EA' }} />,
      title: 'Profil mis à jour',
      subtitle: 'Vos compétences ont été mises à jour',
    },
    {
      icon: <StarIcon sx={{ color: '#9333EA' }} />,
      title: 'Nouvelle recommandation',
      subtitle: 'Une entreprise a consulté votre profil',
    },
  ];

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: '#FDF8FF', border: '1px solid #F3E8FF', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Activité récente
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Aucune activité récentes"
            sx={{ textAlign: 'center', color: 'text.secondary' }}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default ActivityFeed; 