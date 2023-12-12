import { createTheme, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/App';

const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#4db6ac',
            light: '#cae9e6',
            dark: '#349e92',
            contrastText: 'rgba(0, 0, 0, 0.87)'
        },
        secondary: {
            main: '#4db6ac',
            light: '#cae9e6',
            dark: '#349e92'
        }
    }
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <StrictMode>
        <ThemeProvider theme={muiTheme}>
            <App />
        </ThemeProvider>
    </StrictMode>
);
