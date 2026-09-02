export type TemplateId = 'minimal' | 'developer' | 'creative' | 'executive' | 'bento' | 'editorial' | 'corporate' | 'architect' | 'metro' | 'noir' | 'academic';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  role?: string;
  technologies: string[];
  link?: string;
  github?: string;
  featured: boolean;
  metrics?: string;
  image?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  technologies?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface PhotoCandidate {
  id: string;
  url: string;
  score: number;
  width?: number;
  height?: number;
  source: 'resume' | 'manual';
  selected?: boolean;
}

export interface PhotoData {
  source: 'resume' | 'manual' | 'none';
  url: string;
  selected: boolean;
  candidates?: PhotoCandidate[];
}

export interface ProfileData {
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  bannerUrl?: string;
  statusText?: string;
  socials: SocialLinks;
  photo?: PhotoData;
}

export interface PortfolioData {
  id: string;
  slug: string;
  profile: ProfileData;
  about: {
    summary: string;
    highlights: string[];
    yearsOfExperience: number;
  };
  skills: SkillCategory[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  achievements: AchievementItem[];
  templateId: TemplateId;
  accentColor: string;
  fontFamily: string;
  customDomain?: string;
  isPublished: boolean;
  viewsCount: number;
  lastUpdated: string;
  supabaseSyncedAt?: string;
  resumeUrl?: string;
}

export interface CoachSuggestion {
  id: string;
  category: 'impact' | 'clarity' | 'skills' | 'structure';
  title: string;
  description: string;
  actionText: string;
  impactScore: number;
  applied: boolean;
  applyAction?: () => void;
}

export interface UserProfileData {
  basicInfo: {
    fullName: string;
    headline: string;
    bio: string;
    email: string;
    phone?: string;
    location?: string;
    socials: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
    avatarUrl?: string;
  };
  workExperience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current?: boolean;
    location?: string;
    highlights: string[];
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    title: string;
    description: string;
    techStack: string[];
    link?: string;
    github?: string;
    role?: string;
    image?: string;
    metrics?: string;
  }>;
  templateId?: TemplateId;
}

export interface SupabaseCloudState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  userEmail: string | null;
  userId: string | null;
}
