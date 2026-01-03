import SocialLink from '../models/SocialLink.js';

// @desc    Redirect to social platform and track clicks
// @route   GET /api/socials/:platform
// @access  Public
export const redirectToSocial = async (req, res) => {
  try {
    const platform = req.params.platform.toLowerCase();
    console.log('🔗 GET /api/socials/:platform - Redirecting to:', platform);

    const socialLink = await SocialLink.findOne({
      platform,
      isActive: true
    });

    if (!socialLink) {
      console.log('❌ Social link not found:', platform);
      return res.status(404).json({
        success: false,
        message: 'Social link not found'
      });
    }

    // Increment click count
    await socialLink.incrementClick();
    console.log(`✅ Click tracked for ${platform}, total clicks: ${socialLink.clickCount}`);

    // Redirect to the social platform
    res.redirect(302, socialLink.url);
  } catch (error) {
    console.error('❌ Error handling social redirect:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing redirect',
      error: error.message
    });
  }
};

// @desc    Get all social links
// @route   GET /api/socials
// @access  Public
export const getSocialLinks = async (req, res) => {
  try {
    console.log('🔗 GET /api/socials - Fetching social links');

    const socialLinks = await SocialLink.find({ isActive: true })
      .sort({ order: 1 })
      .select('-__v');

    console.log(`✅ Found ${socialLinks.length} social links`);

    res.json({
      success: true,
      data: socialLinks
    });
  } catch (error) {
    console.error('❌ Error fetching social links:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching social links',
      error: error.message
    });
  }
};

// @desc    Create new social link
// @route   POST /api/socials
// @access  Private/Admin
export const createSocialLink = async (req, res) => {
  try {
    console.log('🔗 POST /api/socials - Creating social link:', req.body.platform);

    const { platform, url, displayName, order } = req.body;

    const socialLink = new SocialLink({
      platform: platform.toLowerCase(),
      url,
      displayName,
      order: order || 0
    });

    await socialLink.save();

    console.log('✅ Social link created:', socialLink.platform);

    res.status(201).json({
      success: true,
      data: socialLink,
      message: 'Social link created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating social link:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Social platform already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating social link',
        error: error.message
      });
    }
  }
};

// @desc    Update social link
// @route   PUT /api/socials/:platform
// @access  Private/Admin
export const updateSocialLink = async (req, res) => {
  try {
    console.log('🔗 PUT /api/socials/:platform - Updating social link:', req.params.platform);

    const platform = req.params.platform.toLowerCase();
    const updates = req.body;

    const socialLink = await SocialLink.findOneAndUpdate(
      { platform },
      updates,
      { new: true }
    );

    if (!socialLink) {
      console.log('❌ Social link not found:', platform);
      return res.status(404).json({
        success: false,
        message: 'Social link not found'
      });
    }

    console.log('✅ Social link updated:', socialLink.platform);

    res.json({
      success: true,
      data: socialLink,
      message: 'Social link updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating social link:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating social link',
      error: error.message
    });
  }
};

// @desc    Delete social link
// @route   DELETE /api/socials/:platform
// @access  Private/Admin
export const deleteSocialLink = async (req, res) => {
  try {
    console.log('🔗 DELETE /api/socials/:platform - Deleting social link:', req.params.platform);

    const platform = req.params.platform.toLowerCase();

    const socialLink = await SocialLink.findOneAndDelete({ platform });

    if (!socialLink) {
      console.log('❌ Social link not found:', platform);
      return res.status(404).json({
        success: false,
        message: 'Social link not found'
      });
    }

    console.log('✅ Social link deleted:', socialLink.platform);

    res.json({
      success: true,
      message: 'Social link deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting social link:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting social link',
      error: error.message
    });
  }
};

// @desc    Get social link analytics
// @route   GET /api/socials/analytics
// @access  Private/Admin
export const getSocialAnalytics = async (req, res) => {
  try {
    console.log('📊 GET /api/socials/analytics - Fetching analytics');

    const analytics = await SocialLink.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$platform',
          totalClicks: { $sum: '$clickCount' },
          displayName: { $first: '$displayName' },
          url: { $first: '$url' }
        }
      },
      { $sort: { totalClicks: -1 } }
    ]);

    const totalClicks = analytics.reduce((sum, link) => sum + link.totalClicks, 0);

    console.log(`✅ Social analytics: ${totalClicks} total clicks`);

    res.json({
      success: true,
      data: {
        totalClicks,
        platforms: analytics
      }
    });
  } catch (error) {
    console.error('❌ Error fetching social analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

export default {
  redirectToSocialLink: redirectToSocial,
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getSocialAnalytics
};