import React, { Fragment, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Box,
  Button,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AuthContext from '../../store/auth-context';

const MainNavigation = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const name = authCtx.user;
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMenuClick = (page) => {
    navigate(page);
  };

  const onLogoutHandler = () => {
    authCtx.logout();
    navigate('/', { replace: true });
  };

  return (
    <Box>
      {isMobile && (
        <Fragment>
          <IconButton
            edge="static"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {!isLoggedIn && (
              <MenuItem onClick={() => onMenuClick('/')}>Home</MenuItem>
            )}
            {!isLoggedIn && (
              <MenuItem onClick={() => onMenuClick('/login')}>Login</MenuItem>
            )}
            {!isLoggedIn && (
              <MenuItem onClick={() => onMenuClick('/registration')}>
                Register
              </MenuItem>
            )}
            {isLoggedIn && (
              <MenuItem onClick={onLogoutHandler}>Logout</MenuItem>
            )}
          </Menu>
        </Fragment>
      )}
      {!isMobile && (
        <Fragment>
          {!isLoggedIn && (
            <Button
              sx={{ mx: 1, my: 2, color: 'white' }}
              variant="text"
              onClick={() => onMenuClick('/')}
            >
              Home
            </Button>
          )}
          {!isLoggedIn && (
            <Button
              sx={{ mx: 1, my: 2, color: 'white' }}
              variant="text"
              onClick={() => onMenuClick('/login')}
            >
              Login
            </Button>
          )}
          {!isLoggedIn && (
            <Button
              sx={{ mx: 1, my: 2, color: 'white' }}
              variant="text"
              onClick={() => onMenuClick('/registration')}
            >
              Registration
            </Button>
          )}
          {isLoggedIn && (
            <Box sx={{ display: 'flex', alignItems: 'center'}}>
              <Typography component="p" variant="h6" sx={{mr: 3}}>Hello, {name}!</Typography> 
              <Button
              sx={{ mx: 1, my: 2, color: 'white', borderColor: 'white' }}
              variant="outlined"
              onClick={onLogoutHandler}
            >
              Logout
            </Button>  
            </Box>
            
          )}
        </Fragment>
      )}
    </Box>
  );
};

export default MainNavigation;
