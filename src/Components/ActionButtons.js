import React from 'react';
import { Badge, Box, Button, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const ActionButtons = ({ onDownload, onStartOver, downloadText, loading ,count}) => (
  <Box mt={3} mb={3} display="flex" className='flex-wrap gap-3' justifyContent="center">

    <Button
      variant="contained"
      color="primary"
      className='my-2'
      onClick={onDownload}
      startIcon={<DownloadIcon />}
      style={{
        padding: '10px 20px',
        position:'relative',
        fontSize: '16px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#303f9f';
        e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
      }}
    >
       <Badge
          badgeContent={count}
          color="error"
          overlap="circular"
          style={{ position: 'absolute', right: '0px', top: '0px' }}
        />
      {loading ? <CircularProgress size={24} color="inherit" /> : downloadText}
    </Button>
    <Button
      variant="outlined"
      color="secondary"
      onClick={onStartOver}
      className='my-2'
      style={{
        marginLeft: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
      }}
      startIcon={<RestartAltIcon />}
    >
      Start Over
    </Button>
  </Box>
);

export default ActionButtons;
