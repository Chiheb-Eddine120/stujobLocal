import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import MaintenanceMode from './pages/MaintenanceMode';
import { useMaintenance } from './hooks/useMaintenance';
import Home from './pages/Home';
import DemandeForm from './pages/DemandeForm';
import SuiviDemande from './pages/SuiviDemande';
import Etudiants from './pages/Etudiants';
import EspaceEtudiant from './pages/EspaceEtudiant';
import About from './pages/About';
import Contact from './pages/Contact';
import DashboardMenu from './pages/DashboardMenu';
import DashboardMatch from './pages/DashboardMatch';
import DashboardUsers from './pages/DashboardUsers';
import DashboardStats from './pages/DashboardStats';
import DashboardNotifications from './pages/DashboardNotifications';
import DashboardPreRegistrations from './pages/DashboardPreRegistrations';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Privacy from './pages/Privacy';
import DashboardSettings from './pages/DashboardSettings';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A236EC',
      light: '#FF28C6',
      dark: '#8929BD',
    },
    secondary: {
      main: '#FF7970',
      light: '#FF9B94',
      dark: '#CC614A',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(90deg, #A236EC 0%, #FF28C6 50%, #FF7970 100%)',
            boxShadow: '0 4px 10px rgba(162, 54, 236, 0.25)',
            '&:hover': {
              background: 'linear-gradient(90deg, #8929BD 0%, #E619B0 50%, #E66A61 100%)',
              boxShadow: '0 6px 12px rgba(162, 54, 236, 0.35)',
            },
          },
        },
        text: {
          background: 'transparent',
          boxShadow: 'none',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #A236EC 0%, #FF28C6 50%, #FF7970 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const { isMaintenance, isLoading: isMaintenanceLoading, error: maintenanceError } = useMaintenance();
  const { session, userRole, isChecking: isAuthChecking } = useAuth();

  if (isMaintenanceLoading || isAuthChecking) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
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
      <ThemeProvider theme={theme}>
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
              <>
                <Navbar />
                <main style={{ flex: 1, paddingBottom: '20px' }}>
                  <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Routes protégées */}

                    <Route 
                      path="/demande" 
                      element={<DemandeForm />}
                    />
                    <Route 
                      path="/suivi" 
                      element={<SuiviDemande />}
                    />
                    <Route 
                      path="/suivi/:trackingNumber" 
                      element={<SuiviDemande />}
                    />
                    <Route 
                      path="/etudiants" 
                      element={<Etudiants />}
                    />

                    {/* Routes Dashboard */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <DashboardMenu />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/pre-registrations" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <DashboardPreRegistrations />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/match" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <DashboardMatch />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/users" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <DashboardUsers />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/stats" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <DashboardStats />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/notifications" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <DashboardNotifications />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/settings" 
                      element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <DashboardSettings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/espace-etudiant" 
                      element={
                        <ProtectedRoute requiredRoles={['student']}>
                          <EspaceEtudiant />
                        </ProtectedRoute>
                      }
                    />

                    {/* Route 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <CookieConsent />
              </>
            )}
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App; 