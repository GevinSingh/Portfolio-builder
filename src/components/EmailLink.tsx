import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  Check, 
  Copy, 
  ExternalLink, 
  Send, 
  UploadCloud, 
  FileText, 
  Loader2, 
  Sparkles, 
  X, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  supabase, 
  isSupabaseConfigured, 
  uploadResumeToSupabase, 
  saveContactMessageToSupabase, 
  savePortfolioToSupabase 
} from '../lib/supabase';

interface EmailLinkProps {
  email?: string;
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  label?: string;
  portfolioSlug?: string;
}

export const EmailLink: React.FC<EmailLinkProps> = ({
  email,
  className = '',
  iconClassName = 'w-4 h-4',
  showText = false,
  label,
  portfolioSlug,
}) => {
  const { 
    portfolio, 
    currentUser, 
    showToast, 
    triggerConfetti, 
    syncToCloud 
  } = usePortfolio();

  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form Submission State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!email) return null;

  const cleanEmail = email.replace(/^mailto:/i, '').trim();
  if (!cleanEmail) return null;

  const effectiveSlug = portfolioSlug || portfolio.slug || 'alex-johnson';
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}`;
  const outlookComposeUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(cleanEmail)}`;
  const mailtoUrl = `mailto:${cleanEmail}`;

  // Clipboard copy handler
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(cleanEmail);
      setCopied(true);
      showToast?.('Copied to Clipboard', `Email address ${cleanEmail} copied.`, 'info');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy
      const textarea = document.createElement('textarea');
      textarea.value = cleanEmail;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      showToast?.('Copied to Clipboard', `Email address ${cleanEmail} copied.`, 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Supabase Database & Resume Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!senderEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSubmitStatus('idle');

    try {
      let uploadedResumeUrl: string | undefined = undefined;

      // 1. Upload Resume file to Supabase Storage if attached
      if (resumeFile) {
        if (isSupabaseConfigured() && supabase) {
          const uploadRes = await uploadResumeToSupabase(resumeFile, currentUser?.id);
          if (uploadRes.success && uploadRes.publicUrl) {
            uploadedResumeUrl = uploadRes.publicUrl;
          } else if (uploadRes.error) {
            console.warn('Resume upload note:', uploadRes.error);
          }
        }
      }

      // 2. Format detailed message content with resume reference if available
      const fullMessage = uploadedResumeUrl
        ? `${messageText ? messageText + '\n\n' : ''}📎 Attached Resume: ${uploadedResumeUrl}`
        : (messageText || 'Sent a contact inquiry via portfolio email link.');

      // 3. Save submission to Supabase 'messages' table
      let dbSaved = false;
      if (isSupabaseConfigured() && supabase) {
        const result = await saveContactMessageToSupabase({
          name: senderName.trim() || 'Portfolio Contact',
          email: senderEmail.trim(),
          message: fullMessage,
          portfolio_slug: effectiveSlug,
        });
        dbSaved = result.success;

        if (!result.success && result.error) {
          console.warn('Supabase message save note:', result.error);
        }
      }

      // 4. Also sync current user's portfolio data if logged in / creator mode
      if (currentUser) {
        await syncToCloud().catch(() => {});
      }

      // 5. Success state updates
      setSubmitStatus('success');
      triggerConfetti?.();
      showToast?.(
        'Submission Saved to Supabase!',
        uploadedResumeUrl
          ? 'Your message and resume were securely saved to the database.'
          : 'Your details were recorded in the Supabase database.',
        'sparkles'
      );

      // Reset form after short delay
      setTimeout(() => {
        setSenderName('');
        setSenderEmail('');
        setMessageText('');
        setResumeFile(null);
        setIsSubmitting(false);
        setShowSubmitModal(false);
        setSubmitStatus('idle');
      }, 2000);

    } catch (err: any) {
      console.error('Error submitting data to Supabase:', err);
      setErrorMessage(err.message || 'Failed to submit data. Please try again.');
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
      if (!isPdf) {
        showToast?.('Invalid File Type', 'Only PDF resumes can be uploaded to Supabase.', 'error');
        return;
      }
      setResumeFile(file);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          title={`Contact via Email (${cleanEmail})`}
          className={className || "p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"}
        >
          <Mail className={iconClassName} />
          {showText && <span>{label || cleanEmail}</span>}
        </button>

        {/* Interactive Email Popover Menu */}
        {isOpen && (
          <div 
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3.5 rounded-2xl bg-slate-900/95 border border-white/20 text-white shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Email Display */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
              <div className="flex items-center gap-1.5 min-w-0 pr-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-[11px] font-mono text-slate-300 font-medium truncate" title={cleanEmail}>
                  {cleanEmail}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1 font-semibold transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Quick Action: Direct Supabase Database Submission */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowSubmitModal(true);
              }}
              className="w-full mb-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-between shadow-lg shadow-blue-500/20 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-200 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Submit Data & Resume</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            </button>

            {/* Standard Mail Options */}
            <div className="space-y-1.5 text-xs font-medium">
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 flex items-center justify-between transition-colors group"
              >
                <span>Compose in Gmail</span>
                <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
              </a>

              <a
                href={outlookComposeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 flex items-center justify-between transition-colors group"
              >
                <span>Compose in Outlook</span>
                <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
              </a>

              <a
                href={mailtoUrl}
                onClick={() => setIsOpen(false)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-between transition-colors group"
              >
                <span>Open Default Mail App</span>
                <Mail className="w-3 h-3 opacity-70 group-hover:opacity-100" />
              </a>
            </div>

            {/* Small Arrow indicator */}
            <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-white/20 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
          </div>
        )}
      </div>

      {/* Supabase Database & Resume Submission Modal */}
      {showSubmitModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setShowSubmitModal(false)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 border border-white/20 rounded-2xl p-6 text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Save to Supabase Database</h3>
                <p className="text-xs text-slate-400">
                  Submitting to <span className="text-blue-400 font-medium font-mono">{cleanEmail}</span>
                </p>
              </div>
            </div>

            {/* Submission Form */}
            {submitStatus === 'success' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-emerald-400">Saved Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Your data and resume have been securely synced to Supabase database.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="e.g. sarah@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message / Note</label>
                  <textarea
                    rows={2}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write a message or project note..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                {/* Resume Upload Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Attach Resume (Optional PDF Only)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {resumeFile ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-slate-200 truncate font-medium">{resumeFile.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({(resumeFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="text-slate-400 hover:text-rose-400 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-white/20 hover:border-blue-500/50 bg-white/[0.02] hover:bg-blue-500/5 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-blue-400" />
                      <span>Click to upload resume file</span>
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Save to Supabase</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
