import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Sparkles, Briefcase, Rocket, Trophy, ArrowRight, ExternalLink, Globe, Code2, ShieldCheck, Shield, Check } from 'lucide-react';

export const HeroTransformationVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'projects' | 'experience' | 'skills'>('all');

  return (
    <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
      {/* Subtle light ambient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-[#1E65FF]/10 via-blue-100/40 to-transparent blur-[80px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/60 via-indigo-50/40 to-amber-50/30 rounded-3xl blur-xl opacity-80 -z-10" />

      {/* Main interactive showcase container */}
      <div className="relative rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-slate-200/80 overflow-hidden">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* Top header bar of the simulator */}
        <div className="relative z-10 flex items-center pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-3 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-mono text-[#1E65FF] font-medium">
              <Globe className="w-3 h-3 text-[#1E65FF]" />
              <span>abc.techhumans.live</span>
            </div>
          </div>
        </div>

        {/* Transformation Split Stage */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Left: Traditional Flat PDF Resume (Source) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-4 relative group"
          >
            <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3.5 shadow-sm transition-all duration-300 group-hover:border-[#1E65FF]/60">
              {/* PDF badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-mono font-bold uppercase border border-rose-200">
                  <FileText className="w-3 h-3 text-rose-600" />
                  <span>Resume.pdf</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Static • 2 Pages</span>
              </div>

              {/* Simulated traditional plain paper layout */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 relative overflow-hidden shadow-inner">
                {/* Laser scan line passing through */}
                <motion.div 
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#1E65FF] to-transparent shadow-[0_0_12px_#1E65FF]"
                  animate={{ y: [0, 180, 0] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
                />

                <div className="w-20 h-2 bg-slate-700 rounded" />
                <div className="w-32 h-1.5 bg-slate-400 rounded" />
                <div className="w-full h-px bg-slate-100 my-2" />
                
                <div className="space-y-1">
                  <div className="w-16 h-1.5 bg-blue-600 rounded" />
                  <div className="w-full h-1 bg-slate-300 rounded" />
                  <div className="w-5/6 h-1 bg-slate-300 rounded" />
                  <div className="w-4/6 h-1 bg-slate-300 rounded" />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="w-14 h-1.5 bg-blue-500 rounded" />
                  <div className="w-full h-1 bg-slate-300 rounded" />
                  <div className="w-3/4 h-1 bg-slate-300 rounded" />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="w-12 h-1.5 bg-amber-500 rounded" />
                  <div className="flex gap-1 flex-wrap">
                    <div className="w-6 h-1 bg-slate-300 rounded" />
                    <div className="w-8 h-1 bg-slate-300 rounded" />
                    <div className="w-5 h-1 bg-slate-300 rounded" />
                  </div>
                </div>
              </div>

              <div className="mt-2.5 text-center">
                <span className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E65FF] animate-ping" />
                  Parsing structured data...
                </span>
              </div>
            </div>

            {/* Connecting arrow for mobile / flow indicator */}
            <div className="md:hidden flex justify-center my-2 text-[#1E65FF]">
              <ArrowRight className="w-5 h-5 rotate-90" />
            </div>
          </motion.div>

          {/* Center: Neural beam and connector */}
          <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center relative">
            <div className="w-full h-0.5 bg-gradient-to-r from-[#1E65FF] via-blue-400 to-[#1E65FF] relative">
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1E65FF] shadow-[0_0_8px_#1E65FF]"
                animate={{ left: ['0%', '100%', '0%'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Right: Modern Living Digital Portfolio (Target Output) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-7 space-y-3"
          >
            {/* Interactive category toggles */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[11px] tracking-wider transition-all ${activeTab === 'all' ? 'bg-[#1E65FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-100'}`}
              >
                All Components
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[11px] tracking-wider transition-all ${activeTab === 'projects' ? 'bg-[#1E65FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-100'}`}
              >
                🚀 Projects
              </button>
              <button 
                onClick={() => setActiveTab('experience')}
                className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[11px] tracking-wider transition-all ${activeTab === 'experience' ? 'bg-[#1E65FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-100'}`}
              >
                💼 Experience
              </button>
              <button 
                onClick={() => setActiveTab('skills')}
                className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[11px] tracking-wider transition-all ${activeTab === 'skills' ? 'bg-[#1E65FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-100'}`}
              >
                ⚡ Skills
              </button>
            </div>

            {/* Living Floating Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Card 1: Projects */}
              {(activeTab === 'all' || activeTab === 'projects') && (
                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-white p-3.5 shadow-sm relative overflow-hidden group hover:border-[#1E65FF]/60 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E65FF]">
                      <Rocket className="w-3.5 h-3.5 text-[#1E65FF]" />
                      <span>Featured Project</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1E65FF] transition-colors">Generate Fast Portfolio</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">Generate fast portfolio</p>
                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1E65FF] border border-blue-200 font-mono font-medium">TypeScript</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium">Tailwind</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium">React 19</span>
                  </div>
                </motion.div>
              )}

              {/* Card 2: Experience */}
              {(activeTab === 'all' || activeTab === 'experience') && (
                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="rounded-xl border border-slate-200 hover:border-[#1E65FF]/60 bg-white p-3.5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Briefcase className="w-3.5 h-3.5 text-[#1E65FF]" />
                      <span>Experience</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#1E65FF] font-semibold">2022 - Now</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1E65FF] transition-colors">Demo Resumes Available</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Velocity Labs • San Francisco</p>
                </motion.div>
              )}

              {/* Card 3: Skills */}
              {(activeTab === 'all' || activeTab === 'skills') && (
                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  className={`rounded-xl border border-slate-200 hover:border-[#1E65FF]/60 bg-white p-3.5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all ${activeTab === 'all' ? 'sm:col-span-2' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E65FF]">
                      <Shield className="w-3.5 h-3.5 text-[#1E65FF]" />
                      <span>High Security</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-50 border border-slate-200 text-slate-800 font-medium">Design Systems</span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-50 border border-slate-200 text-slate-800 font-medium">Systems Architecture</span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-50 border border-slate-200 text-slate-800 font-medium">React / Node</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


