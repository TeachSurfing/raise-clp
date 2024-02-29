import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <Container sx={{ maxWidth: 1300 }} maxWidth={false}>
                <Grid container>
                    <Grid item={true} xs={12} sm={8}>
                        <Grid item={true} xs={12}>
                            <div className="footer__logo">
                                <a href="/" className="logo-link" style={{ textDecoration: 'none' }}>
                                    <img
                                        alt="teach-surfing-logo"
                                        className="logo-link__logo"
                                        src="https://cockpit.teachsurfing.org//storage/uploads/2022/11/29/638651adaea9aLogo_green_72dpi_RGB-64x64.svg"
                                    />
                                </a>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'flex' },
                                        fontFamily: 'Museo',
                                        fontSize: 22,
                                        fontWeight: 400,
                                        color: '#fff',
                                        textDecoration: 'none'
                                    }}
                                >
                                    TeachSurfing
                                </Typography>
                            </div>
                            <div>
                                <Typography
                                    sx={{
                                        mb: '16px',
                                        fontSize: 14,
                                        lineHeight: '20px',
                                        fontWeight: 500
                                    }}
                                    color="rgba(255, 255, 255, 0.50)"
                                >
                                    Some people don't have access to knowledge. <br />
                                    If we share knowledge as resources, we can reach people.
                                </Typography>
                            </div>
                            <hr />
                            <Grid container columnSpacing={0}>
                                <Grid item={true} xs={12} sm={3}>
                                    <ul>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/blog"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Blog
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/oer"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Open Educational Resources
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/organizations"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Organizations
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/stories"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Stories
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://vr2.verticalresponse.com/s/teachsurfing-news"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Newsletter
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/knowledge-sharing-festival"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Knowledge Sharing Festival 2023
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/live-training-palermo"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Live Training Palermo (2024)
                                            </Link>
                                        </li>
                                    </ul>
                                </Grid>
                                <Grid item={true} xs={12} sm={3}>
                                    <ul>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/about-us"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                About Us
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/goodmatch"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Software Solutions
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/jobs"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Jobs
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://www.betterplace.org/en/organisations/25631-teachsurfing-gemeinnuetzige-ug-haftungbeschraenkt"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Donate
                                            </Link>
                                        </li>
                                    </ul>
                                </Grid>
                                <Grid item={true} xs={12} sm={3}>
                                    <ul>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/terms-of-use"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Terms of Use
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/privacy"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Privacy
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="https://teachsurfing.org/imprint"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Imprint
                                            </Link>
                                        </li>
                                    </ul>
                                </Grid>
                                <Grid item={true} xs={12} sm={3}>
                                    <ul>
                                        <li>
                                            <Link
                                                href="/faq"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                FAQ
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/login"
                                                fontSize={14}
                                                underline="none"
                                                className="footer-link"
                                            >
                                                Login
                                            </Link>
                                        </li>
                                    </ul>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item={true} xs={12} sm={4} className="stats">
                        <Grid container marginBottom={2}>
                            <Grid item={true} xs={6} className="stat-wrapper">
                                <div className="stat">
                                    <span className="stat__value stat__value--ts">3739</span>
                                    <span className="stat__label">Techsurfers</span>
                                </div>
                            </Grid>
                            <Grid item={true} xs={6} className="stat-wrapper">
                                <div className="stat">
                                    <span className="stat__value stat__value--h">284</span>
                                    <span className="stat__label">
                                        Host
                                        <br />
                                        Organizations
                                    </span>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item={true} xs={6} className="stat-wrapper">
                                <div className="stat">
                                    <span className="stat__value stat__value--ss">82</span>
                                    <span className="stat__label">SUCCESS STORIES</span>
                                </div>
                            </Grid>
                            <Grid item={true} xs={6} className="stat-wrapper">
                                <div className="stat">
                                    <span className="stat__value stat__value--c">284</span>
                                    <span className="stat__label">Countries</span>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <Typography
                            sx={{
                                mt: '32px',
                                fontSize: 14,
                                lineHeight: '22px',
                                fontWeight: 500
                            }}
                            color="rgba(255, 255, 255, 0.50)"
                        >
                            © TeachSurfing 2024 - TeachSurfing is a nonprofit social enterprise (gemeinnützige
                            UG)
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </footer>
    );
};
export default Footer;
