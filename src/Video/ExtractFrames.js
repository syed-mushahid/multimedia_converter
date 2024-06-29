import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Alert,
  Paper,
  Box,
  CircularProgress,
  Fade,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import ExtractIcon from '@mui/icons-material/PhotoLibrary';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useDropzone } from 'react-dropzone';
import { TransitionGroup } from 'react-transition-group';
import axios from 'axios';
import Dropzone from '../Components/Dropzone';
import FilePreviewCard from '../Components/FilePreviewCard';
import Progress from '../Components/Progress';
import Logo from '../Components/Logo';

const ExtractFrames = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedFile, setProcessedFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(1); // 1: Upload, 2: Progress, 3: Results
  const [frameRate, setFrameRate] = useState('');
  const [duration, setDuration] = useState('');
  const [number, setNumber] = useState('');
  const [everyNFrames, setEveryNFrames] = useState('');
  const [everyNSeconds, setEveryNSeconds] = useState('');
  const [size, setSize] = useState('');

  const handleDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setErrors([]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleExtractFrames = async () => {
    setLoading(true);
    setErrors([]);
    setProgress(0);
    setCurrentScreen(2);

    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
    if (frameRate) formData.append('frameRate', frameRate);
    if (duration) formData.append('duration', duration);
    if (number) formData.append('number', number);
    if (everyNFrames) formData.append('everyNFrames', everyNFrames);
    if (everyNSeconds) formData.append('everyNSeconds', everyNSeconds);
    if (size) formData.append('size', size);

    try {
      const response = await axios.post('http://localhost:8001/extract-frames', formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setProcessedFile({ url, name: `frames.zip` });
      setLoading(false);
      setCurrentScreen(3);
    } catch (error) {
      setErrors([error.message]);
      setLoading(false);
      setCurrentScreen(1);
    }
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    setProcessedFile(null);
    setErrors([]);
    setProgress(0);
    setCurrentScreen(1);
    setFrameRate('');
    setDuration('');
    setNumber('');
    setEveryNFrames('');
    setEveryNSeconds('');
    setSize('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: 'video/*',
  });

  return (
    <Container>
      {currentScreen === 1 && (
        <>
         
          <Box className="text-center d-flex justify-content-center flex-wrap" my={5}>
            <Typography variant="h4" className="w-100" component="h1" gutterBottom>
            Extract Frames from Video
            </Typography>
            <Typography gutterBottom>
            Extract individual frames from a video file.
            </Typography>
          </Box>
          {selectedFiles.length === 0 ? (
            <Dropzone type={'video'} onDrop={handleDrop} />
          ) : (
            <>
              <Grid container spacing={2} component={TransitionGroup}>
                {selectedFiles.map((file, index) => (
                  <Fade key={file.name} timeout={300}>
                        <Grid item xs={12} mx={'auto'} sm={9} md={6}>
                      <FilePreviewCard isConverted={false}  file={file} onRemoveFile={handleRemoveFile} />
                    </Grid>
                  </Fade>
                ))}
                {/* <Grid item xs={12} sm={6} md={4}>
                  <Paper
                    {...getRootProps()}
                    style={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: '#757575',
                      border: '2px dashed #757575',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      transition: 'box-shadow 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)'}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <Typography variant="h6">Drop the files here...</Typography>
                    ) : (
                      <div>
                        <CloudUploadIcon fontSize="large" />
                        <Typography variant="h6">Add More Videos</Typography>
                      </div>
                    )}
                  </Paper>
                </Grid> */}
              </Grid>

              <Box mt={3} mb={3} display="flex" flexDirection="column" alignItems="center">
                {/* <TextField
                  label="Frame Rate (fps)"
                  variant="outlined"
                  value={frameRate}
                  onChange={(e) => setFrameRate(e.target.value)}
                  style={{ marginBottom: '20px', minWidth: 120 }}
                />
                <TextField
                  label="Duration (seconds)"
                  variant="outlined"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{ marginBottom: '20px', minWidth: 120 }}
                />
                <TextField
                  label="Number of Frames"
                  variant="outlined"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  style={{ marginBottom: '20px', minWidth: 120 }}
                />
                <TextField
                  label="Every N Frames"
                  variant="outlined"
                  value={everyNFrames}
                  onChange={(e) => setEveryNFrames(e.target.value)}
                  style={{ marginBottom: '20px', minWidth: 120 }}
                />
                <TextField
                  label="Every N Seconds"
                  variant="outlined"
                  value={everyNSeconds}
                  onChange={(e) => setEveryNSeconds(e.target.value)}
                  style={{ marginBottom: '20px', minWidth: 120 }}
                />
                <TextField
                  label="Size (e.g., 640x480)"
                  variant="outlined"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  style={{ marginBottom: '20px', minWidth: 120 }}
                /> */}
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s, box-shadow 0.3s',
                  }}
                  onClick={handleExtractFrames}
                  disabled={loading}
                  startIcon={<ExtractIcon />}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Extract Frames'}
                </Button>
              </Box>
            </>
          )}
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

      {currentScreen === 2 && <Progress progress={progress} />}

      {currentScreen === 3 && (
        <>
          <div className='d-flex w-full justify-content-center align-items-center'>

<Logo className='mx-auto' width={200} height={200}/>
</div>
          <Typography variant="h3" sx={{textAlign:'center'}} component="h1" gutterBottom>
          Frame Extraction Results
          </Typography>
          {processedFile && (
            
            <Box mt={3} mb={3} display="flex" className='flex-wrap' justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                className='my-2'
                href={processedFile.url}
                download={processedFile.name}
                startIcon={<DownloadIcon />}
                style={{
                  padding: '10px 20px',
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
                Download {processedFile.name}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                 className='my-2'
                onClick={handleStartOver}
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
          )}
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

export default ExtractFrames;
