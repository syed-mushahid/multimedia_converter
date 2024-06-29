import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';
import getCroppedImg from './cropImage';
import {
  Button,
  Slider,
  Typography,
  Container,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import Crop169Icon from '@mui/icons-material/Crop169';
import Crop54Icon from '@mui/icons-material/Crop54';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';
import DownloadIcon from '@mui/icons-material/Download';
import CropIcon from '@mui/icons-material/Crop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const ImageCropper = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [aspect, setAspect] = useState(null); 

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onSelectFile = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
      };
    }
  };

  const onCropImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onSelectFile,
    accept: 'image/*',
  });

  const handleAspectChange = (newAspect) => {
    setAspect(newAspect === 'free' ? null : parseFloat(newAspect));
  };

  const resetCrop = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedImage(null);
  };

  const downloadCroppedImage = () => {
    const link = document.createElement('a');
    link.href = croppedImage;
    link.download = 'cropped-image.jpg';
    link.click();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        
      </Typography>
      <Box className="text-center d-flex justify-content-center flex-wrap" my={5}>
            <Typography variant="h4" className="w-100" component="h1" gutterBottom>
            Image Cropper
            </Typography>
            <Typography gutterBottom>
            Crop JPG, PNG, or GIFs with ease; choose oriantations to define your rectangle or use our zoom slider.
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
          <Box position="relative" width="100%" height="400px" mt={2}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid={true}
            />
          </Box>
          <Box mt={2}>
            <Typography gutterBottom>Zoom</Typography>
            <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, zoom) => setZoom(zoom)} />
          </Box>
          <Box mt={2} display="flex" justifyContent="center" alignItems="center">
            <IconButton onClick={() => handleAspectChange(9/16)}>
              <CropPortraitIcon />
              <Typography variant="caption">9:16</Typography>
            </IconButton>
            <IconButton onClick={() => handleAspectChange(1 / 1)}>
              <CropSquareIcon />
              <Typography variant="caption">1:1</Typography>
            </IconButton>
            <IconButton onClick={() => handleAspectChange(4 / 3)}>
              <Crop54Icon />
              <Typography variant="caption">4:3</Typography>
            </IconButton>
            <IconButton onClick={() => handleAspectChange(16 / 9)}>
              <Crop169Icon />
              <Typography variant="caption">16:9</Typography>
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={onCropImage}
            startIcon={<CropIcon />}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
          >
            Crop Image
          </Button>
      
          <Button
      variant="outlined"
      color="secondary"
      onClick={resetCrop}
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
          {croppedImage && (
            <Paper elevation={3} style={{ marginTop: '20px', padding: '20px', textAlign: 'center' }}>
              <img src={croppedImage} alt="Cropped" style={{ width: '70%' }} />
              <div className='w-full d-flex justify-content-center'>

              <Button
                variant="contained"
                color="primary"
                className='mt-4'
                onClick={downloadCroppedImage}
                startIcon={<DownloadIcon />}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                }}
              >
                Download Cropped Image
              </Button>
              </div>

            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default ImageCropper;
