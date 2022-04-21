import React from 'react';
import Banners from '../components/Banners/Banners';
import { Container, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Container >
      <Typography component="h2" variant="h3" align="center" gutterBottom>
        Dashboard
      </Typography>
      <Banners />
    </Container>
  );
};

export default Dashboard;
