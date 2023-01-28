import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import './styles/stars.css';
import ReactGA from 'react-ga';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const TRACKING_ID = "G-WF0LJGRRSV"; // OUR_TRACKING_ID

ReactGA.initialize(TRACKING_ID);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div id='stars'></div>
      <div id='stars2'></div>
      <div id='stars3'></div>
      <App /> 
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

