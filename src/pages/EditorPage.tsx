import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Briefcase, 
  Rocket, 
  GraduationCap, 
  Zap, 
  Award, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Monitor, 
  Smartphone, 
  Sparkles, 
  Palette, 
  Check, 
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Cloud,
  Upload,
  Camera
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioRenderer } from '../components/PortfolioRenderer';
import { CloudSyncBadge } from '../components/CloudSyncBadge';
import { SupabaseAuthModal } from '../components/SupabaseAuthModal';
import { TemplateId } from '../types';
import { templateOptions } from '../data/mockData';
import { formatExternalUrl } from '../lib/sanitize';

type EditorSection = 'profile' | 'about' | 'projects' | 'experience' | 'skills' | 'education' | 'achievements' | 'links' | 'appearance';

export const EditorPage: React.FC = () => {
  const { 
    portfolio, 
    updateProfile, 
    updateAbout, 
    addProject, 
    updateProject, 
    deleteProject, 
    addExperience, 
    updateExperience, 
    deleteExperience, 
    addSkillCategory, 
    updateSkillCategory, 
    deleteSkillCategory, 
    addEducation, 
    updateEducation, 
    deleteEducation, 
    addAchievement, 
    updateAchievement, 
    deleteAchievement, 
    templateId, 
    setTemplateId, 
    showToast, 
    triggerConfetti,
    devicePreview,
    setDevicePreview,
    syncToCloud,
    isCloudSyncing,
    currentUser
  } = usePortfolio();

  const [activeSection, setActiveSection] = useState<EditorSection>('profile');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const sections = [
    { id: 'profile', label: 'Profile & Avatar', icon: User },
    { id: 'about', label: 'About & Story', icon: FileText },
    { id: 'projects', label: 'Projects & Work', icon: Rocket, count: portfolio.projects.length },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, count: portfolio.experience.length },
    { id: 'skills', label: 'Skills & Stack', icon: Zap, count: portfolio.skills.length },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'achievements', label: 'Achievements', icon: Award, count: portfolio.achievements.length },
    { id: 'links', label: 'Socials & Links', icon: LinkIcon },
    { id: 'appearance', label: 'Theme & Style', icon: Palette },
  ];

  const handleSave = async () => {
    triggerConfetti();
    showToast('Changes Saved', 'Your portfolio updates are live instantly!', 'success');
    if (currentUser) {
      await syncToCloud();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-['Inter',sans-serif] flex flex-col">
      
      {/* Top Editor Toolbar */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Editing: {portfolio.profile.fullName}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-[#1E65FF] border border-blue-200 font-mono uppercase font-bold">
                {portfolio.templateId}
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">Auto-saved to local state & Supabase Cloud</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Supabase Cloud Sync Action */}
          <CloudSyncBadge variant="button" onOpenAuth={() => setShowAuthModal(true)} />

          {/* Responsive device simulator toggle */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setDevicePreview('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[11px] transition-all ${
                devicePreview === 'desktop' ? 'bg-white text-[#1E65FF] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevicePreview('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[11px] transition-all ${
                devicePreview === 'mobile' ? 'bg-white text-[#1E65FF] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Mobile view switcher */}
          <div className="lg:hidden flex rounded-lg bg-slate-100 border border-slate-200 p-1 text-xs">
            <button
              onClick={() => setMobileTab('editor')}
              className={`px-3 py-1 rounded-md font-bold uppercase text-[11px] ${mobileTab === 'editor' ? 'bg-white text-[#1E65FF] shadow-sm' : 'text-slate-600'}`}
            >
              Edit
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`px-3 py-1 rounded-md font-bold uppercase text-[11px] ${mobileTab === 'preview' ? 'bg-white text-[#1E65FF] shadow-sm' : 'text-slate-600'}`}
            >
              Preview
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <Link
            to={`/p/${portfolio.slug}`}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#1E65FF]/20 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public URL</span>
          </Link>
        </div>
      </header>

      {/* Main 3-Column Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Section Selector */}
        <aside className={`w-full sm:w-60 border-r border-slate-200 bg-white p-3 shrink-0 overflow-y-auto ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="text-xs uppercase font-bold text-slate-400 px-3 py-2 tracking-wider">
            Sections
          </div>
          <nav className="space-y-1">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as EditorSection)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#1E65FF] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{sec.label}</span>
                  </div>
                  {sec.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {sec.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* CENTER PANEL: Editable Form for Selected Section */}
        <div className={`w-full lg:w-[480px] xl:w-[540px] border-r border-slate-200 bg-[#F8FAFC] p-4 sm:p-6 overflow-y-auto shrink-0 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          
          {/* PROFILE SECTION */}
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">Personal Profile</h2>
                <p className="text-xs text-slate-500">Your core name, headline, avatar, and availability status.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={portfolio.profile.fullName}
                    onChange={(e) => updateProfile({ fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Professional Headline</label>
                  <input
                    type="text"
                    value={portfolio.profile.headline}
                    onChange={(e) => updateProfile({ headline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Profile Photo
                  </label>
                  <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="shrink-0">
                        {portfolio.profile.avatarUrl ? (
                          <img
                            src={portfolio.profile.avatarUrl}
                            alt="Profile Preview"
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-[#1E65FF] text-white font-bold flex flex-col items-center justify-center text-base shadow-sm ring-1 ring-blue-200 select-none">
                            <span>{portfolio.profile.fullName ? portfolio.profile.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'ME'}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#1E65FF] text-slate-700 hover:text-[#1E65FF] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{portfolio.profile.avatarUrl ? 'Change Photo' : 'Upload Your Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                      const newPhotoUrl = reader.result;
                                      updateProfile({
                                        avatarUrl: newPhotoUrl,
                                        photo: {
                                          source: 'manual',
                                          url: newPhotoUrl,
                                          selected: true,
                                          candidates: portfolio.profile.photo?.candidates || [],
                                        }
                                      });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          {portfolio.profile.avatarUrl && (
                            <button
                              type="button"
                              onClick={() => updateProfile({
                                avatarUrl: '',
                                photo: {
                                  source: 'none',
                                  url: '',
                                  selected: false,
                                  candidates: portfolio.profile.photo?.candidates || [],
                                }
                              })}
                              className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Photo</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {portfolio.profile.avatarUrl 
                            ? 'Active profile photo rendered across all themes.'
                            : 'No photo uploaded. Displays elegant initials monogram badge.'}
                        </p>
                      </div>
                    </div>

                    {/* Candidate selector gallery if multiple candidate images detected in resume */}
                    {portfolio.profile.photo?.candidates && portfolio.profile.photo.candidates.length > 1 && (
                      <div className="pt-2 border-t border-slate-200/70">
                        <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                          Detected Resume Candidates:
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {portfolio.profile.photo.candidates.map((cand, idx) => {
                            const isSelected = portfolio.profile.avatarUrl === cand.url;
                            return (
                              <button
                                key={cand.id || idx}
                                type="button"
                                onClick={() => updateProfile({
                                  avatarUrl: cand.url,
                                  photo: {
                                    source: 'resume',
                                    url: cand.url,
                                    selected: true,
                                    candidates: portfolio.profile.photo?.candidates || [],
                                  }
                                })}
                                className={`relative p-1 rounded-xl border transition-all cursor-pointer ${
                                  isSelected ? 'border-[#1E65FF] bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                              >
                                <img src={cand.url} alt={`Candidate ${idx + 1}`} className="w-10 h-10 rounded-lg object-cover" />
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-slate-900 text-white text-[9px] font-bold">
                                  {cand.score}%
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Status / Availability Badge</label>
                  <input
                    type="text"
                    value={portfolio.profile.statusText || ''}
                    onChange={(e) => updateProfile({ statusText: e.target.value })}
                    placeholder="e.g. ⚡ Available for 24/7 Service & Projects"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Bio / Intro</label>
                  <textarea
                    rows={4}
                    value={portfolio.profile.bio}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABOUT SECTION */}
          {activeSection === 'about' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">About & Summary</h2>
                <p className="text-xs text-slate-500">Detailed overview and career bullet highlights.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={portfolio.about.yearsOfExperience}
                    onChange={(e) => updateAbout({ yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Extended Narrative</label>
                  <textarea
                    rows={5}
                    value={portfolio.about.summary}
                    onChange={(e) => updateAbout({ summary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS SECTION */}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Projects ({portfolio.projects.length})</h2>
                  <p className="text-xs text-slate-500">Manage showcased case studies, links & tech tags.</p>
                </div>
                <button
                  onClick={() => addProject({
                    title: 'New Featured Project',
                    description: 'Description of architectural decisions, stack, and measurable impact.',
                    role: 'Lead Specialist & Architect',
                    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
                    link: 'https://example.com',
                    github: 'https://github.com',
                    featured: true,
                    metrics: '1,000+ units installed',
                  })}
                  className="px-3 py-1.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {portfolio.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#1E65FF]">Project #{idx + 1}</span>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Role / Subtitle</label>
                        <input
                          type="text"
                          value={proj.role || ''}
                          onChange={(e) => updateProject(proj.id, { role: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Quantified Impact</label>
                        <input
                          type="text"
                          value={proj.metrics || ''}
                          onChange={(e) => updateProject(proj.id, { metrics: e.target.value })}
                          placeholder="e.g. 50k+ active users"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => updateProject(proj.id, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#1E65FF] font-mono font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE SECTION */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Experience Timeline</h2>
                  <p className="text-xs text-slate-500">Your career trajectory and impact points.</p>
                </div>
                <button
                  onClick={() => addExperience({
                    company: 'New Enterprise / Client',
                    role: 'Senior Project Lead / Engineer',
                    startDate: '2023',
                    endDate: 'Present',
                    current: true,
                    description: ['Delivered key initiatives and boosted system reliability.'],
                  })}
                  className="px-3 py-1.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-4">
                {portfolio.experience.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E65FF]">{exp.role}</span>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Accomplishments (1 per line)</label>
                      <textarea
                        rows={3}
                        value={exp.description.join('\n')}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value.split('\n').filter(Boolean) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS SECTION */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Skills Matrix</h2>
                  <p className="text-xs text-slate-500">Categorized competencies for recruiter search matches.</p>
                </div>
                <button
                  onClick={() => addSkillCategory({
                    category: 'New Category',
                    skills: ['Skill 1', 'Skill 2', 'Skill 3'],
                  })}
                  className="px-3 py-1.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Group</span>
                </button>
              </div>

              <div className="space-y-4">
                {portfolio.skills.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => updateSkillCategory(cat.id, { category: e.target.value })}
                        className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-[#1E65FF]"
                      />
                      <button
                        onClick={() => deleteSkillCategory(cat.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Skills (comma separated)</label>
                      <input
                        type="text"
                        value={cat.skills.join(', ')}
                        onChange={(e) => updateSkillCategory(cat.id, { skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION SECTION */}
          {activeSection === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Education</h2>
                  <p className="text-xs text-slate-500">Academic background and degrees.</p>
                </div>
                <button
                  onClick={() => addEducation({
                    institution: 'University / Institute',
                    degree: 'Bachelor / Master Degree',
                    field: 'Computer Science & Engineering',
                    startYear: '2016',
                    endYear: '2020',
                  })}
                  className="px-3 py-1.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-4">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E65FF]">{edu.degree}</span>
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Start Year</label>
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => updateEducation(edu.id, { startYear: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">End Year</label>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => updateEducation(edu.id, { endYear: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS SECTION */}
          {activeSection === 'achievements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Achievements & Certifications</h2>
                  <p className="text-xs text-slate-500">Awards, licenses, and verified recognitions.</p>
                </div>
                <button
                  onClick={() => addAchievement({
                    title: 'New Award / Certification',
                    issuer: 'Certifying Organization',
                    year: '2024',
                    description: 'Description of honor, certification, or award.',
                  })}
                  className="px-3 py-1.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Award</span>
                </button>
              </div>

              <div className="space-y-4">
                {portfolio.achievements.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E65FF]">{ach.title}</span>
                      <button
                        onClick={() => deleteAchievement(ach.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Title</label>
                        <input
                          type="text"
                          value={ach.title}
                          onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Issuer / Authority</label>
                        <input
                          type="text"
                          value={ach.issuer}
                          onChange={(e) => updateAchievement(ach.id, { issuer: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Description</label>
                      <input
                        type="text"
                        value={ach.description || ''}
                        onChange={(e) => updateAchievement(ach.id, { description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOCIALS & LINKS */}
          {activeSection === 'links' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">Socials & Contact Coordinates</h2>
                <p className="text-xs text-slate-500">Links where clients and recruiters can reach you directly.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Email Address</label>
                    {portfolio.profile.socials.email && (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolio.profile.socials.email.replace(/^mailto:/i, ''))}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#1E65FF] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Test Gmail Compose</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="email"
                    placeholder="e.g. alex@example.com"
                    value={portfolio.profile.socials.email || ''}
                    onChange={(e) => updateProfile({ socials: { ...portfolio.profile.socials, email: e.target.value } })}
                    onBlur={(e) => {
                      const val = e.target.value.trim().replace(/^mailto:/i, '');
                      if (val !== portfolio.profile.socials.email) {
                        updateProfile({ socials: { ...portfolio.profile.socials, email: val } });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">GitHub Profile URL</label>
                    {portfolio.profile.socials.github && (
                      <a
                        href={formatExternalUrl(portfolio.profile.socials.github, 'github')}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#1E65FF] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://github.com/username or username"
                    value={portfolio.profile.socials.github || ''}
                    onChange={(e) => updateProfile({ socials: { ...portfolio.profile.socials, github: e.target.value } })}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val) {
                        updateProfile({ socials: { ...portfolio.profile.socials, github: formatExternalUrl(val, 'github') } });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">LinkedIn Profile URL</label>
                    {portfolio.profile.socials.linkedin && (
                      <a
                        href={formatExternalUrl(portfolio.profile.socials.linkedin, 'linkedin')}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#1E65FF] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    value={portfolio.profile.socials.linkedin || ''}
                    onChange={(e) => updateProfile({ socials: { ...portfolio.profile.socials, linkedin: e.target.value } })}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val) {
                        updateProfile({ socials: { ...portfolio.profile.socials, linkedin: formatExternalUrl(val, 'linkedin') } });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Twitter / X URL</label>
                    {portfolio.profile.socials.twitter && (
                      <a
                        href={formatExternalUrl(portfolio.profile.socials.twitter, 'twitter')}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#1E65FF] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://x.com/username or @username"
                    value={portfolio.profile.socials.twitter || ''}
                    onChange={(e) => updateProfile({ socials: { ...portfolio.profile.socials, twitter: e.target.value } })}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val) {
                        updateProfile({ socials: { ...portfolio.profile.socials, twitter: formatExternalUrl(val, 'twitter') } });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-bold uppercase tracking-wider text-[11px]">Location / Service Area</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={portfolio.profile.socials.location || ''}
                    onChange={(e) => updateProfile({ socials: { ...portfolio.profile.socials, location: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* THEME & APPEARANCE */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">Visual Archetype & Theme</h2>
                <p className="text-xs text-slate-500">Switch design styling instantaneously.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {templateOptions.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplateId(tmpl.id as TemplateId)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between shadow-sm ${
                      portfolio.templateId === tmpl.id
                        ? 'border-[#1E65FF] bg-blue-50/50 shadow-md ring-2 ring-[#1E65FF]/20'
                        : 'border-slate-200 bg-white hover:border-[#1E65FF]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{tmpl.name}</span>
                        {portfolio.templateId === tmpl.id && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#1E65FF] text-white font-bold uppercase">Active</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{tmpl.tagline}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANEL: Live Interactive Real-Time Portfolio Preview */}
        <div className={`flex-1 bg-[#F1F5F9] p-4 lg:p-6 overflow-y-auto flex flex-col items-center justify-start ${mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          
          <div className="w-full max-w-5xl flex items-center justify-between mb-3 text-xs text-slate-500 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-slate-900 font-bold">LIVE PREVIEW ENGINE (Instant Reactive Mirror)</span>
            </div>
            <span className="text-[#1E65FF] font-bold uppercase hidden sm:inline">Theme: {portfolio.templateId.toUpperCase()}</span>
          </div>

          {/* Simulator Frame */}
          <div className={`w-full transition-all duration-300 rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white ${
            devicePreview === 'mobile' ? 'max-w-sm my-4 ring-8 ring-slate-200' : 'max-w-5xl'
          }`}>
            {/* Window titlebar */}
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-[11px] text-slate-500">
                techhumans.live/{portfolio.slug}
              </span>
              <div className="w-6" />
            </div>

            {/* Live Portfolio Renderer */}
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
              <PortfolioRenderer portfolio={portfolio} isCompact={devicePreview === 'mobile'} />
            </div>
          </div>

        </div>

      </div>

      {/* Supabase Auth Modal */}
      <SupabaseAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
