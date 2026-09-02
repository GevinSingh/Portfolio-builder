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

export function sanitizePortfolioData(data: PortfolioData): PortfolioData {
  if (!data) return data;

  const rawCandidates = data.profile?.photo?.candidates || [];
  const cleanedCandidates = rawCandidates.filter((c) => !c.id?.startsWith('canvas-photo-'));
  const isLegacyCanvasPhoto = rawCandidates.some((c) => c.id?.startsWith('canvas-photo-') && c.url === data.profile?.avatarUrl);
  const activeAvatar = isLegacyCanvasPhoto
    ? (cleanedCandidates[0]?.url || '')
    : (data.profile?.avatarUrl || '');

  const profile = {
    ...data.profile,
    fullName: cleanText(data.profile?.fullName) || 'Candidate Name',
    headline: cleanText(data.profile?.headline) || 'Software Professional',
    bio: cleanText(data.profile?.bio) || '',
    avatarUrl: activeAvatar,
    photo: data.profile?.photo ? {
      ...data.profile.photo,
      url: activeAvatar,
      candidates: cleanedCandidates,
      selected: Boolean(activeAvatar),
      source: (activeAvatar ? 'resume' : 'none') as 'resume' | 'none' | 'manual',
    } : undefined,
    socials: {
      github: formatExternalUrl(data.profile?.socials?.github, 'github'),
      linkedin: formatExternalUrl(data.profile?.socials?.linkedin, 'linkedin'),
      twitter: formatExternalUrl(data.profile?.socials?.twitter, 'twitter'),
      website: formatExternalUrl(data.profile?.socials?.website, 'website'),
      email: cleanText(data.profile?.socials?.email) || '',
      phone: cleanText(data.profile?.socials?.phone) || '',
      location: cleanText(data.profile?.socials?.location) || '',
    },
  };

  const about = data.about ? {
    ...data.about,
    summary: cleanText(data.about.summary) || '',
    highlights: Array.isArray(data.about.highlights)
      ? data.about.highlights.map(cleanText).filter(isReadableText)
      : [],
    yearsOfExperience: data.about.yearsOfExperience || 0,
  } : {
    summary: '',
    highlights: [],
    yearsOfExperience: 0,
  };

  const achievements: AchievementItem[] = (data.achievements || [])
    .filter(ach => isReadableText(ach.title) && isReadableText(ach.description || ach.title))
    .map(ach => ({
      ...ach,
      title: cleanText(ach.title),
      description: cleanText(ach.description || ''),
      issuer: cleanText(ach.issuer || ''),
      date: cleanText(ach.date || ''),
    }));

  const experience: ExperienceItem[] = (data.experience || [])
    .filter(exp => isReadableText(exp.role) && isReadableText(exp.company))
    .map(exp => ({
      ...exp,
      role: cleanText(exp.role),
      company: cleanText(exp.company),
      description: Array.isArray(exp.description)
        ? exp.description.map(cleanText).filter(isReadableText)
        : typeof exp.description === 'string' && isReadableText(exp.description)
          ? [cleanText(exp.description)]
          : [],
    }));

  const projects: ProjectItem[] = (data.projects || [])
    .filter(proj => isReadableText(proj.title))
    .map(proj => ({
      ...proj,
      title: cleanText(proj.title),
      description: cleanText(proj.description || ''),
      link: formatExternalUrl(proj.link),
      github: formatExternalUrl(proj.github, 'github'),
      technologies: Array.isArray(proj.technologies)
        ? proj.technologies.map(cleanText).filter(isReadableText)
        : [],
    }));

  const education: EducationItem[] = (data.education || [])
    .filter(edu => isReadableText(edu.institution) || isReadableText(edu.degree))
    .map(edu => ({
      ...edu,
      institution: cleanText(edu.institution),
      degree: cleanText(edu.degree),
      field: cleanText(edu.field || ''),
      gpa: cleanText(edu.gpa || ''),
    }));


  return {
    ...data,
    profile,
    about,
    projects,
    experience,
    education,
    achievements,
  };
}
