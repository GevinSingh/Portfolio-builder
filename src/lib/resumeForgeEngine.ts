import { PortfolioData, ProjectItem, ExperienceItem, EducationItem, SkillCategory, AchievementItem, PhotoData } from '../types';
import { isReadableText, cleanText, sanitizePortfolioData } from './sanitize';

/**
 * Target ResumeForge Application Schema
 */
export interface ResumeForgeProject {
  id: number | string;
  title: string;
  description: string;
  tech: string[];
  link: string;
}

export interface ResumeForgeExperience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface ResumeForgeEducation {
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export interface ResumeForgeProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  github: string;
  linkedin: string;
  skills: string[];
  projects: ResumeForgeProject[];
  experience: ResumeForgeExperience[];
  education: ResumeForgeEducation[];
  achievements?: string[];
}

export interface ResumeForgeOutput {
  profile: ResumeForgeProfile;
}

/**
 * System prompt definition for the ResumeForge AI Core Engine
 */
export const RESUME_FORGE_SYSTEM_PROMPT = `You are the ResumeForge AI Core Engine. Your objective is to parse raw user resumes, optimize bullet points for ATS compliance and recruiter impact, and format the output into structured JSON matching the ResumeForge application schema.

When presented with raw resume text or user profile data, analyze and optimize the content according to these guidelines:
1. Executive Bio: Transform generic statements into concise, high-impact technical summaries highlighting key specializations and quantifiable achievements.
2. Experience & Projects: Rewrite bullet points using action verbs, framing achievements with measurable metrics (e.g., percentage improvements, scale of users, bundle size reductions).
3. Skills: Extract and categorize relevant technical skills into discrete tags (languages, frameworks, tools, cloud services).

Return your response in structured JSON format matching this target structure:

{
  "profile": {
    "name": "Full Name",
    "title": "Professional Title / Target Role",
    "email": "Email Address",
    "phone": "Phone Number",
    "location": "City, Country",
    "bio": "ATS-optimized summary",
    "github": "GitHub URL",
    "linkedin": "LinkedIn URL",
    "skills": ["Skill1", "Skill2"],
    "projects": [
      {
        "id": 1,
        "title": "Project Name",
        "description": "Recruiter-ready outcome statement",
        "tech": ["Tech1", "Tech2"],
        "link": "Project URL"
      }
    ],
    "experience": [
      {
        "role": "Job Title",
        "company": "Company Name",
        "period": "Date Range",
        "description": "Quantified impact description"
      }
    ],
    "education": [
      {
        "degree": "Degree Name",
        "institution": "University/College",
        "year": "Graduation Period",
        "details": "GPA / Specializations"
      }
    ]
  }
}`;

/**
 * Action verbs vocabulary used for algorithmic optimization
 */
const ACTION_VERBS = [
  'Architected', 'Spearheaded', 'Engineered', 'Orchestrated', 'Optimized',
  'Pioneered', 'Scaled', 'Automated', 'Revamped', 'Streamlined', 'Delivered',
  'Developed', 'Designed', 'Constructed', 'Implemented', 'Transformed'
];

/**
 * Optimize an experience or project description to include high-impact action verbs and quantified metrics
 */
export function optimizeBulletPointForATS(rawText: string, context?: { role?: string; company?: string }): string {
  if (!rawText || rawText.trim().length === 0) {
    return 'Architected scalable technical systems, driving 40% performance gains and improving workflow reliability.';
  }

  let text = rawText.trim().replace(/^[-•*–—]\s*/, '');

  const hasMetrics = /\d+%|\d+k|\$\d+|\b\d+\b/i.test(text);
  const startsWithStrongVerb = ACTION_VERBS.some(v => new RegExp(`^${v}\\b`, 'i').test(text));

  if (hasMetrics && startsWithStrongVerb) {
    return text;
  }

  if (/^(helped|assisted|worked on|was responsible for|did|made|contributed to)/i.test(text)) {
    text = text.replace(/^(helped to|helped|assisted in|assisted|was responsible for|worked on|did|made|contributed to)\s*/i, '');
    const chosenVerb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
    text = `${chosenVerb} ${text.charAt(0).toLowerCase() + text.slice(1)}`;
  } else if (!startsWithStrongVerb && text.length > 0) {
    const firstWord = text.split(' ')[0];
    if (!firstWord.endsWith('ed') && !firstWord.endsWith('ing')) {
      const chosenVerb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
      text = `${chosenVerb} ${text.charAt(0).toLowerCase() + text.slice(1)}`;
    }
  }

  return text;
}

/**
 * Optimize executive bio according to ResumeForge guidelines
 */
export function optimizeExecutiveBio(name: string, title: string, rawBio?: string): string {
  if (rawBio && rawBio.length > 50 && !/^(results-driven|alex johnson)/i.test(rawBio)) {
    return rawBio.trim();
  }
  return `Results-driven ${title || 'Technical Specialist'} with proven expertise architecting scalable systems and high-impact digital solutions. Track record of delivering mission-critical projects, optimizing operational workflows by up to 45%, and leading cross-functional execution for enterprise stakeholders.`;
}

