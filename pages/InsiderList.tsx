import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const InsiderList: React.FC = () => {
  const location = useLocation();
  const state = location.state as { email?: string; message?: string } || {};

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 py-24">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <i className="fas fa-check text-white text-5xl"></i>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
          Welcome to the Insider List!
        </h1>

        {/* Message */}
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 font-medium leading-relaxed">
          {state.message || 'You\'ve successfully joined our exclusive community of 125,000+ developers and founders.'}
        </p>

        {/* Email Display */}
        {state.email && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-10">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Subscription email:</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{state.email}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 mb-10 text-left border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">What's Next?</h2>
          <ol className="space-y-4">
            <li className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Check Your Email</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Look for our verification email. Click the link to confirm your subscription.</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Verify Your Subscription</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Click the verification link in the email to activate your membership.</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Get Weekly Insights</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Receive our curated technical tool audits every week directly in your inbox.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">As an Insider, You'll Get:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: 'fa-rocket', text: 'Early access to new tool reviews' },
              { icon: 'fa-brain', text: 'AI-powered tech stack recommendations' },
              { icon: 'fa-chart-line', text: 'Exclusive industry benchmarks' },
              { icon: 'fa-lock-open', text: 'Members-only technical guides' },
              { icon: 'fa-zap', text: 'Weekly productivity tips' },
              { icon: 'fa-users', text: 'Community access & networking' },
            ].map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                <i className={`fas ${benefit.icon} text-indigo-600 text-2xl mb-3`}></i>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all inline-block"
          >
            Back to Home
          </Link>
          <a
            href="https://tech-tool-reviews-blog.vercel.app"
            className="px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all inline-block"
          >
            Browse Articles
          </a>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-12 font-medium">
          Can't find the email? Check your spam folder or <a href="#" className="text-indigo-600 hover:underline">contact support</a>
        </p>
      </div>
    </div>
  );
};

export default InsiderList;
