import React from "react";
import { useDropzone } from "react-dropzone";
import { Paper, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Dropzone = ({ onDrop, type }) => {
  const image = {
    "image/*": [],
  };
  const video = {
    "video/*": [],
  };
  const audio = {
    "audio/*": [],
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type == "video" ? video : type=='audio'?audio: image,
  });

  return (
    <Paper
      {...getRootProps()}
      style={{
        padding: "20px",
        textAlign: "center",
        color: "#757575",
        border: "2px dashed #757575",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.3s",
        minHeight: "280px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.2)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)")
      }
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography variant="h6">Drop the images here...</Typography>
      ) : (
        <div>
          <CloudUploadIcon fontSize="large" />
          <Typography variant="h6">
            Drag & Drop your image files here, or click to select files
          </Typography>
        </div>
      )}
    </Paper>
  );
};

export default Dropzone;
