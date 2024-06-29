import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Button,
  Typography,
  Container,
  Box,
  Paper,
  TextField,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';

const ImageResize = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [resizedImageSrc, setResizedImageSrc] = useState(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);

  const onSelectFile = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
        };
      };
    }
  };

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const resizedImageUrl = canvas.toDataURL('image/jpeg');
        setResizedImageSrc(resizedImageUrl);
      };
    }
  }, [imageSrc, width, height]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onSelectFile,
    accept: 'image/*',
  });

  return (
    <Container>
     
      <Box className="text-center d-flex justify-content-center flex-wrap" my={5}>
            <Typography variant="h4" className="w-100" component="h1" gutterBottom>
            Image Resizer
            </Typography>
            <Typography gutterBottom>
            Define your dimensions, by pixel, and resize your JPG, PNG, SVG, and GIF images.
            </Typography>
          </Box>
      <Paper
        {...getRootProps()}
        style={{
          padding: '20px',
          textAlign: 'center',
          color: '#757575',
          border: '2px dashed #757575',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s',
          minHeight: '200px', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)')}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="h6">Drop the files here...</Typography>
        ) : (
          <div>
            <CloudUploadIcon fontSize="large" />
            <Typography variant="h6">
              Drag & Drop your image files here, or click to select files
            </Typography>
          </div>
        )}
      </Paper>
      {imageSrc && (
        <>
          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <img src={imageSrc} alt="Selected" style={{ maxWidth: '100%' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <img src={resizedImageSrc} alt="Resized" style={{ maxWidth: '100%' }} />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" className='flex-wrap col-md-7 mx-auto'  alignItems="center">
            <TextField
              label="Width"
              type="number"
              className='col-md-5 mx-auto'
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              variant="outlined"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Height"
              type="number"
              className='col-md-5 mx-auto'
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              variant="outlined"
              style={{ marginBottom: '10px' }}
            />
            {resizedImageSrc && (
              <Button
                variant="contained"
                className='mx-auto'
                color="primary"
                href={resizedImageSrc}
                download="resized-image.jpg"
                startIcon={<DownloadIcon />}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, box-shadow 0.3s',
      }}
              >
                Download Resized Image
              </Button>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default ImageResize;
