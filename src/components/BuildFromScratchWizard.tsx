import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Briefcase,
  Code2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Layers,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Eye,
  Smartphone,
  Monitor,
  CheckCircle2,
  X,
  Wand2,
  Rocket,
  Tag,
  FolderGit2,
  Calendar,
  Building,
  RotateCcw,
  Upload,
  Camera
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { UserProfileData, PortfolioData, TemplateId } from '../types';
import { PortfolioRenderer } from './PortfolioRenderer';
import { templateOptions } from '../data/mockData';
import { formatExternalUrl } from '../lib/sanitize';
import { savePortfolioToSupabase } from '../lib/supabase';

interface Props {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: (data: UserProfileData) => void;
}

const defaultInitialData: UserProfileData = {
  basicInfo: {
    fullName: 'Sarah Jenkins',
    headline: 'Senior Full Stack Engineer & Cloud Architect',
    bio: 'Passionate software engineer building resilient distributed systems and delightful user interfaces. 5+ years of experience with React, Node.js, TypeScript, and AWS cloud infrastructure.',
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://sarahjenkins.dev',
    },
    avatarUrl: '',
  },
  workExperience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Systems',
      role: 'Senior Software Engineer',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      location: 'San Francisco, CA',
      highlights: [
        'Architected real-time microservices handling over 250,000 requests per second with 99.99% uptime',
        'Led migration to modern React 19 design token architecture, cutting client bundle size by 35%',
        'Mentored 6 junior engineers and standardized CI/CD automated test suites'
      ],
    },
    {
      id: 'exp-2',
      company: 'Nexus Interactive Labs',
      role: 'Full Stack Developer',
      startDate: '2020',
      endDate: '2022',
      current: false,
      location: 'Austin, TX',
      highlights: [
        'Built full-stack collaborative canvas tooling powered by WebSockets and TypeScript',
        'Implemented end-to-end user authentication and Stripe subscription payment pipelines',
      ],
    },
  ],
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'Tailwind CSS',
    'Next.js',
    'GraphQL',
    'PostgreSQL',
    'Docker',
    'AWS Cloud',
    'Design Systems',
    'REST APIs',
    'Git Workflow',
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DevPulse Cloud Monitor',
      description: 'Distributed metrics dashboard visualizing API latency, server health, and memory telemetry in real-time with sub-millisecond chart rendering.',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'WebSockets', 'D3.js'],
      link: 'https://example.com/devpulse',
      github: 'https://github.com/example/devpulse',
      role: 'Lead Architect',
      metrics: 'Used by 15,000+ engineers daily • 99.9% test coverage',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'proj-2',
      title: 'Synapse AI Assistant',
      description: 'Lightweight local-first knowledge base search engine integrating semantic vector embeddings and syntax-highlighted code playgrounds.',
      techStack: ['Next.js', 'Vector DB', 'Tailwind CSS', 'FastAPI'],
      link: 'https://example.com/synapse',
      github: 'https://github.com/example/synapse',
      role: 'Creator & Builder',
      metrics: '3,200+ GitHub Stars • Top Trending on Product Hunt',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    },
  ],
  templateId: 'developer',
};

