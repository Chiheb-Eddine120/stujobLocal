import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import MaintenanceMode from './pages/MaintenanceMode';
import { useMaintenance } from './hooks/useMaintenance';
import Home from './pages/Home';
import DemandeForm from './pages/Admin/DemandeForm';
import SuiviDemande from './pages/SuiviDemande';
import Etudiants from './pages/Etudiants';
import EspaceEtudiant from './pages/EspaceEtudiant';
import About from './pages/About';
import Contact from './pages/Contact';
import DashboardMenu from './pages/Admin/DashboardMenu';
import DashboardMatch from './pages/Admin/DashboardMatch';
import DashboardUsers from './pages/Admin/DashboardUsers';
import DashboardStats from './pages/Admin/DashboardStats';
import DashboardNotifications from './pages/Admin/DashboardNotifications';
import DashboardPreRegistrations from './pages/Admin/DashboardPreRegistrations';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Privacy from './pages/Privacy';
import DashboardSettings from './pages/Admin/DashboardSettings';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';
import { Box, Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import HomeEtudiant from './pages/HomeEtudiant';
import RoleSwitchBar from './components/RoleSwitchBar';
import LoadingSpinner from './components/loading/LoadingSpinner';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ResetPassword from './pages/ResetPassword';
import AdminSupport from './pages/Admin/AdminSupport';
import ProfileCompletionSnackbar from './components/ProfileCompletionSnackbar';
import DashboardStudentRegistration from './pages/Admin/DashboardStudentRegistration';
import UpdatePassword from './pages/UpdatePassword';
import DashboardRequest from './pages/Admin/DashboardRequest';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [selectedRole, setSelectedRole] = React.useState<'etudiant' | 'entreprise'>(() => {
    return (localStorage.getItem('selectedRole') as 'etudiant' | 'entreprise') || 'etudiant';
  });

  // Le modeAccueil est maintenant toujours basé sur le selectedRole
  const modeAccueil = selectedRole;

  const showRoleSwitch = !location.pathname.startsWith('/dashboard') && 
    location.pathname !== '/login' && 
    location.pathname !== '/register' && 
    location.pathname !== '/reset-password';


  // Nouvelle fonction pour changer le rôle et le stocker
  const handleRoleChange = (role: 'etudiant' | 'entreprise') => {
    setSelectedRole(role);
    localStorage.setItem('selectedRole', role);
  };

  const { session, userRole } = useAuth();
  const isAuthenticated = !!session;

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/reset-password' && <Navbar modeAccueil={modeAccueil} />}
      {showRoleSwitch && !(isAuthenticated && userRole === 'student') && (
        <RoleSwitchBar selectedRole={selectedRole} onChange={handleRoleChange} />
      )}
      <main style={{ flex: 1, paddingBottom: '20px' }}>
        <Routes>
          <Route path="/" element={<HomeSwitcher selectedRole={selectedRole} />} />
          <Route path="/home-etudiant" element={<HomeEtudiant />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/demande" element={<DemandeForm />} />
          <Route path="/suivi" element={<SuiviDemande />} />
          <Route path="/suivi/:trackingNumber" element={<SuiviDemande />} />
          <Route path="/etudiants" element={<Etudiants />} />
          <Route path="/espace-etudiant" element={<ProtectedRoute requiredRoles={['student']}><EspaceEtudiant /></ProtectedRoute>} />
          {/* Routes Dashboard Admin */}
          <Route path="/dashboard" element={<ProtectedRoute requiredRoles={['admin']}><DashboardMenu /></ProtectedRoute>} />
          <Route path="/dashboard/pre-registrations" element={<ProtectedRoute requiredRoles={['admin']}><DashboardPreRegistrations /></ProtectedRoute>} />
          <Route path="/dashboard/match" element={<ProtectedRoute requiredRoles={['admin']}><DashboardMatch /></ProtectedRoute>} />
          <Route path="/dashboard/users" element={<ProtectedRoute requiredRoles={['admin']}><DashboardUsers /></ProtectedRoute>} />
          <Route path="/dashboard/stats" element={<ProtectedRoute requiredRoles={['admin']}><DashboardStats /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute requiredRoles={['admin']}><DashboardNotifications /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute requiredRoles={['admin']}><DashboardSettings /></ProtectedRoute>} />
          <Route path="/dashboard/student-registration" element={<ProtectedRoute requiredRoles={['admin']}><DashboardStudentRegistration /></ProtectedRoute>} />
          <Route path="/dashboard/request" element={<ProtectedRoute requiredRoles={['admin']}><DashboardRequest /></ProtectedRoute>} />
          <Route path="/dashboard-etudiant" element={<ProtectedRoute requiredRoles={['student']}><StudentDashboardPage /></ProtectedRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard/AdminSupport" element={<ProtectedRoute requiredRoles={['admin']}><AdminSupport /></ProtectedRoute>} />
          <Route path="/update-password" element={<UpdatePassword />} />
          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/reset-password' && <Footer />}
      <CookieConsent />
      <ProfileCompletionSnackbar />
    </>
  );
};

const App: React.FC = () => {
  const { isMaintenance, isLoading: isMaintenanceLoading, error: maintenanceError } = useMaintenance();
  const { session, userRole, isChecking: isAuthChecking } = useAuth();

  useEffect(() => {
    if (!sessionStorage.getItem('tributeShown')) {
      console.log(
        '%cÀ mon père, Fadhel-Eddine Mosbah. Ce site lui est dédié.',
        'color: #888; font-style: italic; font-size: 14px;'
      );
      console.log('LinkedIn : https://www.linkedin.com/in/fadhel-eddine-mosbah-2018/');
      sessionStorage.setItem('tributeShown', 'true');
    }
  }, []);

  if (isMaintenanceLoading || isAuthChecking) {
    return <LoadingSpinner text="Chargement de StuJob..." />;
  }

  if (maintenanceError) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <ErrorIcon color="error" sx={{ fontSize: 48 }} />
        <Typography variant="h6" color="error">
          {maintenanceError}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </Box>
    );
  }

  return (
    <HelmetProvider>
      <ThemeProvider>
        <CssBaseline />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {isMaintenance && (!session || userRole !== 'admin') ? (
              <Routes>
                <Route path="*" element={<MaintenanceMode />} />
              </Routes>
            ) : (
              <AppContent />
            )}
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

// HomeSwitcher reçoit maintenant selectedRole en props
interface HomeSwitcherProps {
  selectedRole: 'etudiant' | 'entreprise';
}

const HomeSwitcher: React.FC<HomeSwitcherProps> = ({ selectedRole }) => {
  return (
    <main style={{ flex: 1, paddingBottom: '20px' }}>
      {selectedRole === 'entreprise' ? <Home /> : <HomeEtudiant />}
    </main>
  );
};

export default App; 