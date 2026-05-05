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
const MAX_HARD_STOP_BYTES = 1024 * 1024; // 1MB

const SLOT_PROFILES = {
  hero_16x9: {
    family: 'hero_16x9',
    ratio: 16 / 9,
    targetMinBytes: 700 * 1024,
    targetMaxBytes: 900 * 1024,
    hardMaxBytes: MAX_HARD_STOP_BYTES,
    widths: [1280, 1920],
    minSourceWidth: 1600,
    qualityStart: 92,
    qualityFloor: 82,
  },
  product_detail: {
    family: 'product_detail',
    ratio: null,
    targetMinBytes: 250 * 1024,
    targetMaxBytes: 500 * 1024,
    hardMaxBytes: MAX_HARD_STOP_BYTES,
    widths: [720, 1080, 1440],
    minSourceWidth: 1200,
    qualityStart: 90,
    qualityFloor: 80,
  },
  product_listing: {
    family: 'product_listing',
    ratio: 1,
    targetMinBytes: 80 * 1024,
    targetMaxBytes: 250 * 1024,
    hardMaxBytes: MAX_HARD_STOP_BYTES,
    widths: [480, 720, 1080],
    minSourceWidth: 1200,
    qualityStart: 88,
    qualityFloor: 78,
  },
  generic: {
    family: 'generic',
    ratio: null,
    targetMinBytes: 250 * 1024,
    targetMaxBytes: 500 * 1024,
    hardMaxBytes: MAX_HARD_STOP_BYTES,
    widths: IMAGE_WIDTHS,
    minSourceWidth: 1200,
    qualityStart: 90,
    qualityFloor: 78,
  },
};

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

function resolveProfile(slotInput) {
  const slot = String(slotInput || 'generic').toLowerCase();
  return SLOT_PROFILES[slot] || SLOT_PROFILES.generic;
}

async function encodeWebpBuffer(buffer, width, ratio, quality) {
  const transformer = sharp(buffer).rotate();
  if (ratio) {
    const targetHeight = Math.round(width / ratio);
    transformer.resize(width, targetHeight, { fit: 'cover', position: 'attention' });
  } else {
    transformer.resize(width, null, { fit: 'inside', withoutEnlargement: true });
  }
  return transformer.webp({ quality }).toBuffer({ resolveWithObject: true });
}

async function createImageVariants(buffer, assetId, profile) {
  const meta = await sharp(buffer).metadata();
  const maxWidth = meta.width || 0;
  const widths = profile.widths.filter((w) => w <= maxWidth);
  if (!widths.length && maxWidth > 0) widths.push(maxWidth);

  const variants = [];
  const qualityReport = [];
  let totalDimensionSteps = 0;

  for (const targetWidth of widths) {
    let effectiveWidth = targetWidth;
    let quality = profile.qualityStart;
    let dimensionSteps = 0;

    // Step quality down first, then dimension down if still too large.
    let encoded = await encodeWebpBuffer(buffer, effectiveWidth, profile.ratio, quality);
    while (encoded.info.size > profile.targetMaxBytes && quality > profile.qualityFloor) {
      quality -= 3;
      encoded = await encodeWebpBuffer(buffer, effectiveWidth, profile.ratio, quality);
    }

    while (encoded.info.size > profile.targetMaxBytes && effectiveWidth > 640) {
      effectiveWidth = Math.max(640, Math.round(effectiveWidth * 0.9));
      dimensionSteps += 1;
      totalDimensionSteps += 1;
      encoded = await encodeWebpBuffer(buffer, effectiveWidth, profile.ratio, quality);
    }

    // If the output is too small, raise quality back up to preserve detail.
    while (encoded.info.size < profile.targetMinBytes && quality < 98) {
      quality += 2;
      encoded = await encodeWebpBuffer(buffer, effectiveWidth, profile.ratio, quality);
      if (encoded.info.size > profile.hardMaxBytes) break;
    }

    const webpFilename = `${assetId}-w${effectiveWidth}.webp`;
    const webpPath = path.join(derivedDir, webpFilename);
    await fs.promises.writeFile(webpPath, encoded.data);

    variants.push({
      slot: profile.family,
      width: encoded.info.width || effectiveWidth,
      height: encoded.info.height || null,
      format: 'webp',
      bytes: encoded.info.size,
      url: `/uploads/derived/${webpFilename}`,
    });

    qualityReport.push({
      targetWidth,
      finalWidth: encoded.info.width || effectiveWidth,
      startQuality: profile.qualityStart,
      endQuality: quality,
      dimensionSteps,
      finalBytes: encoded.info.size,
    });
  }

  const sorted = variants.slice().sort((a, b) => a.width - b.width);
  // Use the largest variant as default so srcset generation can include the full width range.
  const preferred = sorted[sorted.length - 1];
  const status = qualityReport.some((r) =>
    r.finalBytes > profile.hardMaxBytes ||
    (r.endQuality <= profile.qualityFloor && r.finalBytes > profile.targetMaxBytes) ||
    (r.endQuality >= 98 && r.finalBytes < profile.targetMinBytes)
  )
    ? 'needs_review'
    : 'ready';

  return {
    defaultUrl: preferred?.url || null,
    variants,
    width: meta.width || null,
    height: meta.height || null,
    status,
    qualityReport: {
      profile: profile.family,
      targetBytesRange: [profile.targetMinBytes, profile.targetMaxBytes],
      hardMaxBytes: profile.hardMaxBytes,
      totalDimensionSteps,
      entries: qualityReport,
    },
  };
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
  const profile = resolveProfile(req.body?.slot || req.query?.slot);

  try {
    const meta = await sharp(req.file.buffer).metadata();
    const requiredMinWidth = Math.max(MIN_IMAGE_WIDTH, profile.minSourceWidth || MIN_IMAGE_WIDTH);
    if (!meta.width || meta.width < requiredMinWidth) {
      return res.status(400).json({
        message: `Image resolution too small. Minimum width is ${requiredMinWidth}px for slot ${profile.family}.`,
        code: 'IMAGE_RESOLUTION_TOO_SMALL',
        meta: {
          slot: profile.family,
          minWidth: requiredMinWidth,
          detectedWidth: meta.width || 0,
          detectedHeight: meta.height || 0,
        },
      });
    }

    const result = await createImageVariants(req.file.buffer, assetId, profile);
    res.json({
      family: profile.family,
      status: result.status,
      url: result.defaultUrl,
      variants: result.variants,
      meta: { width: result.width, height: result.height },
      qualityReport: result.qualityReport,
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
