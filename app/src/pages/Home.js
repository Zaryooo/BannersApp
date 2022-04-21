import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const onButtonClick = (page) => {
    navigate(page);
  };

  return (
    <Container align="center">
      <Typography component="h2" variant="h3" gutterBottom>
        Home
      </Typography>
      <Typography component="p" variant="h6" gutterBottom>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Typography>
      <Box mt={4}>
        <Button
          size="large"
          color="primary"
          variant="contained"
          onClick={() => onButtonClick('/registration')}
        >
          Registration
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