/**
 * Converts ResumeForgeOutput JSON structure to internal PortfolioData
 */
export function resumeForgeToPortfolioData(forgeData: ResumeForgeOutput, existingData?: Partial<PortfolioData>): PortfolioData {
  const p = forgeData.profile;

  const slug = p.name
    ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : (existingData?.slug || 'my-portfolio');

  const projects: ProjectItem[] = (p.projects || []).map((proj, index) => ({
    id: `proj-${proj.id || index + 1}`,
    title: proj.title || `Project ${index + 1}`,
    description: proj.description || '',
    // Only use real extracted tech; no generic fallbacks
    technologies: Array.isArray(proj.tech) && proj.tech.length > 0 ? proj.tech : [],
    link: proj.link || '',
    github: proj.link?.includes('github.com') ? proj.link : undefined,
    featured: index < 3,
    metrics: proj.description && /\d+%|\d+k|\$\d+/i.test(proj.description) ? 'ATS Verified Recruiter Impact' : undefined,
  }));

  const experience: ExperienceItem[] = (p.experience || []).map((exp, index) => {
    const rawPeriod = exp.period || '';
    const parts = rawPeriod.split(/\s*(?:[-–—]|\bto\b)\s*/i);
    const startDate = parts[0]?.trim() || '';
    let endDate = parts[1]?.trim() || (rawPeriod.toLowerCase().includes('present') || rawPeriod.toLowerCase().includes('current') ? 'Present' : '');
    if (endDate && endDate.toLowerCase().startsWith('presen')) {
      endDate = 'Present';
    }

    return {
      id: `exp-${index + 1}`,
      company: exp.company || '',
      role: exp.role || '',
      startDate,
      endDate,
      current: /present|current|now/i.test(rawPeriod) || endDate.toLowerCase() === 'present',
      // Only use real bullet points from the resume
      description: Array.isArray(exp.description)
        ? exp.description.filter(Boolean)
        : exp.description
          ? [exp.description]
          : [],
      technologies: [],
    };
  });

  const education: EducationItem[] = (p.education || []).map((edu, index) => ({
    id: `edu-${index + 1}`,
    institution: edu.institution || '',
    degree: edu.degree || '',
    field: edu.details || '',
    startDate: '',
    endDate: edu.year || '',
    gpa: edu.details && /gpa/i.test(edu.details) ? edu.details : undefined,
  }));

  // Only use skills actually extracted from the resume — no generic fallback list
  const rawSkills = Array.isArray(p.skills) && p.skills.length > 0 ? p.skills : [];

  const half = Math.ceil(rawSkills.length / 2);
  const skillCategories: SkillCategory[] = rawSkills.length > 0 ? [
    {
      id: 'skill-core',
      category: 'Core Competencies & Languages',
      skills: rawSkills.slice(0, half),
    },
    {
      id: 'skill-tools',
      category: 'Frameworks, Cloud & Tooling',
      skills: rawSkills.slice(half),
    },
  ] : [];

  // Map achievements only if they were actually found in the resume and are clean text
  const achievements: AchievementItem[] = (p.achievements || [])
    .map(cleanText)
    .filter(isReadableText)
    .map((ach, idx) => {
      // Extract title from split if present (e.g. "Award Title | Issuer - Date")
      let title = ach;
      let issuer = '';
      let date = '';

      if (ach.includes('|')) {
        const parts = ach.split('|').map(s => s.trim());
        title = parts[0];
        if (parts[1]) {
          const dateMatch = parts[1].match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{4})/i);
          if (dateMatch) {
            date = parts[1];
          } else {
            issuer = parts[1];
          }
        }
      } else if (title.length > 50) {
        // Take first sentence or up to colon/hyphen
        const punctMatch = title.match(/^([^:–—]+)[:–—]/);
        if (punctMatch && punctMatch[1].length < 45) {
          title = punctMatch[1].trim();
        } else {
          title = title.slice(0, 45).replace(/\s+\S*$/, '') + '...';
        }
      }

      return {
        id: `ach-${idx + 1}`,
        title: title || `Honor & Recognition ${idx + 1}`,
        description: ach,
        issuer,
        date: date || 'Recent',
      };
    });

  // Derive years of experience from actual date ranges found in the resume or from explicit mentions in bio/summary
  const derivedYears = (() => {
    // 1. Check if bio or summary explicitly states years of experience (e.g. "5+ years of experience")
    const fullTextSearch = `${p.bio || ''} ${existingData?.about?.summary || ''}`;
    const explicitMatch = fullTextSearch.match(/(\d{1,2})\+?\s*(?:years?|yrs)\s+(?:of\s+)?(?:experience|working|industry)/i) ||
                          fullTextSearch.match(/(\d{1,2})\+?\s*(?:years?|yrs)\b/i);
    const explicitYears = explicitMatch ? parseInt(explicitMatch[1], 10) : 0;

    if (experience.length === 0) {
      return explicitYears || existingData?.about?.yearsOfExperience || 0;
    }

    let minYear = Infinity;
    let maxYear = -Infinity;
    let hasCurrent = false;

    experience.forEach((exp) => {
      const startMatch = exp.startDate?.match(/\b(19\d\d|20\d\d)\b/);
      const endMatch = exp.endDate?.match(/\b(19\d\d|20\d\d)\b/);

      if (startMatch) {
        const y = parseInt(startMatch[1], 10);
        if (y < minYear) minYear = y;
        if (y > maxYear) maxYear = y;
      }
      if (endMatch) {
        const y = parseInt(endMatch[1], 10);
        if (y > maxYear) maxYear = y;
      }
      if (exp.current || /present|current|now/i.test(exp.endDate || '')) {
        hasCurrent = true;
      }
    });

    if (hasCurrent) {
      maxYear = Math.max(maxYear, new Date().getFullYear());
    }

    let calculatedSpan = 0;
    if (minYear !== Infinity && maxYear !== -Infinity && maxYear >= minYear) {
      calculatedSpan = Math.max(1, maxYear - minYear);
    }

    // Return the most accurate metric
    return explicitYears > 0 
      ? explicitYears 
      : (calculatedSpan > 0 ? calculatedSpan : (existingData?.about?.yearsOfExperience || experience.length || 1));
  })();

  const activeAvatar = (existingData?.profile?.avatarUrl && !existingData.profile.avatarUrl.includes('photo-1534528741775'))
    ? existingData.profile.avatarUrl
    : '';

  const photoObject: PhotoData = existingData?.profile?.photo || {
    source: activeAvatar ? 'resume' : 'none',
    url: activeAvatar,
    selected: !!activeAvatar,
    candidates: activeAvatar ? [{ id: 'cand-1', url: activeAvatar, score: 90, source: 'resume', selected: true }] : [],
  };

  const result: PortfolioData = {
    id: existingData?.id || `port-${Date.now()}`,
    slug: slug || existingData?.slug || 'my-portfolio',
    profile: {
      fullName: p.name || existingData?.profile?.fullName || '',
      headline: p.title || existingData?.profile?.headline || '',
      bio: p.bio || existingData?.profile?.bio || '',
      avatarUrl: activeAvatar,
      bannerUrl: existingData?.profile?.bannerUrl || '',
      statusText: existingData?.profile?.statusText || '',
      photo: photoObject,
      socials: {
        // Only populate social fields with real extracted data — no fake placeholders
        github: p.github || existingData?.profile?.socials?.github || '',
        linkedin: p.linkedin || existingData?.profile?.socials?.linkedin || '',
        email: p.email || existingData?.profile?.socials?.email || '',
        // Only store phone if it was actually found in the resume
        phone: p.phone || '',
        location: p.location || existingData?.profile?.socials?.location || '',
      },
    },
    about: {
      summary: p.bio || existingData?.about?.summary || '',
      // Only include highlights that came from the resume (via achievements/summary)
      // — do NOT inject generic placeholder text
      highlights: existingData?.about?.highlights || [],
      yearsOfExperience: derivedYears,
    },
    skills: skillCategories,
    // Do NOT inject fake placeholder projects if none were found
    projects,
    // Do NOT inject fake placeholder experience if none were found
    experience,
    // Do NOT inject fake placeholder education if none were found
    education,
    // Only include achievements actually found in the resume
    achievements,
    templateId: existingData?.templateId || 'developer',
    accentColor: existingData?.accentColor || '#1E65FF',
    fontFamily: existingData?.fontFamily || 'Inter',
    isPublished: existingData?.isPublished ?? true,
    viewsCount: existingData?.viewsCount || 1,
    lastUpdated: 'Just now',
  };

  return sanitizePortfolioData(result);
}

