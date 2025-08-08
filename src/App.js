import React from 'react';
import { useQuery } from 'react-query';
// import { login } from './api/auth/login';
import './App.css';
import Navbar from './components/Navbar';
import { Suspense, lazy, createContext, useMemo, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReactToastContainer from './components/Toast-Container';
import { ThemeProvider } from '@mui/material';
import { getTheme } from './theme';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const MyHome = lazy(() => import('./pages/Home'));
const MyProfile = lazy(() => import('./pages/Profile/Profile'));
const ResetPassword = lazy(() => import('./pages/Auth/Reset-Password'));
const UserHome = lazy(() => import('./pages/Main/UserHome'));
const FriendList = lazy(() => import('./pages/Friends/FriendList/friendList'));
const BlogDetail = lazy(() => import('./pages/BlogDetail/BlogDetail'));

const App = () => {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', mode);
    window.updateTheme(mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <ReactToastContainer />
        <Suspense fallback={<div>Component1 are loading please wait...</div>}>
          <Router>
            <Routes>
              <Route path="/" element={<MyHome />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/user-home" element={<UserHome />} />
              <Route path="/friends" element={<FriendList />} />
              <Route path="/blog/:blogId" element={<BlogDetail />} />
            </Routes>
          </Router>
        </Suspense>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
