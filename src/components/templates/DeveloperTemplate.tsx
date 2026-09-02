import React, { useState } from 'react';
import { PortfolioData } from '../../types';
import { Terminal, Github, Linkedin, Twitter, Mail, ExternalLink, Code2, Cpu, GitBranch, Sparkles, Trophy, Database } from 'lucide-react';
import { formatExternalUrl } from '../../lib/sanitize';
import { EmailLink } from '../EmailLink';

interface TemplateProps {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const DeveloperTemplate: React.FC<TemplateProps> = ({ portfolio, isCompact = false }) => {
  const { profile, about, projects, experience, skills, education, achievements } = portfolio;
  const [terminalInput, setTerminalInput] = useState('');
  const [cmdOutput, setCmdOutput] = useState<string | null>(null);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (cmd === 'help') {
      setCmdOutput('Available commands: bio, skills, projects, contact, clear');
    } else if (cmd === 'bio') {
      setCmdOutput(profile.bio);
    } else if (cmd === 'skills') {
      setCmdOutput(skills.map(s => `${s.category}: ${s.skills.join(', ')}`).join(' | '));
    } else if (cmd === 'projects') {
      setCmdOutput(projects.map(p => p.title).join(' • '));
    } else if (cmd === 'contact') {
      setCmdOutput(`Email: ${profile.socials.email} | Location: ${profile.socials.location}`);
    } else if (cmd === 'clear') {
      setCmdOutput(null);
    } else {
      setCmdOutput(`Command not found: "${cmd}". Type "help" for a list.`);
    }
    setTerminalInput('');
  };

  return (
    <div className={`w-full bg-[#050811] text-slate-100 font-mono selection:bg-cyan-500 selection:text-black transition-all ${isCompact ? 'p-3 text-xs' : 'p-6 sm:p-12 max-w-5xl mx-auto print:max-w-none print:p-4 print:m-0'}`}>
      
      {/* Top Cyber Terminal Window Header */}
      <div className="rounded-2xl border border-cyan-500/30 bg-[#090d1a] shadow-[0_0_50px_-15px_rgba(6,182,212,0.25)] overflow-hidden mb-8">
        
        {/* Terminal Titlebar */}
        <div className="px-4 py-3 bg-[#030611] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs text-cyan-400/80 font-mono">bash - {profile.slug}@system ~ 60fps</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>main / v2.4.0</span>
          </div>
        </div>

        {/* Hero Section inside Terminal */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs text-cyan-400 font-semibold tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>$ whoami --verbose</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
                {profile.fullName}
              </h1>
              <p className="text-sm sm:text-base text-cyan-300/90 max-w-xl font-sans">
                {profile.headline}
              </p>
              {profile.statusText && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs text-cyan-300">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{profile.statusText}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
              <div className="relative">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-900 to-black border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center text-cyan-400 font-mono select-none">
                    <span className="text-2xl font-black">
                      &lt;{profile.fullName ? profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'DEV'}/&gt;
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-cyan-500 text-black text-[10px] font-bold">
                  PRO
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2 text-slate-300">
                {profile.socials.github && (
                  <a href={formatExternalUrl(profile.socials.github, 'github')} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.linkedin && (
                  <a href={formatExternalUrl(profile.socials.linkedin, 'linkedin')} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.twitter && (
                  <a href={formatExternalUrl(profile.socials.twitter, 'twitter')} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.email && (
                  <EmailLink
                    email={profile.socials.email}
                    className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-colors"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Interactive terminal prompt */}
          {!isCompact && (
            <div className="no-print mt-4 p-3 rounded-xl bg-black/60 border border-cyan-500/20 font-mono text-xs">
              <form onSubmit={handleCommand} className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">visitor@portfoliox:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type 'help', 'skills', or 'projects'..."
                  className="flex-1 bg-transparent border-none text-cyan-300 focus:outline-none placeholder:text-slate-600"
                />
              </form>
              {cmdOutput && (
                <div className="mt-2 pt-2 border-t border-white/10 text-cyan-200/90 leading-relaxed font-mono">
                  {cmdOutput}
                </div>
              )}
            </div>
          )}

          {/* Bio text */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans border-l-2 border-cyan-500/40 pl-4">
            {profile.bio}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Code2 className="w-4 h-4" />
              <span>01 // PRODUCTION_PROJECTS.sh</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">{projects.length} Repositories</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-xl border border-white/10 bg-[#090d1a] hover:border-cyan-500/60 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.3)] transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-['Space_Grotesk']">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-cyan-400/80 mt-0.5">{proj.role}</p>
                  </div>
                  {proj.link && (
                    <a href={formatExternalUrl(proj.link)} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-300 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-300 font-sans leading-relaxed">
                  {proj.description}
                </p>

                {proj.metrics && (
                  <div className="mt-3 text-[11px] font-mono text-emerald-400 bg-emerald-950/30 px-2.5 py-1 rounded border border-emerald-500/20">
                    ⚡ {proj.metrics}
                  </div>
                )}

                {proj.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.technologies.map((tech) => (
                      <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-cyan-500/20 text-cyan-300">
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

      {/* Skills Matrix */}
      {skills.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>02 // TECH_STACK_MATRIX</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {skills.map((cat) => (
              <div key={cat.id} className="p-4 rounded-xl bg-[#090d1a] border border-white/10">
                <h4 className="text-xs font-mono font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  {cat.category}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((s) => (
                    <span key={s} className="px-2 py-1 text-xs rounded bg-slate-950 border border-white/5 text-slate-200 font-sans">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {experience.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <GitBranch className="w-4 h-4" />
              <span>03 // WORK_HISTORY_LOG</span>
            </div>
          </div>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-cyan-500/30 space-y-2">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-white font-['Space_Grotesk']">{exp.role} <span className="text-cyan-400 font-normal">@ {exp.company}</span></span>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-xs text-slate-400 font-mono">{exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate}</span>
                  )}
                </div>
                {exp.description.length > 0 && (
                  <ul className="space-y-1.5 text-xs text-slate-300 font-sans list-disc list-inside">
                    {exp.description.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Achievements */}
      {(education.length > 0 || achievements.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-cyan-500/20 text-xs">
          {education.length > 0 && (
            <div>
              <div className="text-cyan-400 font-bold mb-3">04 // ACADEMIC_CREDENTIALS</div>
              {education.map((edu) => (
                <div key={edu.id} className="p-3.5 rounded-lg bg-[#090d1a] border border-white/5 space-y-1">
                  <div className="font-bold text-white">{edu.institution}</div>
                  {(edu.degree || edu.field) && (
                    <div className="text-slate-300">{edu.degree}{edu.degree && edu.field ? ' in ' : ''}{edu.field}</div>
                  )}
                  {(edu.startDate || edu.endDate) && (
                    <div className="text-cyan-400/80 font-mono">{edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <div className="text-cyan-400 font-bold mb-3">05 // HONORS_AND_AWARDS</div>
              <div className="space-y-2">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-3.5 rounded-lg bg-[#090d1a] border border-white/5 space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      {ach.title}
                    </div>
                    {(ach.issuer || ach.date) && (
                      <div className="text-slate-400">{ach.issuer}{ach.issuer && ach.date ? ` (${ach.date})` : ach.date}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