const emptyStarterData: UserProfileData = {
  basicInfo: {
    fullName: '',
    headline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    socials: {
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  workExperience: [
    {
      id: 'exp-1',
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: true,
      location: '',
      highlights: [''],
    },
  ],
  skills: [],
  projects: [
    {
      id: 'proj-1',
      title: '',
      description: '',
      techStack: [],
      link: '',
      github: '',
      role: '',
      metrics: '',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    },
  ],
  templateId: 'developer',
};

const popularSkills = [
  'React',
  'TypeScript',
  'JavaScript',
  'Next.js',
  'Node.js',
  'Tailwind CSS',
  'Python',
  'AWS',
  'GraphQL',
  'PostgreSQL',
  'Docker',
  'Figma',
  'UI/UX Design',
  'Rust',
  'Golang',
];

export const BuildFromScratchWizard: React.FC<Props> = ({
  isModal = false,
  isOpen = true,
  onClose,
  onComplete,
}) => {
  const navigate = useNavigate();
  const { setPortfolio, triggerConfetti, showToast, currentUser } = usePortfolio();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<UserProfileData>(defaultInitialData);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [skillInput, setSkillInput] = useState('');
  const [projectTechInput, setProjectTechInput] = useState<{ [projectId: string]: string }>({});

  // Dynamic portfolio object mapped live from UserProfileData for real-time split-screen preview
  const livePortfolio: PortfolioData = useMemo(() => {
    const slug = (formData.basicInfo.fullName || 'alex-johnson')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'my-portfolio';

    return {
      id: 'custom-scratch-' + Date.now(),
      slug: slug,
      profile: {
        fullName: formData.basicInfo.fullName || 'Your Name',
        headline: formData.basicInfo.headline || 'Your Professional Headline',
        bio: formData.basicInfo.bio || 'Your introductory bio will appear here as you type in the form wizard.',
        avatarUrl: formData.basicInfo.avatarUrl || '',
        bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        statusText: '⚡ Open to new career opportunities & collaborations',
        socials: {
          email: formData.basicInfo.email,
          phone: formData.basicInfo.phone,
          location: formData.basicInfo.location,
          github: formatExternalUrl(formData.basicInfo.socials.github, 'github'),
          linkedin: formatExternalUrl(formData.basicInfo.socials.linkedin, 'linkedin'),
          twitter: formatExternalUrl(formData.basicInfo.socials.twitter, 'twitter'),
          website: formatExternalUrl(formData.basicInfo.socials.website, 'website'),
        },
      },
      about: {
        summary: formData.basicInfo.bio || 'Experienced builder delivering reliable, high-quality digital solutions.',
        highlights: formData.workExperience.flatMap((w) => w.highlights).filter(Boolean).slice(0, 3),
        yearsOfExperience: Math.max(1, formData.workExperience.length * 2),
      },
      skills: [
        {
          id: 'skill-cat-1',
          category: 'Core Competencies & Stack',
          skills: formData.skills.length > 0 ? formData.skills : ['Frontend Engineering', 'TypeScript', 'System Design'],
        },
      ],
      experience: formData.workExperience.map((exp, idx) => ({
        id: exp.id || `exp-${idx}`,
        company: exp.company || 'Company Name',
        role: exp.role || 'Job Title / Position',
        location: exp.location || 'Remote / Hybrid',
        startDate: exp.startDate || '2022',
        endDate: exp.current ? 'Present' : (exp.endDate || '2024'),
        current: !!exp.current,
        description: exp.highlights.filter(Boolean).length > 0 ? exp.highlights.filter(Boolean) : ['Key responsibilities, impacts, and technical achievements.'],
        technologies: formData.skills.slice(0, 4),
      })),
      projects: formData.projects.map((proj, idx) => ({
        id: proj.id || `proj-${idx}`,
        title: proj.title || 'Featured Project Title',
        description: proj.description || 'Description of key architecture, features, and outcomes.',
        role: proj.role || 'Lead Engineer',
        technologies: proj.techStack.length > 0 ? proj.techStack : ['React', 'TypeScript', 'Tailwind CSS'],
        link: proj.link || 'https://example.com',
        github: proj.github || 'https://github.com',
        featured: true,
        metrics: proj.metrics || 'Key outcome metric • Production deployed',
        image: proj.image || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      })),
      education: [
        {
          id: 'edu-1',
          institution: 'University of Science & Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science & Software Engineering',
          startDate: '2016',
          endDate: '2020',
          honors: 'Dean’s Honor Roll',
        },
      ],
      achievements: [
        {
          id: 'ach-1',
          title: 'Top Contributor & Builder Award',
          issuer: 'Tech Humans Network',
          date: '2024',
          description: 'Recognized for distinguished architectural design and portfolio showcase excellence.',
        },
      ],
      templateId: formData.templateId || 'developer',
      accentColor: '#1E65FF',
      fontFamily: 'Inter',
      isPublished: true,
      viewsCount: 1,
      lastUpdated: 'Just now',
    };
  }, [formData]);

  // Step 1: Basic Info handlers
  const handleBasicInfoChange = (field: keyof UserProfileData['basicInfo'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (network: keyof UserProfileData['basicInfo']['socials'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        socials: {
          ...prev.basicInfo.socials,
          [network]: value,
        },
      },
    }));
  };

  // Step 2: Work Experience handlers
  const handleAddExperience = () => {
    const newExp = {
      id: 'exp-' + Date.now(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      highlights: [''],
    };
    setFormData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExp],
    }));
  };

  const handleRemoveExperience = (id: string) => {
    if (formData.workExperience.length <= 1) {
      showToast('At least 1 experience item is recommended', 'warning');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((e) => e.id !== id),
    }));
  };

  const handleExperienceChange = (id: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddHighlight = (expId: string) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item) =>
        item.id === expId
          ? { ...item, highlights: [...item.highlights, ''] }
          : item
      ),
    }));
  };

  const handleHighlightChange = (expId: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item) => {
        if (item.id !== expId) return item;
        const newHighlights = [...item.highlights];
        newHighlights[index] = value;
        return { ...item, highlights: newHighlights };
      }),
    }));
  };

  const handleRemoveHighlight = (expId: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item) => {
        if (item.id !== expId) return item;
        return {
          ...item,
          highlights: item.highlights.filter((_, i) => i !== index),
        };
      }),
    }));
  };

  // Step 3: Skills & Projects handlers
  const handleAddSkill = (skillToAdd?: string) => {
    const raw = (skillToAdd || skillInput).trim();
    if (!raw) return;
    if (formData.skills.includes(raw)) {
      setSkillInput('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, raw],
    }));
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddProject = () => {
    const newProj = {
      id: 'proj-' + Date.now(),
      title: '',
      description: '',
      techStack: ['React', 'TypeScript'],
      link: '',
      github: '',
      role: '',
      metrics: '',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    };
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const handleRemoveProject = (id: string) => {
    if (formData.projects.length <= 1) {
      showToast('At least 1 project is recommended', 'warning');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const handleProjectChange = (id: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const handleAddProjectTech = (projectId: string) => {
    const tech = (projectTechInput[projectId] || '').trim();
    if (!tech) return;
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        if (p.techStack.includes(tech)) return p;
        return { ...p, techStack: [...p.techStack, tech] };
      }),
    }));
    setProjectTechInput((prev) => ({ ...prev, [projectId]: '' }));
  };

  const handleRemoveProjectTech = (projectId: string, techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        return { ...p, techStack: p.techStack.filter((t) => t !== techToRemove) };
      }),
    }));
  };

  // Step 4: Final Save & Launch
  const handleSaveAndLaunch = () => {
    setPortfolio(livePortfolio);
    savePortfolioToSupabase(livePortfolio, currentUser?.id).catch(() => {});
    triggerConfetti();
    showToast('Portfolio Generated & Synced to Supabase!', `Your custom portfolio has been created successfully.`, 'sparkles');

    if (onComplete) {
      onComplete(formData);
    } else if (onClose && isModal) {
      onClose();
      navigate(`/p/${livePortfolio.slug}`);
    } else {
      navigate(`/p/${livePortfolio.slug}`);
    }
  };

  const loadSamplePreset = () => {
    setFormData(defaultInitialData);
    showToast('Sample details loaded', 'Loaded complete profile with projects and experiences.');
  };

  const clearToEmpty = () => {
    setFormData(emptyStarterData);
    showToast('Form Cleared', 'You can now enter your own details from a clean slate.');
  };

  if (isModal && !isOpen) {
    return null;
  }

  const stepsList = [
    { number: 1, title: 'Personal Profile', desc: 'Basic info & contact links', icon: User },
    { number: 2, title: 'Work & Experience', desc: 'Roles, timeline & impact highlights', icon: Briefcase },
    { number: 3, title: 'Projects & Skills', desc: 'Flagship builds & technical stack', icon: Code2 },
    { number: 4, title: 'Template & Launch', desc: 'Select design archetype & publish', icon: Sparkles },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-['Inter',sans-serif]">

      {/* Top Header Bar */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-8 py-4 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E65FF] flex items-center justify-center text-white shadow-md shadow-[#1E65FF]/25">
            <Wand2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Build Portfolio From Scratch</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1E65FF] border border-blue-200">
                Live Studio
              </span>
            </div>
            <p className="text-xs text-slate-500">No resume needed — enter your background details and watch your website update in real-time</p>
          </div>
        </div>

        {/* Quick action buttons & Close */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={loadSamplePreset}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#1E65FF] bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#1E65FF] text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Auto-fill with sample engineer portfolio"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1E65FF]" />
            <span className="hidden sm:inline">Fill Sample Data</span>
          </button>

          <button
            onClick={clearToEmpty}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Clear all fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Split Screen Area: Form Wizard (Left) + Live Preview (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT COLUMN: Multi-Step Form Wizard */}
        <div className="w-full lg:w-[50%] xl:w-[48%] flex flex-col border-r border-slate-200 bg-white overflow-y-auto">

          {/* Progress Tracker Banner */}
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/70 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E65FF]">
                  Step {currentStep} of 4
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  {stepsList[currentStep - 1].title}
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {currentStep * 25}% Completed
              </span>
            </div>

            {/* Progress Bar Line */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-[#1E65FF] to-blue-500 rounded-full"
                initial={false}
                animate={{ width: `${currentStep * 25}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Interactive Step Chips */}
            <div className="grid grid-cols-4 gap-2">
              {stepsList.map((step) => {
                const Icon = step.icon;
                const isCurrent = currentStep === step.number;
                const isPast = currentStep > step.number;
                return (
                  <button
                    key={step.number}
                    onClick={() => setCurrentStep(step.number as any)}
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col items-start gap-1 cursor-pointer ${isCurrent
                      ? 'bg-blue-50 border-[#1E65FF] shadow-sm'
                      : isPast
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-slate-100/60 border-transparent opacity-60 hover:opacity-80'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${isCurrent ? 'bg-[#1E65FF] text-white' : isPast ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}>
                        {isPast ? <Check className="w-3 h-3" /> : step.number}
                      </div>
                      <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#1E65FF]' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-[11px] font-semibold truncate w-full ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Step Body */}
          <div className="p-4 sm:p-6 space-y-6 flex-1">
            <AnimatePresence mode="wait">

              {/* STEP 1: PERSONAL PROFILE */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#1E65FF]" />
                      <span>Personal Information</span>
                    </h3>
                    <p className="text-xs text-slate-500">Provide your basic contact coordinates and headline for the portfolio header.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Profile Photo Upload */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-slate-400" />
                        <span>Profile Photo (Optional)</span>
                      </label>
                      <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="shrink-0">
                          {formData.basicInfo.avatarUrl ? (
                            <img
                              src={formData.basicInfo.avatarUrl}
                              alt="Profile Preview"
                              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm ring-2 ring-blue-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#1E65FF] text-white font-bold flex items-center justify-center text-sm shadow-sm select-none">
                              {formData.basicInfo.fullName ? formData.basicInfo.fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'ME'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#1E65FF] text-slate-700 hover:text-[#1E65FF] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{formData.basicInfo.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
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
                                        handleBasicInfoChange('avatarUrl', reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {formData.basicInfo.avatarUrl && (
                              <button
                                type="button"
                                onClick={() => handleBasicInfoChange('avatarUrl', '')}
                                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {formData.basicInfo.avatarUrl ? 'Custom photo attached to portfolio.' : 'No photo uploaded? An initials monogram badge will be displayed.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-[#1E65FF]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.basicInfo.fullName}
                        onChange={(e) => handleBasicInfoChange('fullName', e.target.value)}
                        placeholder="e.g., Sarah Jenkins"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Headline */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Professional Headline <span className="text-[#1E65FF]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.basicInfo.headline}
                        onChange={(e) => handleBasicInfoChange('headline', e.target.value)}
                        placeholder="e.g., Senior Full Stack Engineer & Cloud Architect"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Bio / Overview Statement
                      </label>
                      <textarea
                        rows={3}
                        value={formData.basicInfo.bio}
                        onChange={(e) => handleBasicInfoChange('bio', e.target.value)}
                        placeholder="Share a brief summary of what drives your work, your technical passion, and career background..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all resize-none"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>Email Address</span>
                        </label>
                        <input
                          type="email"
                          value={formData.basicInfo.email}
                          onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                          placeholder="sarah.jenkins@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>Phone Number (Optional)</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.basicInfo.phone || ''}
                          onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
                          placeholder="+1 (555) 234-5678"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Location / City</span>
                      </label>
                      <input
                        type="text"
                        value={formData.basicInfo.location || ''}
                        onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                        placeholder="e.g., San Francisco, CA or Remote"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Social Media Links */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Social & Repository Links
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative">
                          <Github className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="url"
                            value={formData.basicInfo.socials.github || ''}
                            onChange={(e) => handleSocialChange('github', e.target.value)}
                            placeholder="https://github.com/username"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
                          />
                        </div>

                        <div className="relative">
                          <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="url"
                            value={formData.basicInfo.socials.linkedin || ''}
                            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
                          />
                        </div>

                        <div className="relative">
                          <Twitter className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="url"
                            value={formData.basicInfo.socials.twitter || ''}
                            onChange={(e) => handleSocialChange('twitter', e.target.value)}
                            placeholder="https://twitter.com/handle"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
                          />
                        </div>

                        <div className="relative">
                          <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="url"
                            value={formData.basicInfo.socials.website || ''}
                            onChange={(e) => handleSocialChange('website', e.target.value)}
                            placeholder="https://mywebsite.dev"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Avatar Image URL */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Avatar Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.basicInfo.avatarUrl || ''}
                        onChange={(e) => handleBasicInfoChange('avatarUrl', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF] focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: WORK & EXPERIENCE */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#1E65FF]" />
                        <span>Work Experience History</span>
                      </h3>
                      <p className="text-xs text-slate-500">Add past and current roles with quantified accomplishments.</p>
                    </div>

                    <button
                      onClick={handleAddExperience}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1E65FF] border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  {/* Experience Cards List */}
                  <div className="space-y-4">
                    {formData.workExperience.map((exp, expIdx) => (
                      <div
                        key={exp.id}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 relative group shadow-sm"
                      >
                        {/* Header bar of experience card */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-[#1E65FF] text-white flex items-center justify-center text-[10px]">
                              {expIdx + 1}
                            </span>
                            <span>{exp.company || 'New Experience Entry'}</span>
                          </span>

                          <button
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                            title="Remove Experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Company & Role */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Company Name <span className="text-[#1E65FF]">*</span>
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                              placeholder="e.g., Stripe or Apex Systems"
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Role / Job Title <span className="text-[#1E65FF]">*</span>
                            </label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                              placeholder="e.g., Senior Software Engineer"
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                            />
                          </div>
                        </div>

                        {/* Dates & Current Toggle */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                              placeholder="e.g., 2022 or Jan 2022"
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                            <input
                              type="text"
                              disabled={exp.current}
                              value={exp.current ? 'Present' : exp.endDate}
                              onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                              placeholder="e.g., 2024"
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF] disabled:bg-slate-100 disabled:text-slate-400"
                            />
                          </div>

                          <div className="pt-4 sm:pt-4">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!exp.current}
                                onChange={(e) => handleExperienceChange(exp.id, 'current', e.target.checked)}
                                className="w-4 h-4 rounded text-[#1E65FF] focus:ring-[#1E65FF] border-slate-300"
                              />
                              <span>I currently work here</span>
                            </label>
                          </div>
                        </div>

                        {/* Highlights (Bullet points) */}
                        <div className="space-y-2 pt-2 border-t border-slate-200/50">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-700">
                              Key Responsibilities & Quantified Highlights
                            </label>
                            <button
                              onClick={() => handleAddHighlight(exp.id)}
                              className="text-[11px] font-bold text-[#1E65FF] hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Bullet</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {exp.highlights.map((bullet, bIdx) => (
                              <div key={bIdx} className="flex items-center gap-2">
                                <span className="text-slate-400 text-xs font-mono">•</span>
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => handleHighlightChange(exp.id, bIdx, e.target.value)}
                                  placeholder="e.g., Reduced server API latency by 45% using Redis cache pipelines"
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                                />
                                {exp.highlights.length > 1 && (
                                  <button
                                    onClick={() => handleRemoveHighlight(exp.id, bIdx)}
                                    className="text-slate-400 hover:text-rose-600 p-1"
                                    title="Remove bullet"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PROJECTS & SKILLS */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {/* Skills Section */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#1E65FF]" />
                        <span>Skills & Technologies</span>
                      </h3>
                      <p className="text-xs text-slate-500">Add technical languages, frameworks, libraries, and design tools.</p>
                    </div>

                    {/* Skill Tag Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Type a skill and press Enter (e.g. React, Next.js, Docker)..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                      />
                      <button
                        onClick={() => handleAddSkill()}
                        className="px-4 py-2 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Popular Quick Suggestions */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-500">Quick Add Suggestions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {popularSkills.filter((s) => !formData.skills.includes(s)).slice(0, 8).map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleAddSkill(suggestion)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#1E65FF] text-[11px] font-medium text-slate-700 hover:text-[#1E65FF] transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Current Skills List */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-xs font-semibold text-slate-700 mb-2">
                        Active Portfolio Skills ({formData.skills.length})
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[36px]">
                        {formData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-[#1E65FF] border border-blue-200 text-xs font-semibold"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-[#1E65FF]/70 hover:text-[#1E65FF]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {formData.skills.length === 0 && (
                          <span className="text-xs text-slate-400 italic">No skills added yet. Add some above!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-[#1E65FF]" />
                          <span>Flagship Projects ({formData.projects.length})</span>
                        </h3>
                        <p className="text-xs text-slate-500">Showcase software repositories, apps, websites, or case studies.</p>
                      </div>

                      <button
                        onClick={handleAddProject}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1E65FF] border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    {formData.projects.map((proj, projIdx) => (
                      <div
                        key={proj.id}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 relative shadow-sm"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-[#1E65FF] text-white flex items-center justify-center text-[10px]">
                              {projIdx + 1}
                            </span>
                            <span>{proj.title || 'New Project Showcase'}</span>
                          </span>

                          <button
                            onClick={() => handleRemoveProject(proj.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                            title="Remove Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Title & Role */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Project Title <span className="text-[#1E65FF]">*</span>
                            </label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => handleProjectChange(proj.id, 'title', e.target.value)}
                              placeholder="e.g., DevPulse Cloud Monitor"
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Your Role / Contribution
                            </label>
                            <input
                              type="text"
                              value={proj.role || ''}
                              onChange={(e) => handleProjectChange(proj.id, 'role', e.target.value)}
                              placeholder="e.g., Lead Architect & Creator"
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Project Description <span className="text-[#1E65FF]">*</span>
                          </label>
                          <textarea
                            rows={2}
                            value={proj.description}
                            onChange={(e) => handleProjectChange(proj.id, 'description', e.target.value)}
                            placeholder="Explain the problem solved, tech architecture, and user value..."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF] resize-none"
                          />
                        </div>

                        {/* Project Tech Stack Tags */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Technologies Used
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={projectTechInput[proj.id] || ''}
                              onChange={(e) => setProjectTechInput({ ...projectTechInput, [proj.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddProjectTech(proj.id);
                                }
                              }}
                              placeholder="Add tag (e.g. React, WebSockets)..."
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                            />
                            <button
                              onClick={() => handleAddProjectTech(proj.id)}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                            >
                              Add Tag
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[#1E65FF] border border-blue-200 text-[11px] font-medium"
                              >
                                <span>{tech}</span>
                                <button
                                  onClick={() => handleRemoveProjectTech(proj.id, tech)}
                                  className="text-[#1E65FF]/70 hover:text-[#1E65FF]"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Links & Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Live Demo URL</label>
                            <input
                              type="url"
                              value={proj.link || ''}
                              onChange={(e) => handleProjectChange(proj.id, 'link', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">GitHub Repo</label>
                            <input
                              type="url"
                              value={proj.github || ''}
                              onChange={(e) => handleProjectChange(proj.id, 'github', e.target.value)}
                              placeholder="https://github.com/..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Impact / Metrics Badge</label>
                            <input
                              type="text"
                              value={proj.metrics || ''}
                              onChange={(e) => handleProjectChange(proj.id, 'metrics', e.target.value)}
                              placeholder="e.g., 15k+ DAU • 45% faster"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: TEMPLATE SELECTION & LAUNCH */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#1E65FF]" />
                      <span>Select Portfolio Archetype & Launch</span>
                    </h3>
                    <p className="text-xs text-slate-500">Choose the presentation style that best fits your target role.</p>
                  </div>

                  {/* Template Archetypes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {templateOptions.map((tmpl) => {
                      const isSelected = (formData.templateId || 'developer') === tmpl.id;
                      return (
                        <div
                          key={tmpl.id}
                          onClick={() => setFormData({ ...formData, templateId: tmpl.id as TemplateId })}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                            ? 'bg-blue-50/70 border-[#1E65FF] ring-2 ring-[#1E65FF]/20 shadow-md'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                            }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-900">{tmpl.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white text-[#1E65FF] border border-blue-200">
                                {tmpl.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{tmpl.description}</p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-500">{tmpl.tagline}</span>
                            {isSelected && (
                              <span className="text-[#1E65FF] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Selected
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ready to Publish Summary Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Portfolio Data Verified</div>
                          <div className="text-[11px] text-slate-500">All required sections ready for web publication</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600">100% READY</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="font-bold text-slate-900">{formData.workExperience.length}</div>
                        <div className="text-[10px] text-slate-500">Roles Added</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="font-bold text-slate-900">{formData.projects.length}</div>
                        <div className="text-[10px] text-slate-500">Projects</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="font-bold text-slate-900">{formData.skills.length}</div>
                        <div className="text-[10px] text-slate-500">Skills Mapped</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Sticky Bottom Action Buttons */}
          <div className="p-4 sm:p-6 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                className="px-7 py-3 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#1E65FF]/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSaveAndLaunch}
                className="px-8 py-3.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#1E65FF]/25 flex items-center gap-2 transition-all active:scale-95 group"
              >
                <Rocket className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>Save & Launch Live Portfolio</span>
              </button>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Live Split-Screen Portfolio Preview */}
        <div className="hidden lg:flex flex-1 flex-col bg-slate-100 border-l border-slate-200 overflow-hidden">

          {/* Top Browser Bar of Preview Window */}
          <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="ml-3 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 flex items-center gap-1.5 max-w-xs truncate">
                <Globe className="w-3.5 h-3.5 text-[#1E65FF]" />
                <span>https://{livePortfolio.slug}.techhumans.live</span>
              </div>
            </div>

            {/* Device Viewport Switcher (Desktop vs Mobile) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${deviceView === 'desktop'
                    ? 'bg-white text-[#1E65FF] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Desktop</span>
                </button>

                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${deviceView === 'mobile'
                    ? 'bg-white text-[#1E65FF] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Mobile</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Sync</span>
              </div>
            </div>
          </div>

          {/* Live Preview Stage */}
          <div className="flex-1 p-4 xl:p-6 overflow-y-auto flex items-start justify-center">
            <div
              className={`transition-all duration-300 w-full ${deviceView === 'mobile'
                ? 'max-w-[390px] rounded-[36px] ring-12 ring-slate-900 border-4 border-slate-800 shadow-2xl overflow-hidden bg-white min-h-[750px] my-4'
                : 'max-w-5xl rounded-2xl border border-slate-200 shadow-lg bg-white overflow-hidden'
                }`}
            >
              <PortfolioRenderer portfolio={livePortfolio} isCompact={deviceView === 'mobile'} />
            </div>
          </div>

        </div>

      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-7xl h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return content;
};
export default BuildFromScratchWizard;