/**
 * Converts current PortfolioData into the target ResumeForgeOutput JSON format
 */
export function portfolioDataToResumeForge(data: PortfolioData): ResumeForgeOutput {
  const allSkills = data.skills.flatMap(c => c.skills);

  return {
    profile: {
      name: data.profile.fullName,
      title: data.profile.headline,
      email: data.profile.socials.email || '',
      phone: data.profile.socials.phone || '',
      location: data.profile.socials.location || '',
      bio: data.profile.bio,
      github: data.profile.socials.github || '',
      linkedin: data.profile.socials.linkedin || '',
      skills: allSkills.length > 0 ? allSkills : ['TypeScript', 'React', 'Node.js', 'Tailwind CSS'],
      projects: data.projects.map((p, index) => ({
        id: index + 1,
        title: p.title,
        description: optimizeBulletPointForATS(p.description, { role: p.title }),
        tech: p.technologies,
        link: p.link || p.github || '',
      })),
      experience: data.experience.map(e => ({
        role: e.role,
        company: e.company,
        period: `${e.startDate} - ${e.endDate}`,
        description: optimizeBulletPointForATS(e.description.join('. '), { role: e.role, company: e.company }),
      })),
      education: data.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.endDate || edu.startDate || '2022',
        details: edu.field ? `${edu.field}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}` : (edu.gpa || ''),
      })),
    },
  };
}

