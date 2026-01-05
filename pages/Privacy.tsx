import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';

const Privacy: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="pt-32 pb-20 bg-white dark:bg-gray-950 transition-colors min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:underline">{t.nav.home}</Link>
          <i className="fas fa-chevron-right text-[8px] text-gray-400"></i>
          <span className="text-gray-900 dark:text-gray-200">Privacy Policy</span>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-gray-50 mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">
            Last updated: January 5, 2026
          </p>
        </header>

        <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              1. Introduction
            </h2>
            <p className="mb-6 text-lg leading-loose">
              Welcome to TechToolReviews. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
            <p className="mb-6 text-lg leading-loose">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              2. Information We Collect
            </h2>
            <p className="mb-6 text-lg leading-loose">
              We collect information that you voluntarily provide to us when you subscribe to our newsletter, express interest in obtaining information about us or our products and services, or otherwise contact us.
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Personal Data</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li>Email address (when subscribing to our newsletter)</li>
              <li>Usage data and analytics information</li>
              <li>Browser type and version</li>
              <li>Device information</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              3. How We Use Your Information
            </h2>
            <p className="mb-6 text-lg leading-loose">
              We use the information we collect or receive:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li><strong>To send you our newsletter:</strong> If you have subscribed, we will send you weekly insights about tech tools and industry updates.</li>
              <li><strong>To improve our website:</strong> We analyze usage data to enhance user experience and content quality.</li>
              <li><strong>To respond to inquiries:</strong> When you contact us, we use your information to provide support.</li>
              <li><strong>For analytics:</strong> We use aggregated data to understand how visitors interact with our site.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="mb-6 text-lg leading-loose">
              We use cookies and similar tracking technologies to access or store information. These technologies help us understand user preferences and improve our services. You can control cookies through your browser settings.
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li><strong>Essential cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand site usage</li>
              <li><strong>Preference cookies:</strong> Remember your settings (like dark mode and language)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              5. Third-Party Services
            </h2>
            <p className="mb-6 text-lg leading-loose">
              Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
            </p>
            <p className="mb-6 text-lg leading-loose">
              We may use third-party service providers to assist with:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li>Email delivery (Resend)</li>
              <li>Website hosting (Vercel)</li>
              <li>Database services (MongoDB Atlas)</li>
              <li>Image hosting (Cloudinary)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              6. Affiliate Disclosure
            </h2>
            <p className="mb-6 text-lg leading-loose">
              TechToolReviews participates in affiliate marketing programs. This means we may earn a commission when you click on certain links and make a purchase. This comes at no additional cost to you. Our reviews remain unbiased and are based on thorough testing.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              7. Data Security
            </h2>
            <p className="mb-6 text-lg leading-loose">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              8. Your Privacy Rights
            </h2>
            <p className="mb-6 text-lg leading-loose">
              Depending on your location, you may have certain rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li><strong>Right to access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to unsubscribe:</strong> Opt-out of our newsletter at any time</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              9. Contact Us
            </h2>
            <p className="mb-6 text-lg leading-loose">
              If you have questions or comments about this policy, you may contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">TechToolReviews</p>
              <a href="mailto:techtoolreviews.co@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                techtoolreviews.co@gmail.com
              </a>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default Privacy;
