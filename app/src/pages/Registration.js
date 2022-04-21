import React from 'react';
import RegistrationForm from '../components/Profile/RegistrationForm';
import {Container, Paper, Box, Typography, Avatar } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const Registration = () => {
  return (
    <Container maxWidth="xs" align="center">
      <Paper elevation={12}>
        <Box m={2} pt={2} pb={2}>
          <Avatar sx={{ mt: 3, mb: 1 }}>
            <PersonAddAltIcon fontSize="medium" color="action" />
          </Avatar>
          <Typography component="h2" variant="h4" gutterBottom>
            Registration
          </Typography>
          <RegistrationForm/>
        </Box>
      </Paper>
    </Container>
  );
};

export default Registration;
