import React from 'react';
import { Cloud, CheckCircle2, RefreshCw, AlertCircle, Database, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface Props {
  variant?: 'compact' | 'full' | 'button';
  onOpenAuth?: () => void;
}

export const CloudSyncBadge: React.FC<Props> = ({ variant = 'compact', onOpenAuth }) => {
  const { 
    currentUser, 
    isCloudSyncing, 
    lastCloudSync, 
    syncToCloud, 
    isCloudConnected 
  } = usePortfolio();

  const handleSyncClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser && onOpenAuth) {
      onOpenAuth();
      return;
    }
    await syncToCloud();
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleSyncClick}
        disabled={isCloudSyncing}
        className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm ${
          isCloudSyncing
            ? 'bg-blue-50 border-blue-200 text-[#1E65FF]'
            : currentUser
            ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
        }`}
        title={currentUser ? `Signed in as ${currentUser.email}. Click to save to Supabase Cloud.` : 'Sign in to save to Supabase Cloud.'}
      >
        {isCloudSyncing ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-[#1E65FF] animate-spin" />
            <span>Syncing to Supabase...</span>
          </>
        ) : currentUser ? (
          <>
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cloud Synced</span>
          </>
        ) : (
          <>
            <Cloud className="w-3.5 h-3.5 text-[#1E65FF]" />
            <span>Save to Supabase</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Supabase Cloud Database</div>
              <div className="text-[11px] text-slate-500">
                {currentUser ? `Connected: ${currentUser.email}` : 'Local Mode • Sign in to enable cloud persistence'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncClick}
            disabled={isCloudSyncing}
            className="px-3 py-1.5 rounded-lg bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
          >
            {isCloudSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{isCloudSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isCloudConnected ? 'Cloud Engine Online' : 'Offline / Standalone'}</span>
          </span>
          <span className="font-mono">
            {lastCloudSync ? `Last synced: ${lastCloudSync}` : 'Unsynced local draft'}
          </span>
        </div>
      </div>
    );
  }

  // Compact badge
  return (
    <button
      type="button"
      onClick={handleSyncClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold text-emerald-800 transition-colors"
      title="Supabase Cloud Sync Status"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>Supabase Cloud</span>
      {isCloudSyncing && <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />}
    </button>
  );
};
