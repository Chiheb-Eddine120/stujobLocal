import React from 'react';
import { Box, Button } from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

interface StudentSubNavProps {
  selectedTab: number;
  onTabChange: (index: number) => void;
}

const navItems = [
  { label: 'Accueil', icon: <HomeIcon /> },
  { label: 'Profil', icon: <PersonIcon /> },
  { label: 'Alertes', icon: <NotificationsIcon /> },
  { label: 'Paramètres', icon: <SettingsIcon /> }
];

const StudentSubNav: React.FC<StudentSubNavProps> = ({ selectedTab, onTabChange }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        borderBottom: '1px solid #e5e7eb',
        py: 1,
      }}
    >
      {navItems.map((item, idx) => (
        <Button
          key={item.label}
          onClick={() => onTabChange(idx)}
          startIcon={item.icon}
          sx={{
            color: selectedTab === idx ? '#9333EA' : '#6b7280',
            fontWeight: 600,
            borderBottom: selectedTab === idx ? '2px solid #9333EA' : 'none',
            borderRadius: 0,
            background: 'none',
            boxShadow: 'none',
            '&:hover': {
              color: '#9333EA',
              background: 'none',
              borderBottom: '2px solid #9333EA',
            },
            minWidth: 120,
            fontSize: '1.1rem',
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
};

export default StudentSubNav;