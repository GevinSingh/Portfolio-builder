import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, CheckCircle2, ChevronRight, Mail, Lock, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
          <span className="text-slate-900">Privacy Policy</span>
        </div>

        {/* Header Section */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E65FF] text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-[#1E65FF]" />
            <span>Legal &amp; Trust</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Effective Date: <span className="font-semibold text-slate-700">August 30, 2026</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">

          {/* Section 1: Overview */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">1</span>
              <h2>Overview</h2>
            </div>
            <p className="text-slate-600">
              This Privacy Policy outlines how <strong className="text-slate-900">Tech Humans</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses, and protects any information you provide while visiting <strong className="text-slate-900">techhumans.live</strong> (the &quot;Site&quot;). We respect your privacy and are committed to protecting your personal data.
            </p>
          </div>

          {/* Section 2: Information We Collect */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">2</span>
              <h2>Information We Collect</h2>
            </div>
            <p className="text-slate-600">
              We collect minimal personal data necessary to provide a functional and seamless portfolio experience:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Mail className="w-4 h-4 text-[#1E65FF]" />
                  <span>Contact Information</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  If you reach out via our contact form or direct email, we may collect your name, email address, and any details included in your message.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Eye className="w-4 h-4 text-[#1E65FF]" />
                  <span>Usage &amp; Analytics Data</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  We may collect non-identifiable technical data automatically via browser cookies or analytics services (e.g., IP address, browser type, device details, and pages viewed) to monitor Site performance and improve user experience.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: How We Use Your Information */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">3</span>
              <h2>How We Use Your Information</h2>
            </div>
            <p className="text-slate-600">
              Your data is used strictly for legitimate professional purposes:
            </p>
            <ul className="space-y-3 pt-1">
              <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>To respond to direct inquiries, professional opportunities, or networking requests.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>To analyze traffic patterns and optimize Site functionality.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>To maintain the security and integrity of the Site.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Cookies and Tracking Technologies */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">4</span>
              <h2>Cookies and Tracking Technologies</h2>
            </div>
            <p className="text-slate-600">
              Our Site may use basic cookies to optimize functionality and compile aggregated traffic statistics. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent; however, some features of the Site may not function properly without them.
            </p>
          </div>

          {/* Section 5: Data Sharing and Third-Party Services */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">5</span>
              <h2>Data Sharing and Third-Party Services</h2>
            </div>
            <p className="text-slate-600">
              We do not sell, rent, or trade your personal information. We may share data with trusted third-party service providers (such as hosting platforms or analytics tools) strictly to operate and maintain the Site. These third parties are bound by confidentiality agreements and are prohibited from using your data for any other purpose.
            </p>
          </div>

          {/* Section 6: Data Retention and Security */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">6</span>
              <h2>Data Retention and Security</h2>
            </div>
            <p className="text-slate-600">
              We implement reasonable technical and organizational measures to safeguard your personal information against unauthorized access, loss, or disclosure. Contact messages are retained only as long as necessary to fulfill the communication purpose or comply with legal obligations.
            </p>
          </div>

          {/* Section 7: Your Rights */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E65FF] flex items-center justify-center text-xs font-black">7</span>
              <h2>Your Rights</h2>
            </div>
            <p className="text-slate-600">
              Depending on your jurisdiction, you have the right to access, update, or request the deletion of any personal data we hold about you. To exercise these rights, please contact us directly.
            </p>
          </div>

          {/* Contact Support Box */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-white rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-slate-900">Have questions about our Privacy Policy?</h3>
              <p className="text-xs sm:text-sm text-slate-600">Reach out to our team through our contact and feedback form.</p>
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
              className="px-5 py-2.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#1E65FF]/20 cursor-pointer"
            >
              Contact Team →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
