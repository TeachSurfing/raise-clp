import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutline from '@mui/icons-material/PersonOutline';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useSignOut } from 'react-auth-kit';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import useAppStore from '../../state/app.store';
import './Navbar.scss';

const ResponsiveAppBar = () => {
    const store = useAppStore();
    const isloggedIn = store.isLoggedIn();
    const userInitial = store.user?.name?.charAt(0) || '';
    const signOut = useSignOut();
    const navigate: NavigateFunction = useNavigate();
    const pathname: string = useLocation().pathname;

    const menuClasses = (route: string): string => {
        const classes = ['clp-menu-item-btn'];
        const matchRoute = pathname === route;
        return classes.concat(matchRoute ? 'clp-menu-item-btn--active' : '').join(' ');
    };

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [avatarEl, setAvatarEl] = React.useState<null | HTMLElement>(null);

    const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAvatarEl(event.currentTarget);
    };
    const handleOnCloseAvatar = () => {
        setAvatarEl(null);
    };
    const handleSignIn = () => {
        setAvatarEl(null);
        navigate('login');
    };
    const handleMyProfileClick = () => {
        setAvatarEl(null);
        navigate('profile');
    };
    const handleGoToLP = () => {
        setAvatarEl(null);
        navigate('learning-planner');
    };
    const handleCloseNavMenu = () => {
        setAvatarEl(null);
    };
    const handleLogoutClick = () => {
        setAvatarEl(null);
        signOut();
        store.setUser(null);
        navigate('login');
    };
    const handleFaqClick = (_: React.MouseEvent<HTMLElement>) => {
        setAvatarEl(null);
        navigate('faq');
    };

    return (
        <AppBar className="navbar" position="static" sx={{ bgcolor: 'white' }}>
            <Container>
                <Toolbar disableGutters>
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
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'Museo',
                            fontSize: 22,
                            fontWeight: 400,
                            color: 'inherit',
                            textDecoration: 'none'
                        }}
                    >
                        TeachSurfing
                    </Typography>

                    {/* Mobile */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                            visibility: isloggedIn ? 'visible' : 'hidden'
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={handleMobileMenuClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' }
                            }}
                        >
                            <MenuItem onClick={handleGoToLP}>
                                <Typography textAlign="center">Learning Planner</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            visibility: isloggedIn ? 'visible' : 'hidden'
                        }}
                    >
                        <Button
                            onClick={handleGoToLP}
                            className={menuClasses('/learning-planner')}
                            sx={{
                                my: 2,
                                color: 'black',
                                fontFamily: 'MuseoSans',
                                fontSize: 12,
                                display: 'block',
                                ':hover': 'color: blue'
                            }}
                        >
                            Learning Planner
                        </Button>
                    </Box>

                    {!isloggedIn ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Sign in">
                                <MenuItem className="login-btn" onClick={handleSignIn}>
                                    <Typography textAlign="center">Sign in</Typography>
                                </MenuItem>
                            </Tooltip>
                        </Box>
                    ) : null}

                    {/* Avatar Menu */}
                    <Box sx={{ flexGrow: 0, display: isloggedIn ? 'block' : 'none' }}>
                        <Tooltip title="Menu">
                            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                                <Avatar alt="Menu avatar">{userInitial}</Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={avatarEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={Boolean(avatarEl)}
                            onClose={handleOnCloseAvatar}
                        >
                            <MenuItem className={menuClasses('/profile')} onClick={handleMyProfileClick}>
                                <IconButton
                                    onClick={handleMyProfileClick}
                                    sx={{ p: 0, color: 'black', marginRight: '8px' }}
                                >
                                    <PersonOutline color="primary" />
                                </IconButton>
                                <Typography textAlign="center">My Profile</Typography>
                            </MenuItem>
                            <MenuItem className={menuClasses('/faq')} onClick={handleFaqClick}>
                                <IconButton
                                    sx={{ p: 0, color: 'black', marginRight: '8px' }}
                                    onClick={handleFaqClick}
                                >
                                    <HelpOutlineIcon color="primary" />
                                </IconButton>
                                <Typography textAlign="center">FAQ</Typography>
                            </MenuItem>
                            <MenuItem className={menuClasses('/logout')} onClick={handleLogoutClick}>
                                <IconButton
                                    onClick={handleLogoutClick}
                                    sx={{ p: 0, color: 'black', marginRight: '8px' }}
                                >
                                    <Logout color="warning" />
                                </IconButton>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
