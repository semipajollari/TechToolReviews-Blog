import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { connectDB, disconnectDB } from '../config/db.js';
import { sendEmail } from '../config/mailer.js';
import { Subscriber } from '../models/Subscriber.js';

const sendWeeklyEmail = async () => {
  await connectDB();

  try {
    const subscribers = await Subscriber.find({ active: true });

    if (subscribers.length === 0) {
      console.log('No active subscribers');
      await disconnectDB();
      return;
    }

    const subject = "This week's new articles";
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366f1; color: white; padding: 20px; border-radius: 8px; }
            .content { line-height: 1.6; padding: 20px 0; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>TechToolReviews</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Check out this week's new technical reviews and guides.</p>
              <a href="https://techtoolreviews.com" class="button">Read Articles</a>
            </div>
            <div class="footer">
              <p>You received this because you subscribed to TechToolReviews.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    let successCount = 0;
    let failureCount = 0;

    for (const subscriber of subscribers) {
      try {
        await sendEmail(subscriber.email, subject, html);
        successCount++;
      } catch (error) {
        failureCount++;
      }
    }

    console.log(`Weekly email: ${successCount} sent, ${failureCount} failed`);
  } catch (error) {
    console.error('Weekly email job failed:', error.message);
  } finally {
    await disconnectDB();
  }
};

sendWeeklyEmail();
