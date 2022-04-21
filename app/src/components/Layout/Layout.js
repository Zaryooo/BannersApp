import React from 'react';
import {
  Box,
  Container,
  CssBaseline,
} from '@mui/material';

import Header from './Header';

const Layout = (props) => {
  return (
    <Box sx={{backgroundColor: "#f2f2f2", minHeight: "100vh"}}>
      <CssBaseline />
      <Header/>
      <Container component="main">
        <Box sx={{
          paddingTop: 8,
          paddingBottom: 8,
        }}>{props.children}</Box>
      </Container>
    </Box>
  );
};

export default Layout;
