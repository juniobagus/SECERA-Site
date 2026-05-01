const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (images)
});

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (videos)
});

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const filename = `${uuidv4()}.webp`;
  const filepath = path.join(uploadDir, filename);

  try {
    await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    const imageUrl = `/uploads/${filename}`;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing image' });
  }
});

router.post('/video', uploadVideo.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const mime = (req.file.mimetype || '').toLowerCase();
  const allowed = new Set(['video/mp4', 'video/webm', 'video/ogg']);
  if (!allowed.has(mime)) {
    return res.status(400).json({ message: 'Unsupported video type. Use MP4/WebM/Ogg.' });
  }

  const ext = mime === 'video/webm' ? 'webm' : mime === 'video/ogg' ? 'ogv' : 'mp4';
  const filename = `${uuidv4()}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  try {
    fs.writeFileSync(filepath, req.file.buffer);
    const videoUrl = `/uploads/${filename}`;
    res.json({ url: videoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving video' });
  }
});

module.exports = router;
