import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Layers, 
  Zap, 
  Globe, 
  Edit3, 
  Palette, 
  CheckCircle2, 
  Share2, 
  ChevronRight, 
  ShieldCheck, 
  Star, 
  Users, 
  Award, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Lightbulb, 
  Building2, 
  ShieldAlert, 
  Plug, 
  Wrench, 
  Cpu, 
  Check, 
  Send,
  Server,
  Wand2,
  MessageSquare 
} from 'lucide-react';
import { HeroTransformationVisual } from '../components/HeroTransformationVisual';
import { templateOptions } from '../data/mockData';
import { usePortfolio } from '../context/PortfolioContext';
import { TemplateId } from '../types';
import { MinimalTemplate } from '../components/templates/MinimalTemplate';
import { DeveloperTemplate } from '../components/templates/DeveloperTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';
import { ExecutiveTemplate } from '../components/templates/ExecutiveTemplate';
import { BentoTemplate } from '../components/templates/BentoTemplate';
import { EditorialTemplate } from '../components/templates/EditorialTemplate';
import { CorporateTemplate } from '../components/templates/CorporateTemplate';
import { ArchitectTemplate } from '../components/templates/ArchitectTemplate';
import { MetroTemplate } from '../components/templates/MetroTemplate';
import { NoirTemplate } from '../components/templates/NoirTemplate';
import { AcademicTemplate } from '../components/templates/AcademicTemplate';
import { messageApi } from '../lib/api';
import { saveContactMessageToSupabase } from '../lib/supabase';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { portfolio, setTemplateId, showToast, triggerConfetti } = usePortfolio();
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState<TemplateId>('developer');

  useEffect(() => {
    if (location.hash === '#contact' || window.location.hash === '#contact') {
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Instant Portfolio Generation',
    details: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setFormLoading(true);

    const fullMessage = [
      `[Topic: ${formData.service}]`,
      formData.phone ? `Phone: ${formData.phone}` : '',
      formData.details ? `Feedback: ${formData.details}` : ''
    ].filter(Boolean).join('\n\n');

    try {
      // 1. Send and save to backend database (data/messages.json with local fallback)
      await messageApi.send({
        portfolioSlug: portfolio.slug || 'alex-johnson',
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: fullMessage || `Feedback regarding ${formData.service}`,
      });

      // 2. Also save to Supabase cloud database if configured
      saveContactMessageToSupabase({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: fullMessage || `Feedback regarding ${formData.service}`,
        portfolio_slug: portfolio.slug || 'alex-johnson',
      }).catch((err) => {
        console.warn('Supabase message backup warning:', err);
      });

      setFormSubmitted(true);
      triggerConfetti();
      showToast('Feedback Received', 'Your feedback has been saved to the database.', 'success');

      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Instant Portfolio Generation',
          details: ''
        });
        setFormSubmitted(false);
      }, 4000);
    } catch (error: any) {
      showToast('Submission Failed', error?.message || 'Could not save feedback. Please try again.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Complete Services
  const services: Array<{
    icon: typeof Lightbulb;
    title: string;
    desc: string;
    tag?: string;
    link?: string;
    actionText?: string;
  }> = [
    {
      icon: Lightbulb,
      title: 'Smart Resume Parsing',
      desc: 'Automatically upload and extract education, work experience, projects, skills, and links from standard PDF resumes into structured data',
      tag: 'Neural Parser',
      link: '/templates',
      actionText: 'Explore Templates →',
    },
    {
      icon: Building2,
      title: 'Instant Portfolio Generation',
      desc: 'Turn raw career details into polished professional portfolio websites using multiple selectable visual layouts.',
      tag: '6 Archetypes',
      link: '/upload',
      actionText: 'Transform Resume →',
    },
    {
      icon: ShieldAlert,
      title: 'Secure Profile Management',
      desc: 'Protected user accounts keep your personal portfolio edit links safe, isolated, and completely under your control.',
      tag: 'Verified',
      link: '/login',
      actionText: 'Login to Account →',
    },
    {
      icon: MessageSquare,
      title: 'Feedback Form',
      desc: 'Share your thoughts, suggestions, and feedback directly with our team to help us improve the platform.',
      tag: 'Feedback',
      link: '#contact',
      actionText: 'Give Feedback →',
    },
    {
      icon: Edit3,
      title: 'Personal Editing Studio',
      desc: 'Easily review, modify, add, or reorder projects, experiences, and skills without breaking the visual layout.',
      tag: 'Full Editor',
      link: '/scratch',
      actionText: 'Build From Scratch →',
    },
  ];

  // Why Choose Us Stats
  const whyChooseStats = [
    {
      stat: 'Fully Customizable',
      label: 'PORTFOLIO THEMES',
      sub: 'Edit every section, style, project, and layout',
      icon: Award,
    },
    {
      stat: 'Unique Templates',
      label: 'CURATED ARCHETYPES',
      sub: 'Minimalist, Cyber, Creative, Executive, Bento & Editorial layouts',
      icon: Layers,
    },
    {
      stat: '100% Free',
      label: 'PORTFOLIO BUILDER',
      sub: 'Zero hidden fees or premium paywalls',
      icon: Users,
    },
    {
      stat: 'Instant Live',
      label: 'SHAREABLE PUBLIC URL',
      sub: 'One-click link ready for recruiters and applications',
      icon: Globe,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#F8FAFC] font-['Inter',sans-serif] text-slate-900">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-radial-gradient pointer-events-none -z-10 opacity-70" />
      <div className="absolute top-64 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#1E65FF]/10 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-40 left-10 w-96 h-96 bg-blue-100/50 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 4. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Col: Headline & Pitch */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              {/* Main Heading (H1) */}
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Professional <br className="hidden sm:inline" />
                <span className="text-[#1E65FF]">Portfolio</span> Builder
              </h1>

              {/* Body Paragraph */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Transform your static PDF resume into an interactive, modern portfolio website in seconds. Choose from designer templates, customize every section, and share your personal showcase link directly with recruiters.
              </p>

              {/* CTAs (Buttons) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/upload"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#1E65FF]/25 hover:shadow-[#1E65FF]/40 flex items-center justify-center gap-2 transition-all group active:scale-95"
                >
                  <span>Transform Resume</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/scratch"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1E65FF] border border-blue-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Build From Scratch</span>
                </Link>

                <Link
                  to="/templates"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Templates</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1E65FF]" />
                  <span className="text-slate-900 font-semibold">Fast & Automated Portfolio Builder</span>
                </div>
              </div>

            </motion.div>

            {/* Right Col: Hero Visual - Transformation Concept */}
            <div className="lg:col-span-6">
              <HeroTransformationVisual />
            </div>

          </div>

        </div>
      </section>

      {/* 5. Features / Services Section */}
      <section id="services" className="py-20 sm:py-28 border-t border-slate-200 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#1E65FF]">OUR SERVICES</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Everything You Need to Escape the PDF
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Powerful automated tools to turn static resumes into living, publishable web portfolios in seconds.
            </p>
          </div>

          {/* 3 Columns Card Layout with Centered Placement for 5th Item */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((item) => {
              const IconComp = item.icon;
              const isStudio = item.title === 'Personal Editing Studio';
              return (
                <div 
                  key={item.title}
                  onClick={() => {
                    if (item.link) {
                      if (item.link.startsWith('#')) {
                        const el = document.getElementById(item.link.replace('#', ''));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate(item.link);
                      }
                    }
                  }}
                  className={`group relative p-7 rounded-2xl bg-white border border-slate-200 hover:border-[#1E65FF] transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 ${
                    item.link ? 'cursor-pointer' : ''
                  } ${
                    isStudio
                      ? 'md:col-span-2 lg:col-span-1 lg:col-start-2 mx-auto w-full md:max-w-md lg:max-w-none my-1 sm:my-2'
                      : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E65FF] group-hover:bg-[#1E65FF] group-hover:text-white transition-all shadow-sm">
                        <IconComp className="w-6 h-6" />
                      </div>
                      {item.tag && (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#1E65FF] border border-blue-100">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1E65FF] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end text-xs">
                    {item.link && !item.link.startsWith('#') ? (
                      <Link 
                        to={item.link}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#1E65FF] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                      >
                        {item.actionText || 'Explore Templates →'}
                      </Link>
                    ) : (
                      <a 
                        href={item.link || "#contact"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.link?.startsWith('#')) {
                            e.preventDefault();
                            const el = document.getElementById(item.link.replace('#', ''));
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="text-[#1E65FF] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                      >
                        {item.actionText || 'Request Service →'}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. Why Choose Us Section ("The Right Choice") */}
      <section id="why-choose-us" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#1E65FF]">WHY CHOOSE US</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              The Smart Way to Build Your Portfolio
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Engineered to turn resumes into interactive, high-converting portfolio websites with zero coding required.
            </p>
          </div>

          {/* 4-Column Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseStats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  id={`why-choose-card-${idx}`}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#1E65FF] transition-all text-center space-y-3 group hover:scale-[1.02] shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1E65FF] group-hover:bg-[#1E65FF] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl sm:text-[26px] lg:text-[28px] font-black text-slate-900 group-hover:text-[#1E65FF] transition-colors leading-tight">
                      {item.stat}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {item.label}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {item.sub}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Interactive AI Portfolio Templates Engine */}
      <section className="py-20 sm:py-28 border-t border-slate-200 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#1E65FF]">PORTFOLIO TEMPLATES</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Interactive Digital Showcase
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Turn your resume and credentials into an interactive web portfolio. Select an archetype below to preview in real-time.
            </p>
          </div>

          {/* Template Selection Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
            {templateOptions.map((tmpl) => (
              <button
                key={tmpl.id}
                id={`template-tab-btn-${tmpl.id}`}
                onClick={() => setSelectedPreviewTemplate(tmpl.id as TemplateId)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  selectedPreviewTemplate === tmpl.id
                    ? 'bg-[#1E65FF] text-white shadow-lg shadow-[#1E65FF]/25 scale-105 ring-2 ring-[#1E65FF]/30'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{tmpl.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${selectedPreviewTemplate === tmpl.id ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'}`}>
                  {tmpl.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Live Preview Window */}
          <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-5 shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 mb-4 text-xs text-slate-600 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-slate-800 ml-2">Preview Mode: {selectedPreviewTemplate.toUpperCase()}</span>
              </div>
              <button
                onClick={() => {
                  setTemplateId(selectedPreviewTemplate);
                  navigate('/upload');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#1E65FF] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1853db] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto rounded-xl border border-slate-200 bg-white">
              {selectedPreviewTemplate === 'minimal' && <MinimalTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'developer' && <DeveloperTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'creative' && <CreativeTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'executive' && <ExecutiveTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'bento' && <BentoTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'editorial' && <EditorialTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'corporate' && <CorporateTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'architect' && <ArchitectTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'metro' && <MetroTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'noir' && <NoirTemplate portfolio={portfolio} isCompact={true} />}
              {selectedPreviewTemplate === 'academic' && <AcademicTemplate portfolio={portfolio} isCompact={true} />}
            </div>
          </div>

        </div>
      </section>


      {/* 8. Contact & Booking Form Section ("Get in Touch") */}
      <section id="contact" className="py-20 sm:py-28 border-t border-slate-200 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#1E65FF]">GET IN TOUCH</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Have Questions or Feedback?
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Reach out to our product team for custom template requests, enterprise inquiries, or assistance.
            </p>
          </div>

          {/* 2-Column Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
            
            {/* Left Side: Interactive Form Card */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xl">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name <span className="text-[#1E65FF]">*</span>
                  </label>
                  <input
                    id="contact-full-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Om Korde"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E65FF] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-[#1E65FF]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@company.com"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E65FF] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(+91) 123-456-7890"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E65FF] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Topic <span className="text-[#1E65FF]">*</span>
                  </label>
                  <select
                    id="contact-topic-select"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Instant Portfolio Generation">Instant Portfolio Generation</option>
                    <option value="Secure Profile Management">Secure Profile Management</option>
                    <option value="Feedback Form">Feedback Form</option>
                    <option value="Personal Editing Studio">Personal Editing Studio</option>
                    <option value="Custom Enterprise Theme">Custom Enterprise Theme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message Details
                  </label>
                  <textarea
                    rows={4}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Tell us what questions you have or features you'd like to see..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E65FF] focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitted || formLoading}
                  className="w-full py-4 px-6 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#1E65FF]/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Feedback to Database...</span>
                    </>
                  ) : formSubmitted ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Feedback Saved to Database!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side: Info Panel */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Contact Details Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Support & Connect</h3>
                
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1E65FF] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-semibold">Support Email</div>
                      <div className="text-slate-900 font-medium">support@techhumans.com</div>
                    </div>
                  </li>

                  <li className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1E65FF] shrink-0">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-semibold">Hosting Provider</div>
                      <div className="text-slate-900 font-medium">Google Cloud Platform (Global CDN)</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1E65FF] shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-semibold">Response Time</div>
                      <div className="text-slate-900 font-medium">Average response within 2-4 hours</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Immediate Callout Box (Blue Banner) */}
              <div className="p-6 rounded-2xl bg-[#1E65FF] text-white shadow-xl shadow-[#1E65FF]/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 fill-white text-white" />
                  <h4 className="text-base font-black">Ready to Build Your Portfolio?</h4>
                </div>
                <p id="contact-callout-desc" className="text-xs text-blue-100 leading-relaxed">
                  Transform your resume into a live website in 10 minutes. No credit card required.
                </p>
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md gap-1.5"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

