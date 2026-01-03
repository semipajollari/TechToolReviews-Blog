import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import Subscriber from '../models/Subscriber.js';
import BlogPost from '../models/BlogPost.js';

// Configure email service
const configureEmailService = () => {
  const service = process.env.EMAIL_SERVICE || 'sendgrid';

  if (service === 'sendgrid' && process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('📧 Email service configured: SendGrid');
    return { service: 'sendgrid', client: sgMail };
  } else if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('📧 Email service configured: SMTP');
    return { service: 'nodemailer', client: transporter };
  } else {
    console.warn('⚠️ No email service configured. Using console logging for development.');
    return { service: 'console', client: null };
  }
};

const emailService = configureEmailService();

// Send email to subscribers when new post is published
export const sendNewPostNotification = async (postId) => {
  try {
    console.log('📧 Sending new post notifications for post ID:', postId);

    const post = await BlogPost.findById(postId);
    if (!post || !post.isPublished) {
      console.log('⚠️ Post not found or not published');
      return;
    }

    const subscribers = await Subscriber.find({
      isVerified: true,
      isActive: true
    });

    if (subscribers.length === 0) {
      console.log('⚠️ No active subscribers found');
      return;
    }

    console.log(`📧 Sending notifications to ${subscribers.length} subscribers`);

    const emailData = {
      subject: `New Article: ${post.title}`,
      content: generatePostEmailContent(post),
      post
    };

    let successCount = 0;
    let failCount = 0;

    for (const subscriber of subscribers) {
      try {
        await sendEmail(subscriber.email, emailData);
        subscriber.lastEmailSent = new Date();
        await subscriber.save();
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to send email to ${subscriber.email}:`, error.message);
        failCount++;
      }
    }

    console.log(`✅ Email notifications sent: ${successCount} success, ${failCount} failed`);
  } catch (error) {
    console.error('❌ Error sending new post notifications:', error);
  }
};

// Send single email
const sendEmail = async (to, { subject, content, post }) => {
  const from = process.env.FROM_EMAIL || 'noreply@techtoolreviews.com';

  if (emailService.service === 'sendgrid') {
    const msg = {
      to,
      from,
      subject,
      html: content,
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      }
    };
    await emailService.client.send(msg);
  } else if (emailService.service === 'nodemailer') {
    const mailOptions = {
      from,
      to,
      subject,
      html: content
    };
    await emailService.client.sendMail(mailOptions);
  } else {
    // Console logging for development
    console.log(`📧 EMAIL TO: ${to}`);
    console.log(`📧 SUBJECT: ${subject}`);
    console.log(`📧 CONTENT: ${content.substring(0, 200)}...`);
    console.log('---');
  }
};

// Generate HTML email content for new post
const generatePostEmailContent = (post) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const postUrl = `${baseUrl}/article/${post.slug}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Article: ${post.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
        .unsubscribe { color: #666; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📰 New Article Published!</h1>
        <h2>${post.title}</h2>
      </div>

      <div class="content">
        <p><strong>By ${post.author}</strong> • ${new Date(post.date).toLocaleDateString()}</p>

        ${post.image ? `<img src="${post.image}" alt="${post.title}" style="width: 100%; max-width: 560px; height: auto; border-radius: 8px; margin: 20px 0;">` : ''}

        <p style="font-size: 16px; line-height: 1.8;">${post.excerpt}</p>

        <a href="${postUrl}" class="button">Read Full Article →</a>

        ${post.affiliateLinks && post.affiliateLinks.length > 0 ? `
          <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea;">💡 Recommended Tools</h3>
            ${post.affiliateLinks.map(link => `
              <p><a href="${link.url}" style="color: #667eea; text-decoration: none;">${link.label}</a></p>
            `).join('')}
          </div>
        ` : ''}

        <div class="footer">
          <p>You're receiving this because you subscribed to TechToolReviews updates.</p>
          <p><a href="${baseUrl}/unsubscribe" class="unsubscribe">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  console.log('📧 Sending verification email to:', email);

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  const subject = 'Verify Your Email - TechToolReviews';
  const content = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to TechToolReviews!</h2>
      <p>Please verify your email address to start receiving our latest tech tool reviews and insights.</p>
      <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link: ${verificationUrl}</p>
    </div>
  `;

  await sendEmail(email, { subject, content });
  console.log('✅ Verification email sent');
};

export default emailService;