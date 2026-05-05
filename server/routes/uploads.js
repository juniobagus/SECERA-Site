const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const uploadDocument = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadDir = path.join(__dirname, '../public/uploads');
const derivedDir = path.join(uploadDir, 'derived');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(derivedDir)) fs.mkdirSync(derivedDir, { recursive: true });

const IMAGE_WIDTHS = [480, 768, 1080, 1440, 2000];
const MIN_IMAGE_WIDTH = 1200;
const VIDEO_HEIGHTS = [720, 1080];

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', args);
    let stderr = '';

    ff.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    ff.on('error', (err) => reject(err));
    ff.on('close', (code) => {
      if (code === 0) return resolve();
      reject(new Error(stderr || `ffmpeg exited with code ${code}`));
    });
  });
}

async function createImageVariants(buffer, assetId) {
  const meta = await sharp(buffer).metadata();
  const maxWidth = meta.width || 0;
  const widths = IMAGE_WIDTHS.filter((w) => w <= maxWidth);
  if (!widths.length && maxWidth > 0) widths.push(maxWidth);

  const variants = [];
  for (const width of widths) {
    const webpFilename = `${assetId}-w${width}.webp`;
    const webpPath = path.join(derivedDir, webpFilename);
    await sharp(buffer)
      .resize(width, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(webpPath);
    variants.push({ width, format: 'webp', url: `/uploads/derived/${webpFilename}` });

    try {
      const avifFilename = `${assetId}-w${width}.avif`;
      const avifPath = path.join(derivedDir, avifFilename);
      await sharp(buffer)
        .resize(width, null, { fit: 'inside', withoutEnlargement: true })
        .avif({ quality: 50 })
        .toFile(avifPath);
      variants.push({ width, format: 'avif', url: `/uploads/derived/${avifFilename}` });
    } catch (_) {
      // AVIF can fail on some hosts/builds; WebP remains primary fallback.
    }
  }

  const defaultWidth = widths.includes(1080) ? 1080 : widths[widths.length - 1];
  const defaultUrl = `/uploads/derived/${assetId}-w${defaultWidth}.webp`;

  return { defaultUrl, variants, width: meta.width || null, height: meta.height || null };
}

async function createVideoVariants(inputPath, assetId) {
  const variants = [];

  for (const height of VIDEO_HEIGHTS) {
    const filename = `${assetId}-h${height}.mp4`;
    const outputPath = path.join(derivedDir, filename);
    const bitrate = height === 1080 ? '4500k' : '2200k';

    await runFfmpeg([
      '-y',
      '-i', inputPath,
      '-vf', `scale=-2:${height}`,
      '-c:v', 'libx264',
      '-profile:v', 'high',
      '-movflags', '+faststart',
      '-pix_fmt', 'yuv420p',
      '-b:v', bitrate,
      '-maxrate', bitrate,
      '-bufsize', height === 1080 ? '9000k' : '4400k',
      '-g', '60',
      '-keyint_min', '60',
      '-c:a', 'aac',
      '-b:a', '128k',
      outputPath,
    ]);

    variants.push({ height, format: 'mp4', url: `/uploads/derived/${filename}` });
  }

  const posterName = `${assetId}-poster-1080.webp`;
  const posterPath = path.join(derivedDir, posterName);
  await runFfmpeg([
    '-y',
    '-i', inputPath,
    '-ss', '00:00:00.500',
    '-vframes', '1',
    '-vf', 'scale=-2:1080',
    posterPath,
  ]);

  return {
    variants,
    posterUrl: `/uploads/derived/${posterName}`,
    defaultUrl: variants.find((v) => v.height === 720)?.url || variants[0]?.url,
  };
}

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const assetId = uuidv4();

  try {
    const meta = await sharp(req.file.buffer).metadata();
    if (!meta.width || meta.width < MIN_IMAGE_WIDTH) {
      return res.status(400).json({
        message: `Image resolution too small. Minimum width is ${MIN_IMAGE_WIDTH}px.`,
        code: 'IMAGE_RESOLUTION_TOO_SMALL',
        meta: {
          minWidth: MIN_IMAGE_WIDTH,
          detectedWidth: meta.width || 0,
          detectedHeight: meta.height || 0,
        },
      });
    }

    const result = await createImageVariants(req.file.buffer, assetId);
    res.json({
      url: result.defaultUrl,
      variants: result.variants,
      meta: { width: result.width, height: result.height },
    });
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
  const assetId = uuidv4();
  const originalFilename = `${assetId}.${ext}`;
  const originalPath = path.join(uploadDir, originalFilename);

  try {
    fs.writeFileSync(originalPath, req.file.buffer);

    try {
      const processed = await createVideoVariants(originalPath, assetId);
      return res.json({
        url: processed.defaultUrl,
        originalUrl: `/uploads/${originalFilename}`,
        posterUrl: processed.posterUrl,
        variants: processed.variants,
      });
    } catch (ffmpegErr) {
      console.warn('Video processing degraded (ffmpeg unavailable or failed):', ffmpegErr?.message || ffmpegErr);
      return res.json({
        url: `/uploads/${originalFilename}`,
        originalUrl: `/uploads/${originalFilename}`,
        degraded: true,
        message: 'Video uploaded without renditions. ffmpeg is unavailable or processing failed.',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving video' });
  }
});

router.post('/document', uploadDocument.single('document'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const mime = (req.file.mimetype || '').toLowerCase();
  const allowed = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]);
  if (!allowed.has(mime)) {
    return res.status(400).json({ message: 'Unsupported document type. Use PDF, DOC, or DOCX.' });
  }

  const ext = mime === 'application/pdf' ? 'pdf' : mime === 'application/msword' ? 'doc' : 'docx';
  const filename = `${uuidv4()}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  try {
    fs.writeFileSync(filepath, req.file.buffer);
    const documentUrl = `/uploads/${filename}`;
    res.json({ url: documentUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving document' });
  }
});

router.use((err, req, res, next) => {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxSizeMb = req.path === '/video' ? 50 : 5;
      return res.status(413).json({ message: `File too large. Maximum size is ${maxSizeMb}MB.` });
    }
    return res.status(400).json({ message: err.message || 'Upload error' });
  }

  console.error('Upload route error:', err);
  return res.status(500).json({ message: 'Upload failed due to server error' });
});

module.exports = router;
