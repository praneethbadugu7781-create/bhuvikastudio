'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    setIsLoading(false);

    if (!consent) {
      setIsVisible(true);
    } else {
      loadGoogleAnalytics();
    }
  }, []);

  const loadGoogleAnalytics = () => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID);
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    loadGoogleAnalytics();
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible || isLoading) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Cookie Preferences</h3>
            <p className="text-sm text-gray-600">
              We use cookies to enhance your experience, analyze site traffic, and serve personalized content.
              By clicking "Accept", you consent to our use of cookies. You can learn more in our{' '}
              <a href="/privacy-policy" className="underline text-brand-600 hover:text-brand-700">
                privacy policy
              </a>.
            </p>
          </div>
          <div className="flex gap-3 sm:flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
