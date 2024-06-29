import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  Button,
  Fade,
} from '@mui/material';
import ConvertIcon from '@mui/icons-material/Autorenew';
import Dropzone from '../Components/Dropzone';
import FilePreviewCard from '../Components/FilePreviewCard';
import Progress from '../Components/Progress';
import ActionButtons from '../Components/ActionButtons';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { TransitionGroup } from 'react-transition-group';
import Logo from '../Components/Logo';

const ImageConversion = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newFormat, setNewFormat] = useState('jpeg');
  const [currentScreen, setCurrentScreen] = useState(1); // 1: Upload, 2: Progress, 3: Results
  const fileInputRef = useRef(null);

  const formatFileSize = (size) => {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
  };

  const handleDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setErrors([]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleConvertImages = async () => {
    setLoading(true);
    setErrors([]);
    setProgress(0);
    setCurrentScreen(2);
    const startTime = Date.now();
    const convertedFilesArray = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = URL.createObjectURL(file);

        await new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              const convertedFile = new File([blob], `converted_image_${i}.${newFormat}`, {
                type: `image/${newFormat}`,
              });
              convertedFilesArray.push(convertedFile);
              setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
              resolve();
            }, `image/${newFormat}`);
          };
        });
      } catch (error) {
        setErrors((prevErrors) => [...prevErrors, `Error converting ${file.name}`]);
        console.error(error);
      }
    }
    setConvertedFiles(convertedFilesArray);
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    const remainingTime = 2000 - processingTime;
    setTimeout(() => {
      setLoading(false);
      setCurrentScreen(3);
    }, Math.max(0, remainingTime));
  };

  const downloadAllConvertedImages = async () => {
    const zip = new JSZip();
    const folder = zip.folder('converted_images');
    for (const file of convertedFiles) {
      const response = await fetch(URL.createObjectURL(file));
      const blob = await response.blob();
      folder.file(file.name, blob);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'converted_images.zip');
  };

  const handleFormatChange = (event) => {
    setNewFormat(event.target.value);
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    setConvertedFiles([]);
    setErrors([]);
    setProgress(0);
    setCurrentScreen(1);
  };

  return (
    <Container>
      {currentScreen === 1 && (
        <>
          
          <Box className="text-center d-flex justify-content-center flex-wrap" my={5}>
            <Typography variant="h4" className="w-100" component="h1" gutterBottom>
            Image Conversion
            </Typography>
            <Typography gutterBottom>
            Turn Your Images into JPEG,PNG, GIF, TIF, WEBP, format in bulk with ease.
            </Typography>
          </Box>
          {selectedFiles.length === 0 ? (
            <Dropzone type={'images'} onDrop={handleDrop} />
          ) : (
            <>
              <Grid container spacing={2} component={TransitionGroup}>
                {selectedFiles.map((file, index) => (
                  <Fade key={file.name} timeout={300}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FilePreviewCard isConverted={false}  file={file} onRemoveFile={handleRemoveFile} />
                    </Grid>
                  </Fade>
                ))}
                <Grid item xs={12} sm={6} md={4}>
                  <Dropzone type={'images'} onDrop={handleDrop} />
                </Grid>
              </Grid>

              <Box mt={3} mb={3} display="flex" className='flex-wrap col-lg-4 col-md-6 mx-auto' flexDirection="column" alignItems="center">
                <FormControl variant="outlined" style={{ width: '100%', marginBottom: '20px' }}>
                  <InputLabel id="format-select-label">Select new format</InputLabel>
                  <Select
                    labelId="format-select-label"
                    value={newFormat}
                    onChange={handleFormatChange}
                    label="Select new format"
                  >
                    <MenuItem value="jpeg">JPEG</MenuItem>
                    <MenuItem value="png">PNG</MenuItem>
                    <MenuItem value="webp">WEBP</MenuItem>
                    <MenuItem value="bmp">BMP</MenuItem>
                    <MenuItem value="gif">GIF</MenuItem>
                    <MenuItem value="tiff">TIFF</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    padding: '10px 20px',
                    width: '100%',
                    fontSize: '16px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s, box-shadow 0.3s',
                  }}
                  onClick={handleConvertImages}
                  disabled={loading}
                  startIcon={<ConvertIcon />}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Convert Images'}
                </Button>
              </Box>
            </>
          )}
        </>
      )}

      {currentScreen === 2 && <Progress progress={progress} />}

      {currentScreen === 3 && (
        <>
        <div className='d-flex w-full justify-content-center align-items-center'>

<Logo className='mx-auto' width={200} height={200}/>
</div>
          <Typography variant="h3" sx={{textAlign:'center'}} component="h1" gutterBottom>
          Conversion Results
          </Typography>
          <Grid container spacing={2}>
            {convertedFiles.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FilePreviewCard  isConverted={true}  file={file} />
              </Grid>
            ))}
          </Grid>
          <ActionButtons
            onDownload={downloadAllConvertedImages}
            onStartOver={handleStartOver}
            downloadText={`Download All Images`}
            count={convertedFiles.length}
          />
          {errors.length > 0 && (
            <Grid item xs={12}>
              {errors.map((error, index) => (
                <Alert severity="error" key={index}>
                  {error}
                </Alert>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default ImageConversion;
