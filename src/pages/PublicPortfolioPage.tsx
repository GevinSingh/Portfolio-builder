import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Share2, 
  Edit3, 
  Palette, 
  ArrowUpRight, 
  Check, 
  Copy, 
  Sparkles, 
  Download, 
  Mail, 
  Send,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioRenderer } from '../components/PortfolioRenderer';
import { TemplateId } from '../types';
import { templateOptions } from '../data/mockData';
import { saveContactMessageToSupabase, fetchPortfolioBySlug } from '../lib/supabase';
import { messageApi } from '../lib/api';

export const PublicPortfolioPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { portfolio, setPortfolio, setTemplateId, showToast, triggerConfetti } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [loadingCloudData, setLoadingCloudData] = useState(false);

  React.useEffect(() => {
    if (slug) {
      setLoadingCloudData(true);
      fetchPortfolioBySlug(slug).then((res) => {
        if (res.success && res.data) {
          setPortfolio(res.data);
        }
      }).finally(() => setLoadingCloudData(false));
    }
  }, [slug]);

  const portfolioUrl = window.location.href;

  const handleShare = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    triggerConfetti();
    showToast('Portfolio Link Copied!', portfolioUrl, 'sparkles');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    triggerConfetti();

    // 1. Send via Express Backend API (with local fallback)
    await messageApi.send({
      portfolioSlug: portfolio.slug || 'alex-johnson',
      name: contactForm.name || 'Anonymous Recruiter',
      email: contactForm.email,
      message: contactForm.message,
    });

    // 2. Also forward to Supabase if configured
    saveContactMessageToSupabase({
      name: contactForm.name || 'Anonymous Recruiter',
      email: contactForm.email,
      message: contactForm.message,
      portfolio_slug: portfolio.slug,
    }).catch(() => {});

    showToast('Message Sent Successfully', `Your note was delivered directly to ${portfolio.profile.fullName}.`, 'success');
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('download') === 'true') {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDownloadPortfolio = () => {
    window.print();
  };

  const pageThemeClass = (() => {
    switch (portfolio.templateId) {
      case 'developer':
        return 'bg-[#050811] text-slate-100';
      case 'noir':
        return 'bg-[#111111] text-white';
      case 'creative':
        return 'bg-[#0b0f19] text-slate-100';
      case 'architect':
        return 'bg-[#0f1117] text-slate-100';
      case 'editorial':
        return 'bg-[#FAF9F5] text-slate-900';
      case 'bento':
        return 'bg-[#F8FAFC] text-slate-900';
      case 'minimal':
        return 'bg-[#FFFFFF] text-slate-900';
      case 'corporate':
        return 'bg-[#F8FAFC] text-slate-900';
      default:
        return 'bg-[#F8FAFC] text-slate-700';
    }
  })();

  return (
    <div className={`min-h-screen ${pageThemeClass} font-['Inter',sans-serif] flex flex-col relative selection:bg-[#1E65FF] selection:text-white transition-colors`}>
      
      {/* Floating Top Showcase Banner */}
      <div className="no-print sticky top-0 z-50 w-full border-b border-slate-200/20 bg-slate-900/80 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between text-xs shadow-sm text-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white font-bold uppercase tracking-wider text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-1.5 font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">{portfolio.profile.fullName}</span>
            <span className="text-slate-400 hidden md:inline">• Tech Humans Verified Showcase</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Theme Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-cyan-400/50 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span className="capitalize">{portfolio.templateId}</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-xl z-50 space-y-1">
                {templateOptions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTemplateId(t.id as TemplateId);
                      setShowThemePicker(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer ${
                      portfolio.templateId === t.id ? 'bg-[#1E65FF] text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{t.name}</span>
                    {portfolio.templateId === t.id && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleDownloadPortfolio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 hover:text-white font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
            title="Download Portfolio as PDF"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Portfolio PDF</span>
          </button>

          <Link
            to="/editor"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 hover:text-white font-bold uppercase tracking-wider text-[11px] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>

          <button
            onClick={handleShare}
            id="public-share-btn"
            className="px-3.5 py-1.5 rounded-lg bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 shadow-md shadow-[#1E65FF]/20 transition-all active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share Portfolio ↗'}</span>
          </button>
        </div>
      </div>

      {/* Main Public Portfolio Body - Rendered with active style */}
      <main className="flex-1 py-4 sm:py-8 print:p-0 print:m-0">
        <PortfolioRenderer portfolio={portfolio} isCompact={false} />

        {/* Global Contact Section for Public Visitors (Hidden in PDF export) */}
        <section className="no-print max-w-4xl mx-auto px-6 mt-16 pt-12 border-t border-slate-200">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-xl space-y-3 mb-8">
              <span className="text-xs uppercase font-bold tracking-widest text-[#1E65FF]">Get In Touch</span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                Let's Build Something Exceptional
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Whether you have a new project in mind, an open role, or emergency electrical needs, send a direct message below.
              </p>
            </div>

            {contactSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Message Delivered</h3>
                <p className="text-xs text-slate-600">Thanks for reaching out! Alex will respond to your email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your project, team, or opportunity..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold uppercase tracking-wider text-sm shadow-lg shadow-[#1E65FF]/25 flex items-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}

          </div>
        </section>
      </main>

      {/* Subtle bottom public footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div>
          Published with <Link to="/" className="text-[#1E65FF] hover:underline font-bold">Tech Humans</Link> • Engineered for high-impact careers
        </div>
      </footer>

    </div>
  );
};
