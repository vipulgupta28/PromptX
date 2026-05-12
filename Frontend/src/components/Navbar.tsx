import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onAuthClick: (mode: 'login' | 'register') => void;
}

const POLICY_LINKS = [
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/refund', label: 'Refund' },
];

const POLICY_PATHS = ['/terms', '/privacy', '/refund'];

export default function Navbar({ onAuthClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isPolicyPage = POLICY_PATHS.includes(location.pathname);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-6 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-tight">PX</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-black">PromptX</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${isPolicyPage ? 'text-gray-400 hover:text-black' : 'text-gray-500 hover:text-black'}`}
          >
            Browse
          </Link>
          {user && (
            <Link
              to="/purchases"
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"
            >
              My Prompts
              {user.is_pro && (
                <span className="text-[10px] font-bold bg-black text-white rounded-full px-1.5 py-0.5 leading-none">
                  PRO
                </span>
              )}
            </Link>
          )}

          {/* Divider */}
          <div className="h-3.5 w-px bg-gray-200" />

          {/* Policy links — small and subtle */}
          {POLICY_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-xs font-medium transition-colors ${
                location.pathname === to ? 'text-black' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-gray-700">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 animate-fade-in">
                  <Link
                    to="/purchases"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Prompts
                    {user.is_pro && (
                      <span className="text-[10px] font-bold bg-black text-white rounded-full px-1.5 py-0.5">PRO</span>
                    )}
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  {/* Policy links in dropdown */}
                  {POLICY_LINKS.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-black"
                    >
                      {label} Policy
                    </Link>
                  ))}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => onAuthClick('login')}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => onAuthClick('register')}
                className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
