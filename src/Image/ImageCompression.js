import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const ImageCompression = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [error, setError] = useState(null);

  const formatFileSize = (size) => {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setCompressedFile(null);
    setError(null);
  };

  const handleCompressImage = async () => {
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
      setCompressedFile(compressedFile);
    } catch (error) {
      setError('Error compressing the image');
      console.error(error);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Image Compression</h1>

      <div className="row mb-4">
        <div className="col-md-6">
          <input type="file" accept="image/*" className="form-control mb-2" onChange={handleFileChange} />
          {selectedFile && (
            <div className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">Selected Image</h5>
                <img src={URL.createObjectURL(selectedFile)} className="img-fluid mb-2" alt="Selected" />
                <p className="card-text">Size: {formatFileSize(selectedFile.size)}</p>
                <p className="card-text">Format: {selectedFile.type}</p>
              </div>
            </div>
          )}
        </div>

        <div className="col-md-6">
        <button className="btn btn-success" onClick={handleCompressImage}>Compress Image</button>
          {compressedFile && (
            <div className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">Compressed Image</h5>
                <img src={URL.createObjectURL(compressedFile)} className="img-fluid mb-2" alt="Compressed" />
                <p className="card-text">Size: {formatFileSize(compressedFile.size)}</p>
                <p className="card-text">Format: {compressedFile.type}</p>
                <p>
                  <a
                    href={URL.createObjectURL(compressedFile)}
                    className="btn btn-primary"
                    download="compressed_image.jpg"
                  >
                    Download Compressed Image
                  </a>
                </p>
              </div>
            </div>
          )}
          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageCompression;
