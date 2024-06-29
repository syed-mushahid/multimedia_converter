import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { UserContext } from "../UserContext";

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
function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useContext(UserContext);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <List>
      {tools.map((tool, index) => (
        <ListItem button component={Link} to={tool.path} onClick={() => setDrawerOpen(false)} key={index}>
          <ListItemText primary={<><span>{tool.icon}</span>&nbsp;{tool.title}</>} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <img src="./logo.png" alt="Logo" style={{ height: "60px", marginRight: "0px" }} />
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
          Multimedia Tools
        </Typography>
        {user ? (
          <>
            <Typography variant="h6" style={{ marginRight: "10px" }}>
              {user.displayName ? `Hi, ${user.displayName}` : ""}
            </Typography>
            <Button color="inherit">Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/sign-in">Sign In</Button>
            <Button color="inherit" component={Link} to="/sign-up">Sign Up</Button>
          </>
        )}
      </Toolbar>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </AppBar>
  );
}

export default Header;
