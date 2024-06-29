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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import ConvertIcon from '@mui/icons-material/Autorenew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useDropzone } from 'react-dropzone';
import { TransitionGroup } from 'react-transition-group';
import axios from 'axios';
import Dropzone from '../Components/Dropzone';
import FilePreviewCard from '../Components/FilePreviewCard';
import Progress from '../Components/Progress';
import Logo from '../Components/Logo';

const VideoFormatConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedFile, setProcessedFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(1); // 1: Upload, 2: Progress, 3: Results
  const [outputFormat, setOutputFormat] = useState('mp3'); // Default output format

  const handleDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setErrors([]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleConvertVideos = async () => {
    setLoading(true);
    setErrors([]);
    setProgress(0);
    setCurrentScreen(2);

    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
    formData.append('format', outputFormat);

    try {
      const response = await axios.post('http://localhost:8001/convert', formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setProcessedFile({ url, name: `output.${outputFormat}` });
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
    setOutputFormat('mp3');
  };


  return (
    <Container>
      {currentScreen === 1 && (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
           
          </Typography>
          <Box className="text-center d-flex justify-content-center flex-wrap" my={5}>
            <Typography variant="h4" className="w-100" component="h1" gutterBottom>
            Audio Format Converter
            </Typography>
            <Typography gutterBottom>
            Convert audios from one format to another without losing quality.
            </Typography>
          </Box>
          {selectedFiles.length === 0 ? (
            <Dropzone type={'audio'} onDrop={handleDrop} />
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

              <Box mt={3} mb={3} display="flex" className='flex-wrap col-lg-4 col-md-6 mx-auto' flexDirection="column" alignItems="center">
                <FormControl variant="outlined"  style={{ marginBottom: '20px', width: '100%'}}>
                  <InputLabel id="output-format-label">Output Format</InputLabel>
                  <Select
                    labelId="output-format-label"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    label="Output Format"
                  >
                    <MenuItem value="mp3">MP3</MenuItem>
        <MenuItem value="wav">WAV</MenuItem>
        <MenuItem value="aac">AAC</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    width:'100%',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s, box-shadow 0.3s',
                  }}
                  onClick={handleConvertVideos}
                  disabled={loading}
                  startIcon={<ConvertIcon />}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Convert Video'}
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
          Your audio is ready to download
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

export default VideoFormatConverter;
