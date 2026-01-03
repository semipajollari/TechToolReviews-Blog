import { validationResult } from 'express-validator';
import BlogPost from '../models/BlogPost.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import { sendNewPostNotification } from '../services/emailService.js';

// @desc    Get all blog posts with pagination and filtering
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    console.log('📝 GET /api/posts - Fetching posts with filters:', req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isPublished: true };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await BlogPost.countDocuments(query);

    console.log(`✅ Found ${posts.length} posts (page ${page}/${Math.ceil(total / limit)})`);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = async (req, res) => {
  try {
    console.log('📝 GET /api/posts/:slug - Fetching post:', req.params.slug);

    const post = await BlogPost.findOne({
      slug: req.params.slug,
      isPublished: true
    }).select('-__v');

    if (!post) {
      console.log('❌ Post not found:', req.params.slug);
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    console.log('✅ Post retrieved:', post.title);

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('❌ Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/posts
// @access  Private/Admin
export const createPost = async (req, res) => {
  try {
    console.log('📝 POST /api/posts - Creating new post:', req.body.title);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug: req.body.slug });
    if (existingPost) {
      console.log('❌ Slug already exists:', req.body.slug);
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    const post = new BlogPost(req.body);
    await post.save();

    // Update category and tag counts
    if (post.category) {
      const category = await Category.findOne({ slug: post.category });
      if (category) {
        await category.updatePostCount();
      }
    }

    if (post.tags && post.tags.length > 0) {
      for (const tagName of post.tags) {
        const tag = await Tag.findOne({ name: tagName });
        if (tag) {
          await tag.updatePostCount();
        }
      }
    }

    // Send email notifications if post is published
    if (post.isPublished) {
      console.log('📧 Sending email notifications for new post');
      setTimeout(() => {
        sendNewPostNotification(post._id);
      }, 1000);
    }

    console.log('✅ Post created successfully:', post.title);

    res.status(201).json({
      success: true,
      data: post,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/posts/:id
// @access  Private/Admin
export const updatePost = async (req, res) => {
  try {
    console.log('📝 PUT /api/posts/:id - Updating post:', req.params.id);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      console.log('❌ Post not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if slug changed and if it conflicts
    if (req.body.slug !== post.slug) {
      const existingPost = await BlogPost.findOne({ slug: req.body.slug });
      if (existingPost && existingPost._id.toString() !== req.params.id) {
        console.log('❌ Slug already exists:', req.body.slug);
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
    }

    const wasPublished = post.isPublished;
    Object.assign(post, req.body);
    await post.save();

    // Update category and tag counts
    if (post.category) {
      const category = await Category.findOne({ slug: post.category });
      if (category) {
        await category.updatePostCount();
      }
    }

    if (post.tags && post.tags.length > 0) {
      for (const tagName of post.tags) {
        const tag = await Tag.findOne({ name: tagName });
        if (tag) {
          await tag.updatePostCount();
        }
      }
    }

    // Send email notifications if post was just published
    if (post.isPublished && !wasPublished) {
      console.log('📧 Sending email notifications for published post');
      setTimeout(() => {
        sendNewPostNotification(post._id);
      }, 1000);
    }

    console.log('✅ Post updated successfully:', post.title);

    res.json({
      success: true,
      data: post,
      message: 'Post updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
export const deletePost = async (req, res) => {
  try {
    console.log('📝 DELETE /api/posts/:id - Deleting post:', req.params.id);

    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      console.log('❌ Post not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    // Update category and tag counts
    if (post.category) {
      const category = await Category.findOne({ slug: post.category });
      if (category) {
        await category.updatePostCount();
      }
    }

    if (post.tags && post.tags.length > 0) {
      for (const tagName of post.tags) {
        const tag = await Tag.findOne({ name: tagName });
        if (tag) {
          await tag.updatePostCount();
        }
      }
    }

    console.log('✅ Post deleted successfully:', post.title);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

export default {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
};