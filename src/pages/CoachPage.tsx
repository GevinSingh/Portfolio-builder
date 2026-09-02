import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  Lightbulb, 
  Rocket, 
  Award, 
  Check, 
  Wand2, 
  RefreshCw,
  Copy,
  ChevronRight,
  Target,
  FileCheck
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { optimizeBulletPointForATS } from '../lib/resumeForgeEngine';

export const CoachPage: React.FC = () => {
  const { portfolio, portfolioScore, coachSuggestions, applyCoachSuggestion, triggerConfetti, showToast } = usePortfolio();

  // Interactive AI rewrite tool state
  const [inputText, setInputText] = useState('Helped build our web app frontend and improved loading speeds for our team.');
  const [selectedRole, setSelectedRole] = useState('Senior Frontend / Design Engineer');
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRewrite = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const optimized = optimizeBulletPointForATS(inputText, { role: selectedRole });
      setRewrittenText(optimized);
      setIsGenerating(false);
      triggerConfetti();
      showToast('ResumeForge AI Enhanced', 'Generated ATS-optimized bullet point with action verbs and quantified metrics.', 'sparkles');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-['Inter',sans-serif] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background radial aura */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-radial-gradient pointer-events-none -z-10 opacity-60" />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E65FF] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#1E65FF] animate-spin" />
              <span>AI Portfolio Coach & Optimizer</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Maximize Your Recruiter Impact
            </h1>
            <p className="text-sm text-slate-600 max-w-xl">
              Actionable AI suggestions based on analysis of 40,000+ top candidate profiles in tech, design, and product.
            </p>
          </div>

          {/* Large Circular Score Overview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl flex items-center gap-6 shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
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
                <span className="text-2xl font-black text-slate-900">
                  {portfolioScore}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-900">Portfolio Score</div>
              <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> High Placement Tier
              </div>
              <div className="text-[11px] text-slate-500">
                {coachSuggestions.filter(s => s.applied).length} of {coachSuggestions.length} applied
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Quantified Impact</span>
              <span className="text-emerald-600 font-bold">94%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Keyword Discoverability</span>
              <span className="text-[#1E65FF] font-bold">88%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1E65FF] rounded-full" style={{ width: '88%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Project Depth</span>
              <span className="text-purple-600 font-bold">90%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '90%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Visual Aesthetics</span>
              <span className="text-pink-600 font-bold">98%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: '98%' }} />
            </div>
          </div>
        </div>

        {/* Actionable Suggestions Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Smart Suggestions ({coachSuggestions.filter(s => !s.applied).length} Remaining)
              </h2>
              <p className="text-xs text-slate-500">Click "Apply Suggestion" to automatically upgrade your portfolio data.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coachSuggestions.map((sug) => {
              return (
                <div
                  key={sug.id}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between shadow-sm ${
                    sug.applied
                      ? 'bg-slate-50 border-emerald-200 text-slate-500'
                      : 'bg-white border-slate-200 hover:border-[#1E65FF] hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        sug.applied ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-[#1E65FF] border border-blue-200'
                      }`}>
                        {sug.category}
                      </span>
                      <span className="text-xs font-mono text-amber-600 font-bold">
                        +{sug.impactScore}% Score Boost
                      </span>
                    </div>

                    <h3 className={`text-base font-bold ${sug.applied ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {sug.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sug.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    {sug.applied ? (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 stroke-[3]" /> Applied to Portfolio
                      </span>
                    ) : (
                      <button
                        onClick={() => applyCoachSuggestion(sug.id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#1E65FF]/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{sug.actionText}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive AI Narrative Polisher Simulator */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E65FF] border border-blue-100 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                AI Bullet Point & Metric Transformer
              </h3>
              <p className="text-xs text-slate-500">
                Paste any weak resume bullet and our model synthesizes quantified metrics and executive tone.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Original Bullet Point</label>
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
              />
            </div>

            <button
              onClick={handleRewrite}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#1E65FF]/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing High-Impact Metrics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Transform with AI</span>
                </>
              )}
            </button>

            {rewrittenText && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> AI Optimized Version
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rewrittenText);
                      showToast('Copied to Clipboard', 'You can paste this directly into your editor.', 'success');
                    }}
                    className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {rewrittenText}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