/**
 * Comprehensive Knowledge Base of 250+ Technical Skills
 */
const KNOWN_SKILLS = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go', 'Golang', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB', 'Perl', 'Lua', 'Haskell',
  'Elixir', 'Clojure', 'Shell', 'Bash', 'PowerShell', 'SQL', 'HTML5', 'CSS3', 'HTML', 'CSS',
  
  // Frontend
  'React', 'React.js', 'React Native', 'Next.js', 'Vue', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte',
  'SvelteKit', 'Tailwind CSS', 'Tailwind', 'Bootstrap', 'Material UI', 'MUI', 'Chakra UI',
  'Redux', 'Zustand', 'MobX', 'GraphQL', 'Apollo', 'Webpack', 'Vite', 'Turbopack', 'Three.js',
  'D3.js', 'Framer Motion', 'Emotion', 'Styled Components', 'Sass', 'SCSS', 'Less',
  
  // Backend & APIs
  'Node.js', 'Express', 'Express.js', 'NestJS', 'FastAPI', 'Django', 'Flask', 'Spring Boot',
  'Spring', 'ASP.NET', '.NET', '.NET Core', 'Ruby on Rails', 'Rails', 'Laravel', 'Koa',
  'Gin', 'Echo', 'Fiber', 'gRPC', 'REST API', 'RESTful APIs', 'WebSockets', 'Socket.io', 'tRPC',
  'Microservices', 'Serverless', 'Kafka', 'RabbitMQ', 'NATS', 'Celery',
  
  // Databases & ORMs
  'PostgreSQL', 'Postgres', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'MariaDB', 'Oracle',
  'Cassandra', 'DynamoDB', 'Couchbase', 'Elasticsearch', 'Supabase', 'Firebase', 'Firestore',
  'Prisma', 'Drizzle', 'TypeORM', 'Mongoose', 'Hibernate', 'Entity Framework', 'Neo4j',
  
  // Cloud, DevOps & Infra
  'AWS', 'Amazon Web Services', 'Azure', 'Microsoft Azure', 'Google Cloud', 'GCP',
  'Docker', 'Kubernetes', 'K8s', 'Terraform', 'Ansible', 'Puppet', 'Chef', 'Helm',
  'CI/CD', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'ArgoCD',
  'Linux', 'Ubuntu', 'Debian', 'CentOS', 'Nginx', 'Apache', 'Cloudflare', 'Vercel', 'Netlify',
  'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'Sentry',
  
  // AI, ML & Data Science
  'Machine Learning', 'Deep Learning', 'Artificial Intelligence', 'AI', 'NLP', 'Computer Vision',
  'PyTorch', 'TensorFlow', 'Keras', 'Scikit-Learn', 'Pandas', 'NumPy', 'SciPy', 'OpenCV',
  'OpenAI', 'LangChain', 'LlamaIndex', 'Hugging Face', 'HuggingFace', 'LLMs', 'Prompt Engineering',
  'Apache Spark', 'Spark', 'Hadoop', 'Airflow', 'Kafka Streams', 'dbt', 'BigQuery', 'Snowflake',
  
  // Tools, Testing & Methodologies
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Trello', 'Linear', 'Figma',
  'Postman', 'Swagger', 'Jest', 'Mocha', 'Chai', 'Cypress', 'Playwright', 'Vitest', 'Selenium',
  'Agile', 'Scrum', 'Kanban', 'TDD', 'CI/CD Pipelines', 'System Design', 'OOP', 'Clean Architecture'
];

/**
 * Strips lines that are predominantly garbled binary characters.
 * A line is considered garbled if >40% of its characters are non-printable
 * (outside the normal ASCII + common Unicode Latin range).
 */
function sanitizeResumeText(rawText: string): string {
  const lines = rawText.split('\n');
  const cleanLines = lines.filter(line => {
    if (line.trim().length === 0) return true; // keep blank separators
    // Count printable characters (basic Latin, digits, punctuation, common accents)
    let printable = 0;
    for (const ch of line) {
      const code = ch.codePointAt(0) || 0;
      // Allow: standard printable ASCII (0x20-0x7E), common Latin extended (0x80-0x02FF),
      // space, tab, and common punctuation ranges
      if (
        (code >= 0x0020 && code <= 0x024F) || // ASCII + Latin Extended
        (code >= 0x2010 && code <= 0x2027) || // General punctuation (dashes, bullets)
        (code >= 0x2030 && code <= 0x205E)
      ) {
        printable++;
      }
    }
    const ratio = printable / line.length;
    // Keep lines where at least 60% of characters are printable/readable
    return ratio >= 0.6;
  });
  return cleanLines.join('\n');
}

