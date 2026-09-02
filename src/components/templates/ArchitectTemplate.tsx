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
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const ArchitectTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  const phone = profile.socials.phone || '';
  const website = profile.socials.linkedin || profile.socials.github || profile.socials.website || '';
  const email = profile.socials.email || '';
  const location = profile.socials.location || '';

  return (
    <div className={`w-full bg-white text-slate-800 font-sans selection:bg-[#002D62] selection:text-white relative overflow-hidden transition-all shadow-xl rounded-2xl ${isCompact ? 'p-4 text-xs' : 'p-0 max-w-5xl mx-auto my-6 border border-slate-200'}`}>
      
      {/* Top Left Deep Royal Navy Corner Block */}
      <div className="absolute top-0 left-0 w-36 sm:w-52 h-44 sm:h-56 bg-[#002D62] pointer-events-none -z-0" />

      {/* Decorative Crescent Concentric Rings on Right Edge (Ava Morgan signature) */}
      <div className="absolute top-72 -right-8 w-32 sm:w-44 h-32 sm:h-44 pointer-events-none z-0">
        <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
          <circle cx="80" cy="80" r="70" stroke="#CBD5E1" strokeWidth="18" opacity="0.6" />
          <circle cx="80" cy="80" r="50" fill="#002D62" />
        </svg>
      </div>

      {/* Decorative Crescent Rings on Bottom Right Edge */}
      <div className="absolute -bottom-10 right-10 w-36 sm:w-48 h-36 sm:h-48 pointer-events-none z-0">
        <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
          <circle cx="80" cy="80" r="70" stroke="#002D62" strokeWidth="16" opacity="0.9" />
          <circle cx="80" cy="80" r="50" fill="#CBD5E1" opacity="0.5" />
        </svg>
      </div>

      {/* Decorative Bottom Left Corner Arc */}
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#002D62] rounded-full pointer-events-none z-0" />

      {/* Top Header Section */}
      <div className="relative z-10 pt-8 sm:pt-12 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Photo Container with Concentric Navy Ring */}
        <div className="md:col-span-5 flex justify-center md:justify-start">
          <div className="relative p-2 rounded-full border-4 border-[#002D62] bg-white shadow-xl">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-2 border-white shadow-inner"
              />
            ) : (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#002D62] flex items-center justify-center text-white font-bold text-3xl sm:text-4xl tracking-wider select-none shadow-inner">
                {profile.fullName
                  ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
                  : 'AM'}
              </div>
            )}
          </div>
        </div>

        {/* Name Capsule Badge (Signature Ava Morgan rounded banner) */}
        <div className="md:col-span-7">
          <div className="border-[3px] border-[#002D62] rounded-l-full rounded-r-2xl sm:rounded-r-none sm:border-r-0 py-4 px-6 sm:px-10 bg-slate-50/90 backdrop-blur-sm shadow-sm space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-[#002D62] tracking-wider uppercase font-['Plus_Jakarta_Sans',sans-serif]">
              {profile.fullName || 'Candidate Name'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-700 uppercase">
              {profile.headline || 'Architectural Designer'}
            </p>
          </div>
        </div>

      </div>

      {/* Two-Column Content Layout */}
      <div className="relative z-10 p-6 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 mt-4">
        
        {/* LEFT COLUMN: About Me, Contact, Skills, Languages */}
        <aside className="md:col-span-5 space-y-8">
          
          {/* ABOUT ME */}
          <div className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-black tracking-widest text-[#002D62] uppercase">
              About Me
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
              {about.summary || profile.bio || 'Creative designer and architect focused on innovative concepts, thoughtful details, and functional spaces. Passionate about creating visually appealing designs that balance aesthetics, structure, and practicality.'}
            </p>
          </div>

          {/* CONTACT */}
          <div className="space-y-3.5">
            <h2 className="text-base sm:text-lg font-black tracking-widest text-[#002D62] uppercase">
              Contact
            </h2>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {phone && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full border border-[#002D62] text-[#002D62] flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium truncate">{phone}</span>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full border border-[#002D62] text-[#002D62] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate font-medium">
                    <EmailLink email={email} className="truncate hover:text-[#002D62] hover:underline" />
                  </div>
                </div>
              )}

              {website && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full border border-[#002D62] text-[#002D62] flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <a
                    href={formatExternalUrl(website)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium truncate hover:text-[#002D62] hover:underline"
                  >
                    {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                  </a>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full border border-[#002D62] text-[#002D62] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium truncate">{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* SKILLS */}
          {skills && skills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-black tracking-widest text-[#002D62] uppercase">
                Skills
              </h2>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {skills.flatMap(cat => cat.skills).slice(0, 10).map((sk) => (
                  <li key={sk} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#002D62]" />
                    <span>{sk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ACHIEVEMENTS & LANGUAGES */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-black tracking-widest text-[#002D62] uppercase">
                Accreditations
              </h2>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {achievements.map((ach) => (
                  <li key={ach.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#002D62]" />
                    <span className="font-medium">{ach.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </aside>

        {/* RIGHT COLUMN: Education, Work Experience, Projects */}
        <main className="md:col-span-7 space-y-10">
          
          {/* EDUCATION */}
          {education && education.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base sm:text-lg font-black tracking-widest text-[#002D62] uppercase">
                Education
              </h2>

              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5 text-xs sm:text-sm">
                    <div className="font-bold text-[#002D62] tracking-wide uppercase">
                      {edu.degree}
                    </div>
                    <div className="text-slate-700 font-medium">
                      {edu.institution}
                    </div>
                    {(edu.startDate || edu.endDate) && (
                      <div className="text-xs text-slate-500 font-mono">
                        {[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* WORK EXPERIENCE */}
          {experience && experience.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black tracking-widest text-[#002D62] uppercase">
                  Work Experience
                </h2>
                <span className="text-xs font-mono text-slate-500 font-medium">
                  {about.yearsOfExperience > 0 ? `${about.yearsOfExperience}+ Years Experience` : `${experience.length} Roles`}
                </span>
              </div>

              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="font-bold text-[#002D62] tracking-wide uppercase text-sm sm:text-base">
                      {exp.role}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800">
                      {exp.company}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      {exp.startDate} - {exp.endDate}
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

          {/* SELECTED PROJECTS */}
          {projects && projects.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base sm:text-lg font-black tracking-widest text-[#002D62] uppercase">
                Featured Works & Projects
              </h2>

              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#002D62] text-sm flex items-center gap-1.5">
                        {proj.title}
                        {proj.link && (
                          <a href={formatExternalUrl(proj.link)} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#002D62]">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h3>
                      {proj.metrics && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-white text-[#002D62] rounded border border-slate-200">
                          {proj.metrics}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* REFERENCE / FOOTER */}
          <section className="space-y-1.5 pt-4 border-t border-slate-200">
            <h2 className="text-base sm:text-lg font-black tracking-widest text-[#002D62] uppercase">
              Reference
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 italic">
              Professional references, client testimonials, and portfolio case studies available upon request.
            </p>
          </section>

        </main>
      </div>

    </div>
  );
};
