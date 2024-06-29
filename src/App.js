import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UserProvider from "./UserContext";
import Header from "./Components/Header";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ImageCompression from "./Image/ImageCompression";
import ImageFormatConversion from "./Image/ImageConversion";
import ImageToDocument from "./Image/ImageToDocument";
import VideoToAudio from "./Video/VideoToAudio";
import ImageCropper from "./Image/ImageCropper";
import ImageResize from "./Image/ImageResize";
import VideoFormatConverter from "./Video/VideoFormatConverter";
import ExtractFrames from "./Video/ExtractFrames";
import AudioConverter from "./Audio/AudioConverter";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F3C7E",
    },
    secondary: {
      main: "#EA738D",
    },
  },
});

function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Header />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compression" element={<ImageCompression />} />
              <Route path="/format-conversion" element={<ImageFormatConversion />} />
              <Route path="/image-to-document" element={<ImageToDocument />} />
              <Route path="/crop" element={<ImageCropper />} />
              <Route path="/resize" element={<ImageResize />} />
              <Route path="/video-to-audio" element={<VideoToAudio />} />
              <Route path="/extract-frames" element={<ExtractFrames />} />
              <Route path="/video-convert" element={<VideoFormatConverter />} />
              <Route path="/audio-convert" element={<AudioConverter />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
