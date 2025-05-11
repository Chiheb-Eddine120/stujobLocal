import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Profile, Etudiant } from '../../types';
import StudentHomeTab from './StudentHomeTab';
import StudentProfileTab from './StudentProfileTab';
import StudentSettingsTab from './StudentSettingsTab';
import StudentAlertsTab from './StudentAlertsTab';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
import ConfirmLogoutDialog from './ConfirmLogoutDialog';

interface StudentDashboardProps {
  profile: Profile;
  etudiant: Etudiant;
  onUpdate: (data: Partial<Etudiant>) => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Notification {
  id: string;
  type: 'job' | 'school' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`dashboard-tabpanel-${index}`}
    aria-labelledby={`dashboard-tab-${index}`}
    sx={{ py: 3 }}
  >
    {value === index && children}
  </Box>
);

const StudentDashboard: React.FC<StudentDashboardProps> = ({ profile, etudiant, onUpdate }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    profileVisibility: true,
    emailNotifications: true,
    language: 'fr',
    jobOffers: true,
    relationships: true,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .in('target_role', ['student', 'all'])
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setNotifications(
          data.map((n: any) => ({
            id: n.id,
            type: n.type as 'job' | 'school' | 'system',
            title: n.title,
            message: n.message,
            date: n.created_at,
            read: false, // à améliorer si gestion du lu côté DB
          }))
        );
      }
    };
    fetchNotifications();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleNotificationDelete = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    if (typeof supabase.auth.signOut === 'function') {
      await supabase.auth.signOut();
    }
    localStorage.clear();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mb: 2,
            border: '4px solid #9333EA',
          }}
        >
          {profile.prenom[0]}{profile.nom[0]}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {profile.prenom} {profile.nom}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile.email}
        </Typography>
      </Box>
      <Tabs
        orientation="vertical"
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: '#9333EA',
          },
        }}
      >
        <Tab
          icon={<HomeIcon />}
          label="Accueil"
          iconPosition="start"
          sx={{
            justifyContent: 'flex-start',
            color: 'text.primary',
            '&.Mui-selected': {
              color: '#9333EA',
            },
          }}
        />
        <Tab
          icon={<PersonIcon />}
          label="Profil"
          iconPosition="start"
          sx={{
            justifyContent: 'flex-start',
            color: 'text.primary',
            '&.Mui-selected': {
              color: '#9333EA',
            },
          }}
        />
        <Tab
          icon={<SettingsIcon />}
          label="Paramètres"
          iconPosition="start"
          sx={{
            justifyContent: 'flex-start',
            color: 'text.primary',
            '&.Mui-selected': {
              color: '#9333EA',
            },
          }}
        />
        <Tab
          icon={<NotificationsIcon />}
          label="Alertes"
          iconPosition="start"
          sx={{
            justifyContent: 'flex-start',
            color: 'text.primary',
            '&.Mui-selected': {
              color: '#9333EA',
            },
          }}
        />
      </Tabs>
      {/* Bouton Déconnexion */}
      <Box sx={{ mt: 4, px: 2 }}>
        <Box
          component="button"
          onClick={() => setLogoutDialogOpen(true)}
          sx={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#e53935',
            fontWeight: 600,
            fontSize: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            py: 1.5,
            px: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'color 0.2s',
            '&:hover': {
              color: '#b71c1c',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1, color: 'inherit' }} />
          Déconnexion
        </Box>
        <ConfirmLogoutDialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          onConfirm={handleLogout}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Drawer pour mobile */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer permanent pour desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 251,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            position: 'absolute',
            height: '80vh',
            top: '60%',
            transform: 'translateY(-50%)',
            overflow: 'auto',
            zIndex: 1000,
            backgroundColor: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 250px)` },
          ml: { md: '251px' },
          mt: { md: 0 },
          position: 'relative',
        }}
      >
        {/* Bouton menu pour mobile */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMobileOpen(true)}
          sx={{ display: { md: 'none' }, mb: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Contenu des onglets */}
        <TabPanel value={selectedTab} index={0}>
          <StudentHomeTab profile={profile} etudiant={etudiant} />
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <StudentProfileTab profile={profile} etudiant={etudiant} onUpdate={onUpdate} />
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <StudentSettingsTab settings={settings} onSettingChange={handleSettingChange} />
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          <StudentAlertsTab
            notifications={notifications}
            onNotificationRead={handleNotificationRead}
            onNotificationDelete={handleNotificationDelete}
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default StudentDashboard; 