import { Resend } from 'resend';
import { getSubscriberModel } from './models.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://techtoolreviews.co';
const FROM_EMAIL = process.env.FROM_EMAIL || 'TechToolReviews <onboarding@resend.dev>';

/**
 * Send newsletter email to all active subscribers when a new article is published
 */
export async function sendNewArticleEmail(article) {
  try {
    const Subscriber = getSubscriberModel();
    
    // Get all active subscribers
    const subscribers = await Subscriber.find({ status: 'active' }).lean();
    
    if (subscribers.length === 0) {
      console.log('[Newsletter] No active subscribers to notify');
      return { success: true, sent: 0 };
    }

    const articleUrl = `${FRONTEND_URL}/article/${article.slug}`;
    const unsubscribeUrl = `${FRONTEND_URL}/api/unsubscribe`;

    // Create email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Article: ${article.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                ⚡ TechToolReviews
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
                New Article Alert
              </p>
            </td>
          </tr>

          <!-- Article Image -->
          <tr>
            <td style="padding: 0;">
              <img src="${article.imageUrl}" alt="${article.title}" style="width: 100%; height: 250px; object-fit: cover;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #18181b; margin: 0 0 16px 0; font-size: 22px; font-weight: 700; line-height: 1.3;">
                ${article.title}
              </h2>
              
              <p style="color: #71717a; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
                ${article.description.substring(0, 300)}${article.description.length > 300 ? '...' : ''}
              </p>

              <!-- Category Badge -->
              <p style="margin: 0 0 24px 0;">
                <span style="display: inline-block; background-color: #eef2ff; color: #4f46e5; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                  ${article.category || 'Software'}
                </span>
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 8px;">
                    <a href="${articleUrl}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">
                      Read Full Article →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 32px; border-top: 1px solid #e4e4e7;">
              <p style="color: #a1a1aa; margin: 0 0 12px 0; font-size: 13px; text-align: center;">
                You're receiving this because you subscribed to TechToolReviews newsletter.
              </p>
              <p style="margin: 0; text-align: center;">
                <a href="${FRONTEND_URL}" style="color: #4f46e5; text-decoration: none; font-size: 13px;">Visit Website</a>
                <span style="color: #d4d4d8; margin: 0 8px;">|</span>
                <a href="${unsubscribeUrl}?email={{email}}" style="color: #71717a; text-decoration: none; font-size: 13px;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send emails in batches of 50
    const batchSize = 50;
    let sentCount = 0;
    let errorCount = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (subscriber) => {
        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: subscriber.email,
            subject: `📰 New: ${article.title}`,
            html: emailHtml.replace('{{email}}', encodeURIComponent(subscriber.email)),
          });
          sentCount++;
        } catch (error) {
          console.error(`[Newsletter] Failed to send to ${subscriber.email}:`, error.message);
          errorCount++;
        }
      });

      await Promise.all(emailPromises);
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`[Newsletter] Sent ${sentCount} emails, ${errorCount} failed`);
    return { success: true, sent: sentCount, failed: errorCount };
  } catch (error) {
    console.error('[Newsletter] Error:', error);
    throw error;
  }
}

export default { sendNewArticleEmail };
