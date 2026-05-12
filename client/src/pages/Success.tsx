import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function Success() {
  const [searchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!sessionId || !user) {
      setStatus('error');
      return;
    }

    api.payments.verifyPro(sessionId)
      .then(async ({ success }) => {
        if (success) {
          await refreshUser();
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [sessionId, user, refreshUser]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Activating your Pro access…</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-16">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-black mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-500 mb-6">We couldn't confirm your payment. If you were charged, contact us.</p>
          <Link to="/" className="text-sm font-semibold text-black hover:underline">
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-16 px-4">
      <div className="text-center max-w-sm animate-slide-up">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-black mb-2">Welcome to Pro!</h1>
        <p className="text-sm text-gray-500 mb-1">
          All 14 prompts are now unlocked forever.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Head to <strong>My Prompts</strong> to copy and use them.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/purchases"
            className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            My Prompts
          </Link>
          <Link to="/" className="inline-flex items-center justify-center text-sm font-semibold text-gray-600 hover:text-black transition-colors">
            Browse marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
