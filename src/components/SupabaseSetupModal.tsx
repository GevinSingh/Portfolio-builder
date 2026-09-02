import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  FolderArchive,
  Sparkles,
  Terminal
} from 'lucide-react';
import { checkSupabaseBackendHealth, supabaseUrl } from '../lib/supabase';
import { usePortfolio } from '../context/PortfolioContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

import schemaSql from '../../supabase_schema.sql?raw';

export const SupabaseSetupModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { showToast, triggerConfetti } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [health, setHealth] = useState<{
    isConnected: boolean;
    hasPortfoliosTable: boolean;
    hasMessagesTable: boolean;
    hasResumesBucket: boolean;
  }>({
    isConnected: true,
    hasPortfoliosTable: false,
    hasMessagesTable: false,
    hasResumesBucket: false,
  });

  const runCheck = async () => {
    setIsChecking(true);
    try {
      const res = await checkSupabaseBackendHealth();
      setHealth(res);
    } catch {
      // ignore
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runCheck();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    triggerConfetti();
    showToast('SQL Schema Copied', 'Paste this into your Supabase SQL Editor and click Run.', 'sparkles');
    setTimeout(() => setCopied(false), 3000);
  };

  const projectId = supabaseUrl ? supabaseUrl.replace('https://', '').split('.')[0] : 'vgyxvzpbwbcdtfshixtk';
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectId}/sql/new`;

  const isAllReady = health.hasPortfoliosTable && health.hasMessagesTable && health.hasResumesBucket;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1E65FF] via-[#3ECF8E] to-[#2563EB]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg border border-slate-700">
            <Database className="w-6 h-6 text-[#3ECF8E]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Supabase Backend Setup & Health Check
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Project: {supabaseUrl || 'https://vgyxvzpbwbcdtfshixtk.supabase.co'}
            </p>
          </div>
        </div>

        {/* Live Diagnostics Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          
          {/* Table: Portfolios */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
            health.hasPortfoliosTable ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Portfolios DB</span>
              {health.hasPortfoliosTable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-slate-900">
                {health.hasPortfoliosTable ? 'Table Active' : 'Missing Table'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">public.portfolios</div>
            </div>
          </div>

          {/* Table: Messages */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
            health.hasMessagesTable ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Messages DB</span>
              {health.hasMessagesTable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-slate-900">
                {health.hasMessagesTable ? 'Table Active' : 'Missing Table'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">public.messages</div>
            </div>
          </div>

          {/* Storage: Resumes */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
            health.hasResumesBucket ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Storage Bucket</span>
              {health.hasResumesBucket ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-slate-900">
                {health.hasResumesBucket ? 'Bucket Ready' : 'Missing Bucket'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">resumes & avatars</div>
            </div>
          </div>

        </div>

        {/* Status Notice */}
        {isAllReady ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-800 font-semibold">
                All Supabase tables and storage buckets are configured and 100% online!
              </div>
            </div>
            <button
              onClick={runCheck}
              disabled={isChecking}
              className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
              title="Re-check health"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Sparkles className="w-4 h-4 text-[#1E65FF]" />
                <span>1-Click Fix: Run Database Schema in Supabase</span>
              </div>
              <button
                onClick={runCheck}
                disabled={isChecking}
                className="flex items-center gap-1 text-[11px] text-[#1E65FF] hover:underline font-bold"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Re-check</span>
              </button>
            </div>
            <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Click the <strong>"Copy SQL Schema"</strong> button below.</li>
              <li>Open your Supabase SQL Editor: <a href={sqlEditorUrl} target="_blank" rel="noreferrer" className="text-[#1E65FF] underline font-semibold inline-flex items-center gap-1">Open Supabase SQL Editor <ExternalLink className="w-3 h-3 inline" /></a></li>
              <li>Paste the code and click <strong>Run</strong> (takes 2 seconds).</li>
            </ol>
          </div>
        )}

        {/* Code Snippet Box with Copy Button */}
        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 p-4 font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#3ECF8E]" />
              <span>supabase_schema.sql</span>
            </div>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-lg bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
            </button>
          </div>

          <pre className="max-h-40 overflow-y-auto text-[11px] text-slate-300 leading-relaxed scrollbar-thin">
            {schemaSql}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100">
          <a
            href={sqlEditorUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="px-5 py-2.5 rounded-xl bg-[#3ECF8E] hover:bg-[#34b27b] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#3ECF8E]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy SQL Schema'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
