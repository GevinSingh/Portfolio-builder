import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CheckCircle2, Info, AlertTriangle, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePortfolio();

  return (
    <div id="toast-container" className="no-print fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl text-slate-100 ring-1 ring-indigo-500/20"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'sparkles' && <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {(!toast.type || toast.type === 'success') && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">{toast.title}</div>
              <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 -mr-1 -mt-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const Toast = ToastContainer;
