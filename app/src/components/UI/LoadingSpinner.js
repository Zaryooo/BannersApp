import React from 'react';
import { Box } from '@mui/material';

import classes from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <div className={classes.spinner}></div>
    </Box>
  );
};

export default LoadingSpinner;
