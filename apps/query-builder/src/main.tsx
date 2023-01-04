import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createTheme, ThemeProvider, Typography } from '@mui/material';
import App from './app/app';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#eb6029',
      light: '#f9cfbf',
      dark: '#e34419',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      main: '#4db6ac',
      light: '#cae9e6',
      dark: '#349e92',
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Typography>
      <ThemeProvider theme={muiTheme}>
        <App />
      </ThemeProvider>
    </Typography>
  </StrictMode>
);
