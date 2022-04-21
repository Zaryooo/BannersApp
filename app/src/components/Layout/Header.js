import React from 'react';
import Navigation from '../Layout/Navigation';
import { Typography, AppBar, Toolbar } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography component="h1" variant="h4" sx={{ flexGrow: 1 }}>
          Banner App
        </Typography>
        <Navigation />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
