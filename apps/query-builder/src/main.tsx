import { createTheme, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { AuthProvider } from 'react-auth-kit';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './app/App';
import ProtectedRoute from './app/components/ProtectedRoute/ProtectedRoute';
import Faq from './app/pages/Faq';
import Home from './app/pages/Home';
import Login from './app/pages/Login';
import MyProfile from './app/pages/MyProfile';
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

const Main = () => {
    return (
        <StrictMode>
            <ThemeProvider theme={muiTheme}>
                <AuthProvider
                    authType={'cookie'}
                    authName={'_auth'}
                    cookieDomain={window.location.hostname}
                    cookieSecure={window.location.protocol === 'https:'}
                >
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<App />}>
                                <Route
                                    path="learning-planner"
                                    element={
                                        <ProtectedRoute>
                                            <Home />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="faq"
                                    element={
                                        <ProtectedRoute>
                                            <Faq />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="profile"
                                    element={
                                        <ProtectedRoute>
                                            <MyProfile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="register" element={<SignUp />} />
                                <Route path="login" element={<Login />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProvider>
        </StrictMode>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Main />);
