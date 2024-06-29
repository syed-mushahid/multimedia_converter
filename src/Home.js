import React, { useState } from "react";
import { Grid, Paper, Tabs,Box, Tab, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ImageIcon from "@mui/icons-material/Image";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import Logo from "./Components/Logo";
const tools = [
    {
      title: "Compress Image",
      description:
        "Compress JPG, PNG, SVG, and GIFs while saving space and maintaining quality.",
      path: "/compression",
      icon: "🔄",
      category: "Image",
    },
    {
      title: "Resize Image",
      description:
        "Define your dimensions, by percent or pixel, and resize your JPG, PNG, SVG, and GIF images.",
      path: "/resize",
      icon: "🔧",
      category: "Image",
    },
    {
      title: "Crop Image",
      description:
        "Crop JPG, PNG, or GIFs with ease; choose orientations to define your rectangle or use our zoom slider.",
      path: "/crop",
      icon: "✂️",
      category: "Image",
    },
    {
      title: "Convert Image",
      description:
        "Turn Your Images into JPEG,PNG, GIF, TIF, WEBP, format in bulk with ease.",
      path: "/format-conversion",
      icon: "🖼️",
      category: "Image",
    },
    {
      title: "Image to Document",
      description: "Convert images to PDF or PPT documents easily.",
      path: "/image-to-document",
      icon: "📄",
      category: "Image",
    },
    {
      title: "Video to Audio",
      description: "Extract audio from video files and save it as MP3.",
      path: "/video-to-audio",
      icon: "🎵",
      category: "Audio",
    },
    {
      title: "Video Format Conversion",
      description: "Convert videos from one format to another.",
      path: "/video-convert",
      icon: "🎥",
      category: "Video",
    },
    {
      title: "Extract Frames from Video",
      description: "Extract individual frames from a video file.",
      path: "/extract-frames",
      icon: "🖼️",
      category: "Video",
    },
    {
      title: "Audio Format Conversion",
      description: "Convert audios from one format to another..",
      path: "/audio-convert",
      icon: "🎧",
      category: "Audio",
    },
  ];

function Home() {
  const [selectedTab, setSelectedTab] = useState(0);
  const categories = ["Image", "Audio", "Video"];

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>

      <Box textAlign="center" mb={4}>
        <Logo width={200} height={200}/>
        <Typography variant="h4" gutterBottom>
          Welcome to Multimedia Tools
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Explore our powerful tools for all your multimedia needs.
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          Convert, edit, and enhance your files effortlessly.
        </Typography>
      </Box>
      <Tabs value={selectedTab} onChange={handleChangeTab} variant="fullWidth">
        <Tab icon={<ImageIcon />} label="Image" />
        <Tab icon={<AudiotrackIcon />} label="Audio" />
        <Tab icon={<VideoLibraryIcon />} label="Video" />
      </Tabs>
      <Grid container spacing={3} mt={3}>
        {tools.filter(tool => categories[selectedTab] === tool.category).map((tool, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              component={Link}
              to={tool.path}
              elevation={3}
              style={{
                padding: "20px",
                textAlign: "center",
                textDecoration: "none",
                border: "1px solid #ccc",
                borderRadius: "10px",
                transition: "transform 0.3s, box-shadow 0.3s",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
              }}
            >
              <Typography variant="h4">{tool.icon}</Typography>
              <Typography variant="h6" style={{ margin: "10px 0" }}>{tool.title}</Typography>
              <Typography variant="body2" style={{ marginBottom: "10px" }}>{tool.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
