import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Unsubscribe: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'form'>('loading');
  const [message, setMessage] = useState('Processing your request...');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      // No token provided - show the manual unsubscribe form
      setStatus('form');
      setMessage('');
      return;
    }

    // Call unsubscribe API with token
    fetch(`/api/unsubscribe?token=${token}`)
      .then(async (res) => {
        const html = await res.text();
        
        // Parse success/error from HTML response
        if (html.includes('Successfully unsubscribed') || html.includes('Unsubscribed')) {
          setStatus('success');
          setMessage('You have been successfully unsubscribed from TechToolReviews.');
        } else if (html.includes('Already')) {
          setStatus('success');
          setMessage('You have already been unsubscribed.');
        } else {
          setStatus('error');
          setMessage('This unsubscribe link is invalid or has expired.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again later.');
      });
  }, [location]);

  const handleManualUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call API to request unsubscribe link
      const response = await fetch('/api/request-unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage(`An unsubscribe link has been sent to ${email}. Please check your inbox.`);
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data.error || 'Failed to process your request. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 py-24">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          {status === 'loading' && (
            <div className="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          )}
          {status === 'success' && (
            <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center shadow-2xl">
              <i className="fas fa-check text-white text-5xl"></i>
            </div>
          )}
          {status === 'error' && (
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
              <i className="fas fa-times text-white text-5xl"></i>
            </div>
          )}
          {status === 'form' && (
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center shadow-2xl">
              <i className="fas fa-envelope-open text-white text-5xl"></i>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
          {status === 'loading' && 'Processing...'}
          {status === 'success' && 'Unsubscribed'}
          {status === 'error' && 'Error'}
          {status === 'form' && 'Unsubscribe'}
        </h1>

        {/* Message */}
        {message && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 font-medium leading-relaxed">
            {message}
          </p>
        )}

        {/* Manual Unsubscribe Form */}
        {status === 'form' && (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 mb-10 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              We're sorry to see you go
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enter your email address to unsubscribe from our newsletter.
            </p>
            <form onSubmit={handleManualUnsubscribe} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Unsubscribe'}
              </button>
            </form>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
              We'll send you a confirmation email to complete the unsubscribe process.
            </p>
          </div>
        )}

        {/* Additional Info for Success */}
        {status === 'success' && !message.includes('sent to') && (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 mb-10 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              We're sorry to see you go!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You will no longer receive emails from TechToolReviews. If you change your mind, you can always subscribe again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all inline-block"
              >
                Back to Home
              </Link>
              <Link
                to="/insider-list"
                className="px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all inline-block"
              >
                Resubscribe
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-10">
            <p className="text-red-800 dark:text-red-200">
              If you continue to have issues, please contact us at{' '}
              <a href="mailto:techtoolreview@gmail.com" className="underline font-bold">
                techtoolreview@gmail.com
              </a>
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        {(status === 'error' || status === 'form') && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all inline-block"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-12 font-medium">
          Have feedback? We'd love to hear from you at{' '}
          <a href="mailto:techtoolreview@gmail.com" className="text-indigo-600 hover:underline">
            techtoolreview@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Unsubscribe;
