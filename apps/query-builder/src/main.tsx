import { createTheme, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './app/App';
import Faq from './app/components/Faq/Faq';
import Home from './app/components/Home/Home';

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
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'learning-planner',
                element: <Home />
            },
            {
                path: 'faq',
                element: <Faq />
            }
        ]
        // errorElement: ??
    }
]);
root.render(
    <StrictMode>
        <ThemeProvider theme={muiTheme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    </StrictMode>
);
