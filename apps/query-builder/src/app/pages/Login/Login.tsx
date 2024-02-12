import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { useSignIn } from 'react-auth-kit';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import useAppStore from '../../state/app.store';
import './Login.scss';

type LoginFormData = {
    email: string;
    password: string;
};

const Login = () => {
    const store = useAppStore();
    const signIn = useSignIn();
    const navigate: NavigateFunction = useNavigate();
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
    const handleSubmit = async (values: LoginFormData, { setSubmitting }: FormikHelpers<LoginFormData>) => {
        const url = `${(window as any).env.API_URL as string}/login`;
        setSubmitting(true);
        const response: Response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                ...values
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        if (response.ok) {
            store.setUser(json.user);
            signIn({
                token: json.token,
                expiresIn: 3600 * 24, // 1 day
                tokenType: 'Bearer',
                authState: {
                    ...json.user
                }
            });
            navigate('../learning-plans');
        } else {
            store.setAlert({
                severity: 'error',
                message: json.message
            });
        }
    };
    const handleValidate = (values: LoginFormData) => {
        const errors = {} as LoginFormData;
        if (!values.email) {
            errors.email = 'Required';
        } else if (!emailRegex.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        return errors;
    };
    return (
        <div className="login">
            <div className="login__img">
                <a href="/" className="logo-link" style={{ textDecoration: 'none' }}>
                    <img
                        alt="teach-surfing-logo"
                        src="https://cockpit.teachsurfing.org//storage/uploads/2022/11/29/638651adaea9aLogo_green_72dpi_RGB-64x64.svg"
                    />
                </a>
            </div>
            <Container>
                <div className="login__form-wrapper">
                    <h2 className="login__form-wrapper__title">Login</h2>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validate={handleValidate}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="login__form-wrapper__form">
                                <Field component={TextField} name="email" type="email" label="Email" />
                                <br />
                                <Field
                                    component={TextField}
                                    type="password"
                                    label="Password"
                                    name="password"
                                />
                                {isSubmitting && <LinearProgress />}
                                <br />
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="login-btn"
                                >
                                    Login
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <Link className="login__form-wrapper__signup" href="/register" underline="always">
                        Not registered yet? Sign up here.
                    </Link>
                </div>
            </Container>
        </div>
    );
};

export default Login;
