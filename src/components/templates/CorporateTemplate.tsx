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

export const CorporateTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  // Derive phone, website, email, location from profile
  const phone = profile.socials.phone || '';
  const website = profile.socials.linkedin || profile.socials.github || '';
  const email = profile.socials.email || '';
  const location = profile.socials.location || '';

  // Get primary and secondary skills flat list
  const allSkills = skills.flatMap(cat => cat.skills);

  return (
    <div className={`w-full bg-white text-slate-800 font-sans selection:bg-[#162544] selection:text-white relative overflow-hidden transition-all shadow-xl rounded-2xl ${isCompact ? 'p-4 text-xs' : 'p-0 max-w-5xl mx-auto my-6 border border-slate-200'}`}>
      
      {/* Top-Right Decorative Geometric Navy Chevron & Polygon Mesh */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-36 sm:h-44 pointer-events-none overflow-hidden -z-0">
        {/* Angled Navy Top Bar */}
        <svg viewBox="0 0 400 160" className="w-full h-full object-cover preserve-3d" fill="none">
          <path d="M120 0 L400 0 L400 65 L280 65 L240 100 L0 0 Z" fill="#162544" />
          <path d="M220 0 L400 0 L400 40 L280 40 Z" fill="#203358" opacity="0.6" />
          {/* Subtle Geometric Wireframe Polygons */}
          <polygon points="260,30 310,70 280,120 230,80" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.6" />
          <polygon points="310,70 380,50 350,110 280,120" stroke="#E2E8F0" strokeWidth="1" fill="none" opacity="0.7" />
          <polygon points="280,120 350,110 330,155 250,145" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.5" />
          <line x1="260" y1="30" x2="350" y2="110" stroke="#E2E8F0" strokeWidth="0.8" opacity="0.4" />
        </svg>
      </div>

      {/* Main Two-Column Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Sidebar (Profile Photo, Contact, Education, Expertise)       */}
        {/* ========================================================================= */}
        <aside className="md:col-span-4 lg:col-span-5 bg-[#F8FAFC]/90 border-r border-slate-200 p-6 sm:p-10 flex flex-col justify-between relative">
          
          <div className="space-y-8">
            
            {/* Circular Profile Photo with Thick Dark Navy Ring */}
            <div className="flex justify-center md:justify-start pt-2">
              <div className="relative">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-[6px] sm:border-[8px] border-[#162544] shadow-xl"
                  />
                ) : (
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#162544] border-[6px] sm:border-[8px] border-[#162544] shadow-xl flex items-center justify-center text-white font-bold text-3xl sm:text-4xl tracking-wider select-none">
                    {profile.fullName
                      ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
                      : 'TH'}
                  </div>
                )}

                {/* Subtle verified badge */}
                <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CONTACT Section */}
            <div className="space-y-4">
              <div className="pb-1.5 border-b-2 border-[#162544]">
                <h2 className="text-base sm:text-lg font-black tracking-widest text-[#162544] uppercase">
                  Contact
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                {/* Phone */}
                {phone && (
                  <div className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-[#162544] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-medium truncate">{phone}</span>
                  </div>
                )}

                {/* Website / LinkedIn / GitHub */}
                {website && (
                  <div className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-[#162544] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Globe className="w-4 h-4" />
                    </div>
                    <a
                      href={formatExternalUrl(website)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium truncate hover:text-[#162544] hover:underline"
                    >
                      {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </a>
                  </div>
                )}

                {/* Email */}
                {email && (
                  <div className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-[#162544] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate font-medium">
                      <EmailLink email={email} className="truncate hover:text-[#162544] hover:underline" />
                    </div>
                  </div>
                )}

                {/* Location */}
                {location && (
                  <div className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-[#162544] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-medium truncate">{location}</span>
                  </div>
                )}

                {/* Social Links Row */}
                <div className="flex items-center gap-2 pt-2">
                  {profile.socials.linkedin && (
                    <a
                      href={formatExternalUrl(profile.socials.linkedin, 'linkedin')}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-200 hover:bg-[#162544] hover:text-white text-slate-700 transition-colors"
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
                      className="p-2 rounded-lg bg-slate-200 hover:bg-[#162544] hover:text-white text-slate-700 transition-colors"
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
                      className="p-2 rounded-lg bg-slate-200 hover:bg-[#162544] hover:text-white text-slate-700 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* EDUCATION Section */}
            {education && education.length > 0 && (
              <div className="space-y-4">
                <div className="pb-1.5 border-b-2 border-[#162544]">
                  <h2 className="text-base sm:text-lg font-black tracking-widest text-[#162544] uppercase">
                    Education
                  </h2>
                </div>

                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-0.5 text-xs sm:text-sm">
                      <div className="font-bold text-[#162544] leading-snug">
                        {edu.degree}
                      </div>
                      <div className="text-slate-600 font-medium">
                        {edu.institution}
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <div className="text-xs text-slate-500 font-mono">
                          {[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}
                        </div>
                      )}
                      {edu.field && edu.field !== edu.degree && (
                        <div className="text-xs text-slate-500 italic pt-0.5">
                          {edu.field}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERTISE / SKILLS Section */}
            {skills && skills.length > 0 && (
              <div className="space-y-4">
                <div className="pb-1.5 border-b-2 border-[#162544]">
                  <h2 className="text-base sm:text-lg font-black tracking-widest text-[#162544] uppercase">
                    Expertise
                  </h2>
                </div>

                <div className="space-y-3">
                  {skills.map((cat) => (
                    <div key={cat.id} className="space-y-1.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#162544]">
                        {cat.category}
                      </div>
                      <ul className="space-y-1 text-xs sm:text-sm text-slate-600">
                        {cat.skills.slice(0, 5).map((sk) => (
                          <li key={sk} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#162544]" />
                            <span>{sk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACHIEVEMENTS / HONORS Section */}
            {achievements && achievements.length > 0 && (
              <div className="space-y-4">
                <div className="pb-1.5 border-b-2 border-[#162544]">
                  <h2 className="text-base sm:text-lg font-black tracking-widest text-[#162544] uppercase">
                    Honors & Awards
                  </h2>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  {achievements.map((ach) => {
                    const subtitle = [ach.issuer, (ach.date && ach.date !== 'Recent') ? ach.date : ''].filter(Boolean).join(' • ');
                    return (
                      <div key={ach.id} className="space-y-0.5">
                        <div className="font-bold text-[#162544] flex items-start gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#162544] shrink-0 mt-0.5" />
                          <span>{ach.title}</span>
                        </div>
                        {subtitle && <div className="text-xs text-slate-500 pl-5">{subtitle}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Bottom Sidebar Footer Accent */}
          <div className="pt-8 text-[11px] text-slate-400 font-mono text-center md:text-left">
            Verified Digital Resume • Tech Humans
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Main Content (Name, Headline, Profile, Work Experience)     */}
        {/* ========================================================================= */}
        <main className="md:col-span-8 lg:col-span-7 p-6 sm:p-12 space-y-10 relative">
          
          {/* Header Banner: Name & Headline */}
          <header className="space-y-2 pt-2 sm:pt-4">
            <h1 className="text-3xl sm:text-5xl font-black text-[#162544] tracking-wider uppercase leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
              {profile.fullName || 'Candidate Name'}
            </h1>
            
            <div className="text-base sm:text-xl font-medium tracking-[0.25em] text-slate-600 uppercase border-b-2 border-slate-300 pb-4">
              {profile.headline || 'Professional Consultant'}
            </div>
          </header>

          {/* PROFILE Section */}
          <section className="space-y-3">
            <div className="pb-1 border-b-2 border-[#162544] inline-block">
              <h2 className="text-lg sm:text-xl font-black tracking-widest text-[#162544] uppercase">
                Profile
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              {about.summary || profile.bio || 'High-impact professional with a track record of driving cross-functional initiatives, optimizing operational workflows, and delivering strategic business value.'}
            </p>
          </section>

          {/* WORK EXPERIENCE Section */}
          {experience && experience.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between pb-1 border-b-2 border-[#162544]">
                <h2 className="text-lg sm:text-xl font-black tracking-widest text-[#162544] uppercase">
                  Work Experience
                </h2>
                <span className="text-xs font-mono text-slate-500 font-medium">
                  {about.yearsOfExperience > 0 ? `${about.yearsOfExperience}+ Years Career Track` : `${experience.length} Roles`}
                </span>
              </div>

              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="text-base sm:text-lg font-bold text-[#162544]">
                        {exp.company}
                      </h3>
                      <span className="text-xs font-mono text-slate-500">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-semibold text-slate-700">
                      {exp.role}
                    </div>

                    {exp.description && exp.description.length > 0 && (
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside leading-relaxed pl-1">
                        {exp.description.map((point, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SELECTED PROJECTS / KEY INITIATIVES Section */}
          {projects && projects.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between pb-1 border-b-2 border-[#162544]">
                <h2 className="text-lg sm:text-xl font-black tracking-widest text-[#162544] uppercase">
                  Selected Work & Initiatives
                </h2>
                <span className="text-xs font-mono text-slate-500 font-medium">
                  {projects.length} {projects.length === 1 ? 'Showcase' : 'Showcases'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white hover:border-[#162544] hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-[#162544] flex items-center gap-1.5">
                          {proj.title}
                          {proj.link && (
                            <a
                              href={formatExternalUrl(proj.link)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-[#162544] transition-colors"
                              title="Open Project"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </h3>
                        {proj.role && (
                          <div className="text-xs text-slate-500 font-medium">{proj.role}</div>
                        )}
                      </div>

                      {proj.metrics && (
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 bg-blue-50 text-[#162544] rounded border border-blue-200 shrink-0">
                          {proj.metrics}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* KEY HIGHLIGHTS / REFERENCES Section */}
          {about.highlights && about.highlights.length > 0 && (
            <section className="space-y-4">
              <div className="pb-1 border-b-2 border-[#162544] inline-block">
                <h2 className="text-lg sm:text-xl font-black tracking-widest text-[#162544] uppercase">
                  Key Highlights
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {about.highlights.map((hl, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#162544] shrink-0 mt-0.5" />
                    <span className="leading-snug">{hl}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM DECORATIVE WAVES (Navy & Slate curves matching the uploaded template) */}
      {/* ========================================================================= */}
      <div className="w-full h-16 sm:h-20 overflow-hidden relative pointer-events-none -mt-4">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          {/* Light Gray/Slate wave underlayer */}
          <path
            d="M0,0 C300,90 600,10 900,80 C1050,110 1150,50 1200,30 L1200,120 L0,120 Z"
            fill="#8392A5"
            opacity="0.5"
          />
          {/* Main Dark Navy wave top layer */}
          <path
            d="M0,40 C200,100 500,20 800,90 C1000,130 1120,70 1200,50 L1200,120 L0,120 Z"
            fill="#162544"
          />
        </svg>
      </div>

    </div>
  );
};
