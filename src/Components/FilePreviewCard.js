import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

const FilePreviewCard = ({ file, onRemoveFile, isConverted }) => {
  const isVideo = file.type.startsWith('video');
  const isAudio = file.type.startsWith('audio');

  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      style={{
        marginBottom: '20px',
        position: 'relative',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
      }}
    >
      {isVideo ? (
        <CardMedia
          component="video"
          controls
          src={URL.createObjectURL(file)}
          alt="Selected Video"
          style={{ height: 200, objectFit: 'cover' }}
        />
      ) : isAudio ? (
        <CardMedia
          component="audio"
          controls
          src={URL.createObjectURL(file)}
          alt="Selected Audio"
          style={{ height: 50, width: '100%',marginTop:'70px',padding:'0px 20px' }}
        />
      ) : (
        <CardMedia
          component="img"
          src={URL.createObjectURL(file)}
          alt="Selected Image"
          style={{ height: 200, objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="body1">{file.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          Size: {formatFileSize(file.size)}
        </Typography>
      </CardContent>
      <IconButton
        onClick={isConverted ? handleDownload : () => onRemoveFile(file)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: 'white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {isConverted ? <DownloadIcon color="primary" /> : <DeleteIcon color="error" />}
      </IconButton>
    </Card>
  );
};

const formatFileSize = (size) => {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
};

export default FilePreviewCard;
