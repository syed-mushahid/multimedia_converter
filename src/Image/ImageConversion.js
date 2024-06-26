import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const ImageConversion = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [error, setError] = useState(null);
  const [newFormat, setNewFormat] = useState('jpeg');

  const formatFileSize = (size) => {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setCompressedFile(null);
    setError(null);
  };

  const handleFormatChange = (event) => {
    setNewFormat(event.target.value);
  };

  const handleCompressAndConvertImage = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    try {
      const compressedFile = await imageCompression(selectedFile, options);

      // Convert the compressed file to the selected format
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = URL.createObjectURL(compressedFile);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const convertedFile = new File([blob], `converted_image.${newFormat}`, {
            type: `image/${newFormat}`,
          });
          setCompressedFile(convertedFile);
        }, `image/${newFormat}`);
      };
    } catch (error) {
      setError('Error compressing or converting the image');
      console.error(error);
    }
  };

  return (
    <div className="image-conversion-container">
      <h1>Image Conversion</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedFile && (
        <div className="image-preview">
          <h2>Selected Image</h2>
          <img src={URL.createObjectURL(selectedFile)} alt="Selected" />
          <p>Size: {formatFileSize(selectedFile.size)}</p>
          <p>Format: {selectedFile.type}</p>
        </div>
      )}
      <div className="format-selector">
        <label htmlFor="format">Select new format: </label>
        <select id="format" value={newFormat} onChange={handleFormatChange}>
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WEBP</option>
        </select>
      </div>
      <button onClick={handleCompressAndConvertImage}>Compress and Convert Image</button>
      {error && <p className="error-message">{error}</p>}
      {compressedFile && (
        <div className="image-preview">
          <h2>Converted Image</h2>
          <img src={URL.createObjectURL(compressedFile)} alt="Converted" />
          <p>Size: {formatFileSize(compressedFile.size)}</p>
          <p>Format: {compressedFile.type}</p>
          <p>
            <a
              href={URL.createObjectURL(compressedFile)}
              download={`converted_image.${newFormat}`}
            >
              Download Converted Image
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageConversion;
