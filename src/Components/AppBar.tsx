import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { BiCodeAlt, BiMenu } from 'react-icons/bi';
import { SxProps } from '@mui/material';
import { MdIncompleteCircle, MdLogout, MdWavingHand } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { styled } from '../Styles/stitches.config';
import { useUserContextProvider } from '../Providers/UserContextProvider';

const pages = [
  { title: 'Categorias', route: '/challenges/categories' },
  { title: 'Ranking', route: '/ranking' },
  { title: 'Sobre', route: '/about' },
];
const settings = [
  {
    title: 'Meus desafios',
    route: '/user/dashboard',
    icon: <MdIncompleteCircle />,
  },
  { route: '/user/logout', title: 'Logout', icon: <MdLogout /> },
];

const UsernameDiv = styled('div', {
  width: '100%',
  padding: '10px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  borderBottom: '2px solid $defaultGrayPallete',
  marginBottom: '2px',
});

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [appBarStyle, setAppBarStyle] = useState<SxProps>({
    background: 'transparent',
    height: '5.2em',
    boxShadow: 'none',
    transition: 'all 0.2s ease-out',
    zIndex: '33',
  });
  const navigate = useNavigate();

  const { userContext } = useUserContextProvider();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY <= 30) {
        setAppBarStyle(lastStyle => ({
          ...lastStyle,
          background: 'transparent',
          borderBottom: 'none',
          boxShadow: 'none',
        }));
        return;
      }

      if (window.scrollY > 30) {
        setAppBarStyle(lastStyle => ({
          ...lastStyle,
          background: '#2e2e2e',
          borderBottom: '4px solid #FFBB00',
          boxShadow: 'inherit',
        }));
      }
    });

    return () => {
      // return a cleanup function to unregister our function since its gonna run multiple times
      window.removeEventListener('scroll', () =>
        setAppBarStyle(lastStyle => ({
          ...lastStyle,
          background: 'transparent',
          boxShadow: 'none',
          borderBottom: 'none',
        }))
      );
    };
  }, []);

  return (
    <AppBar sx={appBarStyle} position="fixed" component="nav">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <BiCodeAlt size={30} style={{ color: '#FFBB00' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              ml: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 400,
              letterSpacing: '.1rem',
              textDecoration: 'none',
              fontFamily: '"VT323", monospace;',
              fontSize: '2em',
              color: '#FFBB00',
              textShadow: '2px 2px #FF7701C0',
            }}
          >
            Tech Challenge
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <BiMenu />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(({ title }) => (
                <MenuItem key={title} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <Typography
            variant="h3"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography> */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-end',
            }}
          >
            {pages.map(({ title, route }) => (
              <Button
                key={title}
                onClick={() => navigate(route)}
                sx={{
                  my: 2,
                  mr: 10,
                  display: 'block',
                  fontFamily: '"VT323", monospace;',
                  fontSize: '1.5em',
                  color: 'white',
                }}
              >
                {title}
              </Button>
            ))}
          </Box>

          {userContext.is_logged_in ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      background: '#bb8900',
                    }}
                  >
                    {userContext.username.split('')[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <UsernameDiv>
                  <p>Olá, {userContext.username}</p> <MdWavingHand />
                </UsernameDiv>
                {settings.map(({ title, icon, route }) => (
                  <MenuItem
                    key={title}
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate(route);
                    }}
                  >
                    {icon}{' '}
                    <Typography sx={{ ml: 2 }} textAlign="center">
                      {title}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Button
                sx={{
                  background: '#FFBB00',
                  fontFamily: '"VT323", monospace;',
                  fontSize: '1.4em',
                  color: 'white',
                  '&:hover': {
                    background: '#bb8900',
                  },
                }}
                variant="outlined"
                onClick={() => navigate('/user/login')}
              >
                Entrar
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
