import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  Edit3, 
  Palette, 
  Sparkles, 
  BarChart3, 
  Settings, 
  Eye, 
  Rocket, 
  CheckCircle2, 
  Share2, 
  Plus, 
  ExternalLink, 
  Copy, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight,
  Clock,
  Layers,
  Wand2,
  Cloud,
  RefreshCw,
  Database,
  User,
  ShieldCheck,
  Download
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CloudSyncBadge } from '../components/CloudSyncBadge';
import { SupabaseAuthModal } from '../components/SupabaseAuthModal';
import { SupabaseSetupModal } from '../components/SupabaseSetupModal';
import { messageApi, checkServerHealth, ContactMessage, ServerHealth } from '../lib/api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    portfolio, 
    portfolioScore, 
    showToast, 
    triggerConfetti,
    currentUser,
    isCloudSyncing,
    lastCloudSync,
    isCloudConnected,
    syncToCloud,
    loadFromCloud
  } = usePortfolio();

  const [copied, setCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [serverHealth, setServerHealth] = useState<ServerHealth>({ status: 'online', portfoliosCount: 1, messagesCount: 1 });

  useEffect(() => {
    checkServerHealth().then(setServerHealth);
    messageApi.getMessages().then(setMessages);
  }, []);

  const handleDeleteMessage = async (id: string) => {
    await messageApi.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Message Removed', 'Recruiter inquiry removed from inbox.', 'info');
  };

  const portfolioUrl = `${window.location.origin}/p/${portfolio.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    showToast('Link Copied to Clipboard', portfolioUrl, 'sparkles');
    setTimeout(() => setCopied(false), 2500);
  };

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard', active: true },
    { label: 'Build from Scratch', icon: Wand2, path: '/scratch', badge: 'New' },
    { label: 'My Portfolio', icon: Globe, path: `/p/${portfolio.slug}` },
    { label: 'Edit Portfolio', icon: Edit3, path: '/editor' },
    { label: 'Templates', icon: Palette, path: '/templates' },
    { label: 'Portfolio Coach', icon: Sparkles, path: '/coach', badge: 'AI' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Settings', icon: Settings, path: '/editor' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-['Inter',sans-serif] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-slate-200 bg-white p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* User profile cardlet */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            {portfolio.profile.avatarUrl ? (
              <img
                src={portfolio.profile.avatarUrl}
                alt={portfolio.profile.fullName}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#1E65FF] text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-blue-200 select-none">
                {portfolio.profile.fullName ? portfolio.profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'ME'}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">{portfolio.profile.fullName}</div>
              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{currentUser ? 'Supabase Pro' : 'Local Draft'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    item.active
                      ? 'bg-[#1E65FF] text-white shadow-md shadow-[#1E65FF]/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-50 text-[#1E65FF] border border-blue-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom Cloud Sync Status Card */}
        <div className="mt-8">
          {/* Cloud Sync Status */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-emerald-600" /> Supabase Cloud
              </span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">
                {currentUser ? 'Connected' : 'Offline'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              {currentUser ? `Saved for ${currentUser.email}` : 'Sign in to sync your portfolio to Supabase.'}
            </p>
            {currentUser ? (
              <button
                onClick={() => syncToCloud()}
                disabled={isCloudSyncing}
                className="w-full text-center py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isCloudSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Cloud className="w-3 h-3" />}
                <span>{isCloudSyncing ? 'Syncing...' : 'Sync to Cloud'}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full text-center py-2 rounded-lg bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <User className="w-3 h-3" />
                <span>Connect Supabase</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <span>Good morning, {portfolio.profile.fullName.split(' ')[0]} 👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Your professional portfolio is published and connected to Supabase Cloud Database.
            </p>
          </div>

          {/* Quick links & Live Preview Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <CloudSyncBadge variant="button" onOpenAuth={() => setShowAuthModal(true)} />

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#1E65FF] text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#1E65FF]" />
              <span>{copied ? 'Copied!' : 'Copy Public URL'}</span>
            </button>

            <Link
              to={`/p/${portfolio.slug}`}
              className="px-4 py-2 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#1E65FF]/20 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Portfolio</span>
            </Link>
          </div>
        </div>

        {/* Supabase Cloud Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1528] to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 text-[#3ECF8E] text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${serverHealth.status === 'online' ? 'bg-[#3ECF8E] animate-pulse' : 'bg-amber-400'}`} />
              <span>Express Backend Server {serverHealth.status === 'online' ? 'Online' : 'Offline'} · {serverHealth.portfoliosCount} Portfolio{serverHealth.portfoliosCount !== 1 ? 's' : ''} Saved</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Self-Hosted Backend · Cloud & Multi-Device Sync
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your portfolio data, resume uploads, and recruiter messages are stored in your own Express backend server — no third-party subscription required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* SQL Setup & Health Button */}
            <button
              type="button"
              onClick={() => setShowSetupModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[#3ECF8E] font-bold text-xs uppercase tracking-wider border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Database className="w-4 h-4" />
              <span>SQL Setup & Health</span>
            </button>

            {currentUser ? (
              <>
                {/* Save to Supabase */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    syncToCloud();
                  }}
                  disabled={isCloudSyncing}
                  className="px-4 py-2.5 rounded-xl bg-[#3ECF8E] hover:bg-[#34b27b] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#3ECF8E]/20 transition-all cursor-pointer"
                >
                  <Cloud className="w-4 h-4" />
                  <span>{isCloudSyncing ? 'Saving...' : 'Save to Supabase'}</span>
                </button>
                {/* Restore from Cloud */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    loadFromCloud();
                  }}
                  disabled={isCloudSyncing}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restore from Cloud</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="px-5 py-3 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#1E65FF]/25 transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Connect Supabase Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Highlights Row: Score Card */}
        <div className="flex justify-center">
          
          {/* Large Portfolio Strength Score Card (Radial Gauge) */}
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E65FF] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1E65FF]" /> Portfolio Strength
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Excellent
              </span>
            </div>

            {/* Circular score gauge */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-100"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#1E65FF] transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * portfolioScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900">
                    {portfolioScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">OPTIMIZED</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>AI Enhancement potential</span>
                <span className="text-[#1E65FF] font-bold">+18% available</span>
              </div>
              <Link
                to="/coach"
                className="block text-center py-2.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Boost to 100% with AI Coach →
              </Link>
            </div>
          </div>

        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <Link
              to="/scratch"
              className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/70 to-white border border-blue-200 hover:border-[#1E65FF] hover:shadow-md transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1E65FF] text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md shadow-[#1E65FF]/20">
                <Wand2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E65FF]">Build From Scratch</h3>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1E65FF]">NEW</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Manual multi-step form wizard with real-time live preview.</p>
            </Link>

            <Link
              to="/editor"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1E65FF] hover:shadow-md transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E65FF] border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E65FF]">Edit Portfolio</h3>
              <p className="text-xs text-slate-500 mt-1">Update projects, bio, skills, or experience timeline.</p>
            </Link>

            <Link
              to="/editor"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1E65FF] hover:shadow-md transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E65FF] border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E65FF]">Add New Project</h3>
              <p className="text-xs text-slate-500 mt-1">Showcase your latest electrical or software build.</p>
            </Link>

            <Link
              to="/templates"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1E65FF] hover:shadow-md transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E65FF] border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E65FF]">Change Style</h3>
              <p className="text-xs text-slate-500 mt-1">Current: <span className="text-slate-900 capitalize">{portfolio.templateId}</span>. Switch in 1 click.</p>
            </Link>

            <Link
              to={`/p/${portfolio.slug}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1E65FF] hover:shadow-md transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E65FF] border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1E65FF]">View Public Site</h3>
              <p className="text-xs text-slate-500 mt-1">See how clients and recruiters view your portfolio.</p>
            </Link>

          </div>
        </div>

        {/* Recruiter Messages Inbox - Live from Express Backend */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Recruiter Messages Inbox</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  serverHealth.status === 'online' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  Server {serverHealth.status === 'online' ? '● Online' : '○ Offline'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {messages.length > 0 
                  ? `${messages.length} message${messages.length !== 1 ? 's' : ''} from recruiters & clients`
                  : 'Direct contact form messages from your portfolio visitors'}
              </p>
            </div>
            <button
              onClick={() => messageApi.getMessages().then(setMessages)}
              className="text-xs text-[#1E65FF] hover:underline font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>

          <div className="space-y-2.5">
            {messages.length > 0 ? (
              messages.slice(0, 5).map((msg) => (
                <div key={msg.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between text-xs gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center font-bold border border-blue-100 shrink-0 text-[10px]">
                      {msg.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{msg.name}</div>
                      <div className="text-slate-500 truncate">{msg.email}</div>
                      <div className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">{msg.message}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-slate-400 font-mono whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-[10px] text-red-400 hover:text-red-600 font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center font-bold border border-blue-100">SF</div>
                    <div>
                      <div className="font-semibold text-slate-900">Commercial Client (San Francisco)</div>
                      <div className="text-slate-500">Viewed "Aura Design System" & requested quote</div>
                    </div>
                  </div>
                  <span className="text-slate-400 font-mono">14m ago</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center font-bold border border-blue-100">NYC</div>
                    <div>
                      <div className="font-semibold text-slate-900">Facility Manager (New York)</div>
                      <div className="text-slate-500">Explored experience timeline for 3m 42s</div>
                    </div>
                  </div>
                  <span className="text-slate-400 font-mono">1h ago</span>
                </div>
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No recruiter messages yet. Share your portfolio to start receiving inquiries.
                </div>
              </>
            )}
          </div>
        </div>

      </main>

      {/* Supabase Auth Modal */}
      <SupabaseAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Supabase Backend Setup & Health Modal */}
      <SupabaseSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
      />
    </div>
  );
};
