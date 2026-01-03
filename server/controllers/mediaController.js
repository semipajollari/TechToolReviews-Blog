import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Media from '../models/Media.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @desc    Upload media file
// @route   POST /api/media/upload
// @access  Private/Admin
export const uploadMedia = async (req, res) => {
  try {
    console.log('📁 POST /api/media/upload - Uploading file');

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      uploadedBy: req.body.uploadedBy || 'admin',
      alt: req.body.alt || '',
      caption: req.body.caption || '',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    });

    // Generate thumbnail for images
    if (req.file.mimetype.startsWith('image/')) {
      media.thumbnailUrl = fileUrl; // For now, use same URL as thumbnail
    }

    await media.save();

    console.log('✅ File uploaded successfully:', req.file.originalname);

    res.status(201).json({
      success: true,
      data: media,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

// @desc    Get all media with pagination
// @route   GET /api/media
// @access  Private/Admin
export const getMedia = async (req, res) => {
  try {
    console.log('📁 GET /api/media - Fetching media');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    // Filter by tags
    if (req.query.tags) {
      query.tags = { $in: req.query.tags.split(',') };
    }

    // Filter by type
    if (req.query.type) {
      if (req.query.type === 'image') {
        query.mimeType = { $regex: '^image/' };
      } else if (req.query.type === 'document') {
        query.mimeType = { $nin: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] };
      }
    }

    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Media.countDocuments(query);

    console.log(`✅ Found ${media.length} media files`);

    res.json({
      success: true,
      data: media,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching media:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching media',
      error: error.message
    });
  }
};

// @desc    Get media by ID
// @route   GET /api/media/:id
// @access  Private/Admin
export const getMediaById = async (req, res) => {
  try {
    console.log('📁 GET /api/media/:id - Fetching media:', req.params.id);

    const media = await Media.findById(req.params.id);

    if (!media || !media.isActive) {
      console.log('❌ Media not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    console.log('✅ Media retrieved:', media.originalName);

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('❌ Error fetching media:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching media',
      error: error.message
    });
  }
};

// @desc    Update media metadata
// @route   PUT /api/media/:id
// @access  Private/Admin
export const updateMedia = async (req, res) => {
  try {
    console.log('📁 PUT /api/media/:id - Updating media:', req.params.id);

    const updates = {
      alt: req.body.alt,
      caption: req.body.caption,
      tags: req.body.tags,
      isActive: req.body.isActive
    };

    // Remove undefined values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!media) {
      console.log('❌ Media not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    console.log('✅ Media updated:', media.originalName);

    res.json({
      success: true,
      data: media,
      message: 'Media updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating media:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating media',
      error: error.message
    });
  }
};

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private/Admin
export const deleteMedia = async (req, res) => {
  try {
    console.log('📁 DELETE /api/media/:id - Deleting media:', req.params.id);

    const media = await Media.findById(req.params.id);

    if (!media) {
      console.log('❌ Media not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Soft delete - mark as inactive instead of removing from DB
    media.isActive = false;
    await media.save();

    console.log('✅ Media deleted:', media.originalName);

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting media',
      error: error.message
    });
  }
};

// @desc    Get media statistics
// @route   GET /api/media/stats
// @access  Private/Admin
export const getMediaStats = async (req, res) => {
  try {
    console.log('📊 GET /api/media/stats - Fetching media statistics');

    const stats = await Media.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$size' },
          images: {
            $sum: {
              $cond: [{ $regexMatch: { input: '$mimeType', regex: '^image/' } }, 1, 0]
            }
          },
          documents: {
            $sum: {
              $cond: [{ $regexMatch: { input: '$mimeType', regex: '^image/' } }, 0, 1]
            }
          }
        }
      }
    ]);

    const result = stats[0] || { totalFiles: 0, totalSize: 0, images: 0, documents: 0 };

    console.log('✅ Media stats:', result);

    res.json({
      success: true,
      data: {
        totalFiles: result.totalFiles,
        totalSize: result.totalSize,
        totalSizeMB: (result.totalSize / (1024 * 1024)).toFixed(2),
        images: result.images,
        documents: result.documents
      }
    });
  } catch (error) {
    console.error('❌ Error fetching media stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching media statistics',
      error: error.message
    });
  }
};

export default {
  uploadMedia,
  getAllMedia: getMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  getMediaStats
};