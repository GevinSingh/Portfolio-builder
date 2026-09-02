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
  Star 
} from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const NoirTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;

  const phone = profile.socials.phone || '';
  const website = profile.socials.linkedin || profile.socials.github || profile.socials.website || '';
  const email = profile.socials.email || '';
  const location = profile.socials.location || '';

  return (
    <div className={`w-full bg-[#181818] text-white font-sans selection:bg-white selection:text-black relative overflow-hidden transition-all shadow-2xl rounded-2xl ${isCompact ? 'p-4 text-xs' : 'p-0 max-w-5xl mx-auto my-6 border border-zinc-800'}`}>
      
      {/* Top Header Section with Diagonal Cut */}
      <div className="relative bg-[#111111] p-6 sm:p-10 border-b border-zinc-800 overflow-hidden">
        
        {/* Angular Geometric Light Slices in Top Right */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-full pointer-events-none opacity-20">
          <svg viewBox="0 0 400 200" className="w-full h-full" fill="none">
            <polygon points="150,0 400,0 400,200 50,200" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          
          {/* Circular Photo with White Crescent Arc Frame (Moris Maxwell signature) */}
          <div className="relative shrink-0">
            <div className="relative p-1.5 rounded-full border-4 border-white/90 shadow-2xl bg-zinc-900">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover grayscale contrast-125"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-3xl select-none">
                  {profile.fullName
                    ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
                    : 'MM'}
                </div>
              )}
            </div>

            {/* Glowing Accent Crescent */}
            <div className="absolute -inset-1 rounded-full border-2 border-white/30 pointer-events-none" />
          </div>

          {/* Large Name & Headline Block */}
          <div className="space-y-2 text-center sm:text-left pt-2">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wider uppercase font-['Plus_Jakarta_Sans',sans-serif]">
              {profile.fullName || 'Candidate Name'}
            </h1>
            <p className="text-sm sm:text-base font-semibold tracking-[0.3em] text-zinc-400 uppercase">
              {profile.headline || 'Graphic Designer & Visual Strategist'}
            </p>

            {/* Social badges row */}
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
              {profile.socials.linkedin && (
                <a
                  href={formatExternalUrl(profile.socials.linkedin, 'linkedin')}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded bg-zinc-800 hover:bg-white hover:text-black text-zinc-300 transition-colors"
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
                  className="p-1.5 rounded bg-zinc-800 hover:bg-white hover:text-black text-zinc-300 transition-colors"
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
                  className="p-1.5 rounded bg-zinc-800 hover:bg-white hover:text-black text-zinc-300 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Main Grid: Left Dark Column (42%) / Right Light Gray Column (58%) */}
      <div className="grid grid-cols-1 md:grid-cols-12">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Noir Dark Column (About Me, Education, Software Ratings)     */}
        {/* ========================================================================= */}
        <aside className="md:col-span-5 bg-[#181818] p-6 sm:p-10 space-y-8 border-r border-zinc-800">
          
          {/* ABOUT ME */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-black tracking-widest text-white uppercase">
                About Me
              </h2>
              <div className="w-full h-0.5 bg-zinc-700" />
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed text-justify">
              {about.summary || profile.bio || 'Experienced graphic designer with a passion for building cohesive visual identities, brand systems, and engaging multimedia content that drive audience impact.'}
            </p>
          </div>

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <div className="space-y-3">
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-black tracking-widest text-white uppercase">
                  Education
                </h2>
                <div className="w-full h-0.5 bg-zinc-700" />
              </div>

              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5 text-xs sm:text-sm">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                      <span>{edu.institution}</span>
                    </div>
                    <div className="text-zinc-400 pl-3">
                      {edu.degree} {(edu.startDate || edu.endDate) && `(${[edu.startDate, edu.endDate].filter(Boolean).join(' - ')})`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOFTWARE / SKILL RATINGS (Star / Dot Metrics) */}
          {skills && skills.length > 0 && (
            <div className="space-y-3">
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-black tracking-widest text-white uppercase">
                  Software Proficiency
                </h2>
                <div className="w-full h-0.5 bg-zinc-700" />
              </div>

              <div className="space-y-2.5">
                {skills.flatMap(cat => cat.skills).slice(0, 6).map((item, idx) => {
                  const starCount = [5, 5, 4, 4, 5, 4][idx % 6];
                  return (
                    <div key={item} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{item}</span>
                      <div className="flex items-center gap-1 text-white">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`text-xs ${s <= starCount ? 'text-white' : 'text-zinc-700'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HONORS */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-3">
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-black tracking-widest text-white uppercase">
                  Honors & Awards
                </h2>
                <div className="w-full h-0.5 bg-zinc-700" />
              </div>

              <div className="space-y-2 text-xs text-zinc-400">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2">
                    <Award className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">{ach.title}</span>
                      {ach.issuer && <span className="block text-[11px] text-zinc-500">{ach.issuer}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Light Silver Crisp Column (Experience, Skills, Contact)     */}
        {/* ========================================================================= */}
        <main className="md:col-span-7 bg-[#F4F4F5] text-zinc-900 p-6 sm:p-10 space-y-8">
          
          {/* EXPERIENCE WORK */}
          {experience && experience.length > 0 && (
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-black tracking-widest text-zinc-900 uppercase">
                  Experience Work
                </h2>
                <div className="w-full h-0.5 bg-zinc-300" />
              </div>

              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="font-bold text-xs sm:text-sm tracking-wide text-zinc-900 uppercase">
                      {exp.role}
                    </div>
                    <div className="text-xs font-mono font-semibold text-zinc-600">
                      {exp.startDate} - {exp.endDate} • {exp.company}
                    </div>

                    {exp.description && exp.description.length > 0 && (
                      <div className="space-y-1 text-xs text-zinc-700 leading-relaxed pt-1">
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

          {/* SKILLS with Dual-Tone Sliders */}
          {skills && skills.length > 0 && (
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-black tracking-widest text-zinc-900 uppercase">
                  Skills
                </h2>
                <div className="w-full h-0.5 bg-zinc-300" />
              </div>

              <div className="space-y-3">
                {skills.flatMap(cat => cat.skills).slice(0, 4).map((sk, idx) => {
                  const pct = [85, 90, 75, 80][idx % 4];
                  return (
                    <div key={sk} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-zinc-800">
                        <span>{sk}</span>
                        <span className="text-zinc-500 font-mono text-[11px]">{pct}%</span>
                      </div>
                      <div className="w-full h-3 rounded bg-zinc-300 overflow-hidden">
                        <div className="h-full bg-zinc-800 rounded" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* FEATURED PROJECTS */}
          {projects && projects.length > 0 && (
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-black tracking-widest text-zinc-900 uppercase">
                  Selected Work
                </h2>
                <div className="w-full h-0.5 bg-zinc-300" />
              </div>

              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl border border-zinc-300 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-zinc-900 text-xs sm:text-sm flex items-center gap-1.5">
                        {proj.title}
                        {proj.link && (
                          <a href={formatExternalUrl(proj.link)} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-black">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h3>
                      {proj.metrics && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-800 rounded border border-zinc-200">
                          {proj.metrics}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CONTACT Section with Circle Badges */}
          <section className="space-y-3 pt-2">
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-black tracking-widest text-zinc-900 uppercase">
                Contact
              </h2>
              <div className="w-full h-0.5 bg-zinc-300" />
            </div>

            <div className="space-y-2.5 text-xs text-zinc-800">
              {phone && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{phone}</span>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate font-medium">
                    <EmailLink email={email} className="truncate hover:underline" />
                  </div>
                </div>
              )}

              {website && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <a href={formatExternalUrl(website)} target="_blank" rel="noreferrer" className="truncate font-medium hover:underline">
                    {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                  </a>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{location}</span>
                </div>
              )}
            </div>
          </section>

        </main>
      </div>

    </div>
  );
};
