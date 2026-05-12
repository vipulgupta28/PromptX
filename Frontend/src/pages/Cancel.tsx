import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-16 px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-black mb-2">Payment cancelled</h1>
        <p className="text-sm text-gray-500 mb-7">
          No worries — you haven't been charged. Head back and try again when you're ready.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors"
        >
          Back to marketplace
        </Link>
      </div>
    </div>
  );
}
