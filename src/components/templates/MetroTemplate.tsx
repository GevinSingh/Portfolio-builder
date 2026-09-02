import React from 'react';
import { PortfolioData } from '../../types';
import { 
  Phone, 
  Globe, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  FolderGit2, 
  Award, 
  ArrowUpRight, 
  Github, 
  Linkedin, 
  Twitter 
} from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const MetroTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  const phone = profile.socials.phone || '';
  const website = profile.socials.linkedin || profile.socials.github || profile.socials.website || '';
  const email = profile.socials.email || '';
  const location = profile.socials.location || '';

  return (
    <div className={`w-full bg-white text-slate-900 font-sans selection:bg-[#0E1726] selection:text-white relative overflow-hidden transition-all shadow-xl rounded-2xl ${isCompact ? 'p-4 text-xs' : 'p-0 max-w-5xl mx-auto my-6 border border-slate-200'}`}>
      
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[900px]">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Deep Obsidian Sidebar with Top Photo & Contact               */}
        {/* ========================================================================= */}
        <aside className="md:col-span-4 lg:col-span-4 bg-[#0E1726] text-white flex flex-col justify-between">
          
          <div>
            {/* Full-width Portrait Photo Header */}
            <div className="w-full aspect-[4/5] bg-slate-900 overflow-hidden relative border-b border-slate-800">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 font-bold text-4xl select-none">
                  <span>{profile.fullName ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'HM'}</span>
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-normal mt-2">Digital Resume</span>
                </div>
              )}
            </div>

            {/* Candidate Identity Block */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1.5 pb-4 border-b border-slate-700/60">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  {profile.fullName || 'Candidate Name'}
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-slate-300 uppercase">
                  {profile.headline || 'Graphic Designer'}
                </p>

                {/* Social Badges Row */}
                <div className="flex items-center gap-2 pt-3">
                  {profile.socials.linkedin && (
                    <a
                      href={formatExternalUrl(profile.socials.linkedin, 'linkedin')}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.socials.github && (
                    <a
                      href={formatExternalUrl(profile.socials.github, 'github')}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.socials.twitter && (
                    <a
                      href={formatExternalUrl(profile.socials.twitter, 'twitter')}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* CONTACT Section */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xs sm:text-sm font-black tracking-widest text-white uppercase">
                    Contact
                  </h2>
                  <div className="w-8 h-0.5 bg-slate-400" />
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  {email && (
                    <div className="flex items-start gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div className="truncate">
                        <span className="block text-[10px] uppercase text-slate-400 font-bold">Email</span>
                        <EmailLink email={email} className="truncate hover:text-white hover:underline" />
                      </div>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-start gap-2.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[10px] uppercase text-slate-400 font-bold">Phone</span>
                        <span>{phone}</span>
                      </div>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[10px] uppercase text-slate-400 font-bold">Address</span>
                        <span>{location}</span>
                      </div>
                    </div>
                  )}

                  {website && (
                    <div className="flex items-start gap-2.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div className="truncate">
                        <span className="block text-[10px] uppercase text-slate-400 font-bold">Website</span>
                        <a href={formatExternalUrl(website)} target="_blank" rel="noreferrer" className="truncate hover:text-white hover:underline">
                          {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CORE COMPETENCIES / LANGUAGES with Progress Bars */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <h2 className="text-xs sm:text-sm font-black tracking-widest text-white uppercase">
                    Competencies
                  </h2>
                  <div className="w-8 h-0.5 bg-slate-400" />
                </div>

                <div className="space-y-2.5">
                  {(skills[0]?.skills || ['Communication', 'Leadership', 'Strategic Planning']).slice(0, 4).map((item, idx) => {
                    const widthPct = [90, 80, 85, 75][idx % 4];
                    return (
                      <div key={item} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>{item}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{widthPct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-slate-300 rounded-full" style={{ width: `${widthPct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          <div className="p-6 sm:p-8 text-[10px] text-slate-500 font-mono border-t border-slate-800/80">
            Professional Dossier • Tech Humans
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Clean Minimal White Column with Vertical Timelines          */}
        {/* ========================================================================= */}
        <main className="md:col-span-8 lg:col-span-8 p-6 sm:p-12 space-y-10">
          
          {/* PROFILE */}
          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black tracking-widest text-slate-900 uppercase">
                Profile
              </h2>
              <div className="w-10 h-0.5 bg-slate-900" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
              {about.summary || profile.bio || 'Accomplished professional with experience across end-to-end design, execution, and leadership. Dedicated to delivering high quality deliverables that blend aesthetics, performance, and business objectives.'}
            </p>
          </section>

          {/* EXPERIENCE (Continuous Timeline Track with Milestone Dots) */}
          {experience && experience.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-black tracking-widest text-slate-900 uppercase">
                    Experience
                  </h2>
                  <div className="w-10 h-0.5 bg-slate-900" />
                </div>
                <span className="text-xs font-mono text-slate-500 font-medium">
                  {about.yearsOfExperience > 0 ? `${about.yearsOfExperience}+ Years Track` : `${experience.length} Roles`}
                </span>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative space-y-1.5">
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-200" />

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-mono text-slate-500">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-600">
                      {exp.company}
                    </div>

                    {exp.description && exp.description.length > 0 && (
                      <div className="space-y-1 text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                        {exp.description.map((point, idx) => (
                          <p key={idx}>{point}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION (Timeline) */}
          {education && education.length > 0 && (
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-black tracking-widest text-slate-900 uppercase">
                  Education
                </h2>
                <div className="w-10 h-0.5 bg-slate-900" />
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200">
                {education.map((edu) => (
                  <div key={edu.id} className="relative space-y-1">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-200" />

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">
                        {edu.institution}
                      </h3>
                      {(edu.startDate || edu.endDate) && (
                        <span className="text-xs font-mono text-slate-500">
                          {[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      {edu.degree}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EXPERTISE / TECHNICAL SKILLS with Dual-Tone Bars */}
          {skills && skills.length > 0 && (
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-black tracking-widest text-slate-900 uppercase">
                  Expertise
                </h2>
                <div className="w-10 h-0.5 bg-slate-900" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.flatMap(cat => cat.skills).slice(0, 8).map((sk, idx) => {
                  const p = [85, 90, 75, 80, 95, 70, 85, 80][idx % 8];
                  return (
                    <div key={sk} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-800">
                        <span>{sk}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{p}%</span>
                      </div>
                      <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                        <div className="h-full bg-slate-900 rounded" style={{ width: `${p}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* FEATURED WORK SHOWCASE */}
          {projects && projects.length > 0 && (
            <section className="space-y-4 pt-2">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-black tracking-widest text-slate-900 uppercase">
                  Featured Projects
                </h2>
                <div className="w-10 h-0.5 bg-slate-900" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-400 space-y-1.5 transition-all">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        {proj.title}
                        {proj.link && (
                          <a href={formatExternalUrl(proj.link)} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h3>
                      {proj.metrics && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded">
                          {proj.metrics}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>

    </div>
  );
};
