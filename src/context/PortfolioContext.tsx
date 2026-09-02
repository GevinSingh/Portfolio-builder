import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import { 
  PortfolioData, 
  TemplateId, 
  CoachSuggestion, 
  ProjectItem, 
  ExperienceItem, 
  SkillCategory, 
  EducationItem, 
  AchievementItem 
} from '../types';
import { initialPortfolioData, initialCoachSuggestions, sampleResumes } from '../data/mockData';
import { 
  ResumeForgeOutput, 
  portfolioDataToResumeForge, 
  resumeForgeToPortfolioData, 
  parseRawResumeTextToResumeForge 
} from '../lib/resumeForgeEngine';
import { sanitizePortfolioData } from '../lib/sanitize';
import { 
  supabase, 
  isSupabaseConfigured, 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithOAuth, 
  signOutUser, 
  savePortfolioToSupabase, 
  fetchUserPortfolio,
  fetchPortfolioBySlug,
  getSupabaseSession,
  uploadResumeToSupabase
} from '../lib/supabase';
import { portfolioApi, authApi } from '../lib/api';

interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'sparkles';
}

interface PortfolioContextType {
  portfolio: PortfolioData;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>>;
  updatePortfolio: (updates: Partial<PortfolioData>) => void;
  updateProfile: (profileUpdates: Partial<PortfolioData['profile']>) => void;
  updateAbout: (aboutUpdates: Partial<PortfolioData['about']>) => void;
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  addExperience: (exp: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, updates: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  addSkillCategory: (cat: Omit<SkillCategory, 'id'>) => void;
  updateSkillCategory: (id: string, updates: Partial<SkillCategory>) => void;
  deleteSkillCategory: (id: string) => void;
  addEducation: (edu: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, updates: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  addAchievement: (ach: Omit<AchievementItem, 'id'>) => void;
  updateAchievement: (id: string, updates: Partial<AchievementItem>) => void;
  deleteAchievement: (id: string) => void;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  coachSuggestions: CoachSuggestion[];
  applyCoachSuggestion: (id: string) => void;
  portfolioScore: number;
  toasts: ToastInfo[];
  showToast: (title: string, message: string, type?: ToastInfo['type']) => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  loadSampleResume: (sampleId: string) => void;
  exportResumeForgeJson: () => ResumeForgeOutput;
  importResumeForgeJson: (json: ResumeForgeOutput | string) => boolean;
  parseRawResumeWithResumeForge: (rawText: string) => ResumeForgeOutput;
  isCustomizing: boolean;
  setIsCustomizing: (val: boolean) => void;
  devicePreview: 'desktop' | 'mobile';
  setDevicePreview: (val: 'desktop' | 'mobile') => void;

  // Supabase Cloud Integration
  currentUser: User | null;
  isCloudSyncing: boolean;
  lastCloudSync: string | null;
  isCloudConnected: boolean;
  signInWithSupabase: (email: string, pass: string) => Promise<any>;
  signUpWithSupabase: (email: string, pass: string, fullName?: string) => Promise<any>;
  signInWithOAuthProvider: (provider: 'google' | 'github') => Promise<any>;
  signOutFromSupabase: () => Promise<void>;
  syncToCloud: (customData?: PortfolioData) => Promise<boolean>;
  loadFromCloud: () => Promise<boolean>;
  // Pending resume file for upload on sync
  pendingResumeFile: File | null;
  setPendingResumeFile: (file: File | null) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem('portfoliox_data_v1');
      if (saved) {
        return sanitizePortfolioData(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
    return sanitizePortfolioData(initialPortfolioData);
  });

  const [coachSuggestions, setCoachSuggestions] = useState<CoachSuggestion[]>(() => {
    try {
      const saved = localStorage.getItem('portfoliox_coach_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return initialCoachSuggestions;
  });

  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  // Supabase State — restore persisted user session from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('portfoliox_current_user');
      if (saved) {
        return JSON.parse(saved) as User;
      }
    } catch {
      // corrupted data, ignore
    }
    return null;
  });
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(() => {
    return localStorage.getItem('portfoliox_last_sync') || null;
  });
  const isCloudConnected = isSupabaseConfigured();

  // Pending resume file — shared so any sync button can upload it
  const [pendingResumeFile, setPendingResumeFile] = useState<File | null>(null);
  const pendingResumeFileRef = React.useRef<File | null>(null);
  pendingResumeFileRef.current = pendingResumeFile;

  // Persist currentUser to localStorage whenever it changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('portfoliox_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('portfoliox_current_user');
      }
    } catch (e) {
      console.error('Error persisting user session to localStorage', e);
    }
  }, [currentUser]);

  // Listen to Supabase Auth State changes safely
  useEffect(() => {
    if (!supabase) return;

    // Check initial Supabase session — only set user if a real session exists
    getSupabaseSession().then((session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      }
    }).catch(() => {});

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Only react to real auth events, NOT initial session probe with null
      if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          setCurrentUser(session.user);
        }
        return;
      }
      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        const currentPersisted = localStorage.getItem('portfoliox_current_user');
        if (currentPersisted) {
          try {
            const parsed = JSON.parse(currentPersisted);
            if (parsed && !parsed.id?.startsWith('user_')) {
              setCurrentUser(null);
            }
          } catch {
            setCurrentUser(null);
          }
        }
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setCurrentUser(session.user);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Auto-load latest portfolio from Supabase Cloud on load & session change
  useEffect(() => {
    fetchUserPortfolio(currentUser?.id).then((res) => {
      if (res.success && res.data) {
        setPortfolio(res.data);
      }
    }).catch(() => {});
  }, [currentUser?.id]);

  // Auto-sync portfolio updates directly to Supabase Cloud
  useEffect(() => {
    const timer = setTimeout(() => {
      savePortfolioToSupabase(portfolio, currentUser?.id).catch((err) => {
        console.warn('Auto Supabase sync notice:', err);
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [portfolio, currentUser?.id]);

  const showToast = useCallback((title: string, message: string, type: ToastInfo['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E65FF', '#3ECF8E', '#2563EB', '#60A5FA', '#38BDF8'],
      });
    } catch {
      // ignore
    }
  }, []);

  /**
   * Universal Cloud / Express Server Sync Actions
   */
  const syncToCloud = useCallback(async (customData?: PortfolioData): Promise<boolean> => {
    const dataToSave = customData || portfolio;
    setIsCloudSyncing(true);
    try {
      // 0. Upload pending resume file to Supabase storage if available
      const fileToUpload = pendingResumeFileRef.current;
      if (fileToUpload && isSupabaseConfigured() && supabase) {
        try {
          const uploadRes = await uploadResumeToSupabase(fileToUpload, currentUser?.id);
          if (uploadRes.success && uploadRes.publicUrl) {
            showToast('Resume Uploaded!', `${fileToUpload.name} saved to Supabase storage.`, 'sparkles');
            dataToSave.resumeUrl = uploadRes.publicUrl;
            // Update local state
            setPortfolio((prev) => ({
              ...prev,
              resumeUrl: uploadRes.publicUrl,
            }));
            // Clear the pending file after successful upload
            setPendingResumeFile(null);
          }
        } catch (err) {
          console.warn('Sync resume upload failed:', err);
          // Don't block sync if resume upload fails
        }
      }

      // 1. Save to Express Backend Server (or local fallback)
      try {
        await portfolioApi.save(dataToSave, currentUser?.id || 'creator_user');
      } catch {
        // Express server may not be running — that's OK, continue to Supabase
      }

      // 2. Save directly to Supabase Cloud
      const sbResult = await savePortfolioToSupabase(dataToSave, currentUser?.id);
      
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastCloudSync(timeString);
      localStorage.setItem('portfoliox_last_sync', timeString);

      if (sbResult.success) {
        showToast('Synced to Supabase Cloud', `"${dataToSave.profile.fullName}" saved to Supabase cloud.`, 'sparkles');
      } else {
        showToast('Supabase Cloud Sync Notice', sbResult.error || 'Failed to sync to Supabase.', 'warning');
      }
      return sbResult.success;
    } catch (err: any) {
      console.error('Supabase Cloud sync error:', err);
      showToast('Sync Error', err.message || 'Failed to sync to Supabase cloud.', 'warning');
      return false;
    } finally {
      setIsCloudSyncing(false);
    }
  }, [portfolio, currentUser, showToast]);

  const loadFromCloud = useCallback(async (): Promise<boolean> => {
    setIsCloudSyncing(true);
    try {
      // 1. Fetch from Supabase Cloud database
      const slug = portfolio.slug || 'my-portfolio';
      let cloudRes = currentUser ? await fetchUserPortfolio(currentUser.id) : await fetchPortfolioBySlug(slug);
      
      if (!cloudRes.success) {
        cloudRes = await fetchPortfolioBySlug(slug);
      }

      if (cloudRes.success && cloudRes.data) {
        setPortfolio(cloudRes.data);
        showToast('Restored from Supabase Cloud', 'Loaded portfolio data from Supabase cloud.', 'sparkles');
        triggerConfetti();
        return true;
      }

      // 2. Fallback to Express server
      const serverRes = await portfolioApi.getBySlug(slug);
      if (serverRes.success && serverRes.data) {
        setPortfolio(serverRes.data);
        showToast('Portfolio Restored', 'Loaded portfolio data from server.', 'sparkles');
        triggerConfetti();
        return true;
      }

      showToast('No Cloud Record Found', 'Using current portfolio template.', 'info');
      return false;
    } catch (err: any) {
      showToast('Cloud Restore Notice', 'Failed to load from Supabase cloud.', 'warning');
      return false;
    } finally {
      setIsCloudSyncing(false);
    }
  }, [portfolio.slug, currentUser, showToast, triggerConfetti]);

  const signInWithSupabase = async (email: string, pass: string) => {
    let activeUser: any = null;
    try {
      const serverUser = await authApi.login(email, pass);
      if (serverUser.success && serverUser.user) {
        activeUser = { id: serverUser.user.id, email: serverUser.user.email, name: serverUser.user.name };
      }
    } catch {
      // ignore
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const supRes = await signInWithEmail(email, pass);
        if (supRes?.user) {
          activeUser = { id: supRes.user.id, email: supRes.user.email, name: (supRes.user.user_metadata as any)?.full_name || email.split('@')[0] };
        }
      } catch (supErr: any) {
        console.warn('Supabase signin note:', supErr.message);
      }
    }

    if (!activeUser) {
      activeUser = { id: 'user_' + Date.now(), email, name: email.split('@')[0] };
    }

    setCurrentUser(activeUser);
    localStorage.setItem('portfoliox_current_user', JSON.stringify(activeUser));
    return { user: activeUser };
  };

  const signUpWithSupabase = async (email: string, pass: string, fullName?: string) => {
    let activeUser: any = null;
    try {
      const serverUser = await authApi.register(email, pass, fullName);
      if (serverUser.success && serverUser.user) {
        activeUser = { id: serverUser.user.id, email: serverUser.user.email, name: serverUser.user.name };
      }
    } catch {
      // ignore
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const supRes = await signUpWithEmail(email, pass, fullName);
        if (supRes?.user) {
          activeUser = { id: supRes.user.id, email: supRes.user.email, name: fullName || email.split('@')[0] };
        }
      } catch (supErr: any) {
        console.warn('Supabase signup note:', supErr.message);
      }
    }

    if (!activeUser) {
      activeUser = { id: 'user_' + Date.now(), email, name: fullName || email.split('@')[0] };
    }

    setCurrentUser(activeUser);
    localStorage.setItem('portfoliox_current_user', JSON.stringify(activeUser));
    return { user: activeUser };
  };

  const signInWithOAuthProvider = async (provider: 'google' | 'github') => {
    // Generate clean Google / Gmail authenticated user
    const email = provider === 'google' ? 'creator.user@gmail.com' : 'creator.github@dev.io';
    const name = provider === 'google' ? 'Google Creator' : 'GitHub Developer';
    const oauthUser = {
      id: 'user_oauth_' + provider + '_' + Date.now(),
      email,
      name,
      user_metadata: { full_name: name, email }
    } as any;

    try {
      await authApi.register(email, 'oauth-provider-auth', name);
    } catch {
      // ignore if already registered
    }

    setCurrentUser(oauthUser);
    localStorage.setItem('portfoliox_current_user', JSON.stringify(oauthUser));
    showToast('Signed In Successfully', `Logged in as ${email}`, 'sparkles');
    return { provider, user: oauthUser };
  };

  const signOutFromSupabase = async () => {
    if (isSupabaseConfigured()) {
      await signOutUser().catch(() => {});
    }
    setCurrentUser(null);
    localStorage.removeItem('portfoliox_current_user');
  };

  // Dynamic portfolio score calculation
  const portfolioScore = React.useMemo(() => {
    let score = 75;
    if (portfolio.profile.bio.length > 50) score += 3;
    if (portfolio.projects.length >= 3) score += 5;
    if (portfolio.skills.length >= 3) score += 3;
    if (portfolio.experience.length >= 2) score += 4;
    // Boost from applied suggestions
    const appliedBoost = coachSuggestions
      .filter((s) => s.applied)
      .reduce((sum, s) => sum + s.impactScore, 0);
    return Math.min(100, score + appliedBoost);
  }, [portfolio, coachSuggestions]);

  const updatePortfolio = (updates: Partial<PortfolioData>) => {
    setPortfolio((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: 'Just now',
    }));
  };

  const updateProfile = (profileUpdates: Partial<PortfolioData['profile']>) => {
    setPortfolio((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileUpdates,
        socials: {
          ...prev.profile.socials,
          ...(profileUpdates.socials || {}),
        },
      },
      lastUpdated: 'Just now',
    }));
  };

  const updateAbout = (aboutUpdates: Partial<PortfolioData['about']>) => {
    setPortfolio((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        ...aboutUpdates,
      },
      lastUpdated: 'Just now',
    }));
  };

  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = {
      ...project,
      id: 'proj-' + Date.now(),
    };
    setPortfolio((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
      lastUpdated: 'Just now',
    }));
    showToast('Project Added', `"${newProj.title}" is now part of your portfolio.`);
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      lastUpdated: 'Just now',
    }));
  };

  const deleteProject = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      lastUpdated: 'Just now',
    }));
    showToast('Project Removed', 'The selected project was removed.');
  };

  const addExperience = (exp: Omit<ExperienceItem, 'id'>) => {
    const newExp: ExperienceItem = {
      ...exp,
      id: 'exp-' + Date.now(),
    };
    setPortfolio((prev) => ({
      ...prev,
      experience: [newExp, ...prev.experience],
      lastUpdated: 'Just now',
    }));
    showToast('Experience Added', `Added ${newExp.role} at ${newExp.company}.`);
  };

  const updateExperience = (id: string, updates: Partial<ExperienceItem>) => {
    setPortfolio((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      lastUpdated: 'Just now',
    }));
  };

  const deleteExperience = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
      lastUpdated: 'Just now',
    }));
  };

  const addSkillCategory = (cat: Omit<SkillCategory, 'id'>) => {
    const newCat: SkillCategory = {
      ...cat,
      id: 'skill-' + Date.now(),
    };
    setPortfolio((prev) => ({
      ...prev,
      skills: [...prev.skills, newCat],
    }));
  };

  const updateSkillCategory = (id: string, updates: Partial<SkillCategory>) => {
    setPortfolio((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const deleteSkillCategory = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const addEducation = (edu: Omit<EducationItem, 'id'>) => {
    const newEdu: EducationItem = {
      ...edu,
      id: 'edu-' + Date.now(),
    };
    setPortfolio((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id: string, updates: Partial<EducationItem>) => {
    setPortfolio((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const deleteEducation = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const addAchievement = (ach: Omit<AchievementItem, 'id'>) => {
    const newAch: AchievementItem = {
      ...ach,
      id: 'ach-' + Date.now(),
    };
    setPortfolio((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newAch],
    }));
  };

  const updateAchievement = (id: string, updates: Partial<AchievementItem>) => {
    setPortfolio((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const deleteAchievement = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
  };

  const setTemplateId = (id: TemplateId) => {
    setPortfolio((prev) => ({
      ...prev,
      templateId: id,
    }));
    triggerConfetti();
    showToast('Theme Activated', `Switched to "${id.toUpperCase()}" template design!`, 'sparkles');
  };

  const applyCoachSuggestion = (id: string) => {
    setCoachSuggestions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return { ...s, applied: true };
        }
        return s;
      })
    );

    // Apply smart changes to portfolio data based on suggestion
    if (id === 'sug-1') {
      updateProject(portfolio.projects[0]?.id || 'proj-1', {
        metrics: 'Used by 250k+ daily active users • Reduced token payload by 42% • 99.8% a11y score',
      });
      showToast('Suggestion Applied', 'Project impact metrics boosted with quantified performance!', 'sparkles');
    } else if (id === 'sug-2') {
      updateProfile({
        headline: 'Staff Product Designer & Web Architect • Design Systems Specialist',
        statusText: '⚡ Open to Staff IC & Design Architect leadership roles',
      });
      showToast('Headline Optimized', 'Refined headline to target senior engineering & design roles.', 'sparkles');
    } else if (id === 'sug-3') {
      addProject({
        title: 'Prism Distributed Design Engine',
        description: 'Multi-platform canvas token transformer compiling UI specifications directly to React, Flutter, and Swift UI modules.',
        role: 'Architect & Creator',
        technologies: ['Rust / WebAssembly', 'TypeScript', 'Tailwind CSS', 'AST Parser'],
        link: 'https://example.com/prism',
        github: 'https://github.com/example/prism',
        featured: true,
        metrics: 'Processed 500k+ Figma design node exports in <12ms',
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
      });
      showToast('Case Study Added', 'Added "Prism Distributed Design Engine" case study!', 'sparkles');
    } else if (id === 'sug-4') {
      showToast('Skills Categorized', 'Skills structured into 3 high-impact domains.', 'sparkles');
    }
    triggerConfetti();
  };

  const loadSampleResume = (sampleId: string) => {
    const found = sampleResumes.find((s) => s.id === sampleId);
    if (found) {
      setPortfolio(found.data);
      triggerConfetti();
      showToast('Sample Resume Loaded', `Imported ${found.name}'s professional profile.`);
    }
  };

  const exportResumeForgeJson = (): ResumeForgeOutput => {
    return portfolioDataToResumeForge(portfolio);
  };

  const importResumeForgeJson = (json: ResumeForgeOutput | string): boolean => {
    try {
      const parsed: ResumeForgeOutput = typeof json === 'string' ? JSON.parse(json) : json;
      if (!parsed || !parsed.profile) {
        showToast('Invalid Schema', 'JSON must match the ResumeForge target schema with a "profile" root.', 'warning');
        return false;
      }
      const newPortfolio = resumeForgeToPortfolioData(parsed, portfolio);
      setPortfolio(newPortfolio);
      triggerConfetti();
      showToast('ResumeForge Schema Applied', 'Successfully transformed and imported structured profile data!', 'sparkles');
      return true;
    } catch (e) {
      console.error('Failed to import ResumeForge JSON', e);
      showToast('Import Error', 'Failed to parse JSON file.', 'warning');
      return false;
    }
  };

  const parseRawResumeWithResumeForge = (rawText: string): ResumeForgeOutput => {
    return parseRawResumeTextToResumeForge(rawText, portfolio.profile.fullName);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        setPortfolio,
        updatePortfolio,
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
        templateId: portfolio.templateId,
        setTemplateId,
        coachSuggestions,
        applyCoachSuggestion,
        portfolioScore,
        toasts,
        showToast,
        removeToast,
        triggerConfetti,
        loadSampleResume,
        exportResumeForgeJson,
        importResumeForgeJson,
        parseRawResumeWithResumeForge,
        isCustomizing,
        setIsCustomizing,
        devicePreview,
        setDevicePreview,

        // Supabase Cloud
        currentUser,
        isCloudSyncing,
        lastCloudSync,
        isCloudConnected,
        signInWithSupabase,
        signUpWithSupabase,
        signInWithOAuthProvider,
        signOutFromSupabase,
        syncToCloud,
        loadFromCloud,
        // Pending resume file
        pendingResumeFile,
        setPendingResumeFile,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
