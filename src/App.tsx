import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DemandeForm from './pages/DemandeForm';
import SuiviDemande from './pages/SuiviDemande';
import Etudiants from './pages/Etudiants';
import About from './pages/About';
import Contact from './pages/Contact';
import DashboardMatch from './pages/DashboardMatch';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, paddingBottom: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/demande" element={<DemandeForm />} />
              <Route path="/suivi" element={<SuiviDemande />} />
              <Route path="/suivi/:trackingNumber" element={<SuiviDemande />} />
              <Route path="/etudiants" element={<Etudiants />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardMatch />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App; 