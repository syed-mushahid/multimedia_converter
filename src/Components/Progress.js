import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Progress = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="100vh"
    position="relative"
  >
    <div className="spinner">
      <CircularProgress size={80} color="primary" />
    </div>
    <Typography variant="h6" style={{ marginTop: '20px', color: '#2F3C7E' }}>
      Processing...
    </Typography>
  </Box>
);

export default Progress;
