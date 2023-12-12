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
import './Navbar.scss';

const pages = ['Learning Planner'];

const ResponsiveAppBar = (props: { handleInfoButtonClick: () => void }) => {
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
    const handleMyProfileClick = () => {
        setAvatarEl(null);
    };
    const handleCloseNavMenu = () => {
        setAvatarEl(null);
    };
    const handleLogoutClick = () => {
        setAvatarEl(null);
    };
    const handleFaqClick = (_: React.MouseEvent<HTMLElement>) => {
        setAvatarEl(null);
        props.handleInfoButtonClick();
    };

    return (
        <AppBar className="navbar" position="static" sx={{ bgcolor: 'white' }}>
            <Container>
                <Toolbar disableGutters>
                    <a href="#fake" className="logo-link" style={{ textDecoration: 'none' }}>
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
                        href="#app-bar-with-responsive-menu"
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
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => {
                            return (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    className="clp-menu-item-btn"
                                    sx={{
                                        my: 2,
                                        color: 'black',
                                        fontFamily: 'MuseoSans',
                                        fontSize: 12,
                                        display: 'block',
                                        ':hover': 'color: blue'
                                    }}
                                >
                                    {page}
                                </Button>
                            );
                        })}
                    </Box>

                    {/* Desktop */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Menu">
                            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                                <Avatar alt="Menu avatar" src="" />
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
                            <MenuItem className="clp-menu-item-btn" onClick={handleMyProfileClick}>
                                <IconButton
                                    onClick={handleMyProfileClick}
                                    sx={{ p: 0, color: 'black', marginRight: '8px' }}
                                >
                                    <PersonOutline color="primary" />
                                </IconButton>
                                <Typography textAlign="center">My Profile</Typography>
                            </MenuItem>
                            <MenuItem className="clp-menu-item-btn" onClick={handleFaqClick}>
                                <IconButton
                                    onClick={handleFaqClick}
                                    sx={{ p: 0, color: 'black', marginRight: '8px' }}
                                >
                                    <HelpOutlineIcon color="primary" />
                                </IconButton>
                                <Typography textAlign="center">Help</Typography>
                            </MenuItem>
                            <MenuItem className="clp-menu-item-btn" onClick={handleLogoutClick}>
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
