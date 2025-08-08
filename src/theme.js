import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#4c00e6',
      light: '#7c40ff',
      dark: '#3900b3',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#000000',
      secondary: mode === 'dark' ? '#b3b3b3' : '#666666',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:not(.createOneButton)': {
            backgroundColor: '#4c00e6',
            '&:hover': {
              backgroundColor: '#3900b3',
            },
            color: '#ffffff',
          }
        },
        outlined: {
          borderColor: '#4c00e6',
          color: '#4c00e6',
          '&:hover': {
            borderColor: '#3900b3',
            backgroundColor: 'rgba(76, 0, 230, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4c00e6',
        },
      },
    },
  },
});