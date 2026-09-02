import React from 'react';
import { PortfolioData } from '../../types';
import { Mail, MapPin, ExternalLink, Github, Linkedin, Twitter, ArrowUpRight, Award, GraduationCap, Briefcase } from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  return (
    <div className={`w-full bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-900 selection:text-white transition-all ${isCompact ? 'p-4 text-xs' : 'p-6 sm:p-12 max-w-4xl mx-auto'}`}>
      
      {/* Top Header */}
      <header className="border-b border-slate-200 pb-8 sm:pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-serif tracking-tight font-medium text-slate-950">
              {profile.fullName}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-light max-w-xl">
              {profile.headline}
            </p>
            {profile.socials.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.socials.location}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-300 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 border-2 border-slate-300 shadow-sm flex items-center justify-center text-slate-800 font-bold text-xl sm:text-2xl select-none">
                {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'ME'}
              </div>
            )}
            {/* Social Links */}
            <div className="flex items-center gap-2 text-slate-600">
              {profile.socials.github && (
                <a href={formatExternalUrl(profile.socials.github, 'github')} target="_blank" rel="noreferrer" className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socials.linkedin && (
                <a href={formatExternalUrl(profile.socials.linkedin, 'linkedin')} target="_blank" rel="noreferrer" className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socials.twitter && (
                <a href={formatExternalUrl(profile.socials.twitter, 'twitter')} target="_blank" rel="noreferrer" className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socials.email && (
                <EmailLink
                  email={profile.socials.email}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors"
                />
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-6 text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
          {profile.bio}
        </p>
      </header>

      {/* Main Content Sections */}
      <div className="mt-10 space-y-12">
        
        {/* Featured Projects */}
        {/* Featured Projects */}
        {projects.length > 0 && (
          <section>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-500">Selected Work</h2>
              <span className="text-xs text-slate-500">{projects.length} {projects.length === 1 ? 'Project' : 'Projects'}</span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-slate-900 flex items-center gap-1.5">
                        {proj.title}
                        {proj.link && <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />}
                      </h3>
                      {proj.role && <p className="text-xs text-slate-500 mt-0.5">{proj.role}</p>}
                    </div>
                    {proj.metrics && (
                      <span className="hidden sm:inline-block text-xs font-mono px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                        {proj.metrics}
                      </span>
                    )}
                  </div>
                  
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      {proj.technologies.map((tech) => (
                        <span key={tech} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-500">Professional Journey</h2>
              <span className="text-xs text-slate-500">
                {about.yearsOfExperience > 0 ? `${about.yearsOfExperience}+ Years` : `${experience.length} ${experience.length === 1 ? 'Role' : 'Roles'}`}
              </span>
            </div>

          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-slate-200 space-y-1.5">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-900" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-900">{exp.role} · <span className="text-slate-700 font-normal">{exp.company}</span></span>
                  <span className="text-slate-500 font-mono text-xs">{exp.startDate} — {exp.endDate}</span>
                </div>
                {exp.location && <div className="text-xs text-slate-500">{exp.location}</div>}
                
                <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                  {exp.description.map((point, idx) => (
                    <li key={idx} className="leading-relaxed">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Skills */}
        <section>
          <div className="pb-3 border-b border-slate-200 mb-6">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-500">Expertise & Skills</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {skills.map((cat) => (
              <div key={cat.id} className="p-4 rounded-xl bg-white border border-slate-200">
                <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2.5">{cat.category}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-4 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <div className="font-semibold text-slate-900 text-sm">{edu.institution}</div>
                <div className="text-xs text-slate-600">{edu.degree} in {edu.field}</div>
                <div className="text-xs text-slate-500 font-mono">{edu.startDate} — {edu.endDate} {edu.gpa && `• GPA ${edu.gpa}`}</div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Honors & Awards
            </h2>
            <div className="space-y-3">
              {achievements.map((ach) => {
                const subtitle = [ach.issuer, (ach.date && ach.date !== 'Recent') ? ach.date : ''].filter(Boolean).join(' • ');
                return (
                  <div key={ach.id} className="text-xs space-y-0.5">
                    <div className="font-medium text-slate-900">{ach.title}</div>
                    {subtitle && <div className="text-slate-500">{subtitle}</div>}
                    {ach.description && ach.description !== ach.title && (
                      <div className="text-slate-500">{ach.description}</div>
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
