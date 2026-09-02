import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X, 
  User, 
  Eye, 
  ShieldCheck, 
  Cloud, 
  LogOut, 
  RefreshCw, 
  ChevronDown, 
  LayoutDashboard,
  Palette,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SupabaseAuthModal } from './SupabaseAuthModal';
import { CloudSyncBadge } from './CloudSyncBadge';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    portfolio, 
    currentUser, 
    signOutFromSupabase, 
    isCloudSyncing, 
    syncToCloud, 
    showToast 
  } = usePortfolio();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isPublicPage = location.pathname.startsWith('/p/');

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'BUILD FROM SCRATCH', path: '/scratch' },
    { name: 'TEMPLATES', path: '/templates' },
    { name: 'DASHBOARD', path: '/dashboard' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const id = path.replace('/#', '');
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const id = path.replace('/#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
      if (path === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  if (isPublicPage) {
    return null; // Public portfolio has its own top preview banner
  }

  const handleSignOut = async () => {
    setShowUserDropdown(false);
    await signOutFromSupabase();
    showToast('Signed Out', 'You have been disconnected from Supabase cloud.', 'info');
  };

  return (
    <>

      {/* 2. Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E65FF] to-[#0A47D4] flex items-center justify-center shadow-md shadow-[#1E65FF]/25 group-hover:scale-105 transition-all duration-300 border border-white/20">
              <Sparkles className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 font-['Inter',sans-serif]">
                  Tech<span className="text-[#1E65FF]">Humans</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <Cloud className="w-2.5 h-2.5" /> Supabase
                </span>
              </div>
              <span className="text-[11px] text-slate-500 -mt-0.5 hidden sm:inline font-medium">
                Automated Resume to Portfolio Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold tracking-wider transition-all uppercase ${
                    isActive
                      ? 'text-[#1E65FF] bg-blue-50 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Actions & User State */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#1E65FF] bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-all"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#1E65FF] to-[#3ECF8E] text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate font-bold text-[11px]">
                    {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.user_metadata?.full_name || 'Supabase Creator'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Supabase Cloud Connected</span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#1E65FF]" />
                      <span>Creator Dashboard</span>
                    </Link>

                    <Link
                      to="/editor"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <Palette className="w-4 h-4 text-purple-600" />
                      <span>Visual Editor</span>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        syncToCloud();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <Cloud className="w-4 h-4 text-[#3ECF8E]" />
                        <span>Sync to Supabase Cloud</span>
                      </span>
                      {isCloudSyncing && <RefreshCw className="w-3.5 h-3.5 text-[#1E65FF] animate-spin" />}
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1.5 hover:bg-slate-100 rounded-lg border border-slate-200 bg-slate-50"
              >
                <User className="w-3.5 h-3.5 text-[#1E65FF]" />
                <span>Login</span>
              </Link>
            )}

            <Link
              to="/upload"
              id="nav-build-cta"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs uppercase font-bold tracking-wider shadow-lg shadow-[#1E65FF]/20 hover:shadow-[#1E65FF]/30 transition-all active:scale-95 gap-2"
            >
              <span>Transform Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/upload"
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#1E65FF] text-white"
            >
              Build
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-4 py-5 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className="text-left px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase text-slate-800 hover:bg-slate-100"
                >
                  {link.name}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              {currentUser ? (
                <button
                  onClick={handleSignOut}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider uppercase text-center bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
                >
                  Sign Out ({currentUser.email?.split('@')[0]})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider uppercase text-center bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 block"
                >
                  Sign In with Supabase
                </Link>
              )}
              <Link
                to="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider uppercase text-center bg-[#1E65FF] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#1E65FF]/20"
              >
                <span>Transform Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Supabase Authentication Modal */}
      <SupabaseAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </>
  );
};
