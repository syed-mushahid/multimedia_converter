import React, { useState } from 'react';
import { creFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = creFFmpeg({ log: true });

const VideoConversion = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setConvertedFiles([]);
    setError(null);
  };

  const handleConvertVideo = async () => {
    if (!selectedFile) {
      setError('Please select a video file first');
      return;
    }

    try {
      // Load FFmpeg
      await ffmpeg.load();

      // Write file to FFmpeg FS
      ffmpeg.FS('writeFile', selectedFile.name, await fetchFile(selectedFile));

      // Convert to MP4 (H.264 video and AAC audio)
      await ffmpeg.run('-i', selectedFile.name, 'output.mp4');
      const mp4Data = ffmpeg.FS('readFile', 'output.mp4');
      const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });

      // Convert to WebM (VP9 video and Opus audio)
      await ffmpeg.run('-i', selectedFile.name, '-c:v', 'vp9', '-c:a', 'libopus', 'output.webm');
      const webmData = ffmpeg.FS('readFile', 'output.webm');
      const webmBlob = new Blob([webmData.buffer], { type: 'video/webm' });

      // Extract audio as MP3
      await ffmpeg.run('-i', selectedFile.name, '-vn', 'output.mp3');
      const mp3Data = ffmpeg.FS('readFile', 'output.mp3');
      const mp3Blob = new Blob([mp3Data.buffer], { type: 'audio/mp3' });

      // Update converted files state
      setConvertedFiles([
        { blob: mp4Blob, type: 'video/mp4', name: 'converted_video.mp4' },
        { blob: webmBlob, type: 'video/webm', name: 'converted_video.webm' },
        { blob: mp3Blob, type: 'audio/mp3', name: 'extracted_audio.mp3' }
      ]);
    } catch (err) {
      console.error('Error:', err);
      setError('Error converting the video');
    }
  };

  return (
    <div className="video-conversion-container">
      <h1>Video Conversion</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      {selectedFile && (
        <div className="file-info">
          <p>Selected Video:</p>
          <p>{selectedFile.name}</p>
          <p>Size: {Math.round(selectedFile.size / 1024 / 1024)} MB</p>
        </div>
      )}
      <button onClick={handleConvertVideo}>Convert Video</button>
      {error && <p className="error-message">{error}</p>}
      {convertedFiles.length > 0 && (
        <div className="converted-files">
          <p>Converted Files:</p>
          {convertedFiles.map((file, index) => (
            <div key={index}>
              <p>{file.name}</p>
              {file.type.startsWith('video') ? (
                <video controls>
                  <source src={URL.createObjectURL(file.blob)} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <audio controls>
                  <source src={URL.createObjectURL(file.blob)} type={file.type} />
                  Your browser does not support the audio tag.
                </audio>
              )}
              <p>
                <a href={URL.createObjectURL(file.blob)} download={file.name}>
                  Download {file.name}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoConversion;
