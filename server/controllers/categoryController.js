import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    console.log('📂 GET /api/categories - Fetching all categories');

    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .select('-__v');

    console.log(`✅ Found ${categories.length} categories`);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res) => {
  try {
    console.log('📂 GET /api/categories/:slug - Fetching category:', req.params.slug);

    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true
    }).select('-__v');

    if (!category) {
      console.log('❌ Category not found:', req.params.slug);
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    console.log('✅ Category retrieved:', category.name);

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('❌ Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    console.log('📂 POST /api/categories - Creating category:', req.body.name);

    const { name, slug, description, icon, order } = req.body;

    const category = new Category({
      name,
      slug,
      description,
      icon,
      order: order || 0
    });

    await category.save();

    console.log('✅ Category created:', category.name);

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating category:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Category slug already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating category',
        error: error.message
      });
    }
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    console.log('📂 PUT /api/categories/:id - Updating category:', req.params.id);

    const category = await Category.findById(req.params.id);
    if (!category) {
      console.log('❌ Category not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    Object.assign(category, req.body);
    await category.save();

    console.log('✅ Category updated:', category.name);

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    console.log('📂 DELETE /api/categories/:id - Deleting category:', req.params.id);

    const category = await Category.findById(req.params.id);
    if (!category) {
      console.log('❌ Category not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Soft delete - mark as inactive
    category.isActive = false;
    await category.save();

    console.log('✅ Category deleted:', category.name);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

export default {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};