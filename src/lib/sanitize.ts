import { PortfolioData, AchievementItem, ExperienceItem, ProjectItem, EducationItem } from '../types';

export function isReadableText(str?: string | null): boolean {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length === 0) return false;

  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/.test(trimmed)) {
    return false;
  }


  const replacementCount = (trimmed.match(/\uFFFD/g) || []).length;
  if (replacementCount > 0 && replacementCount / trimmed.length > 0.05) {
    return false;
  }

  if (/MSWordDoc|WordDocument|themeManager|\[Content_Types\]\.xml|_rels\/\.rels|clrMap|CJOJ|QJ^J_PK\x03\x04|<\?xml/i.test(trimmed)) {
    return false;
  }

  if (/^(personal details|date of birth|languages known|hobbies|extracurricular activities|references|declaration|contact details)[:\s]*$/i.test(trimmed)) {
    return false;
  }

  if (trimmed.length > 6) {
    const alphaNumCount = (trimmed.match(/[a-zA-Z0-9]/g) || []).length;
    if (alphaNumCount / trimmed.length < 0.4) {
      return false;
    }
  }

  return true;
}

export function cleanText(raw?: string | null): string {
  if (!raw || typeof raw !== 'string') return '';

  return raw
    .replace(/[\u2018\u2019\u201A\u201F]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '\"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u00B7\u2023\u25E6\u25CF\u25AA\u25AB\u25A0\u25A1●▪■]/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/\uFFFD/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/**
 * Normalizes external URLs and social handles into valid, absolute https:// URLs
 */
export function formatExternalUrl(url?: string, defaultDomain?: 'github' | 'linkedin' | 'twitter' | 'website'): string {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim().replace(/^[,\s;'"]+|[,\s;'"]+$/g, '');
  if (!trimmed) return '';

  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed;
  }

  // Upgrade http to https
  if (/^http:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed.slice(7);
  }

  // If already absolute URL with https:// protocol
  if (/^https:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // If protocol-relative e.g. //github.com/...
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // If starts with domain e.g. github.com/..., linkedin.com/..., in.linkedin.com/..., www.linkedin.com/...
  if (/^(?:[a-zA-Z0-9-]+\.)*(?:github\.com|linkedin\.com|twitter\.com|x\.com|instagram\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // If it's a raw username/handle and defaultDomain is provided
  const cleanHandle = trimmed.replace(/^@/, '');
  if (defaultDomain === 'github') {
    return `https://github.com/${cleanHandle.replace(/^github\.com\/?/i, '')}`;
  }
  if (defaultDomain === 'linkedin') {
    const withoutPrefix = cleanHandle.replace(/^(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)*linkedin\.com\/?/i, '');
    return withoutPrefix.startsWith('in/') || withoutPrefix.startsWith('company/') 
      ? `https://linkedin.com/${withoutPrefix}` 
      : `https://linkedin.com/in/${withoutPrefix}`;
  }
  if (defaultDomain === 'twitter') {
    return `https://x.com/${cleanHandle.replace(/^(?:twitter\.com|x\.com)\/?/i, '')}`;
  }

  // Default fallback: prepend https://
  return `https://${trimmed}`;
}

import { initialPortfolioData } from '../data/mockData';

export function sanitizePortfolioData(data?: PortfolioData | any): PortfolioData {
  const base = (data && typeof data === 'object') ? data : initialPortfolioData;
  const rawProfile = base.profile || initialPortfolioData.profile || {};

  const rawCandidates = rawProfile?.photo?.candidates || [];
  const cleanedCandidates = Array.isArray(rawCandidates) 
    ? rawCandidates.filter((c: any) => !c?.id?.startsWith('canvas-photo-')) 
    : [];
  const isLegacyCanvasPhoto = Array.isArray(rawCandidates) && rawCandidates.some((c: any) => c?.id?.startsWith('canvas-photo-') && c?.url === rawProfile?.avatarUrl);
  const activeAvatar = isLegacyCanvasPhoto
    ? (cleanedCandidates[0]?.url || '')
    : (rawProfile?.avatarUrl || '');

  const profile = {
    fullName: cleanText(rawProfile?.fullName) || initialPortfolioData.profile.fullName,
    headline: cleanText(rawProfile?.headline) || initialPortfolioData.profile.headline,
    bio: cleanText(rawProfile?.bio) || initialPortfolioData.profile.bio,
    avatarUrl: activeAvatar || initialPortfolioData.profile.avatarUrl,
    bannerUrl: rawProfile?.bannerUrl || initialPortfolioData.profile.bannerUrl,
    statusText: rawProfile?.statusText || '',
    photo: rawProfile?.photo ? {
      ...rawProfile.photo,
      url: activeAvatar,
      candidates: cleanedCandidates,
      selected: Boolean(activeAvatar),
      source: (activeAvatar ? 'resume' : 'none') as 'resume' | 'none' | 'manual',
    } : undefined,
    socials: {
      github: formatExternalUrl(rawProfile?.socials?.github, 'github'),
      linkedin: formatExternalUrl(rawProfile?.socials?.linkedin, 'linkedin'),
      twitter: formatExternalUrl(rawProfile?.socials?.twitter, 'twitter'),
      website: formatExternalUrl(rawProfile?.socials?.website, 'website'),
      email: cleanText(rawProfile?.socials?.email) || '',
      phone: cleanText(rawProfile?.socials?.phone) || '',
      location: cleanText(rawProfile?.socials?.location) || '',
    },
  };

  const rawAbout = base.about || initialPortfolioData.about || {};
  const about = {
    summary: cleanText(rawAbout?.summary) || initialPortfolioData.about.summary,
    highlights: Array.isArray(rawAbout?.highlights)
      ? rawAbout.highlights.map(cleanText).filter(isReadableText)
      : initialPortfolioData.about.highlights,
    yearsOfExperience: rawAbout?.yearsOfExperience || initialPortfolioData.about.yearsOfExperience || 0,
  };

  const achievements: AchievementItem[] = (Array.isArray(base.achievements) ? base.achievements : (initialPortfolioData.achievements || []))
    .filter((ach: any) => isReadableText(ach?.title) && isReadableText(ach?.description || ach?.title))
    .map((ach: any) => ({
      ...ach,
      title: cleanText(ach.title),
      description: cleanText(ach.description || ''),
      issuer: cleanText(ach.issuer || ''),
      date: cleanText(ach.date || ''),
    }));

  const experience: ExperienceItem[] = (Array.isArray(base.experience) ? base.experience : (initialPortfolioData.experience || []))
    .filter((exp: any) => isReadableText(exp?.role) && isReadableText(exp?.company))
    .map((exp: any) => ({
      ...exp,
      role: cleanText(exp.role),
      company: cleanText(exp.company),
      description: Array.isArray(exp.description)
        ? exp.description.map(cleanText).filter(isReadableText)
        : typeof exp.description === 'string' && isReadableText(exp.description)
          ? [cleanText(exp.description)]
          : [],
    }));

  const projects: ProjectItem[] = (Array.isArray(base.projects) ? base.projects : (initialPortfolioData.projects || []))
    .filter((proj: any) => isReadableText(proj?.title))
    .map((proj: any) => ({
      ...proj,
      title: cleanText(proj.title),
      description: cleanText(proj.description || ''),
      link: formatExternalUrl(proj.link),
      github: formatExternalUrl(proj.github, 'github'),
      technologies: Array.isArray(proj.technologies)
        ? proj.technologies.map(cleanText).filter(isReadableText)
        : [],
    }));

  const education: EducationItem[] = (Array.isArray(base.education) ? base.education : (initialPortfolioData.education || []))
    .filter((edu: any) => isReadableText(edu?.institution) || isReadableText(edu?.degree))
    .map((edu: any) => ({
      ...edu,
      institution: cleanText(edu.institution),
      degree: cleanText(edu.degree),
      field: cleanText(edu.field || ''),
      gpa: cleanText(edu.gpa || ''),
    }));

  return {
    ...initialPortfolioData,
    ...base,
    profile,
    about,
    projects,
    experience,
    education,
    achievements,
  };
}
