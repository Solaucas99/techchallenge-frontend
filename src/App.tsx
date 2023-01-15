import React from 'react';
import AOS from 'aos';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

import { GlobalDiv } from './Styles/GlobalDiv';

import 'aos/dist/aos.css';
import UserContextProvider from './Providers/UserContextProvider';
import { AppRoutes } from './Routes';
import AppContextProvider from './Providers/AppContextProvider';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  AOS.init();

  return (
    <AppContextProvider>
      <UserContextProvider>
        <Router>
          <GlobalDiv>
            <ThemeProvider theme={darkTheme}>
              <CssBaseline />

              <AppRoutes />
            </ThemeProvider>

            <ToastContainer theme="colored" position="bottom-right" />
          </GlobalDiv>
        </Router>
      </UserContextProvider>
    </AppContextProvider>
  );
}

export default App;
