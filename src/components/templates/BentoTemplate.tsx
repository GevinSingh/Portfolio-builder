import React from 'react';
import { PortfolioData } from '../../types';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FolderGit2, 
  Sparkles, 
  ArrowUpRight,
  Code2,
  Cpu,
  Layers,
  Terminal,
  Send,
  CheckCircle2,
  ChevronRight,
  Globe,
  Rocket,
  TrendingUp
} from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const BentoTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  return (
    <div className={`w-full bg-[#090D16] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-all ${isCompact ? 'p-3 text-xs' : 'p-4 sm:p-8 lg:p-12 max-w-6xl mx-auto'}`}>
      
      {/* Background ambient lighting */}
      <div className="relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Tile 1: Profile Hero Card (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-[#111726]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/15 via-transparent to-transparent rounded-full pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>Bento Studio Showcase</span>
                </div>

                {profile.statusText && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{profile.statusText}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/15 shadow-md shadow-black/40 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border border-white/20 shadow-md shadow-black/40 shrink-0 flex items-center justify-center text-white font-black text-2xl sm:text-3xl select-none">
                    {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'ME'}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {profile.fullName}
                  </h1>
                  <p className="text-sm sm:text-base text-indigo-200/90 font-medium mt-1">
                    {profile.headline}
                  </p>
                  {profile.socials.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{profile.socials.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl pt-2">
                {profile.bio}
              </p>
            </div>

            {/* Socials Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {profile.socials.github && (
                  <a
                    href={formatExternalUrl(profile.socials.github, 'github')}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.linkedin && (
                  <a
                    href={formatExternalUrl(profile.socials.linkedin, 'linkedin')}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.twitter && (
                  <a
                    href={formatExternalUrl(profile.socials.twitter, 'twitter')}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.email && (
                  <EmailLink
                    email={profile.socials.email}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  />
                )}
              </div>

              <div className="text-xs font-mono text-slate-400">
                <span className="text-indigo-400 font-bold">{projects.length > 0 ? projects.length : experience.length}</span> {projects.length > 0 ? (projects.length === 1 ? 'Showcase Work' : 'Showcase Works') : 'Career Engagements'}
              </div>
            </div>
          </div>

          {/* Tile 2: Quick Metrics & Focus Card */}
          <div className="rounded-3xl p-6 bg-[#111726]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <TrendingUp className="w-4 h-4" />
                <span>Career Impact</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {about.yearsOfExperience > 0 ? `${about.yearsOfExperience}+` : `${experience.length}`}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium uppercase">
                    {about.yearsOfExperience > 0 ? 'Years Experience' : 'Industry Roles'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                    {projects.length > 0 ? projects.length : experience.length}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium uppercase">
                    {projects.length > 0 ? (projects.length === 1 ? 'Major Project' : 'Major Projects') : 'Key Milestones'}
                  </div>
                </div>
              </div>

              {about.highlights && about.highlights.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Flagship Highlights</div>
                  {about.highlights.slice(0, 2).map((hl, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Status: Active</span>
              <span className="text-emerald-400">● Open for Opportunities</span>
            </div>
          </div>

          {/* Tile 3: Skills & Technology Matrix (Spans Full or 2 Cols) */}
          <div className="lg:col-span-3 rounded-3xl p-6 sm:p-8 bg-[#111726]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6 hover:border-indigo-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Cpu className="w-4 h-4" />
                <span>Technical Stack & Core Competencies</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{skills.reduce((acc, c) => acc + c.skills.length, 0)} Skills</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {skills.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tile 4: Featured Projects Grid (Spans Full on lg) */}
          {projects.length > 0 && (
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                  <Rocket className="w-4 h-4" />
                  <span>Featured Project Case Studies</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Interactive Cards</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-3xl p-6 sm:p-7 bg-[#111726]/80 border border-white/10 hover:border-indigo-500/50 backdrop-blur-xl shadow-xl flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-[11px] font-mono font-medium">
                            <FolderGit2 className="w-3 h-3 text-indigo-400" />
                            <span>{proj.role || 'Featured Work'}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {proj.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {proj.github && (
                            <a
                              href={formatExternalUrl(proj.github, 'github')}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {proj.link && (
                            <a
                              href={formatExternalUrl(proj.link)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {proj.description}
                      </p>

                      {proj.metrics && (
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-indigo-300 font-mono">
                          ⚡ {proj.metrics}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                      {proj.technologies.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tile 5: Career Experience (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-[#111726]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6 hover:border-indigo-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Briefcase className="w-4 h-4" />
                <span>Work Experience & Trajectory</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{experience.length} Positions</span>
            </div>

            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-indigo-500/30 space-y-2">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#111726] border-2 border-indigo-400" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 w-fit">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </div>

                  <ul className="space-y-1.5 pt-1">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 text-xs">▹</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.technologies.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tile 6: Education & Honors (Spans 1 column on lg) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#111726]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <GraduationCap className="w-4 h-4" />
                <span>Education & Credentials</span>
              </div>

              {education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                  <div className="text-xs font-mono text-indigo-300">{edu.startDate} - {edu.endDate}</div>
                  <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                  <div className="text-xs text-slate-400">{edu.field}</div>
                  <div className="text-xs text-slate-300 font-medium">{edu.institution}</div>
                  {edu.honors && (
                    <div className="text-[11px] text-amber-300/90 pt-1 font-mono">
                      ★ {edu.honors}
                    </div>
                  )}
                </div>
              ))}

              {achievements && achievements.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Award className="w-4 h-4" />
                    <span>Key Recognitions</span>
                  </div>
                  {achievements.map((ach) => {
                    const subtitle = [ach.issuer, (ach.date && ach.date !== 'Recent') ? ach.date : ''].filter(Boolean).join(' • ');
                    return (
                      <div key={ach.id} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                        <div className="text-xs font-bold text-white">{ach.title}</div>
                        {subtitle && <div className="text-[11px] text-amber-300/90">{subtitle}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 text-center">
              <span className="text-xs text-slate-400 font-mono">Tech Humans Verified Architecture</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
