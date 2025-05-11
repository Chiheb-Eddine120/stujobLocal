import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { authService } from '../services/authService';
import { UserRole } from '../types';
import Logo from './Logo';

interface NavbarProps {
  modeAccueil?: 'etudiant' | 'entreprise';
}

const Navbar: React.FC<NavbarProps> = ({ modeAccueil }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isDashboardEtudiant = location.pathname.startsWith('/dashboard-etudiant');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const authenticated = await authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          const role = await authService.getCurrentUser();
          setUserRole(role?.role as UserRole);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setIsAuthenticated(false);
      setUserRole(null);
      handleClose();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <List>
        {modeAccueil === 'entreprise' && (
          <>
            <ListItem 
              button 
              component={RouterLink} 
              to="/demande"
              onClick={handleDrawerToggle}
              sx={{ py: 2 }}
            >
              <ListItemText primary="Introduire une demande" />
            </ListItem>
            <ListItem 
              button 
              component={RouterLink} 
              to="/suivi"
              onClick={handleDrawerToggle}
              sx={{ py: 2 }}
            >
              <ListItemText primary="Suivre une demande" />
            </ListItem>
          </>
        )}
        <ListItem 
          button 
          component={RouterLink} 
          to={isAuthenticated && userRole === 'student' ? '/espace-etudiant' : '/etudiants'}
          onClick={handleDrawerToggle}
          sx={{ py: 2 }}
        >
          <ListItemText primary={isAuthenticated && userRole === 'student' ? 'Mon Espace' : 'Vous êtes étudiant ?'} />
        </ListItem>
        {isAuthenticated && userRole === 'admin' && (
          <ListItem 
            button 
            component={RouterLink} 
            to="/dashboard"
            onClick={handleDrawerToggle}
            sx={{ py: 2 }}
          >
            <ListItemText primary="Dashboard" />
          </ListItem>
        )}
        {isAuthenticated && userRole === 'student' && isDashboardEtudiant && (
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ py: 2, mt: 2 }}
          >
            <ListItemText primary={<span style={{ color: '#e53935', fontWeight: 600 }}>Déconnexion</span>} />
          </ListItem>
        )}
      </List>
      <Box sx={{ textAlign: 'center', pb: 2, color: 'white', opacity: 0.7, fontSize: 14 }}>
        © {new Date().getFullYear()} Stujob
      </Box>
    </Box>
  );

  const buttonStyle = {
    color: 'white',
    textTransform: 'none',
    fontSize: '1.1rem',
    px: 2,
    py: 1,
    mr: 2,
    fontWeight: 500,
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'white',
      color: '#9333EA',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(147, 51, 234, 0.2)',
    }
  };

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(90deg, #9333EA 0%, #E355A3 50%, #FF8366 100%)',
          borderRadius: '15px',
          mx: 3,
          mt: 2,
          position: 'relative',
          maxWidth: 'calc(100% - 48px)',
          left: 0,
          right: 0,
          margin: '16px auto',
          '& .MuiToolbar-root': {
            minHeight: '60px',
            py: '30px',
            px: 3
          }
        }}
      >
        <Container 
          maxWidth={false}
          sx={{
            maxWidth: 'calc(100% - 32px)',
            px: 2
          }}
        >
          <Toolbar sx={{ py: 0.5, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon sx={{ fontSize: 32 }} />
              </IconButton>
              
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  mr: 6,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <Logo variant={modeAccueil === 'entreprise' ? 'partners' : 'students'} fontSize={28} color="white" />
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {modeAccueil === 'entreprise' && (
                  <>
                    <Button
                      component={RouterLink}
                      to="/demande"
                      disableRipple
                      disableElevation
                      variant="text"
                      sx={buttonStyle}
                    >
                      Introduire une demande
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/suivi"
                      disableRipple
                      disableElevation
                      variant="text"
                      sx={buttonStyle}
                    >
                      Suivre une demande
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <>
                  {isAuthenticated ? (
                    <>
                      {userRole === 'admin' && (
                        <Button
                          component={RouterLink}
                          to="/dashboard"
                          startIcon={
                            <DashboardIcon 
                              sx={{
                                transition: 'transform 0.3s ease',
                                transform: 'rotate(0deg)',
                                '.MuiButton-root:hover &': {
                                  transform: 'rotate(90deg)',
                                },
                              }}
                            />
                          }
                          sx={{
                            ...buttonStyle,
                            background: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              background: 'white',
                              color: '#9333EA',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(147, 51, 234, 0.2)',
                            }
                          }}
                        >
                          Dashboard
                        </Button>
                      )}
                      {userRole === 'student' && isDashboardEtudiant ? (
                        <>
                          <IconButton
                            onClick={handleMenu}
                            sx={{
                              color: 'white',
                              ml: 1,
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                              }
                            }}
                          >
                            <Avatar sx={{ bgcolor: 'white', color: '#9333EA' }}>
                              {userRole?.[0].toUpperCase()}
                            </Avatar>
                          </IconButton>
                        </>
                      ) : (
                        <>
                          {userRole === 'student' && !isDashboardEtudiant && (
                            <Button
                              component={RouterLink}
                              to="/dashboard-etudiant"
                              startIcon={
                                <DashboardIcon 
                                  sx={{
                                    transition: 'transform 0.3s ease',
                                    transform: 'rotate(0deg)',
                                    '.MuiButton-root:hover &': {
                                      transform: 'rotate(90deg)',
                                    },
                                  }}
                                />
                              }
                              sx={{
                                ...buttonStyle,
                                background: 'rgba(255, 255, 255, 0.1)',
                                ml: 2,
                                '&:hover': {
                                  background: 'white',
                                  color: '#9333EA',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(147, 51, 234, 0.2)',
                                }
                              }}
                            >
                              Mon espace étudiant
                            </Button>
                          )}
                          <IconButton
                            onClick={handleMenu}
                            sx={{
                              color: 'white',
                              ml: 1,
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                              }
                            }}
                          >
                            <Avatar sx={{ bgcolor: 'white', color: '#9333EA' }}>
                              {userRole?.[0].toUpperCase()}
                            </Avatar>
                          </IconButton>
                        </>
                      )}
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                          sx: {
                            mt: 1.5,
                            borderRadius: '12px',
                            minWidth: 180,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          }
                        }}
                      >
                        <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
                          <LogoutIcon sx={{ mr: 1, color: '#666' }} />
                          Déconnexion
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    modeAccueil === 'etudiant' && (
                      <Button
                        component={RouterLink}
                        to="/register"
                        startIcon={<LoginIcon />}
                        sx={{
                          ...buttonStyle,
                          background: 'rgba(255, 255, 255, 0.1)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)',
                          }
                        }}
                      >
                        Rejoindre notre réseau étudiant
                      </Button>
                    )
                  )}
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            background: 'linear-gradient(90deg, #9333EA 0%, #E355A3 50%, #FF8366 100%)',
            color: 'white',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 