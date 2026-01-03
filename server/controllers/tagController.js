import Tag from '../models/Tag.js';

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
export const getTags = async (req, res) => {
  try {
    console.log('🏷️ GET /api/tags - Fetching all tags');

    const tags = await Tag.find({ isActive: true })
      .sort({ postCount: -1, name: 1 })
      .select('-__v');

    console.log(`✅ Found ${tags.length} tags`);

    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('❌ Error fetching tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tags',
      error: error.message
    });
  }
};

// @desc    Get tag by slug
// @route   GET /api/tags/:slug
// @access  Public
export const getTagBySlug = async (req, res) => {
  try {
    console.log('🏷️ GET /api/tags/:slug - Fetching tag:', req.params.slug);

    const tag = await Tag.findOne({
      slug: req.params.slug,
      isActive: true
    }).select('-__v');

    if (!tag) {
      console.log('❌ Tag not found:', req.params.slug);
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    console.log('✅ Tag retrieved:', tag.name);

    res.json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('❌ Error fetching tag:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tag',
      error: error.message
    });
  }
};

// @desc    Create new tag
// @route   POST /api/tags
// @access  Private/Admin
export const createTag = async (req, res) => {
  try {
    console.log('🏷️ POST /api/tags - Creating tag:', req.body.name);

    const { name, slug, description } = req.body;

    const tag = new Tag({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description
    });

    await tag.save();

    console.log('✅ Tag created:', tag.name);

    res.status(201).json({
      success: true,
      data: tag,
      message: 'Tag created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating tag:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Tag name or slug already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating tag',
        error: error.message
      });
    }
  }
};

// @desc    Update tag
// @route   PUT /api/tags/:id
// @access  Private/Admin
export const updateTag = async (req, res) => {
  try {
    console.log('🏷️ PUT /api/tags/:id - Updating tag:', req.params.id);

    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      console.log('❌ Tag not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    Object.assign(tag, req.body);
    await tag.save();

    console.log('✅ Tag updated:', tag.name);

    res.json({
      success: true,
      data: tag,
      message: 'Tag updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating tag:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tag',
      error: error.message
    });
  }
};

// @desc    Delete tag
// @route   DELETE /api/tags/:id
// @access  Private/Admin
export const deleteTag = async (req, res) => {
  try {
    console.log('🏷️ DELETE /api/tags/:id - Deleting tag:', req.params.id);

    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      console.log('❌ Tag not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Soft delete - mark as inactive
    tag.isActive = false;
    await tag.save();

    console.log('✅ Tag deleted:', tag.name);

    res.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting tag:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tag',
      error: error.message
    });
  }
};

export default {
  getTags,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag
};