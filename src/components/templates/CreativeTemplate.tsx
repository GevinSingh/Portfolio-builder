import React from 'react';
import { PortfolioData } from '../../types';
import { Sparkles, ArrowUpRight, Github, Linkedin, Twitter, Mail, Heart, Palette, Award, Briefcase } from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  return (
    <div className={`w-full bg-[#12071f] text-slate-100 font-sans selection:bg-pink-500 selection:text-white transition-all ${isCompact ? 'p-3 text-xs' : 'p-6 sm:p-12 max-w-5xl mx-auto'}`}>
      
      {/* Background ambient color spheres */}
      <div className="relative">
        
        {/* Hero Section */}
        <header className="relative z-10 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-indigo-950/60 border border-pink-500/20 backdrop-blur-2xl shadow-2xl overflow-hidden mb-12">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
                <span>Creative Studio & Portfolio</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
                Hello, I'm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400">
                  {profile.fullName}
                </span>
              </h1>

              <p className="text-base sm:text-xl text-purple-200/90 font-light leading-relaxed">
                {profile.headline}
              </p>

              {profile.statusText && (
                <div className="text-xs text-pink-300/90 font-medium">
                  {profile.statusText}
                </div>
              )}

              {/* Socials */}
              <div className="flex items-center gap-3 pt-2">
                {profile.socials.github && (
                  <a href={formatExternalUrl(profile.socials.github, 'github')} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-300 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.linkedin && (
                  <a href={formatExternalUrl(profile.socials.linkedin, 'linkedin')} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-300 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.twitter && (
                  <a href={formatExternalUrl(profile.socials.twitter, 'twitter')} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-300 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.email && (
                  <EmailLink
                    email={profile.socials.email}
                    className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-300 transition-colors"
                  />
                )}
              </div>
            </div>

            <div className="shrink-0 relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-2xl shadow-pink-500/30 rotate-2 hover:rotate-0 transition-transform">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover rounded-[22px]"
                  />
                ) : (
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-pink-300 select-none">
                    <span className="text-3xl sm:text-4xl font-black font-['Space_Grotesk']">
                      {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'CR'}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400 mt-1">Creative</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-sm text-purple-200/80 leading-relaxed max-w-3xl">
            {profile.bio}
          </div>
        </header>

        {/* Featured Projects Gallery */}
        {projects.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-pink-400">Featured Showcase</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] mt-1">Impactful Inventions</h2>
              </div>
              <span className="text-xs text-purple-300 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30">
                {projects.length} {projects.length === 1 ? 'Work' : 'Works'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 backdrop-blur-xl p-6 hover:border-pink-500/50 hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-xs font-mono font-bold text-pink-400">0{idx + 1} //</span>
                      {proj.link && (
                        <a href={formatExternalUrl(proj.link)} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 group-hover:bg-pink-500 group-hover:text-white text-slate-300 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors mt-2 font-['Space_Grotesk']">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-purple-300/80 mt-1 font-medium">{proj.role}</p>
                    
                    <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    {proj.metrics && (
                      <div className="text-xs font-semibold text-pink-300 mb-3 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                        <span>{proj.metrics}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((t) => (
                        <span key={t} className="px-2.5 py-1 text-xs rounded-lg bg-pink-500/10 text-pink-200 border border-pink-500/20 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Superpowers */}
        <section className="mb-14">
          <div className="mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-pink-400">Toolkit</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] mt-1">Creative Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {skills.map((cat) => (
              <div key={cat.id} className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/30 to-slate-950/60 border border-purple-500/20">
                <h4 className="text-sm font-bold text-pink-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-pink-400" />
                  {cat.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span key={s} className="px-3 py-1.5 text-xs rounded-xl bg-purple-900/30 text-purple-100 border border-purple-500/20 hover:border-pink-500/50 transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="mb-14">
          <div className="mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-pink-400">Career</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] mt-1">Studio History</h2>
          </div>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="p-6 rounded-2xl bg-slate-950/40 border border-white/10 hover:border-pink-500/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h4 className="text-lg font-bold text-white">{exp.role} <span className="text-pink-400 font-medium">@ {exp.company}</span></h4>
                  <span className="text-xs font-mono text-purple-300">{exp.startDate} - {exp.endDate}</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                  {exp.description.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-pink-400" /> Education
            </h3>
            {education.map((edu) => (
              <div key={edu.id} className="p-4 rounded-xl bg-purple-950/20 border border-white/5 space-y-1">
                <div className="font-bold text-white text-sm">{edu.institution}</div>
                <div className="text-xs text-purple-200">{edu.degree} · {edu.field}</div>
                <div className="text-xs text-slate-400">{edu.startDate} - {edu.endDate} {edu.gpa && `• GPA ${edu.gpa}`}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-pink-400" /> Honors & Awards
            </h3>
            <div className="space-y-3">
              {achievements.map((ach) => {
                const subtitle = [ach.issuer, (ach.date && ach.date !== 'Recent') ? ach.date : ''].filter(Boolean).join(' • ');
                return (
                  <div key={ach.id} className="p-4 rounded-xl bg-purple-950/20 border border-white/5 space-y-1">
                    <div className="font-bold text-pink-300 text-sm">{ach.title}</div>
                    {subtitle && <div className="text-xs text-slate-300">{subtitle}</div>}
                    {ach.description && ach.description !== ach.title && (
                      <div className="text-xs text-slate-400">{ach.description}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
