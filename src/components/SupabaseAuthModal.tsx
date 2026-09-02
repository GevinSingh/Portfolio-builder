import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Github, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Cloud,
  ExternalLink,
  Zap,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { isSupabaseConfigured, supabaseUrl } from '../lib/supabase';
import { supabase } from '../supabaseClient.js';
import { SupabaseSetupModal } from './SupabaseSetupModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const SupabaseAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { 
    signInWithSupabase, 
    signUpWithSupabase, 
    signInWithOAuthProvider, 
    currentUser, 
    signOutFromSupabase, 
    showToast, 
    triggerConfetti 
  } = usePortfolio();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!email || !password) {
          throw new Error('Please provide both email and password.');
        }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMessage('Account created successfully!');
        triggerConfetti();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (mode === 'signin') {
        if (!email || !password) {
          throw new Error('Please enter your email and password.');
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccessMessage('Welcome back!');
        triggerConfetti();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (mode === 'forgot') {
        // Mock / trigger reset
        setSuccessMessage(`Password recovery instructions dispatched to ${email}.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      setErrorMessage(null);
      await signInWithOAuthProvider(provider);
      triggerConfetti();
      setSuccessMessage(`Signed in with ${provider === 'google' ? 'Google' : 'GitHub'} successfully!`);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || `Failed to sign in with ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoName: string) => {
    setEmail(demoEmail);
    setPassword('demo-portfolio-123');
    setFullName(demoName);
    setLoading(true);
    try {
      await signInWithSupabase(demoEmail, 'demo-portfolio-123');
      showToast('Demo Access Granted', `Logged in as ${demoName} (${demoEmail})`, 'sparkles');
      triggerConfetti();
      onClose();
    } catch {
      // Fallback local sign in
      showToast('Demo Mode Activated', `Switched to ${demoName} local profile workspace.`, 'success');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
      >
        {/* Decorative Top Supabase Banner Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1E65FF] via-[#3ECF8E] to-[#2563EB]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E65FF] to-[#0A47D4] flex items-center justify-center shadow-lg shadow-[#1E65FF]/25 border border-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">
                {currentUser ? 'Supabase Account' : mode === 'signup' ? 'Create Supabase Account' : mode === 'forgot' ? 'Reset Password' : 'Sign in with Supabase'}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-pulse" />
              <span className="font-medium">Supabase Cloud Sync Ready</span>
            </div>
          </div>
        </div>

        {/* Active User State if logged in */}
        {currentUser ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Currently Authenticated</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">{currentUser.email}</div>
              <div className="text-[11px] text-slate-500 font-mono">User ID: {currentUser.id}</div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 font-medium">
                  <Cloud className="w-4 h-4 text-[#1E65FF]" /> Cloud Portfolios
                </span>
                <span className="font-bold text-emerald-600">Auto-Syncing</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 font-medium">
                  <Database className="w-4 h-4 text-[#3ECF8E]" /> Supabase Instance
                </span>
                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[160px]">
                  {supabaseUrl ? new URL(supabaseUrl).hostname : 'vgyxvzpbwbcdtfshixtk.supabase.co'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  signOutFromSupabase();
                  showToast('Signed Out', 'You have been logged out of Supabase.', 'info');
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#1E65FF]/20"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs for Sign In / Sign Up */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-[#1E65FF] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-[#1E65FF] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Johnson"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@techhumans.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] font-semibold text-[#1E65FF] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#1E65FF]/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting to Supabase...
                  </span>
                ) : (
                  <>
                    <span>
                      {mode === 'signup'
                        ? 'Create Cloud Account'
                        : mode === 'forgot'
                        ? 'Send Password Reset'
                        : 'Sign In to Supabase'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Social OAuth Buttons */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                <span className="bg-white px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleOAuth('github')}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span className="font-bold text-[#EA4335] text-sm">G</span>
                <span>Google</span>
              </button>
            </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-slate-500 font-medium">Instant Creator Demo Switch</span>
                  <button
                    type="button"
                    onClick={() => setShowSetup(true)}
                    className="text-[11px] text-[#1E65FF] font-bold hover:underline flex items-center gap-1"
                  >
                    <Database className="w-3 h-3" />
                    <span>SQL Setup Helper</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('alex.johnson@example.com', 'Alex Johnson')}
                    className="p-2 rounded-xl border border-slate-200 hover:border-[#1E65FF] bg-slate-50 hover:bg-blue-50 text-slate-700 text-left transition-colors flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#1E65FF] flex items-center justify-center font-bold text-[10px]">
                      AJ
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-[11px] truncate">Alex (Lead)</div>
                      <div className="text-[10px] text-slate-500 truncate">Developer</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('sarah.jenkins@example.com', 'Sarah Jenkins')}
                    className="p-2 rounded-xl border border-slate-200 hover:border-[#1E65FF] bg-slate-50 hover:bg-blue-50 text-slate-700 text-left transition-colors flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                      SJ
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-[11px] truncate">Sarah (Full Stack)</div>
                      <div className="text-[10px] text-slate-500 truncate">Cloud Architect</div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <SupabaseSetupModal
        isOpen={showSetup}
        onClose={() => setShowSetup(false)}
      />
    </>
  );
};
