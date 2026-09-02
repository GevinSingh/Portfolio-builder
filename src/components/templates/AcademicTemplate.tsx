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
  Twitter, 
  User, 
  Languages, 
  Check, 
  Settings 
} from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  const phone = profile.socials.phone || '';
  const website = profile.socials.linkedin || profile.socials.github || profile.socials.website || '';
  const email = profile.socials.email || '';
  const location = profile.socials.location || '';

  return (
    <div className={`w-full bg-white text-slate-900 font-sans selection:bg-[#363F4D] selection:text-white relative overflow-hidden transition-all shadow-xl rounded-2xl ${isCompact ? 'p-4 text-xs' : 'p-0 max-w-5xl mx-auto my-6 border border-slate-200'}`}>
      
      {/* ========================================================================= */}
      {/* TOP HEADER: Dark Charcoal Navy Banner with Prominent Name & Subtitle      */}
      {/* ========================================================================= */}
      <div className="bg-[#363F4D] text-white pt-10 sm:pt-14 pb-8 sm:pb-12 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative">
        
        {/* Placeholder spacer for the overlapping Arch Photo */}
        <div className="hidden md:block md:col-span-4 lg:col-span-4" />

        {/* Name and Headline in Clean White Typography */}
        <div className="md:col-span-8 lg:col-span-8 space-y-2 text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl font-black tracking-wide text-white font-['Plus_Jakarta_Sans',sans-serif]">
            {profile.fullName || 'Candidate Name'}
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-300 uppercase">
            {profile.headline || 'Bachelor of Arts in Education'}
          </p>

          {/* Social Icons row */}
          <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
            {profile.socials.linkedin && (
              <a
                href={formatExternalUrl(profile.socials.linkedin, 'linkedin')}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-white hover:text-[#363F4D] text-slate-200 transition-colors"
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
                className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-white hover:text-[#363F4D] text-slate-200 transition-colors"
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
                className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-white hover:text-[#363F4D] text-slate-200 transition-colors"
                title="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

      </div>

      {/* Main Two-Column Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[850px] relative">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Matte Silver Sidebar (Arch Photo, Contact, Languages, Skills) */}
        {/* ========================================================================= */}
        <aside className="md:col-span-4 lg:col-span-4 bg-[#DCE1E4] text-slate-800 p-6 sm:p-8 space-y-8 relative flex flex-col justify-between">
          
          {/* Overlapping Arch Portrait Photo (Signature Galena Micheal style) */}
          <div className="relative -mt-24 sm:-mt-32 mb-6 flex justify-center z-20">
            <div className="relative p-2 rounded-t-full rounded-b-[40px] border-[8px] border-[#CBD2D7] bg-[#DCE1E4] shadow-2xl overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-36 h-48 sm:w-44 sm:h-56 rounded-t-full rounded-b-[32px] object-cover"
                />
              ) : (
                <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-t-full rounded-b-[32px] bg-[#363F4D] flex flex-col items-center justify-center text-white font-bold text-3xl select-none">
                  <span>
                    {profile.fullName
                      ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
                      : 'GM'}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-300 font-normal mt-2">Dossier</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            
            {/* CONTACT SECTION */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#363F4D] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-3 h-3" />
                </div>
                <h2 className="text-sm font-black tracking-widest text-[#363F4D] uppercase">
                  Contact
                </h2>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 pl-8">
                {location && (
                  <p className="leading-relaxed">
                    {location}
                  </p>
                )}

                {phone && (
                  <p className="font-semibold">
                    {phone}
                  </p>
                )}

                {email && (
                  <div className="truncate font-semibold">
                    <EmailLink email={email} className="truncate hover:text-[#363F4D] hover:underline" />
                  </div>
                )}

                {website && (
                  <div className="truncate font-semibold">
                    <a
                      href={formatExternalUrl(website)}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate hover:text-[#363F4D] hover:underline"
                    >
                      {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* LANGUAGES SECTION */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#363F4D] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Languages className="w-3 h-3" />
                </div>
                <h2 className="text-sm font-black tracking-widest text-[#363F4D] uppercase">
                  Languages
                </h2>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 pl-8">
                {[
                  { name: 'English', lineW: 'w-24' },
                  { name: 'Spanish', lineW: 'w-16' },
                  { name: 'French', lineW: 'w-12' },
                ].map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between gap-2">
                    <span className="font-medium">{lang.name}</span>
                    <div className="h-0.5 bg-[#363F4D]/80 rounded-full w-20 sm:w-28" />
                  </div>
                ))}
              </div>
            </div>

            {/* SKILLS CHECKLIST SECTION */}
            {skills && skills.length > 0 && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#363F4D] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Settings className="w-3 h-3" />
                  </div>
                  <h2 className="text-sm font-black tracking-widest text-[#363F4D] uppercase">
                    Skills
                  </h2>
                </div>

                <div className="space-y-2 text-xs text-slate-700 pl-8">
                  {skills.flatMap(cat => cat.skills).slice(0, 8).map((sk) => (
                    <div key={sk} className="flex items-start gap-2">
                      <span className="font-bold text-[#363F4D] shrink-0 mt-0.5">✓</span>
                      <span className="font-medium leading-tight">{sk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Branding */}
          <div className="pt-6 border-t border-slate-300 text-[10px] font-mono tracking-widest uppercase text-slate-600 text-center">
            {profile.socials.website ? profile.socials.website.replace(/^https?:\/\//, '') : 'WWW.TECHHUMANS.COM'}
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Clean White Column (Summary, Education, Experience, Awards) */}
        {/* ========================================================================= */}
        <main className="md:col-span-8 lg:col-span-8 p-6 sm:p-12 space-y-9">
          
          {/* SUMMARY */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#363F4D] text-white flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-3 h-3" />
              </div>
              <h2 className="text-base font-black tracking-widest text-[#363F4D] uppercase">
                Summary
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8 text-justify">
              {about.summary || profile.bio || 'Motivated professional with proven experience developing structured workflows, leading projects, and improving team performance across multidisciplinary domains. Skilled in execution, documentation, and stakeholder collaboration.'}
            </p>
          </section>

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#363F4D] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <GraduationCap className="w-3 h-3" />
                </div>
                <h2 className="text-base font-black tracking-widest text-[#363F4D] uppercase">
                  Education
                </h2>
              </div>

              <div className="space-y-3 pl-8">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5 text-xs sm:text-sm">
                    <div className="font-black text-slate-900">
                      {edu.institution}
                      {edu.location && <span className="font-normal text-slate-500">, {edu.location}</span>}
                    </div>
                    <div className="italic text-slate-700">
                      {edu.degree}
                    </div>
                    {(edu.startDate || edu.endDate) && (
                      <div className="text-xs font-mono text-slate-500">
                        {[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCE */}
          {experience && experience.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#363F4D] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Briefcase className="w-3 h-3" />
                </div>
                <h2 className="text-base font-black tracking-widest text-[#363F4D] uppercase">
                  Experience
                </h2>
              </div>

              <div className="space-y-6 pl-8">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="text-xs sm:text-sm font-medium text-slate-900">
                      <span>{exp.company}, </span>
                      <span className="font-black">{exp.role}</span>
                    </div>

                    <div className="text-xs font-mono text-slate-500">
                      {exp.startDate} – {exp.endDate}
                    </div>

                    {exp.description && exp.description.length > 0 && (
                      <ul className="space-y-1 text-xs text-slate-600 leading-relaxed pt-1">
                        {exp.description.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-bold text-slate-900 mt-0.5 text-[10px]">▪</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS & HONORS */}
          {achievements && achievements.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#363F4D] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-3 h-3" />
                </div>
                <h2 className="text-base font-black tracking-widest text-[#363F4D] uppercase">
                  Certifications & Honors
                </h2>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 pl-8">
                {achievements.map((ach) => (
                  <li key={ach.id} className="flex items-start gap-2">
                    <span className="font-bold text-slate-900 mt-0.5 text-[10px]">▪</span>
                    <div>
                      <span className="font-bold text-slate-900">{ach.title}</span>
                      {ach.issuer && <span className="text-slate-600"> ({ach.issuer})</span>}
                      {ach.date && <span className="text-slate-500 font-mono">, {ach.date}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FEATURED PROJECTS */}
          {projects && projects.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#363F4D] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FolderGit2 className="w-3 h-3" />
                </div>
                <h2 className="text-base font-black tracking-widest text-[#363F4D] uppercase">
                  Featured Initiatives
                </h2>
              </div>

              <div className="space-y-2.5 pl-8">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        {proj.title}
                        {proj.link && (
                          <a href={formatExternalUrl(proj.link)} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#363F4D]">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h3>
                      {proj.metrics && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-white text-[#363F4D] rounded border border-slate-200">
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

          {/* Bottom Horizontal Accent Bar */}
          <div className="pt-6 border-b-4 border-[#363F4D] w-full" />

        </main>
      </div>

    </div>
  );
};