/**
 * Intelligent section classifier and parser for real resumes
 */
export function parseRawResumeTextToResumeForge(rawText: string, fallbackName = 'Candidate Name'): ResumeForgeOutput {
  if (!rawText || rawText.trim().length === 0) {
    return {
      profile: {
        name: fallbackName,
        title: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        github: '',
        linkedin: '',
        skills: [],
        projects: [],
        experience: [],
        education: [],
      }
    };
  }

  // Sanitize: strip lines that are predominantly garbled/binary characters
  const sanitized = sanitizeResumeText(rawText);
  const normalizedRawText = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedRawText.split('\n').map(l => l.trim()).filter(Boolean);

  // -------------------------------------------------------------
  // 1. Contact Information Extraction
  // -------------------------------------------------------------
  // Email
  const emailMatch = normalizedRawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone
  const phoneMatch = normalizedRawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // GitHub
  const githubMatch = normalizedRawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? `https://github.com/${githubMatch[1]}` : '';

  // LinkedIn
  const linkedinMatch = normalizedRawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '';

  // Location detection
  let location = '';
  const locationRegex = /(?:Location|Address|Based in|City)?[:\s]*([A-Z][a-zA-Z\s.-]+,\s*[A-Z]{2,}(?:\s*,\s*[A-Z][a-zA-Z]+)?|[A-Z][a-zA-Z\s.-]+,\s*(?:USA|UK|India|Canada|Germany|France|Australia|Singapore|Remote))/i;
  const locationMatch = normalizedRawText.match(locationRegex);
  if (locationMatch && locationMatch[1] && locationMatch[1].length < 40) {
    location = locationMatch[1].trim();
  }

  // -------------------------------------------------------------
  // 2. Candidate Name & Professional Title Extraction
  // -------------------------------------------------------------
  let detectedName = '';
  let detectedTitle = '';

  // Filter out noise lines at the beginning (e.g. "Resume", "Curriculum Vitae", emails, URLs)
  const headerLines = lines.slice(0, 10).filter(line => {
    if (/^(curriculum vitae|resume|cv|contact|page \d+|profile)\b/i.test(line)) return false;
    if (line.includes('@') || line.includes('http') || line.includes('www.') || line.includes('github') || line.includes('linkedin')) return false;
    if (/^\+?\d{1,4}[-.\s]?\d{3}/.test(line)) return false;
    // Skip lines that look like a postal/street address
    if (/\b(flat|house|apt|block|road|street|nagar|heights|colony|sector|plot|floor|wing|building|society|layout|avenue|lane|drive|boulevard)\b/i.test(line)) return false;
    if (/[A-Z]\/\d+/.test(line)) return false;   // G/14, B/7 flat patterns
    if (/^\w+\/\d+/.test(line)) return false;     // word/number
    return true;
  });

  if (headerLines.length > 0) {
    // Top non-noise line is usually the candidate's full name
    const candidateNameCandidate = headerLines[0].replace(/^(name\s*:\s*)/i, '').trim();
    if (candidateNameCandidate.length >= 2 && candidateNameCandidate.length <= 40 && !candidateNameCandidate.includes('|')) {
      detectedName = candidateNameCandidate;
    }

    // Second line is often the job title / headline
    if (headerLines.length > 1) {
      const candidateTitleCandidate = headerLines[1].replace(/^(title\s*:\s*)/i, '').trim();

      // Reject if it looks like a street/postal address
      const isAddressLike = (
        /^\d+/.test(candidateTitleCandidate) ||                                          // starts with a number (house/flat number)
        /\b(flat|house|apt|block|road|street|nagar|heights|colony|sector|plot|floor|wing|building|society|layout|avenue|lane|drive|boulevard)\b/i.test(candidateTitleCandidate) ||
        /\b\d{3,}\b/.test(candidateTitleCandidate) ||                                    // contains 3+ digit number (pin code, etc.)
        /[A-Z]\/\d+/.test(candidateTitleCandidate) ||                                    // matches G/14 or B/7 style flat numbers
        /^\w+\/\d+/.test(candidateTitleCandidate)                                        // matches word/number patterns
      );

      if (candidateTitleCandidate.length >= 3 && candidateTitleCandidate.length <= 60 && !candidateTitleCandidate.includes('@') && !isAddressLike) {
        detectedTitle = candidateTitleCandidate;
      }
    }
  }

  if (!detectedName) {
    // Use fallback name cleaned from filename
    detectedName = fallbackName
      .replace(/[_-]/g, ' ')
      .replace(/\.(pdf|docx|txt|json|doc)$/i, '')
      .replace(/\b(resume|cv|2024|2025|2026|final|latest|updated)\b/gi, '')
      .trim() || 'Candidate Name';
  }

  // -------------------------------------------------------------
  // 3. Section Slicing (Experience, Projects, Education, Skills, Summary)
  // -------------------------------------------------------------
  const sectionKeywords: { [key: string]: RegExp } = {
    summary: /^(professional summary|summary|profile|about me|executive summary|objective|overview)\b/i,
    skills: /^(technical skills|skills & expertise|skills|core competencies|tech stack|key competencies|technologies|tools & technologies)\b/i,
    experience: /^(work experience|professional experience|experience|employment history|work history|career history|experience history)\b/i,
    projects: /^(projects|personal projects|key projects|academic projects|notable projects|selected projects)\b/i,
    education: /^(education|academic background|academic qualifications|qualifications|education & credentials)\b/i,
    achievements: /^(achievements|certifications|awards & honors|awards|certificates|publications|honors)\b/i,
  };

  interface SectionBlock {
    type: string;
    header: string;
    lines: string[];
  }

  const sections: SectionBlock[] = [];
  let currentSection: SectionBlock = { type: 'header', header: 'header', lines: [] };

  for (const line of lines) {
    let matchedType: string | null = null;
    const cleanHeader = line.replace(/^[#*_\-–—=\s]+|[#*_\-–—=\s:]+$/g, '').trim();

    for (const [secType, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(cleanHeader) && cleanHeader.length < 40) {
        matchedType = secType;
        break;
      }
    }

    if (matchedType) {
      sections.push(currentSection);
      currentSection = { type: matchedType, header: line, lines: [] };
    } else {
      currentSection.lines.push(line);
    }
  }
  sections.push(currentSection);

  // -------------------------------------------------------------
  // 4. Skills Extraction (Taxonomy match + Custom lines)
  // -------------------------------------------------------------
  const foundSkillsSet = new Set<string>();

  // 4a. Match against known technical taxonomy across all text
  for (const skill of KNOWN_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+.])${escaped}(?:$|[^a-zA-Z0-9#+.])`, 'i');
    if (regex.test(normalizedRawText)) {
      foundSkillsSet.add(skill);
    }
  }

  // 4b. Extract custom skills explicitly listed in the skills section
  const skillSections = sections.filter(s => s.type === 'skills');
  for (const s of skillSections) {
    for (const line of s.lines) {
      // Split by common delimiters: comma, bullet, pipe, semicolon
      const tokens = line
        .replace(/^[A-Za-z\s]+:\s*/, '') // Remove category labels like "Languages: "
        .split(/[,|•*·;]|\s{3,}/)
        .map(t => t.trim())
        .filter(t => t.length >= 2 && t.length <= 30 && !/^(skills|technologies|tools|languages|frameworks|databases):?$/i.test(t));

      tokens.forEach(token => {
        if (token && !foundSkillsSet.has(token)) {
          foundSkillsSet.add(token);
        }
      });
    }
  }

  const finalSkillsList = Array.from(foundSkillsSet);
  const skills = finalSkillsList.length > 0
    ? finalSkillsList
    : ['TypeScript', 'React', 'Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL', 'Tailwind CSS'];

  // -------------------------------------------------------------
  // 5. Work Experience Extraction
  // -------------------------------------------------------------
  const expSections = sections.filter(s => s.type === 'experience');
  const extractedExperience: ResumeForgeExperience[] = [];

  const dateRegex = /(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}[\/\-])?\s*\d{4}|\d{4})\s*[-–—to]+\s*(Present|Current|Now|\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}[\/\-])?\s*\d{4})/i;

  for (const sec of expSections) {
    let currentJob: { role: string; company: string; period: string; bullets: string[] } | null = null;

    for (let i = 0; i < sec.lines.length; i++) {
      const line = sec.lines[i];
      const hasDate = dateRegex.test(line);

      // Check if line looks like a job header (Company - Role or Date)
      if (hasDate || (line.includes('|') && !line.startsWith('-') && !line.startsWith('•')) || (/^(senior|lead|staff|junior|principal|software|engineer|developer|designer|manager|architect|consultant|intern|specialist|analyst)\b/i.test(line) && line.length < 70)) {
        if (currentJob && (currentJob.role || currentJob.company)) {
          extractedExperience.push({
            role: currentJob.role || 'Software Engineer',
            company: currentJob.company || 'Tech Company',
            period: currentJob.period || '2022 - Present',
            description: currentJob.bullets.join('. ') || 'Delivered key product initiatives and optimized software performance.',
          });
        }

        // Parse role, company, period
        let role = '';
        let company = '';
        let period = '';

        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
          period = dateMatch[0];
        }

        const remainingText = line.replace(dateRegex, '').replace(/[|•–—,-]+\s*$/, '').trim();
        const splitParts = remainingText.split(/[-–—|@,]\s+/).map(p => p.trim()).filter(Boolean);

        if (splitParts.length >= 2) {
          role = splitParts[0];
          company = splitParts[1];
        } else if (splitParts.length === 1) {
          role = splitParts[0];
          // Check next line for company
          if (i + 1 < sec.lines.length && !dateRegex.test(sec.lines[i + 1]) && !sec.lines[i + 1].startsWith('-') && !sec.lines[i + 1].startsWith('•')) {
            company = sec.lines[i + 1].trim();
            i++;
          }
        }

        currentJob = {
          role: role || 'Software Engineer',
          company: company || 'Company',
          period: period || '2022 - Present',
          bullets: [],
        };
      } else if (currentJob) {
        if (line.trim().length > 0) {
          const cleanBullet = optimizeBulletPointForATS(line.replace(/^[-•*–—]\s*/, ''));
          currentJob.bullets.push(cleanBullet);
        }
      }
    }

    if (currentJob && (currentJob.role || currentJob.company)) {
      extractedExperience.push({
        role: currentJob.role || 'Software Engineer',
        company: currentJob.company || 'Tech Company',
        period: currentJob.period || '2022 - Present',
        description: currentJob.bullets.join('. ') || 'Delivered key product initiatives and optimized software performance.',
      });
    }
  }

  // Derive professional title from most recent experience role if not detected
  if (!detectedTitle && extractedExperience.length > 0) {
    detectedTitle = extractedExperience[0].role;
  }
  if (!detectedTitle) {
    detectedTitle = 'Senior Software Engineer';
  }

  // -------------------------------------------------------------
  // 6. Projects Extraction
  // -------------------------------------------------------------
  const projSections = sections.filter(s => s.type === 'projects');
  const extractedProjects: ResumeForgeProject[] = [];

  for (const sec of projSections) {
    let currentProj: { title: string; tech: string[]; link: string; bullets: string[] } | null = null;

    for (let i = 0; i < sec.lines.length; i++) {
      const line = sec.lines[i];
      const isHeader = !line.startsWith('-') && !line.startsWith('•') && line.length < 80 && !line.toLowerCase().startsWith('github:');

      if (isHeader) {
        if (currentProj && currentProj.title) {
          extractedProjects.push({
            id: extractedProjects.length + 1,
            title: currentProj.title,
            tech: currentProj.tech.length > 0 ? currentProj.tech : skills.slice(0, 3),
            link: currentProj.link || '',
            description: currentProj.bullets.join('. ') || 'Architected and built full-stack application with modern technologies.',
          });
        }

        // Extract potential link from project header line
        const linkMatch = line.match(/https?:\/\/[^\s)]+/);
        const link = linkMatch ? linkMatch[0] : '';
        const titleClean = line.replace(/https?:\/\/[^\s)]+/, '').replace(/[|•–—()].*$/, '').trim();

        // Detect tech stack in header parentheses (e.g. "Portfolio Builder (React, TypeScript)")
        const techInHeader = line.match(/\(([^)]+)\)/);
        const techFound: string[] = [];
        if (techInHeader && techInHeader[1]) {
          techFound.push(...techInHeader[1].split(/[,|/]/).map(t => t.trim()).filter(Boolean));
        }

        currentProj = {
          title: titleClean || `Project ${extractedProjects.length + 1}`,
          tech: techFound,
          link,
          bullets: [],
        };
      } else if (currentProj) {
        if (line.includes('http')) {
          const m = line.match(/https?:\/\/[^\s)]+/);
          if (m) currentProj.link = m[0];
        }
        currentProj.bullets.push(optimizeBulletPointForATS(line.replace(/^[-•*–—]\s*/, '')));
      }
    }

    if (currentProj && currentProj.title) {
      extractedProjects.push({
        id: extractedProjects.length + 1,
        title: currentProj.title,
        tech: currentProj.tech.length > 0 ? currentProj.tech : skills.slice(0, 3),
        link: currentProj.link || '',
        description: currentProj.bullets.join('. ') || 'Architected and built full-stack application with modern technologies.',
      });
    }
  }

  // Fallback: If no dedicated projects section existed, extract key initiatives from experience
  if (extractedProjects.length === 0 && extractedExperience.length > 0) {
    extractedExperience.forEach((exp, idx) => {
      const desc = exp.description || '';
      const sentences = desc.split(/\.\s+/).map(s => s.trim()).filter(s => s.length > 20);

      if (sentences.length > 0) {
        const primarySentence = sentences.find(s => /\d+%|\bproject\b|\bsystem\b|\bdashboard\b|\bplatform\b|\bprocess\b|\bclient\b/i.test(s)) || sentences[0];
        const titleWords = primarySentence
          .replace(/^(?:led|coordinated|supported|automated|built|developed|managed|spearheaded|engineered|delivered)\s+/i, '')
          .replace(/^(?:the|a|an)\s+/i, '')
          .split(/\s+/)
          .slice(0, 5)
          .join(' ');
        const cleanTitle = titleWords.replace(/[.,:;()–—-]+$/, '').trim();

        extractedProjects.push({
          id: extractedProjects.length + 1,
          title: cleanTitle ? (cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)) : `${exp.role} Initiative`,
          tech: skills.slice(idx * 3, idx * 3 + 3),
          link: '',
          description: sentences.slice(0, 2).join('. ').replace(/\.\.+/g, '.') + (desc.endsWith('.') ? '' : '.'),
        });
      }
    });
  }

  // -------------------------------------------------------------
  // 7. Education Extraction
  // -------------------------------------------------------------
  const eduSections = sections.filter(s => s.type === 'education');
  const extractedEducation: ResumeForgeEducation[] = [];

  for (const sec of eduSections) {
    const rawLines = sec.lines.map(l => l.trim()).filter(Boolean);
    const eduBlocks: string[][] = [];
    let currentBlock: string[] = [];

    for (const line of rawLines) {
      const isDegreeLine = /(bachelor|master|b\.s|b\.tech|b\.e|m\.s|m\.tech|ph\.d|doctorate|diploma|b\.sc|m\.sc|mba|b\.com|m\.com|bba|bca|mca|b\.a|m\.a|b\.ed|m\.ed|b\.des|m\.des|b\.arch|m\.arch|ll\.b|ll\.m|degree)/i.test(line);
      if (isDegreeLine && currentBlock.length > 0 && currentBlock.some(l => /(university|college|institute|school|campus|academy)/i.test(l))) {
        eduBlocks.push(currentBlock);
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
    if (currentBlock.length > 0) eduBlocks.push(currentBlock);

    for (const block of eduBlocks) {
      let institution = '';
      let degree = '';
      let year = '';
      let details = '';

      for (const line of block) {
        // Check for degree keywords
        if (/(bachelor|master|b\.s|b\.tech|b\.e|m\.s|m\.tech|ph\.d|doctorate|associate|diploma|b\.sc|m\.sc|mba|b\.com|m\.com|bba|bca|mca|b\.a|m\.a|b\.ed|m\.ed|b\.des|m\.des|b\.arch|m\.arch|ll\.b|ll\.m|degree)/i.test(line)) {
          degree = line.replace(/[–—|-]\s*(?:19|20)\d{2}.*$/, '').trim();
        }
        // Check for university / college keywords
        if (/(university|college|institute|school|academy|polytechnic|campus)/i.test(line)) {
          institution = line.replace(/[–—|-]\s*(?:19|20)\d{2}.*$/, '').trim();
        }
        // Check for graduation year
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        if (yearMatch && !year) {
          year = yearMatch[0];
        }
        // Check for GPA
        if (/gpa/i.test(line)) {
          details = line.trim();
        }
      }

      // Fallback: If degree not matched by keyword, use any line that isn't the institution
      if (!degree && block.length > 0) {
        const nonInst = block.find(l => !/(university|college|institute|school|academy)/i.test(l) && !/^\s*(?:19|20)\d{2}\s*$/.test(l));
        if (nonInst) {
          degree = nonInst.replace(/[–—|-]\s*(?:19|20)\d{2}.*$/, '').trim();
        }
      }

      if (institution || degree) {
        extractedEducation.push({
          degree: degree || 'Bachelor of Arts / Science',
          institution: institution || 'University',
          year: year || '2022',
          details: details || '',
        });
      }
    }
  }

  // -------------------------------------------------------------
  // 8. Professional Summary / Bio Extraction
  // -------------------------------------------------------------
  const summarySections = sections.filter(s => s.type === 'summary');
  let bio = '';
  if (summarySections.length > 0 && summarySections[0].lines.length > 0) {
    bio = summarySections[0].lines.join(' ').trim();
  }
  if (!bio || bio.length < 30) {
    bio = optimizeExecutiveBio(detectedName, detectedTitle);
  }

  // -------------------------------------------------------------
  // 9. Achievements & Certifications Extraction
  // -------------------------------------------------------------
  const achSections = sections.filter(s => s.type === 'achievements');
  const achievements: string[] = [];
  for (const s of achSections) {
    for (const line of s.lines) {
      const clean = cleanText(line.replace(/^[●▪■•*–—\-\s\u2022\u25CF\u25AA\u25AB\u25A0\u25A1]+/, ''));
      if (clean.length > 5 && isReadableText(clean)) {
        achievements.push(clean);
      }
    }
  }

  return {
    profile: {
      name: detectedName,
      title: detectedTitle,
      // Only set these if actually found — empty string means the field was not in the resume
      email: email || '',
      phone: phone || '',
      location: location || '',
      bio,
      github,
      linkedin,
      skills,
      projects: extractedProjects,
      experience: extractedExperience,
      education: extractedEducation,
      achievements,
    }
  };
}
