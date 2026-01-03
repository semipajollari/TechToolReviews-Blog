import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import mediaController from '../controllers/mediaController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, documents, and PDFs are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST /api/media/upload - Upload media file
router.post('/upload', upload.single('file'), mediaController.uploadMedia);

// GET /api/media - Get all media with pagination
router.get('/', mediaController.getAllMedia);

// GET /api/media/:id - Get media by ID
router.get('/:id', mediaController.getMediaById);

// PUT /api/media/:id - Update media metadata
router.put('/:id', mediaController.updateMedia);

// DELETE /api/media/:id - Delete media
router.delete('/:id', mediaController.deleteMedia);

export default router;