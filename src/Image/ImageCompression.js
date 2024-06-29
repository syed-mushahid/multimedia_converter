import React, { useContext, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import {
  Grid,
  Container,
  Typography,
  Box,
  Slider,
  CircularProgress,
  Button,
  Alert,
  Fade,
} from "@mui/material";
import Dropzone from "../Components//Dropzone";
import FilePreviewCard from "../Components/FilePreviewCard";
import Progress from "../Components//Progress";
import CompressIcon from '@mui/icons-material/Compress';
import ActionButtons from "../Components/ActionButtons";
import DownloadIcon from '@mui/icons-material/Download';

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { TransitionGroup } from "react-transition-group";
import { UserContext } from "../UserContext";
import Logo from "../Components/Logo";

const ImageCompression = () => {
  const { user, credits, updateCredits } = useContext(UserContext);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionPercentage, setCompressionPercentage] = useState(50);
  const [currentScreen, setCurrentScreen] = useState(1); // 1: Upload, 2: Progress, 3: Results
  const fileInputRef = useRef(null);

  const handleDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setErrors([]);
  };

  const handleCompressImages = async () => {
    if (!user && credits < selectedFiles.length) {
      setErrors((prevErrors) => [
        ...prevErrors,
        `You are trying to use multiple images. Please sign in for unlimited access.`,
      ]);

      return;
    }

    setLoading(true);
    setErrors([]);
    setProgress(0);
    setCurrentScreen(2);
    const startTime = Date.now();
    const compressedFilesArray = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        const options = {
          maxSizeMB:
            (file.size / (1024 * 1024)) * (compressionPercentage / 100),
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        compressedFilesArray.push(compressedFile);
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      } catch (error) {
        setErrors((prevErrors) => [
          ...prevErrors,
          `Error compressing ${file.name}`,
        ]);
        console.error(error);
      }
    }
    setCompressedFiles(compressedFilesArray);

    // if (!user) {
    //   updateCredits(credits - compressedFilesArray.length);
    // }

    const endTime = Date.now();
    const processingTime = endTime - startTime;
    const remainingTime = 2000 - processingTime;
    setTimeout(() => {
      setLoading(false);
      setCurrentScreen(3);
    }, Math.max(0, remainingTime));
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  const downloadAllCompressedImages = async () => {
    const zip = new JSZip();
    const folder = zip.folder("compressed_images");
    compressedFiles.forEach((file) => {
      folder.file(file.name, file);
    });
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "compressed_images.zip");
  };

  const handleCompressionChange = (event, newValue) => {
    setCompressionPercentage(newValue);
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    setCompressedFiles([]);
    setErrors([]);
    setProgress(0);
    setCurrentScreen(1);
  };

  return (
    <Container py={5}>
      {currentScreen === 1 && (
        <>
          <Box className="text-center d-flex justify-content-center flex-wrap" my={5}>
            <Typography variant="h4" className="w-100" component="h1" gutterBottom>
              Image Compression
            </Typography>
            <Typography gutterBottom>
              Compress JPG, PNG, SVG, and GIFs while saving space and
              maintaining quality.
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
                      <FilePreviewCard
                      isConverted={false} 
                        file={file}
                        onRemoveFile={handleRemoveFile}
                      />
                    </Grid>
                  </Fade>
                ))}
                <Grid item xs={12} sm={6} md={4}>
                  <Dropzone type={'images'} onDrop={handleDrop} />
                </Grid>
              </Grid>
              <Box
                mt={3}
                mb={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Typography gutterBottom>
                  Compression Percentage: {compressionPercentage}%
                </Typography>
                <Slider
                  value={compressionPercentage}
                  onChange={handleCompressionChange}
                  aria-labelledby="compression-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={10}
                  max={100}
                  style={{ width: "80%" }}
                />
                {errors.length > 0 && (
                  <Grid item xs={12} my={3}>
                    {errors.map((error, index) => (
                      <Alert severity="error" key={index}>
                        {error}
                      </Alert>
                    ))}
                  </Grid>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCompressImages}
                  startIcon={<CompressIcon />}
                  disabled={loading}
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#303f9f";
                    e.currentTarget.style.boxShadow =
                      "0px 8px 20px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.boxShadow =
                      "0px 4px 10px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Compress Images"
                  )}
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
            Compression Results
          </Typography>
       
          <Grid container  spacing={2}>
            {compressedFiles.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FilePreviewCard
                isConverted={true}  file={file} />
              </Grid>
            ))}
          </Grid>
          <ActionButtons
            onDownload={downloadAllCompressedImages}
            onStartOver={handleStartOver}
            downloadText='Download All Images'
            count={compressedFiles.length}

          />
        </>
      )}
    </Container>
  );
};

export default ImageCompression;
