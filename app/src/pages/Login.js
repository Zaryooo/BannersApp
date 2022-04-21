import React from 'react';
import LoginForm from '../components/Profile/LoginForm';
import { Container, Typography, Paper, Avatar, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const Login = () => {
  return (
    <Container maxWidth="xs" align="center">
      <Paper elevation={12}>
        <Box m={2} pt={2} pb={2}>
          <Avatar sx={{ mt: 3, mb: 1 }}>
            <PersonIcon fontSize="medium" color="action" />
          </Avatar>
          <Typography component="h2" variant="h4" gutterBottom>
            Login
          </Typography>
          <LoginForm />
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
