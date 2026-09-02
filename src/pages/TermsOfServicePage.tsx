import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Shield, Scale, ExternalLink, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20 font-['Inter',sans-serif]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-[#1E65FF] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">Terms of Service</span>
        </div>

        {/* Header Section */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E65FF] text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-[#1E65FF]" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Effective Date: <span className="font-semibold text-slate-700">August 30, 2026</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">

          {/* Section 1 */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">1</span>
              <h2>Acceptance of Terms</h2>
            </div>
            <p className="text-slate-600">
              By accessing and using <strong className="text-slate-900">techhumans.live</strong> (the &quot;Site&quot;), operated by <strong className="text-slate-900">Tech Humans</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">2</span>
              <h2>Use of the Site</h2>
            </div>
            <p className="text-slate-600">
              This Site serves as a professional portfolio and resource. You agree to use the Site only for lawful purposes and in a manner that does not infringe upon the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the Site. Prohibited behavior includes harassing or causing distress to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within the Site.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">3</span>
              <h2>Intellectual Property Rights</h2>
            </div>
            <p className="text-slate-600">
              All original content, designs, code, text, graphics, logos, and showcase projects on this Site are the intellectual property of <strong className="text-slate-900">Tech Humans</strong> unless otherwise stated.
            </p>
            <ul className="space-y-2.5 pt-1">
              <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>You may view, download, and print pages for your personal, non-commercial use or for evaluating potential professional engagements.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>You may not reproduce, redistribute, republish, or sell any content from this Site without prior written permission.</span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">4</span>
              <h2>External Links</h2>
            </div>
            <p className="text-slate-600">
              The Site may contain links to third-party websites (such as GitHub, LinkedIn, live demo sites, or external publications) that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. Accessing external links is done at your own risk.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">5</span>
              <h2>Disclaimer of Warranties</h2>
            </div>
            <p className="text-slate-600">
              The Site and its contents are provided on an &quot;as is&quot; and &quot;as available&quot; basis without any warranties of any kind, whether express or implied. We do not guarantee that the Site will operate uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </div>

          {/* Section 6 */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">6</span>
              <h2>Limitation of Liability</h2>
            </div>
            <p className="text-slate-600">
              To the fullest extent permitted by law, <strong className="text-slate-900">Tech Humans</strong> shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, use of, or inability to use this Site or any materials on it.
            </p>
          </div>

          {/* Section 7 */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">7</span>
              <h2>Changes to Terms</h2>
            </div>
            <p className="text-slate-600">
              We reserve the right to modify these Terms of Service at any time. Any changes will be posted directly to this page with an updated &quot;Effective Date.&quot; Continued use of the Site following any changes constitutes your acceptance of the revised terms.
            </p>
          </div>

          {/* Contact Support Box */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-white rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-slate-900">Questions regarding these Terms?</h3>
              <p className="text-xs sm:text-sm text-slate-600">Send us your inquiry directly through our feedback form.</p>
            </div>
            <button 
              onClick={() => {
                navigate('/#contact');
                setTimeout(() => {
                  const el = document.getElementById('contact');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#contact';
                  }
                }, 150);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#1E65FF]/20 cursor-pointer shrink-0"
            >
              Contact Team →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
