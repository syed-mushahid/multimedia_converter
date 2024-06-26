import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { Document, Packer, Paragraph, Media } from 'docx';
import { saveAs } from 'file-saver';

const ImageToDocument = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [format, setFormat] = useState('pdf');

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
    setError(null);
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleCreateDocument = () => {
    if (selectedFiles.length === 0) {
      setError('Please select image files first');
      return;
    }

    switch (format) {
      case 'pdf':
        createPDF();
        break;
      case 'ppt':
        createPPT();
        break;
      default:
        setError('Unsupported format');
    }
  };

  const createPDF = () => {
    const doc = new jsPDF();
    selectedFiles.forEach((file, index) => {
      if (index > 0) doc.addPage();
      const img = URL.createObjectURL(file);
      doc.addImage(img, 'JPEG', 10, 10, 180, 160);
    });
    doc.save('document.pdf');
  };

  const createPPT = () => {
    const ppt = new PptxGenJS();
    selectedFiles.forEach((file) => {
      const slide = ppt.addSlide();
      const img = URL.createObjectURL(file);
      slide.addImage({ path: img, x: 1, y: 1, w: 8, h: 6 });
    });
    ppt.writeFile({ fileName: 'document.pptx' });
  };

 

  return (
    <div className="image-to-document-container">
      <h1>Image to Document Conversion</h1>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      {selectedFiles.length > 0 && (
        <div className="image-preview">
          <h2>Selected Images</h2>
          {selectedFiles.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt="Selected" />
          ))}
        </div>
      )}
      <div className="format-selector">
        <label htmlFor="format">Select format: </label>
        <select id="format" value={format} onChange={handleFormatChange}>
          <option value="pdf">PDF</option>
          <option value="ppt">PPT</option>
        </select>
      </div>
      <button onClick={handleCreateDocument}>Create Document</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ImageToDocument;
