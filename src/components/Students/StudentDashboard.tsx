import React, { useState, useEffect } from 'react';
import {
  Box,
  //Typography,
  //Avatar,
  IconButton,
  //Drawer,
  //useTheme,
  //useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  //Logout as LogoutIcon,
} from '@mui/icons-material';
import { Profile, Etudiant } from '../../types';
import StudentHomeTab from './StudentHomeTab';
import StudentProfileTab from './StudentProfileTab';
import StudentSettingsTab from './StudentSettingsTab';
import StudentAlertsTab from './StudentAlertsTab';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
//import ConfirmLogoutDialog from './ConfirmLogoutDialog';
import StudentSubNav from './StudentSubNav';
//import MailOutlineIcon from '@mui/icons-material/MailOutline';
//import PhoneIcon from '@mui/icons-material/Phone';
//import CakeIcon from '@mui/icons-material/Cake';
import ScrollToTopButton from './ScrollToTopButton';
import StudentDrawer from './StudentDrawer';

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
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  //const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    profileVisibility: true,
    emailNotifications: true,
    language: 'fr',
    jobOffers: true,
    relationships: true,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  //const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const [currentProfile, setCurrentProfile] = useState<Profile>(profile);

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

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setCurrentProfile(updatedProfile);
  };

  return (
    <>
      <StudentSubNav selectedTab={selectedTab} onTabChange={(idx) => { setSelectedTab(idx); setShowProfileForm(false); }} />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Drawer pour mobile */}
        <StudentDrawer
          profile={currentProfile}
          etudiant={etudiant}
          onLogout={handleLogout}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          variant="temporary"
          onProfileUpdate={handleProfileUpdate}
        />
        {/* Drawer permanent pour desktop */}
        <StudentDrawer
          profile={currentProfile}
          etudiant={etudiant}
          onLogout={handleLogout}
          variant="permanent"
          onProfileUpdate={handleProfileUpdate}
        />

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
            {showProfileForm ? (
              <StudentProfileTab profile={profile} etudiant={etudiant} onUpdate={onUpdate} />
            ) : (
              <StudentHomeTab profile={profile} etudiant={etudiant} onGoToProfil={() => setShowProfileForm(true)} />
            )}
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <StudentAlertsTab
              notifications={notifications}
              onNotificationRead={handleNotificationRead}
              onNotificationDelete={handleNotificationDelete}
            />
          </TabPanel>
          <TabPanel value={selectedTab} index={2}>
            <StudentSettingsTab settings={settings} onSettingChange={handleSettingChange} />
          </TabPanel>
        </Box>
      </Box>
      <ScrollToTopButton />
    </>
  );
};

export default StudentDashboard; 