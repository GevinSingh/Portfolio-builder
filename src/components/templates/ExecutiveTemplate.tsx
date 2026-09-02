import React from 'react';
import { PortfolioData } from '../../types';
import { Shield, Award, Briefcase, GraduationCap, Mail, Linkedin, Twitter, Github, MapPin, TrendingUp, CheckCircle, ExternalLink, Globe } from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  return (
    <div className={`w-full bg-[#0b0f19] text-slate-100 font-sans selection:bg-amber-500 selection:text-black transition-all ${isCompact ? 'p-3 text-xs' : 'p-6 sm:p-12 max-w-5xl mx-auto'}`}>
      
      {/* Executive Hero */}
      <header className="border-b border-amber-500/20 pb-10 mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Briefing</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-white font-normal">
              {profile.fullName}
            </h1>

            <p className="text-base sm:text-xl text-amber-100/80 font-light">
              {profile.headline}
            </p>

            {profile.socials.location && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.socials.location}</span>
                <span className="text-amber-500/50">•</span>
                <span className="text-amber-300/90">{about.yearsOfExperience}+ Years Leadership</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="p-1 rounded-xl bg-gradient-to-b from-amber-500/40 to-slate-800 border border-amber-500/30 shadow-xl">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-slate-950 border border-amber-500/20 flex flex-col items-center justify-center text-amber-300 font-serif select-none">
                  <span className="text-2xl sm:text-3xl font-bold tracking-wider">
                    {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'EX'}
                  </span>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-amber-500/70 mt-1">Executive</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              {profile.socials.linkedin && (
                <a href={formatExternalUrl(profile.socials.linkedin, 'linkedin')} target="_blank" rel="noreferrer" className="p-2 rounded bg-slate-900 border border-amber-500/20 hover:border-amber-400 text-amber-300 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socials.github && (
                <a href={formatExternalUrl(profile.socials.github, 'github')} target="_blank" rel="noreferrer" className="p-2 rounded bg-slate-900 border border-amber-500/20 hover:border-amber-400 text-amber-300 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socials.twitter && (
                <a href={formatExternalUrl(profile.socials.twitter, 'twitter')} target="_blank" rel="noreferrer" className="p-2 rounded bg-slate-900 border border-amber-500/20 hover:border-amber-400 text-amber-300 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socials.email && (
                <EmailLink
                  email={profile.socials.email}
                  className="p-2 rounded bg-slate-900 border border-amber-500/20 hover:border-amber-400 text-amber-300 transition-colors"
                />
              )}
            </div>
          </div>
        </div>

        {/* Executive Summary Quote */}
        <div className="mt-8 p-5 rounded-xl bg-slate-900/80 border-l-4 border-amber-400 text-slate-300 text-sm leading-relaxed">
          {profile.bio}
        </div>
      </header>

      {/* Leadership Highlights / Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
          <div className="text-xs text-amber-400 font-mono uppercase tracking-wider">Experience</div>
          <div className="text-2xl font-serif text-white mt-1">
            {about.yearsOfExperience > 0 ? `${about.yearsOfExperience}+ Years` : `${experience.length} Roles`}
          </div>
          <div className="text-xs text-slate-400 mt-1">Cross-functional team direction</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
          <div className="text-xs text-amber-400 font-mono uppercase tracking-wider">Initiatives Delivered</div>
          <div className="text-2xl font-serif text-white mt-1">
            {projects.length > 0 ? `${projects.length} Initiatives` : `${experience.length}+ Milestones`}
          </div>
          <div className="text-xs text-slate-400 mt-1">High-scale enterprise impact</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
          <div className="text-xs text-amber-400 font-mono uppercase tracking-wider">Key Specialization</div>
          <div className="text-sm font-semibold text-white mt-2 truncate">Systems & Product Scale</div>
          <div className="text-xs text-slate-400 mt-1">Proven ROI and velocity</div>
        </div>
      </div>

      {/* Executive Experience Timeline */}
      <section className="mb-12">
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400">Leadership Track Record</h2>
        </div>

        <div className="space-y-8">
          {experience.map((exp) => (
            <div key={exp.id} className="relative pl-6 border-l-2 border-amber-500/30 space-y-2">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-400" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <h3 className="text-base font-bold text-white font-serif">{exp.role} · <span className="text-amber-300 font-normal">{exp.company}</span></h3>
                <span className="text-xs text-slate-400 font-mono">{exp.startDate} - {exp.endDate}</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside">
                {exp.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Flagship Projects */}
      {projects.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400">Flagship Strategic Initiatives</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((proj) => (
              <div key={proj.id} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all">
                <h3 className="text-base font-bold text-white font-serif">{proj.title}</h3>
                <p className="text-xs text-amber-400/90 mt-0.5">{proj.role}</p>
                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">{proj.description}</p>
                {proj.metrics && (
                  <div className="mt-3 text-xs font-mono text-amber-300 bg-amber-950/30 px-2.5 py-1 rounded border border-amber-500/20">
                    ★ {proj.metrics}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      <section className="mb-12">
        <div className="pb-3 border-b border-amber-500/20 mb-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400">Executive Competencies</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {skills.map((cat) => (
            <div key={cat.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <h4 className="text-xs font-mono text-amber-400 uppercase mb-3">{cat.category}</h4>
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 text-xs rounded bg-slate-950 text-slate-200 border border-slate-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Honors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-amber-500/20 text-xs">
        <div>
          <div className="text-amber-400 font-mono uppercase mb-3">Education</div>
          {education.map((edu) => (
            <div key={edu.id} className="space-y-1">
              <div className="font-bold text-white text-sm">{edu.institution}</div>
              <div className="text-slate-300">{edu.degree} · {edu.field}</div>
              <div className="text-slate-500 font-mono">{edu.startDate} - {edu.endDate} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-amber-400 font-mono uppercase mb-3">Distinctions</div>
          <div className="space-y-2">
            {achievements.map((ach) => {
              const subtitle = [ach.issuer, (ach.date && ach.date !== 'Recent') ? ach.date : ''].filter(Boolean).join(' • ');
              return (
                <div key={ach.id} className="space-y-0.5">
                  <div className="font-bold text-amber-200">{ach.title}</div>
                  {subtitle && <div className="text-slate-400 text-xs">{subtitle}</div>}
                  {ach.description && ach.description !== ach.title && (
                    <div className="text-slate-400 text-xs">{ach.description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
