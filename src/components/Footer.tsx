import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 py-16 relative overflow-hidden font-['Inter',sans-serif]">
      {/* Ambient subtle light accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#1E65FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          
          {/* Col 1 (Brand Info) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E65FF] to-[#0A47D4] flex items-center justify-center shadow-md shadow-[#1E65FF]/25 border border-white/20">
                <Sparkles className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 font-['Inter',sans-serif]">
                  Tech<span className="text-[#1E65FF]">Humans</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Automated AI resume-to-portfolio engine. Transform static PDF resumes into interactive, modern portfolio websites in seconds.
            </p>
          </div>

          {/* Col 2 (Navigation Links) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-900 tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/" 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-slate-600 hover:text-[#1E65FF] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li><a href="/#services" className="text-slate-600 hover:text-[#1E65FF] transition-colors">Services & Features</a></li>
              <li><Link to="/templates" className="text-slate-600 hover:text-[#1E65FF] transition-colors">Templates Gallery</Link></li>
              <li><Link to="/upload" className="text-slate-600 hover:text-[#1E65FF] transition-colors">Upload Resume</Link></li>
              <li><Link to="/dashboard" className="text-slate-600 hover:text-[#1E65FF] transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3 (Contact Info) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-900 tracking-widest">Platform Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#1E65FF] shrink-0" />
                <span>support@techhumans.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#1E65FF] shrink-0" />
                <span>Global Cloud Infrastructure</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Tech Humans. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

