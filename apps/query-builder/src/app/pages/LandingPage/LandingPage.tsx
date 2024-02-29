import GitHubIcon from '@mui/icons-material/GitHub';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import 'react-querybuilder/dist/query-builder.scss';
import { useNavigate } from 'react-router-dom';
import euLogo from '../../../assets/img/eu-logo.png';
import heidelbergLogo from '../../../assets/img/heidelberg-logo.png';
import vilniusLogo from '../../../assets/img/vilnius-uni-logo.svg';
import useAppStore from '../../state/app.store';
import './LandingPage.scss';

const LandingPage = () => {
    const store = useAppStore();
    const navigate = useNavigate();

    // Click Actions
    const handleHowWorksButton = () => {
        navigate('./learning-plans');
    };
    const handleCreateAccountButton = () => {
        navigate(store.isLoggedIn() ? './learning-plans' : './login');
    };
    const handleGitHubBtnClicked = () => {
        window.open('https://github.com/TeachSurfing/raise-clp', '_blank');
    };
    return (
        <div className="landing-page">
            <section className="green-section">
                <Container sx={{ maxWidth: 960 }} maxWidth={false}>
                    <Grid container columnSpacing={0}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h1"
                                sx={{
                                    mb: '16px',
                                    fontSize: 48,
                                    fontWeight: 500,
                                    textShadow:
                                        '0px 3px 5px rgba(0, 0, 0, 0.20), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)'
                                }}
                                color="white"
                            >
                                Your Custom Learning Plan Tool
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    mb: '32px',
                                    fontSize: 20,
                                    fontWeight: 300,
                                    textShadow:
                                        '0px 3px 5px rgba(0, 0, 0, 0.20), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)'
                                }}
                                color="rgba(255, 255, 255, 0.70)"
                            >
                                Make your online courses more attractive and personalised for your learners.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className="btn-wrapper">
                            <Button
                                variant="outlined"
                                className="clp-button clp-button--rounded"
                                onClick={handleHowWorksButton}
                            >
                                Get started
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </section>
            <section className="home-section">
                <Container sx={{ maxWidth: 960 }} maxWidth={false}>
                    <Grid container columnSpacing={0}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: '32px',
                                    fontSize: 32,
                                    fontWeight: 500,
                                    textTransform: 'uppercase'
                                }}
                            >
                                About the project
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ mb: '0px', fontSize: 18, fontWeight: 300 }} lineHeight={'32px'}>
                                The Custom Learning Planner Tool (CLP-Tool) is an open-source software
                                developed within the EU Erasmus+ program “Young Refugees AI Student
                                Empowerment Program”. Originating from the need to enhance the personalisation
                                of online courses for learners, this tool empowers educators to digitise their
                                educational coaching activities. By collecting and analysing user data, it
                                takes the initial steps towards building an AI-based decision-making system to
                                personalise the learning experience.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </section>
            <section className="home-section home-section--grey">
                <Container sx={{ maxWidth: 960 }} maxWidth={false}>
                    <Grid container columnSpacing={0}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: '30px',
                                    fontSize: 32,
                                    fontWeight: 500,
                                    textTransform: 'uppercase'
                                }}
                            >
                                How it works
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{ mb: '48px', fontSize: 18, fontWeight: 300 }}
                                lineHeight={'32px'}
                            >
                                Educators are provided with technical and pedagogical guidance to construct
                                questionnaires and define decision-making rules. These rules determine which
                                educational content is recommended to learners based on their background,
                                interests, and prior knowledge.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="h5"
                                sx={{ mb: '32px', fontSize: 22, fontWeight: 500 }}
                                textAlign={'center'}
                                className="hiw-for-whom-h5"
                            >
                                For Educators
                            </Typography>
                            <Typography variant="h5" sx={{ mb: '32px', fontSize: 22, fontWeight: 300 }}>
                                <ul className="hiw-list">
                                    <li>Register on this website or deploy your own version of the tool.</li>
                                    <li>Follow guided steps to create a tailored survey.</li>
                                    <li>Import your course structure.</li>
                                    <li>
                                        Utilize guidance to establish decision-making rules for content
                                        recommendations.
                                    </li>
                                </ul>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="h5"
                                sx={{ mb: '32px', fontSize: 22, fontWeight: 500 }}
                                textAlign={'center'}
                                className="hiw-for-whom-h5"
                            >
                                For Students
                            </Typography>
                            <Typography variant="h5" sx={{ mb: '32px', fontSize: 22, fontWeight: 300 }}>
                                <ul className="hiw-list">
                                    <li>No registration required! This tool is used only by educators.</li>
                                    <li>Simply complete the survey provided by your educators.</li>
                                    <li>Receive a customized learning plan in your mailbox.</li>
                                    <li>
                                        If using Learnpress LMS, see the optional content marked in the course
                                        curriculum.
                                    </li>
                                </ul>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} className="btn-wrapper">
                            <Button className="clp-button" onClick={handleCreateAccountButton}>
                                Create an account
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </section>
            <section className="home-section home-section--illustration"></section>
            <section className="home-section">
                <Container sx={{ maxWidth: 960 }} maxWidth={false}>
                    <Grid container columnSpacing={0}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: '32px',
                                    fontSize: 32,
                                    fontWeight: 500,
                                    textTransform: 'uppercase'
                                }}
                            >
                                Partners
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ mb: '0px', fontSize: 18, fontWeight: 300 }} lineHeight={'32px'}>
                                The CLP tool is developed in collaboration with TeachSurfing gUG (Germany),
                                Heidelberg University of Education (Germany), CESIE (Italy), CSI (Cyprus), and
                                GEYC (Romania). For inquiries about the course, contact us at
                                <span>
                                    {' '}
                                    <a
                                        href="mailto:evelp@teachsurfing.de"
                                        target="_blank"
                                        className="clp-link"
                                        rel="noreferrer"
                                    >
                                        evelp@teachsurfing.de
                                    </a>
                                </span>
                                .
                            </Typography>
                        </Grid>
                        <Grid item xs={12} container className="logos-wrapper">
                            <Grid item xs={12} sm={4} className="logos-wrapper__img">
                                <img src={euLogo} height={52} alt="eu-logo" />
                            </Grid>
                            <Grid item xs={12} sm={4} className="logos-wrapper__img">
                                <img src={heidelbergLogo} height={88} alt="heidelberg-logo" />
                            </Grid>
                            <Grid item xs={12} sm={4} className="logos-wrapper__img">
                                <img src={vilniusLogo} height={88} alt="vilnius-uni-logo" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </section>
            <section className="home-section home-section--illustration"></section>
            <section className="home-section">
                <Container sx={{ maxWidth: 960 }} maxWidth={false}>
                    <Grid container columnSpacing={0}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: '32px',
                                    fontSize: 32,
                                    fontWeight: 500,
                                    textTransform: 'uppercase'
                                }}
                            >
                                TECHNICAL SETUP
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ mb: '0px', fontSize: 18, fontWeight: 300 }} lineHeight={'32px'}>
                                The Beta version of the tool integrates Paperform for survey creation and
                                Learnpress Learning Management System for course structure import. Future
                                development aims to support entering course structures and creating surveys in
                                a more versatile manner, ensuring educators aren't limited to specific
                                technologies or platforms.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </section>
            <section className="home-section home-section--grey">
                <Container sx={{ maxWidth: 960 }} maxWidth={false}>
                    <Grid container columnSpacing={0}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: '30px',
                                    fontSize: 32,
                                    fontWeight: 500,
                                    textTransform: 'uppercase'
                                }}
                            >
                                OPEN SOURCE
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{ mb: '48px', fontSize: 18, fontWeight: 300 }}
                                lineHeight={'32px'}
                            >
                                Get involved in shaping the future of education technology! Contribute to our
                                open-source project or deploy your own instance of the Custom Learning Planner
                                Tool. <br />
                                <span>
                                    <a
                                        href="https://github.com/TeachSurfing/raise-clp"
                                        target="_blank"
                                        className="clp-link"
                                        rel="noreferrer"
                                    >
                                        Explore our GitHub project
                                    </a>
                                </span>{' '}
                                and contact us at{' '}
                                <span>
                                    {' '}
                                    <a
                                        href="mailto:evelp@teachsurfing.de"
                                        target="_blank"
                                        className="clp-link"
                                        rel="noreferrer"
                                    >
                                        evelp@teachsurfing.de
                                    </a>
                                </span>{' '}
                                to join the collaboration. Let's innovate together for a better educational
                                experience!
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} className="btn-wrapper">
                            <Button
                                className="clp-button"
                                startIcon={<GitHubIcon />}
                                onClick={handleGitHubBtnClicked}
                            >
                                Explore on GitHub
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </section>
        </div>
    );
};
export default LandingPage;
