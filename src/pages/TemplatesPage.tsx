import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Palette, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Eye, 
  Layers, 
  Star, 
  ExternalLink,
  Code2,
  Briefcase,
  PenTool,
  Shield
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { templateOptions } from '../data/mockData';
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

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio, templateId, setTemplateId, triggerConfetti, showToast } = usePortfolio();
  const [modalPreviewId, setModalPreviewId] = useState<TemplateId | null>(null);

  const handleSelect = (id: TemplateId) => {
    setTemplateId(id);
    triggerConfetti();
    showToast('Design Theme Activated', `Switched active template to "${id.toUpperCase()}".`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-['Inter',sans-serif] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Glow ambient background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-radial-gradient pointer-events-none -z-10 opacity-60" />
      <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-[#1E65FF]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1E65FF] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Palette className="w-3.5 h-3.5 text-[#1E65FF]" />
            <span>Design Studio Archetypes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Choose Your Signature Style
          </h1>

          <p className="text-sm sm:text-base text-slate-600">
            Switch your portfolio design anytime without losing a single line of data or project metrics. 11 premium archetypes available.
          </p>
        </div>

        {/* Templates 6-Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {templateOptions.map((tmpl) => {
            const isCurrent = portfolio.templateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#1E65FF] bg-white shadow-2xl shadow-blue-500/10 ring-2 ring-[#1E65FF]/30'
                    : 'border-slate-200 bg-white hover:border-[#1E65FF] hover:shadow-xl'
                }`}
              >
                {/* Visual Header Image Preview */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
                  <img
                    src={tmpl.previewThumb}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

                  {/* Badge & Active Tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 border border-slate-200 backdrop-blur-md uppercase tracking-wider shadow-sm">
                      {tmpl.badge}
                    </span>
                    {isCurrent && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center gap-1 uppercase tracking-wider shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Active Style
                      </span>
                    )}
                  </div>

                  {/* Quick preview button */}
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => setModalPreviewId(tmpl.id as TemplateId)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold uppercase tracking-wider border border-slate-200 backdrop-blur-md flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#1E65FF]" />
                      <span>Full Preview</span>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{tmpl.name}</h3>
                    <p className="text-xs text-[#1E65FF] font-bold mt-0.5">{tmpl.tagline}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{tmpl.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tmpl.tags.map((tag) => (
                      <span key={tag} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleSelect(tmpl.id as TemplateId)}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                          : 'bg-[#1E65FF] hover:bg-[#1853db] text-white shadow-lg shadow-[#1E65FF]/20 active:scale-95'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Currently Selected</span>
                        </>
                      ) : (
                        <>
                          <span>Apply This Design</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <Link
                      to={`/p/${portfolio.slug}`}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                      title="View live portfolio"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Full Template Modal Preview */}
      {modalPreviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Top Bar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900 uppercase font-mono">
                  Preview: {modalPreviewId} Template
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleSelect(modalPreviewId);
                    setModalPreviewId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Activate This Template</span>
                </button>
                <button
                  onClick={() => setModalPreviewId(null)}
                  className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 text-xs font-bold border border-slate-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F8FAFC]">
              {modalPreviewId === 'minimal' && <MinimalTemplate portfolio={portfolio} />}
              {modalPreviewId === 'developer' && <DeveloperTemplate portfolio={portfolio} />}
              {modalPreviewId === 'creative' && <CreativeTemplate portfolio={portfolio} />}
              {modalPreviewId === 'executive' && <ExecutiveTemplate portfolio={portfolio} />}
              {modalPreviewId === 'bento' && <BentoTemplate portfolio={portfolio} />}
              {modalPreviewId === 'editorial' && <EditorialTemplate portfolio={portfolio} />}
              {modalPreviewId === 'corporate' && <CorporateTemplate portfolio={portfolio} />}
              {modalPreviewId === 'architect' && <ArchitectTemplate portfolio={portfolio} />}
              {modalPreviewId === 'metro' && <MetroTemplate portfolio={portfolio} />}
              {modalPreviewId === 'noir' && <NoirTemplate portfolio={portfolio} />}
              {modalPreviewId === 'academic' && <AcademicTemplate portfolio={portfolio} />}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
