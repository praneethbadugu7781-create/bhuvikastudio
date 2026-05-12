'use client';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://browser.sentry-cdn.com/7.108.0/bundle.min.js';
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).Sentry?.captureException(error, {
          contexts: {
            react: {
              componentStack: error.stack,
            },
          },
        });
      };
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-center text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-center text-gray-600 mb-6">
            We're sorry for the inconvenience. Our team has been notified and is working to fix this issue.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 p-4 bg-gray-100 rounded text-sm text-gray-700 overflow-auto max-h-40">
              <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
              <pre>{error.message}</pre>
            </details>
          )}
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-medium"
          >
            Try again
          </button>
          <a
            href="/"
            className="block text-center mt-4 text-brand-600 hover:text-brand-700 font-medium"
          >
            Go back to home
          </a>
        </div>
      </div>
    </div>
  );
}
