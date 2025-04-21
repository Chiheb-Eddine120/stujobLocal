import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { authService } from '../services/authService';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

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
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.5rem',
                mr: 6,
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  opacity: 0.9,
                },
                '&::after': {
                  content: '""',
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'white',
                  transform: 'rotate(45deg)',
                  marginLeft: '2px',
                  marginBottom: '8px'
                }
              }}
            >
              StuJob
            </Typography>

            <Box sx={{ display: 'flex' }}>
              {(userRole === 'entreprise' || userRole === 'admin') && (
                <>
                  <Button
                    component={RouterLink}
                    to="/demande"
                    disableRipple
                    disableElevation
                    variant="text"
                    sx={buttonStyle}
                  >
                    Faire une demande
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

              {(userRole === 'student' || userRole === 'admin') && (
                <Button
                  component={RouterLink}
                  to="/espace-etudiant"
                  disableRipple
                  disableElevation
                  variant="text"
                  sx={buttonStyle}
                >
                  Mon espace étudiant
                </Button>
              )}


            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              <>
                {userRole === 'admin' && (
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    disableRipple
                    disableElevation
                    variant="text"
                    sx={{
                      color: 'white',
                      minWidth: '40px',
                      width: '40px',
                      height: '40px',
                      mr: 3,
                      p: 0,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'white',
                        color: '#9333EA',
                        transform: 'rotate(90deg)',
                        boxShadow: '0 4px 8px rgba(147, 51, 234, 0.2)',
                      }
                    }}
                  >
                    <DashboardIcon />
                  </Button>
                )}

                {isAuthenticated ? (
                  <>
                    <IconButton
                      onClick={handleMenu}
                      sx={{ p: 0 }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 38, 
                          height: 38,
                          backgroundColor: 'transparent',
                          color: 'white',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          }
                        }}
                      >
                        F
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      sx={{
                        '& .MuiPaper-root': {
                          borderRadius: 2,
                          minWidth: 180,
                          boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
                          '& .MuiMenu-list': {
                            padding: '4px 0',
                          },
                          '& .MuiMenuItem-root': {
                            '& .MuiSvgIcon-root': {
                              fontSize: 18,
                              color: '#666',
                              marginRight: 1.5,
                            },
                            '&:active': {
                              backgroundColor: '#666',
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon />
                        Se déconnecter
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    component={RouterLink}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{
                      ...buttonStyle,
                      mr: 0,
                      border: '1px solid white',
                      '&:hover': {
                        ...buttonStyle['&:hover'],
                        borderColor: 'white',
                      }
                    }}
                  >
                    Se connecter
                  </Button>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 