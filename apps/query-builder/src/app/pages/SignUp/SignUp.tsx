import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import './SignUp.scss';

type SingUpFormData = {
    name: string;
    email: string;
    password: string;
    organizationName: string;
};

const SignUp = () => {
    const navigate: NavigateFunction = useNavigate();
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i;
    const handleSubmit = async (values: SingUpFormData, { setSubmitting }: FormikHelpers<SingUpFormData>) => {
        const url = `${(window as any).env.API_URL as string}/register`;
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
        setSubmitting(false);
        if (response.ok) {
            navigate('../login');
        }
    };
    const handleValidate = (values: SingUpFormData) => {
        const errors = {} as SingUpFormData;
        if (!values.name) errors.name = 'Required';
        if (!values.email) errors.email = 'Required';
        if (!emailRegex.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        if (!pwRegex.test(values.password)) {
            errors.password = `
            At least one alphabet (uppercase or lowercase) is required.
            At least one digit is required.
            The total length of the password must be at least 8 characters.
            `;
        }
        return errors;
    };
    return (
        <div className="signup">
            <div className="signup__img">
                <a href="/" className="logo-link" style={{ textDecoration: 'none' }}>
                    <img
                        alt="teach-surfing-logo"
                        src="https://cockpit.teachsurfing.org//storage/uploads/2022/11/29/638651adaea9aLogo_green_72dpi_RGB-64x64.svg"
                    />
                </a>
            </div>
            <Container>
                <div className="signup__form-wrapper">
                    <h2 className="signup__form-wrapper__title">Sign Up</h2>
                    <Formik
                        initialValues={{ email: '', password: '', name: '', organizationName: '' }}
                        validate={handleValidate}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="signup__form-wrapper__form">
                                <Field component={TextField} name="name" type="text" label="Name" />
                                <br />
                                <Field
                                    component={TextField}
                                    name="organizationName"
                                    type="text"
                                    label="Organization / Company Name"
                                />
                                <br />
                                <Field component={TextField} name="email" type="email" label="Email" />
                                <br />
                                <Field
                                    component={TextField}
                                    type="password"
                                    label="Password"
                                    name="password"
                                    className="password-field"
                                />
                                {isSubmitting && <LinearProgress />}
                                <br />
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="register-btn"
                                >
                                    Register
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <Link className="signup__form-wrapper__login" href="/login" underline="always">
                        Alerady registered? Sign in here.
                    </Link>
                </div>
            </Container>
        </div>
    );
};

export default SignUp;
