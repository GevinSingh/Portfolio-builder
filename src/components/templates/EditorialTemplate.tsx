import React from 'react';
import { PortfolioData } from '../../types';
import { 
  BookOpen, 
  MapPin, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ArrowUpRight, 
  Award, 
  GraduationCap, 
  Briefcase,
  Layers,
  Sparkles,
  Quote,
  Bookmark
} from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const EditorialTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  return (
    <div className={`w-full bg-[#FAF9F5] text-[#1E293B] font-sans selection:bg-[#1E293B] selection:text-[#FAF9F5] transition-all ${isCompact ? 'p-3 text-xs' : 'p-6 sm:p-12 lg:p-16 max-w-5xl mx-auto'}`}>
      
      {/* Editorial Masthead Bar */}
      <div className="border-b-2 border-[#1E293B] pb-3 mb-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono tracking-widest uppercase text-slate-500">
        <div className="flex items-center gap-2 text-[#1E293B] font-bold">
          <BookOpen className="w-3.5 h-3.5 text-[#1E65FF]" />
          <span>PORTFOLIO MONOGRAPH</span>
        </div>
        <div className="hidden sm:block">
          <span>CURATED CAREER RETROSPECTIVE</span>
        </div>
        <div className="text-[#1E293B] font-bold">
          <span>PORTFOLIO ARCHIVE • VOL. 06</span>
        </div>
      </div>

      {/* Main Cover Header */}
      <header className="pb-12 border-b border-slate-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs uppercase tracking-widest font-mono text-[#1E65FF] font-bold">
              SPECIALIZATION & LEADERSHIP
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif tracking-tight font-normal text-slate-950 leading-[1.08]">
              {profile.fullName}
            </h1>

            <p className="text-lg sm:text-2xl font-serif italic text-slate-700 leading-snug max-w-2xl pt-1">
              "{profile.headline}"
            </p>

            {profile.socials.location && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 pt-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Base: {profile.socials.location}</span>
                <span>•</span>
                <span>Experience: {about.yearsOfExperience}+ Years</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4 shrink-0">
            <div className="relative p-1.5 bg-white border border-slate-300 shadow-lg rounded-xl">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg bg-slate-900 text-white flex flex-col items-center justify-center font-mono select-none">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'CV'}
                  </span>
                  <span className="text-[9px] text-slate-400 tracking-widest uppercase mt-1">PORTFOLIO</span>
                </div>
              )}
            </div>

            {/* Social Coordinates */}
            <div className="flex items-center gap-2">
              {profile.socials.github && (
                <a href={formatExternalUrl(profile.socials.github, 'github')} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-black hover:border-black transition-colors shadow-sm">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socials.linkedin && (
                <a href={formatExternalUrl(profile.socials.linkedin, 'linkedin')} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-black hover:border-black transition-colors shadow-sm">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socials.twitter && (
                <a href={formatExternalUrl(profile.socials.twitter, 'twitter')} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-black hover:border-black transition-colors shadow-sm">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socials.email && (
                <EmailLink
                  email={profile.socials.email}
                  className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-black hover:border-black transition-colors shadow-sm"
                />
              )}
            </div>
          </div>
        </div>

        {/* Lead Abstract / Bio */}
        <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
            01 / Narrative Abstract
          </div>
          <div className="md:col-span-9">
            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-serif">
              {profile.bio}
            </p>
            {about.summary && (
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {about.summary}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mt-12 space-y-16">
        
        {/* Section 1: Selected Case Studies / Works */}
        {projects.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <h2 className="text-base sm:text-lg font-serif font-bold uppercase tracking-widest text-slate-950 flex items-center gap-2">
                <span>02 / Selected Works & Monographs</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">{projects.length} {projects.length === 1 ? 'Documented Work' : 'Documented Works'}</span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {projects.map((proj, idx) => (
                <article
                  key={proj.id}
                  className="group p-6 sm:p-8 bg-white border border-slate-300 hover:border-slate-900 transition-all rounded-xl shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-mono text-slate-500 font-bold uppercase">
                        Plate {String(idx + 1).padStart(2, '0')} • {proj.role || 'Featured Subject'}
                      </div>
                      <h3 className="text-2xl font-serif text-slate-950 group-hover:text-[#1E65FF] transition-colors">
                        {proj.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {proj.github && (
                        <a
                          href={formatExternalUrl(proj.github, 'github')}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Source</span>
                        </a>
                      )}
                      {proj.link && (
                        <a
                          href={formatExternalUrl(proj.link)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-[#1E65FF] text-white text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <span>Review Work</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-base sm:text-lg font-serif text-slate-700 leading-relaxed max-w-4xl">
                    {proj.description}
                  </p>

                  {proj.metrics && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono rounded">
                      <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                      <span>{proj.metrics}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-slate-600">
                    {proj.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Chronological Career Chronicle */}
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
            <h2 className="text-base sm:text-lg font-serif font-bold uppercase tracking-widest text-slate-950">
              03 / Chronological Chronicle
            </h2>
            <span className="text-xs font-mono text-slate-500">Career Trajectory</span>
          </div>

          <div className="space-y-8 divide-y divide-slate-200">
            {experience.map((exp) => (
              <div key={exp.id} className="pt-8 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-1">
                  <div className="text-xs font-mono text-[#1E65FF] font-bold">
                    {exp.startDate} — {exp.endDate}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-950">
                    {exp.company}
                  </h3>
                  <div className="text-xs text-slate-600">
                    {exp.role} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                </div>

                <div className="md:col-span-8 space-y-3">
                  <ul className="space-y-2">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif flex items-start gap-2">
                        <span className="text-slate-400 font-mono">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.technologies.map((t) => (
                        <span key={t} className="text-[11px] font-mono text-slate-500">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Technical Taxonomy & Skills */}
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
            <h2 className="text-base sm:text-lg font-serif font-bold uppercase tracking-widest text-slate-950">
              04 / Technical Taxonomy & Skills
            </h2>
            <span className="text-xs font-mono text-slate-500">Classifications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((cat) => (
              <div key={cat.id} className="p-5 bg-white border border-slate-300 rounded-lg space-y-3 shadow-sm">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-2">
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="px-2 py-1 rounded bg-[#FAF9F5] border border-slate-200 text-xs font-medium text-slate-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Credentials, Honors & Colophon */}
        <section className="pt-8 border-t-2 border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-950 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-700" />
              <span>05 / Academic Credentials</span>
            </h3>

            {education.map((edu) => (
              <div key={edu.id} className="p-4 bg-white border border-slate-300 rounded-lg space-y-1">
                <div className="text-xs font-mono text-[#1E65FF] font-bold">{edu.startDate} — {edu.endDate}</div>
                <div className="text-sm font-serif font-bold text-slate-950">{edu.degree} in {edu.field}</div>
                <div className="text-xs text-slate-600">{edu.institution}</div>
                {edu.honors && (
                  <div className="text-xs italic text-slate-500 pt-1 font-serif">Honors: {edu.honors}</div>
                )}
              </div>
            ))}
          </div>

          {/* Honors & Accolades */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-700" />
              <span>06 / Recognitions & Awards</span>
            </h3>

            {achievements && achievements.length > 0 ? (
              achievements.map((ach) => {
                const subtitle = [ach.issuer, (ach.date && ach.date !== 'Recent') ? ach.date : ''].filter(Boolean).join(' • ');
                return (
                  <div key={ach.id} className="p-4 bg-white border border-slate-300 rounded-lg space-y-1">
                    <div className="text-sm font-serif font-bold text-slate-950">{ach.title}</div>
                    {subtitle && (
                      <div className="text-xs text-slate-600 font-mono">{subtitle}</div>
                    )}
                    {ach.description && ach.description !== ach.title && (
                      <p className="text-xs text-slate-600 pt-1 font-serif">{ach.description}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 bg-white border border-slate-300 rounded-lg text-xs text-slate-500 font-mono">
                Verified portfolio archival record.
              </div>
            )}
          </div>

        </section>

      </div>

    </div>
  );
};
