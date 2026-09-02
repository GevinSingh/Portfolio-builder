import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Globe, 
  ArrowLeft, 
  Download, 
  Share2, 
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AnalyticsPage: React.FC = () => {
  const { portfolio } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-['Inter',sans-serif] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-radial-gradient pointer-events-none -z-10 opacity-60" />

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <Link to="/dashboard" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-2 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Recruiter & Visitor Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Live traffic, company sources, and project engagement data for your portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Tracking Active
            </span>
          </div>
        </div>

        {/* Top 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Unique Visits</div>
            <div className="text-3xl font-black text-slate-900 mt-2">1,284</div>
            <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +28% this month
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Avg. Time on Portfolio</div>
            <div className="text-3xl font-black text-slate-900 mt-2">2m 48s</div>
            <div className="text-xs text-[#1E65FF] font-bold mt-1">
              Top 5% across design & tech
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Resume PDF Downloads</div>
            <div className="text-3xl font-black text-slate-900 mt-2">142</div>
            <div className="text-xs text-purple-600 font-bold mt-1">
              11% visitor conversion rate
            </div>
          </div>
        </div>

        {/* Simulated Traffic Graph & Geographic split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Traffic Graph Simulator */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Daily Recruiter Impressions (Last 14 Days)</h3>
              <span className="text-xs text-slate-500 font-mono">1,284 total views</span>
            </div>

            {/* Simulated bar chart */}
            <div className="h-48 flex items-end gap-2 sm:gap-3 pt-6 border-b border-slate-100 pb-2">
              {[45, 62, 78, 54, 89, 112, 130, 95, 80, 140, 165, 120, 178, 190].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 font-mono transition-opacity">
                    {val}
                  </div>
                  <div
                    style={{ height: `${(val / 200) * 100}%` }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#1E65FF] to-blue-400 group-hover:from-blue-600 group-hover:to-blue-300 transition-all cursor-pointer shadow-sm"
                  />
                  <span className="text-[9px] text-slate-400 font-mono">D{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Traffic Locations */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Top Visitor Regions</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">🇺🇸 San Francisco / Bay Area</span>
                <span className="font-mono text-[#1E65FF] font-bold">48%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">🇺🇸 New York City</span>
                <span className="font-mono text-[#1E65FF] font-bold">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">🇬🇧 London, United Kingdom</span>
                <span className="font-mono text-[#1E65FF] font-bold">14%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">🇩🇪 Berlin, Germany</span>
                <span className="font-mono text-[#1E65FF] font-bold">9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">🌍 Other Global Hubs</span>
                <span className="font-mono text-[#1E65FF] font-bold">7%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
