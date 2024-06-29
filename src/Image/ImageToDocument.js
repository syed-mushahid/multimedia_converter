import React, { useState } from "react";
import { jsPDF } from "jspdf";
import PptxGenJS from "pptxgenjs";
import {
  Container,
  Typography,
  Grid,
  Alert,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Fade,
  Button,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DownloadIcon from "@mui/icons-material/Download";
import { useDropzone } from "react-dropzone";
import { TransitionGroup } from "react-transition-group";
import Dropzone from "../Components/Dropzone";
import FilePreviewCard from "../Components/FilePreviewCard";
import Progress from "../Components/Progress";
import ActionButtons from "../Components/ActionButtons";
import Logo from "../Components/Logo";

const ImageToDocument = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(1); // 1: Upload, 2: Progress, 3: Results
  const [generatedFile, setGeneratedFile] = useState(null);

  const formatFileSize = (size) => {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${
      ["B", "KB", "MB", "GB", "TB"][i]
    }`;
  };

  const handleDrop = (acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setError(null);
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleCreateDocument = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select image files first");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentScreen(2);
    const startTime = Date.now();

    switch (format) {
      case "pdf":
        await createPDF();
        break;
      case "ppt":
        await createPPT();
        break;
      default:
        setError("Unsupported format");
    }

    const endTime = Date.now();
    const processingTime = endTime - startTime;
    const remainingTime = 2000 - processingTime;
    setTimeout(() => {
      setLoading(false);
      setCurrentScreen(3);
    }, Math.max(0, remainingTime));
  };

  const createPDF = async () => {
    const doc = new jsPDF();
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (i > 0) doc.addPage();
      const img = URL.createObjectURL(file);
      doc.addImage(img, "JPEG", 10, 10, 180, 160);
      setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
    }
    const pdfBlob = doc.output("blob");
    setGeneratedFile(
      new File([pdfBlob], "document.pdf", { type: "application/pdf" })
    );
  };

  const createPPT = async () => {
    const ppt = new PptxGenJS();
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const slide = ppt.addSlide();
      const img = URL.createObjectURL(file);
      slide.addImage({ path: img, x: 1, y: 1, w: 8, h: 6 });
      setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
    }
    const pptBlob = await ppt.write("blob");
    setGeneratedFile(
      new File([pptBlob], "document.pptx", {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      })
    );
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    setGeneratedFile(null);
    setError(null);
    setProgress(0);
    setCurrentScreen(1);
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  return (
    <Container>
      {currentScreen === 1 && (
        <>
          <Box
            className="text-center d-flex justify-content-center flex-wrap"
            my={5}
          >
            <Typography
              variant="h4"
              className="w-100"
              component="h1"
              gutterBottom
            >
              Image to Document Conversion
            </Typography>
            <Typography gutterBottom>
              Convert images to PDF or PPT documents easily.
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
                className='flex-wrap col-lg-4 col-md-6 mx-auto'
              >
                <FormControl
                  variant="outlined"
                  style={{  width: '100%', marginBottom: "20px" }}
                >
                  <InputLabel id="format-select-label">
                    Select format
                  </InputLabel>
                  <Select
                    labelId="format-select-label"
                    value={format}
                    onChange={handleFormatChange}
                    label="Select format"
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="ppt">PPT</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    width: '100%',
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s, box-shadow 0.3s",
                  }}
                  onClick={handleCreateDocument}
                  disabled={loading}
                  startIcon={<CreateIcon />}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Document"
                  )}
                </Button>
              </Box>
            </>
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </>
      )}

      {currentScreen === 2 && <Progress progress={progress} />}

      {currentScreen === 3 && (
        <>
          <div className="d-flex w-full justify-content-center align-items-center">
            <Logo className="mx-auto" width={200} height={200} />
          </div>
          <Typography variant="h3" sx={{textAlign:'center'}} component="h1" gutterBottom>
            Your document is ready to doanload.
          </Typography>
          {generatedFile && (
            <Box
              mt={3}
              mb={3}
              display="flex"
              className="flex-wrap"
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="primary"
                className="my-2"
                href={URL.createObjectURL(generatedFile)}
                download={generatedFile.name}
                startIcon={<DownloadIcon />}
                style={{
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
                Download {generatedFile.name}
              </Button>
              <Button
                variant="outlined"
                className="my-2"
                color="secondary"
                onClick={handleStartOver}
                style={{
                  marginLeft: "10px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0px 8px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0px 4px 10px rgba(0, 0, 0, 0.1)";
                }}
                startIcon={<RestartAltIcon />}
              >
                Start Over
              </Button>
            </Box>
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </>
      )}
    </Container>
  );
};

export default ImageToDocument;
