import { createTheme, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { AuthProvider } from 'react-auth-kit';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './app/App';
import Faq from './app/pages/Faq';
import Home from './app/pages/Home';
import Login from './app/pages/Login';
import SignUp from './app/pages/SignUp';

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
            },
            {
                path: 'register',
                element: <SignUp />
            },
            {
                path: 'login',
                element: <Login />
            }
        ]
        // errorElement: ??
    }
]);
root.render(
    <StrictMode>
        <ThemeProvider theme={muiTheme}>
            <AuthProvider
                authType={'cookie'}
                authName={'_auth'}
                cookieDomain={window.location.hostname}
                cookieSecure={window.location.protocol === 'https:'}
            >
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>
);
