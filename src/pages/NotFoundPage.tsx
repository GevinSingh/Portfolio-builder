import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search, FileX, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const quickLinks = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Templates', href: '/templates', icon: '🎨' },
    { label: 'Upload Resume', href: '/upload', icon: '📄' },
    { label: 'AI Coach', href: '/coach', icon: '🤖' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#F8FAFC' }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      {/* Floating blobs with parallax */}
      <div
        className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none transition-transform duration-100"
        style={{
          background: 'radial-gradient(circle, #1E65FF, transparent)',
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
        }}
      />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none transition-transform duration-100"
        style={{
          background: 'radial-gradient(circle, #2563EB, transparent)',
          transform: `translate(${-mousePos.x * 0.3}px, ${-mousePos.y * 0.3}px)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1E65FF, transparent)' }}
      />

      {/* Main card */}
      <div
        className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 text-center"
        style={{
          transform: `translate(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Animated 404 number */}
        <div className="relative inline-block mb-6 select-none">
          <span
            className="text-[10rem] font-black leading-none tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, #1E65FF 0%, #2563EB 50%, #93C5FD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 24px rgba(30,101,255,0.18))',
            }}
          >
            404
          </span>
          {/* Floating icon on top of 404 */}
          <div
            className="absolute -top-4 -right-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #1E65FF, #2563EB)',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <FileX className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Page Not Found
        </h1>

        {/* Subtext with the attempted path */}
        <p className="text-slate-500 text-lg mb-2 max-w-md mx-auto leading-relaxed">
          The page{' '}
          <code
            className="px-2 py-0.5 rounded-md text-sm font-mono"
            style={{ background: 'rgba(30,101,255,0.08)', color: '#1E65FF' }}
          >
            {location.pathname}
          </code>{' '}
          doesn't exist or has been moved.
        </p>

        {/* Auto-redirect notice */}
        <p className="text-slate-400 text-sm mb-10">
          Redirecting to home in{' '}
          <span
            className="font-bold tabular-nums"
            style={{ color: '#1E65FF' }}
          >
            {countdown}s
          </span>
        </p>

        {/* Primary actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            to="/"
            id="not-found-go-home"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #1E65FF, #2563EB)',
              boxShadow: '0 4px 20px rgba(30,101,255,0.35)',
            }}
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
          <button
            id="not-found-go-back"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="glass-card rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-center gap-2">
            <Search className="w-3.5 h-3.5" />
            Quick Links
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                id={`not-found-quicklink-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-slate-600 hover:text-blue-600 font-medium text-sm transition-all duration-200 hover:bg-blue-50 hover:-translate-y-0.5 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="relative z-10 mt-8 flex items-center gap-1.5 text-slate-400 text-sm">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>Portfolio Builder by TechHumans</span>
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
