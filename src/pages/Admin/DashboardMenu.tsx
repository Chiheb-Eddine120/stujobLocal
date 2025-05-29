import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SupportIcon from '@mui/icons-material/Support';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const DashboardMenu: React.FC = () => {
  const muiTheme = useMuiTheme();
  const isDarkMode = muiTheme.palette.mode === 'dark';
  const menuItems = [
    {
      title: 'Demandes',
      description: 'Gérer les demandes des utilisateurs',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#9333EA' }} />,
      link: '/dashboard/request',
      color: '#9333EA',
    },
    {
      title: 'Statistiques',
      description: 'Analyser les performances de la plateforme',
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#9333EA' }} />,
      link: '/dashboard/stats',
      color: '#9333EA',
    },
    {
      title: 'Matching',
      description: 'Gérer les correspondances entre étudiants et entreprises',
      icon: <HandshakeIcon sx={{ fontSize: 40, color: '#9333EA' }} />,
      link: '/dashboard/match',
      color: '#9333EA',
    },
    {
      title: 'Utilisateurs',
      description: 'Gérer les comptes étudiants et entreprises',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#E355A3' }} />,
      link: '/dashboard/users',
      color: '#E355A3',
    },
    {
      title: 'Enregistrement Étudiant',
      description: 'Enregistrer manuellement un nouvel étudiant',
      icon: <PersonAddIcon sx={{ fontSize: 40, color: '#E355A3' }} />,
      link: '/dashboard/student-registration',
      color: '#E355A3',
    },
    {
      title: 'Newsletter',
      description: 'Gérer les demandes de notification de lancement',
      icon: <HowToRegIcon sx={{ fontSize: 40, color: '#E355A3' }} />,
      link: '/dashboard/pre-registrations',
      color: '#E355A3',
    },
    {
      title: 'Support',
      description: 'Gérer les tickets de support',
      icon: <SupportIcon sx={{ fontSize: 40, color: '#FF8366' }} />,
      link: '/dashboard/AdminSupport',
      color: '#FF8366',
    },
    {
      title: 'Notifications',
      description: 'Gérer les notifications et communications',
      icon: <NotificationsIcon sx={{ fontSize: 40, color: '#FF8366' }} />,
      link: '/dashboard/notifications',
      color: '#FF8366',
    },
    {
      title: 'Paramètres',
      description: 'Configurer les paramètres de la plateforme',
      icon: <SettingsIcon sx={{ fontSize: 40, color: '#FF8366' }} />,
      link: '/dashboard/settings',
      color: '#FF8366',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        align="center"
        sx={{ 
          mb: 6,
          fontWeight: 700,
          background: isDarkMode ? undefined : 'linear-gradient(90deg, #9333EA 0%, #FF4D8D 100%)',
          backgroundClip: isDarkMode ? undefined : 'text',
          WebkitBackgroundClip: isDarkMode ? undefined : 'text',
          color: isDarkMode ? muiTheme.palette.text.primary : 'transparent',
        }}
      >
        Dashboard Administrateur
      </Typography>

      <Grid container spacing={4}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                background: muiTheme.palette.background.paper,
                transition: 'all 0.3s ease',
                color: muiTheme.palette.text.primary,
                border: `1px solid ${muiTheme.palette.divider}`,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: isDarkMode ? '0 8px 16px rgba(0,0,0,0.25)' : '0 8px 16px rgba(147, 51, 234, 0.15)',
                },
              }}
            >
              <Button
                component={RouterLink}
                to={item.link}
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'inherit',
                  textTransform: 'none',
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    color: item.color,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(10deg)',
                    },
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: muiTheme.palette.text.primary,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: muiTheme.palette.text.secondary,
                  }}
                >
                  {item.description}
                </Typography>
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardMenu; 