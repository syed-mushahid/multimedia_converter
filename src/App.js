import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ImageCompression from './Image/ImageCompression';
import ImageFormatConversion from './Image/ImageConversion';
import './App.css'; // You can keep your custom styles
import ImageToDocument from './Image/ImageToDocument';
// import VideoConversion from './Video/VideoConversion';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header bg-dark py-3">
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-dark">
              <div className="container-fluid">
                <Link to="/" className="navbar-brand">Multimedia Tools</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link to="/compression" className="nav-link">Image Compression</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/format-conversion" className="nav-link">Image Format Conversion</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/image-to-document" className="nav-link">Image to Document</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/video-conversion" className="nav-link">Video Conversion</Link>
                    </li>
                  </ul>
                  <div className="d-flex">
                    <button className="btn btn-outline-light me-2">Sign In</button>
                    <button className="btn btn-primary">Sign Up</button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <div className="container mt-4">
          <Routes>
            <Route path="/compression" element={<ImageCompression />} />
            <Route path="/format-conversion" element={<ImageFormatConversion />} />
            <Route path="/image-to-document" element={<ImageToDocument />} />
            {/* <Route path="/video-conversion" element={<VideoConversion />} /> */}
            <Route path="/" element={
              <div>
                <h1>Welcome to Multimedia Tools</h1>
                <p>Select an option from the menu to get started.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
