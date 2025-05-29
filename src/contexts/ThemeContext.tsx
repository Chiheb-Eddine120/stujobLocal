import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const darkBg = '#181818';
  const darkText = '#F3F3F3';

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
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
      background: {
        default: isDarkMode ? darkBg : '#FFFFFF',
        paper: isDarkMode ? darkBg : '#FDF8FF',
      },
      text: {
        primary: isDarkMode ? darkText : '#1A1A1A',
        secondary: isDarkMode ? '#B0B0B0' : '#555',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
      allVariants: {
        color: isDarkMode ? darkText : undefined,
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
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 16,
            border: isDarkMode ? '1px solid #232323' : '1px solid #F3E8FF',
            backgroundColor: isDarkMode ? darkBg : '#FDF8FF',
            color: isDarkMode ? darkText : undefined,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? darkBg : '#FFF',
            color: isDarkMode ? darkText : undefined,
            borderRight: isDarkMode ? '1px solid #232323' : undefined,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? darkBg : 'linear-gradient(90deg, #A236EC 0%, #FF28C6 50%, #FF7970 100%)',
            color: isDarkMode ? darkText : undefined,
            boxShadow: 'none',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? darkBg : '#FFF',
            color: isDarkMode ? darkText : undefined,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? darkBg : '#FFF',
            color: isDarkMode ? darkText : undefined,
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? darkBg : '#FFF',
            color: isDarkMode ? darkText : undefined,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: isDarkMode ? darkText : undefined,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDarkMode ? '#232323' : '#F3E8FF',
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 