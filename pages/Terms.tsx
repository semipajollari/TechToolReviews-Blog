import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';

const Terms: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="pt-32 pb-20 bg-white dark:bg-gray-950 transition-colors min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:underline">{t.nav.home}</Link>
          <i className="fas fa-chevron-right text-[8px] text-gray-400"></i>
          <span className="text-gray-900 dark:text-gray-200">Terms of Service</span>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-gray-50 mb-6 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">
            Last updated: January 5, 2026
          </p>
        </header>

        <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              1. Agreement to Terms
            </h2>
            <p className="mb-6 text-lg leading-loose">
              By accessing and using TechToolReviews, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              2. Use License
            </h2>
            <p className="mb-6 text-lg leading-loose">
              Permission is granted to temporarily access the materials (information, reviews, and articles) on TechToolReviews for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li>Modify or copy the materials without permission</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
              <li>Transfer the materials to another person or mirror the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              3. Content and Reviews
            </h2>
            <p className="mb-6 text-lg leading-loose">
              All reviews, articles, and content published on TechToolReviews represent the opinions of our editorial team based on hands-on testing and research. While we strive for accuracy:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li>Software and tools may change after our review date</li>
              <li>Pricing and features may vary by region or subscription tier</li>
              <li>Our recommendations are general and may not suit every use case</li>
              <li>We encourage users to conduct their own research before purchasing</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              4. Affiliate Links and Compensation
            </h2>
            <p className="mb-6 text-lg leading-loose">
              TechToolReviews participates in affiliate marketing programs. When you click on affiliate links and make purchases, we may earn a commission. This does not affect:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li>The price you pay for products or services</li>
              <li>Our editorial independence and honest review process</li>
              <li>The objectivity of our ratings and recommendations</li>
            </ul>
            <p className="mb-6 text-lg leading-loose">
              We only recommend products and services that we believe provide genuine value. Our "2026 Ready" certification is based on rigorous testing criteria, not sponsorship status.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              5. Newsletter Subscription
            </h2>
            <p className="mb-6 text-lg leading-loose">
              By subscribing to our newsletter (The Insider List), you agree to receive weekly emails containing:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li>New tool reviews and recommendations</li>
              <li>Industry news and insights</li>
              <li>Exclusive deals and offers from our partners</li>
            </ul>
            <p className="mb-6 text-lg leading-loose">
              You may unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us directly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              6. Disclaimer
            </h2>
            <p className="mb-6 text-lg leading-loose">
              The materials on TechToolReviews are provided on an 'as is' basis. TechToolReviews makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
              <li>Implied warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of intellectual property</li>
            </ul>
            <p className="mb-6 text-lg leading-loose">
              We do not warrant that the website will be error-free, secure, or continuously available.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              7. Limitations of Liability
            </h2>
            <p className="mb-6 text-lg leading-loose">
              In no event shall TechToolReviews or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on TechToolReviews.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              8. External Links
            </h2>
            <p className="mb-6 text-lg leading-loose">
              TechToolReviews has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by TechToolReviews of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              9. Intellectual Property
            </h2>
            <p className="mb-6 text-lg leading-loose">
              All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of TechToolReviews or its content suppliers and protected by international copyright laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              10. Modifications
            </h2>
            <p className="mb-6 text-lg leading-loose">
              TechToolReviews may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              11. Governing Law
            </h2>
            <p className="mb-6 text-lg leading-loose">
              These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-600 pl-6">
              12. Contact Information
            </h2>
            <p className="mb-6 text-lg leading-loose">
              If you have any questions about these Terms, please contact us at:
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

export default Terms;
