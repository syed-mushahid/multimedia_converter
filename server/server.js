const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const archiver = require('archiver');

const app = express();
const port = 8001;

app.use(cors());

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Video to audio conversion API
app.post('/convert', upload.single('file'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(uploadsDir, `${Date.now()}-output.mp3`);

  ffmpeg(inputPath)
    .toFormat('mp3')
    .on('end', () => {
      res.download(outputPath, 'output.mp3', (err) => {
        if (err) {
          console.error('Error downloading the file:', err);
          res.status(500).send('Error downloading the file');
        }

        // Clean up files
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error('Error during conversion:', err);
      res.status(500).send('Error during conversion');
    })
    .save(outputPath);
});


app.post('/convert-audio', upload.single('file'), (req, res) => {
  const inputPath = req.file.path;
  const outputFormat = req.body.format || 'mp3';
  const outputPath = path.join(uploadsDir, `${Date.now()}-output.${outputFormat}`);

  ffmpeg(inputPath)
    .toFormat(outputFormat)
    .on('end', () => {
      res.download(outputPath, `output.${outputFormat}`, (err) => {
        if (err) {
          console.error('Error downloading the file:', err);
          res.status(500).send('Error downloading the file');
        }

        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error('Error during conversion:', err);
      res.status(500).send('Error during conversion');
    })
    .save(outputPath);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Video format conversion API
app.post('/convert-video', upload.single('file'), (req, res) => {
  const inputPath = req.file.path;
  const outputFormat = req.body.format || 'mp4'; // Default to mp4 if format is not specified
  const outputPath = path.join(uploadsDir, `${Date.now()}-output.${outputFormat}`);

  ffmpeg(inputPath)
    .toFormat(outputFormat)
    .on('end', () => {
      res.download(outputPath, `output.${outputFormat}`, (err) => {
        if (err) {
          console.error('Error downloading the file:', err);
          res.status(500).send('Error downloading the file');
        }

        // Clean up files
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error('Error during conversion:', err);
      res.status(500).send('Error during conversion');
    })
    .save(outputPath);
});

// Extract all frames from a video API
app.post('/extract-frames', upload.single('file'), (req, res) => {
  const inputPath = req.file.path;
  const framesDir = path.join(uploadsDir, `${Date.now()}-frames`);

  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir);
  }

  ffmpeg(inputPath)
    .on('end', () => {
      const zipPath = path.join(uploadsDir, `${Date.now()}-frames.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        res.download(zipPath, 'frames.zip', (err) => {
          if (err) {
            console.error('Error downloading the file:', err);
            res.status(500).send('Error downloading the file');
          }

          // Clean up files
          fs.unlinkSync(inputPath);
          fs.rmdirSync(framesDir, { recursive: true });
          fs.unlinkSync(zipPath);
        });
      });

      archive.on('error', (err) => {
        console.error('Error creating zip file:', err);
        res.status(500).send('Error creating zip file');
      });

      archive.pipe(output);
      archive.directory(framesDir, false);
      archive.finalize();
    })
    .on('error', (err) => {
      console.error('Error extracting frames:', err);
      res.status(500).send('Error extracting frames');
    })
    .output(path.join(framesDir, 'frame-%03d.png'))
    .run();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
