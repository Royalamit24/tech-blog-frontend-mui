import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, // Reduce default retries from 3 to 1
      staleTime: 60000, // 1 minute default stale time
    },
  },
});

// Function to update CSS theme attributes
const updateTheme = (mode) => {
  document.documentElement.setAttribute('data-theme', mode);
};

// Initialize theme from localStorage or default to 'light'
const savedTheme = localStorage.getItem('theme') || 'light';
updateTheme(savedTheme);

const theme = createTheme();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// Export the update function for use in App.js
window.updateTheme = updateTheme;

reportWebVitals();
