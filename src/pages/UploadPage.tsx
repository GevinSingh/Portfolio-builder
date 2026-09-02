import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Cpu, 
  Eye, 
  Layers, 
  Edit3, 
  Check, 
  AlertCircle,
  FileCheck,
  User,
  Briefcase,
  Rocket,
  Zap,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Wand2,
  FileSpreadsheet,
  Trash2,
  Mail,
  Phone,
  Github,
  Linkedin
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { sampleResumes } from '../data/mockData';
import { BuildFromScratchWizard } from '../components/BuildFromScratchWizard';
import { 
  parseRawResumeTextToResumeForge, 
  resumeForgeToPortfolioData, 
  ResumeForgeOutput 
} from '../lib/resumeForgeEngine';
import { uploadResumeToSupabase, isSupabaseConfigured, savePortfolioToSupabase } from '../lib/supabase';
import { uploadApi } from '../lib/api';
import { extractTextFromFile, ExtractedFileResult } from '../lib/pdfParser';
import { PhotoCandidate, PhotoData } from '../types';
import { formatExternalUrl } from '../lib/sanitize';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    portfolio, 
    updatePortfolio, 
    setPortfolio, 
    loadSampleResume, 
    triggerConfetti, 
    showToast, 
    currentUser,
    syncToCloud,
    setPendingResumeFile
  } = usePortfolio();

  const [step, setStep] = useState<1 | 2 | 3>(() => {
    try {
      const savedStep = sessionStorage.getItem('upload_page_step');
      if (savedStep === '3') return 3;
    } catch {}
    return 1;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const [rawFile, setRawFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
    numPages?: number;
    wordCount?: number;
  } | null>(null);

  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ResumeForgeOutput | null>(() => {
    try {
      const saved = sessionStorage.getItem('upload_parsed_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Processing stage state
  const [processingIndex, setProcessingIndex] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);

  const [userAvatar, setUserAvatar] = useState<string>('');
  const userAvatarRef = useRef(userAvatar);
  userAvatarRef.current = userAvatar;

  const [extractedPhotoData, setExtractedPhotoData] = useState<PhotoData | null>(null);
  const extractedPhotoDataRef = useRef(extractedPhotoData);
  extractedPhotoDataRef.current = extractedPhotoData;

  const [photoCandidates, setPhotoCandidates] = useState<PhotoCandidate[]>([]);
  const photoCandidatesRef = useRef(photoCandidates);
  photoCandidatesRef.current = photoCandidates;

  const parsedDataRef = useRef(parsedData);
  parsedDataRef.current = parsedData;

  const rawFileRef = useRef(rawFile);
  rawFileRef.current = rawFile;

  // Store rawFile in context so all sync buttons across the app can upload it
  useEffect(() => {
    setPendingResumeFile(rawFile);
  }, [rawFile]);

  const selectedFileRef = useRef(selectedFile);
  selectedFileRef.current = selectedFile;

  const portfolioRef = useRef(portfolio);
  portfolioRef.current = portfolio;

  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  const processingSteps = [
    { title: 'Reading resume & parsing document typography', desc: 'Analyzing layout, contact coordinates & text structures' },
    { title: 'Discovering core skills & technical taxonomy', desc: 'Categorizing languages, frameworks, cloud & toolkits' },
    { title: 'Extracting projects & quantified metrics', desc: 'Identifying URLs, repositories, outcomes & technologies' },
    { title: 'Organizing experience timeline & roles', desc: 'Structuring achievements, date ranges & career milestones' },
    { title: 'Building dynamic interactive portfolio', desc: 'Applying responsive theme tokens and layout styling' },
  ];

  // Process uploaded file
  const processUploadedFile = async (file: File) => {
    setIsExtracting(true);
    setExtractError(null);
    setRawFile(file);

    const fileSizeFormatted = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    setSelectedFile({
      name: file.name,
      size: fileSizeFormatted,
      type: file.type || 'application/pdf',
    });

    try {
      // 1. Universal Text Extraction (PDF / DOCX / TXT / JSON)
      const extraction: ExtractedFileResult = await extractTextFromFile(file);
      const text = extraction.text || '';

      let parsedOutput: ResumeForgeOutput;
      if (text && text.trim().length >= 10) {
        setExtractedText(text);

        if (extraction.fileType === 'json') {
          try {
            const jsonVal = JSON.parse(text);
            if (jsonVal.profile) {
              parsedOutput = jsonVal as ResumeForgeOutput;
            } else {
              parsedOutput = parseRawResumeTextToResumeForge(text, file.name);
            }
          } catch {
            parsedOutput = parseRawResumeTextToResumeForge(text, file.name);
          }
        } else {
          parsedOutput = parseRawResumeTextToResumeForge(text, file.name);
        }
      } else {
        // Safe fallback if scanned image without text layer
        parsedOutput = parseRawResumeTextToResumeForge(file.name.replace(/\.[^/.]+$/, ''), file.name);
      }

      setParsedData(parsedOutput);
      try {
        sessionStorage.setItem('upload_parsed_data', JSON.stringify(parsedOutput));
      } catch {}

      const words = text ? text.split(/\s+/).filter(Boolean).length : 200;
      const extractedPhoto = extraction.extractedPhotoUrl || '';
      const candidates = extraction.photoCandidates || [];

      setExtractedPhotoData(extraction.photoData || null);
      setPhotoCandidates(candidates);
      setUserAvatar(extractedPhoto);
      userAvatarRef.current = extractedPhoto;
      photoCandidatesRef.current = candidates;
      extractedPhotoDataRef.current = extraction.photoData || null;

      if (extractedPhoto) {
        setPortfolio(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            avatarUrl: extractedPhoto,
            photo: extraction.photoData || {
              source: 'resume',
              url: extractedPhoto,
              selected: true,
              candidates,
            }
          }
        }));
      }

      setSelectedFile({
        name: file.name,
        size: fileSizeFormatted,
        type: extraction.fileType,
        numPages: extraction.numPages || 1,
        wordCount: words,
      });

      if (extractedPhoto) {
        showToast('Profile Photo Extracted', `Detected and attached portrait photo from ${file.name}.`, 'sparkles');
      } else {
        showToast('Document Ready', `Extracted content from ${file.name}. Ready for AI synthesis.`, 'sparkles');
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      // Fallback parsed output so the flow never gets stuck
      const fallbackOutput = parseRawResumeTextToResumeForge(file.name.replace(/\.[^/.]+$/, ''), file.name);
      setParsedData(fallbackOutput);
      try {
        sessionStorage.setItem('upload_parsed_data', JSON.stringify(fallbackOutput));
      } catch {}
      setExtractError(err.message || 'Standard text extraction was partial. AI synthesizer will still generate your portfolio.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  // Robust simulation timer for step 2 that cannot be interrupted by background state updates
  useEffect(() => {
    if (step !== 2) return;

    let isMounted = true;
    setProcessingProgress(5);
    setProcessingIndex(0);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (!isMounted) return;

            // Apply parsed data to portfolio using the latest refs
            const currentParsed = parsedDataRef.current;
            const currentPortfolio = portfolioRef.current;
            const currentRawFile = rawFileRef.current;
            const currentSelected = selectedFileRef.current;
            const currentAuthUser = currentUserRef.current;

            if (currentParsed) {
              try {
                const activePhotoUrl = userAvatarRef.current || '';
                const currentPhotoData: PhotoData = {
                  source: activePhotoUrl ? 'resume' : 'none',
                  url: activePhotoUrl,
                  selected: !!activePhotoUrl,
                  candidates: photoCandidatesRef.current || [],
                };

                const loaded = resumeForgeToPortfolioData(currentParsed, {
                  ...currentPortfolio,
                  profile: {
                    ...currentPortfolio.profile,
                    avatarUrl: activePhotoUrl,
                    photo: currentPhotoData,
                  }
                });
                setPortfolio(loaded);
                syncToCloud(loaded).catch(() => {});
              } catch (e) {
                console.error('Error applying parsed data to portfolio:', e);
              }
            }

            if (currentRawFile) {
              // Upload to Express Backend Server
              uploadApi.uploadResume(currentRawFile, currentAuthUser?.id).then((uploadRes) => {
                if (uploadRes.success && uploadRes.publicUrl) {
                  showToast('Resume File Saved', `Backed up ${currentSelected?.name || 'resume'} to storage.`, 'sparkles');
                }
              }).catch(() => {});

              // Upload any file format to Supabase Storage
              uploadResumeToSupabase(currentRawFile, currentAuthUser?.id).then((upRes) => {
                if (upRes.success && upRes.publicUrl) {
                  showToast('Resume File Saved', `Backed up ${currentSelected?.name || 'resume'} to Supabase Storage.`, 'sparkles');
                }
              }).catch(() => {});
            }

            setStep(3);
            try {
              sessionStorage.setItem('upload_page_step', '3');
            } catch {}
            triggerConfetti();
            showToast('Resume Extracted & Ready', 'Optimized executive bio, recruiter impact metrics, and discrete skills.', 'sparkles');
          }, 350);
          return 100;
        }
        const nextVal = prev + Math.floor(Math.random() * 10) + 6;
        const currentIdx = Math.min(
          processingSteps.length - 1,
          Math.floor((nextVal / 100) * processingSteps.length)
        );
        setProcessingIndex(currentIdx);
        return Math.min(100, nextVal);
      });
    }, 130);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [step]);

  const startExtraction = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!selectedFile && !parsedData) return;
    setStep(2);
  };

  const handleResetFile = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedFile(null);
    setRawFile(null);
    setExtractedText(null);
    setParsedData(null);
    setExtractError(null);
    try {
      sessionStorage.removeItem('upload_parsed_data');
      sessionStorage.removeItem('upload_page_step');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-['Inter',sans-serif] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-radial-gradient pointer-events-none -z-10 opacity-60" />
      <div className="absolute top-32 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-[#1E65FF]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        
        {/* Step Progression Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= 1 ? 'bg-[#1E65FF] text-white shadow-lg shadow-[#1E65FF]/25 ring-4 ring-blue-100' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-xs font-semibold mt-2 text-slate-900">Upload</span>
            </div>

            <div className={`flex-1 h-0.5 mx-2 transition-all ${step >= 2 ? 'bg-[#1E65FF]' : 'bg-slate-200'}`} />

            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= 2 ? 'bg-[#1E65FF] text-white shadow-lg shadow-[#1E65FF]/25 ring-4 ring-blue-100' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-xs font-semibold mt-2 text-slate-900">Processing</span>
            </div>

            <div className={`flex-1 h-0.5 mx-2 transition-all ${step >= 3 ? 'bg-[#1E65FF]' : 'bg-slate-200'}`} />

            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= 3 ? 'bg-[#1E65FF] text-white shadow-lg shadow-[#1E65FF]/25 ring-4 ring-blue-100' : 'bg-slate-200 text-slate-500'
              }`}>
                3
              </div>
              <span className="text-xs font-semibold mt-2 text-slate-900">Review</span>
            </div>
          </div>
        </div>

        {/* STEP 1: RESUME UPLOAD */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#1E65FF] border border-blue-200 shadow-sm">
                Step 1: Upload Resume
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Drop Your Resume. We'll Power It Online.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                Upload your PDF, DOCX, or TXT resume. Our neural engine extracts your contact info, work history, projects, and skills automatically.
              </p>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-14 text-center transition-all bg-white shadow-sm ${
                isDragging
                  ? 'border-[#1E65FF] bg-blue-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-[#1E65FF] hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl bg-[#1E65FF] flex items-center justify-center text-white shadow-xl shadow-[#1E65FF]/25 ${
                  isExtracting ? 'animate-pulse' : ''
                }`}>
                  {isExtracting ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 animate-bounce" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {isExtracting ? 'Reading & Extracting Document...' : 'Drag & drop your resume file here'}
                  </h3>
                  <p className="text-xs text-slate-500">Supports PDF, DOCX, TXT, JSON files up to 25 MB</p>
                </div>

                <div className="pt-2">
                  <label className="relative cursor-pointer px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow transition-colors inline-block">
                    <span>{isExtracting ? 'Processing File...' : 'Browse Files'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt,.json,.md"
                      onChange={handleFileSelect}
                      disabled={isExtracting}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Extraction Error Alert */}
              {extractError && (
                <div className="mt-6 max-w-md mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 space-y-1">
                    <div className="font-bold">Extraction Notice</div>
                    <div>{extractError}</div>
                  </div>
                </div>
              )}

              {/* Selected File Card Preview */}
              {selectedFile && !extractError && (
                <div className="mt-8 max-w-lg mx-auto p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200 text-left shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 truncate max-w-[220px] sm:max-w-xs">{selectedFile.name}</div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-2">
                          <span>{selectedFile.size}</span>
                          {selectedFile.numPages && <span>• {selectedFile.numPages} Page{selectedFile.numPages > 1 ? 's' : ''}</span>}
                          {selectedFile.wordCount && <span>• {selectedFile.wordCount} Words</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetFile}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Extracted Highlights Quick Chips */}
                  {parsedData && (
                    <div className="pt-2 border-t border-blue-100/80 flex flex-wrap gap-2 text-[11px]">
                      {parsedData.profile.name && (
                        <span className="px-2.5 py-0.5 rounded-md bg-white border border-blue-200 font-medium text-slate-800 flex items-center gap-1">
                          <User className="w-3 h-3 text-[#1E65FF]" /> {parsedData.profile.name}
                        </span>
                      )}
                      {parsedData.profile.skills.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-md bg-white border border-blue-200 font-medium text-slate-800 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" /> {parsedData.profile.skills.length} Skills
                        </span>
                      )}
                      {parsedData.profile.experience.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-md bg-white border border-blue-200 font-medium text-slate-800 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-emerald-600" /> {parsedData.profile.experience.length} Roles
                        </span>
                      )}
                      {parsedData.profile.projects.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-md bg-white border border-blue-200 font-medium text-slate-800 flex items-center gap-1">
                          <Rocket className="w-3 h-3 text-indigo-600" /> {parsedData.profile.projects.length} Projects
                        </span>
                      )}
                      {userAvatar ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 font-medium text-emerald-800 flex items-center gap-1.5">
                          <img src={userAvatar} alt="Resume Photo" className="w-3.5 h-3.5 rounded-full object-cover" />
                          <span>Resume Photo Preserved</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-medium text-slate-600 flex items-center gap-1">
                          <span>Modern Monogram Format</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Demo Presets */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-[#1E65FF] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E65FF]" /> Instant Demo Presets (1-Click Test)
                </span>
                <span className="text-xs text-slate-500">Click to auto-populate</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sampleResumes.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      loadSampleResume(sample.id);
                      const sampleData = {
                        profile: {
                          name: sample.data.profile.fullName,
                          title: sample.data.profile.headline,
                          email: (sample.data.profile.socials as any).email || '',
                          phone: (sample.data.profile.socials as any).phone || '',
                          location: (sample.data.profile.socials as any).location || '',
                          bio: sample.data.profile.bio,
                          github: sample.data.profile.socials.github || '',
                          linkedin: sample.data.profile.socials.linkedin || '',
                          skills: sample.data.skills.flatMap(s => s.skills),
                          projects: sample.data.projects.map(p => ({
                            id: p.id,
                            title: p.title,
                            description: p.description,
                            tech: p.technologies,
                            link: p.link || '',
                          })),
                          experience: sample.data.experience.map(e => ({
                            role: e.role,
                            company: e.company,
                            period: `${e.startDate} - ${e.endDate}`,
                            description: e.description.join('. '),
                          })),
                          education: sample.data.education.map(edu => ({
                            degree: edu.degree,
                            institution: edu.institution,
                            year: edu.endDate || '2022',
                            details: edu.field || '',
                          })),
                        }
                      };
                      setSelectedFile({
                        name: sample.fileName,
                        size: sample.fileSize,
                        type: 'application/pdf',
                        numPages: 2,
                        wordCount: 850,
                      });
                      setParsedData(sampleData);
                      try {
                        sessionStorage.setItem('upload_parsed_data', JSON.stringify(sampleData));
                      } catch {}
                    }}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#1E65FF] hover:bg-blue-50/50 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#1E65FF]">{sample.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{sample.fileSize}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{sample.role}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Don't Have a Resume Option */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#1E65FF] flex items-center justify-center text-white shadow-md shadow-[#1E65FF]/20 shrink-0">
                  <Wand2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Don't have an existing resume?</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#1E65FF]">
                      New Option
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Build your portfolio from scratch using our step-by-step form wizard with real-time live preview.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowScratchModal(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#1E65FF] text-[#1E65FF] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Open Wizard</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/scratch');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#1E65FF]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Full Screen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={startExtraction}
                disabled={(!selectedFile && !parsedData) || isExtracting}
                className="px-10 py-4 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#1E65FF]/25 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 cursor-pointer"
              >
                <span>Continue to Processing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PROCESSING SCREEN */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="py-8 space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1E65FF] text-xs font-bold uppercase tracking-wider shadow-sm">
                <Zap className="w-4 h-4 text-[#1E65FF] fill-current animate-pulse" />
                <span>AI Neural Extraction in Progress</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Synthesizing {parsedData?.profile?.name ? `${parsedData.profile.name}'s` : 'Your'} Portfolio...
              </h2>
              <p className="text-sm text-slate-600">
                Parsing unstructured data, optimizing ATS keywords, and synthesizing high-conversion structure.
              </p>
            </div>

            {/* Glowing Laser Scanner Card */}
            <div className="relative rounded-3xl border border-blue-200 bg-white p-6 sm:p-10 shadow-2xl overflow-hidden max-w-2xl mx-auto">
              
              {/* Animated scanning laser beam */}
              <motion.div 
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#1E65FF] to-transparent shadow-[0_0_15px_#1E65FF]"
                animate={{ y: [0, 320, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              />

              {/* Progress Ring & Bar */}
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#1E65FF] font-bold">PROGRESS: {processingProgress}%</span>
                  <span className="text-slate-500 font-mono">
                    {parsedData?.profile?.skills?.length ? `DETECTED_${parsedData.profile.skills.length}_SKILLS` : 'SYNTHESIZING_NODES'}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#1E65FF] via-blue-400 to-[#1E65FF]"
                    style={{ width: `${processingProgress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>

                {/* Animated Steps Checklist */}
                <div className="space-y-3.5 pt-4">
                  {processingSteps.map((item, idx) => {
                    const isDone = processingIndex > idx || processingProgress === 100;
                    const isCurrent = processingIndex === idx && processingProgress < 100;

                    return (
                      <div
                        key={item.title}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-slate-50 border-blue-100 text-slate-800'
                            : isCurrent
                            ? 'bg-blue-50/70 border-blue-300 text-slate-900 shadow-sm'
                            : 'bg-transparent border-transparent text-slate-400'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full border-2 border-[#1E65FF] border-t-transparent animate-spin" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300" />
                          )}
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${isCurrent ? 'text-[#1E65FF]' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs text-slate-500 font-mono">
                ⚡ Neural engine running client sandbox & backend synchronizer
              </span>
            </div>
          </motion.div>
        )}

        {/* STEP 3: REVIEW EXTRACTED INFORMATION */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Step 3: Review & Edit
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Here's What We Discovered
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Verify and tweak your parsed data. Everything remains fully editable in the visual editor later.
              </p>
            </div>

            {/* Extracted Sections Review Cards */}
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <User className="w-4 h-4 text-[#1E65FF]" />
                    <span>Personal Profile & Contact</span>
                  </div>
                  {portfolio.profile.avatarUrl && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Photo Attached
                    </span>
                  )}
                </div>

                {/* Profile Photo (Extracted directly from resume) */}
                {portfolio.profile.avatarUrl ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={portfolio.profile.avatarUrl}
                            alt="Resume Profile Photo"
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-blue-100"
                          />
                          <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full shadow-sm ring-2 ring-white">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Profile Photo</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1E65FF] border border-blue-100">
                              Extracted from Resume
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            Extracted automatically from your uploaded resume file.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          updatePortfolio({
                            profile: {
                              ...portfolio.profile,
                              avatarUrl: '',
                              photo: {
                                source: 'none',
                                url: '',
                                selected: false,
                                candidates: [],
                              }
                            }
                          });
                          showToast('Photo Removed', 'Switched to monogram initials format.', 'info');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    {/* Photo candidates gallery if multiple detected in resume */}
                    {portfolio.profile.photo?.candidates && portfolio.profile.photo.candidates.length > 1 && (
                      <div className="pt-2.5 border-t border-slate-200/80">
                        <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#1E65FF]" />
                          <span>Detected Embedded Resume Photos ({portfolio.profile.photo.candidates.length}):</span>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {portfolio.profile.photo.candidates.map((cand, idx) => {
                            const isSelected = portfolio.profile.avatarUrl === cand.url;
                            return (
                              <button
                                key={cand.id || idx}
                                type="button"
                                onClick={() => {
                                  updatePortfolio({
                                    profile: {
                                      ...portfolio.profile,
                                      avatarUrl: cand.url,
                                      photo: {
                                        source: 'resume',
                                        url: cand.url,
                                        selected: true,
                                        candidates: portfolio.profile.photo?.candidates || [],
                                      }
                                    }
                                  });
                                  showToast('Photo Selected', `Applied photo #${idx + 1} from resume.`, 'sparkles');
                                }}
                                className={`relative p-1 rounded-xl border transition-all cursor-pointer ${
                                  isSelected ? 'border-[#1E65FF] bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                              >
                                <img src={cand.url} alt={`Candidate ${idx + 1}`} className="w-11 h-11 rounded-lg object-cover" />
                                {isSelected && (
                                  <span className="absolute -top-1 -right-1 p-0.5 bg-[#1E65FF] text-white rounded-full shadow-sm">
                                    <Check className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={portfolio.profile.fullName}
                      onChange={(e) => updatePortfolio({
                        profile: { ...portfolio.profile, fullName: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Role</label>
                    <input
                      type="text"
                      value={portfolio.profile.headline}
                      onChange={(e) => updatePortfolio({
                        profile: { ...portfolio.profile, headline: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="e.g. alex@example.com"
                      value={portfolio.profile.socials.email || ''}
                      onChange={(e) => updatePortfolio({
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, email: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={portfolio.profile.socials.phone || ''}
                      onChange={(e) => updatePortfolio({
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, phone: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">GitHub Profile</label>
                    <input
                      type="text"
                      placeholder="https://github.com/username"
                      value={portfolio.profile.socials.github || ''}
                      onChange={(e) => updatePortfolio({
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, github: e.target.value }
                        }
                      })}
                      onBlur={(e) => {
                        const val = e.target.value.trim();
                        if (val) {
                          updatePortfolio({
                            profile: {
                              ...portfolio.profile,
                              socials: { ...portfolio.profile.socials, github: formatExternalUrl(val, 'github') }
                            }
                          });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      value={portfolio.profile.socials.linkedin || ''}
                      onChange={(e) => updatePortfolio({
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, linkedin: e.target.value }
                        }
                      })}
                      onBlur={(e) => {
                        const val = e.target.value.trim();
                        if (val) {
                          updatePortfolio({
                            profile: {
                              ...portfolio.profile,
                              socials: { ...portfolio.profile.socials, linkedin: formatExternalUrl(val, 'linkedin') }
                            }
                          });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-600 font-medium block mb-1">
                      Address / Location
                      {!(portfolio.profile.socials.location) && (
                        <span className="text-slate-400 font-normal ml-1">(optional)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder="City, State, Country"
                      value={portfolio.profile.socials.location || ''}
                      onChange={(e) => updatePortfolio({
                        profile: {
                          ...portfolio.profile,
                          socials: { ...portfolio.profile.socials, location: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-600 font-medium block mb-1">Bio / Executive Overview</label>
                    <textarea
                      rows={3}
                      value={portfolio.profile.bio}
                      onChange={(e) => updatePortfolio({
                        profile: { ...portfolio.profile, bio: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E65FF] text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Discovered Skills Summary */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Zap className="w-4 h-4 text-[#1E65FF]" />
                    <span>Categorized Skill Clusters ({portfolio.skills.flatMap(s => s.skills).length} Skills Found)</span>
                  </div>
                  <span className="text-xs text-slate-500">{portfolio.skills.length} Categories</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.flatMap(s => s.skills).map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs text-[#1E65FF] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects Summary */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Rocket className="w-4 h-4 text-[#1E65FF]" />
                    <span>Discovered Projects ({portfolio.projects.length})</span>
                  </div>
                  <span className="text-xs text-slate-500">Live repos & impact statements mapped</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {portfolio.projects.map((proj) => (
                    <div key={proj.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-sm font-bold text-slate-900">{proj.title}</div>
                      <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.slice(0, 4).map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1E65FF] border border-blue-200 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Summary */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Briefcase className="w-4 h-4 text-[#1E65FF]" />
                    <span>Experience History ({portfolio.experience.length} Positions)</span>
                  </div>
                  <span className="text-xs text-slate-500">{portfolio.about.yearsOfExperience}+ Years total</span>
                </div>

                <div className="space-y-2">
                  {portfolio.experience.map((exp) => (
                    <div key={exp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">
                          {exp.role} <span className="text-slate-500 font-normal">at {exp.company}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{exp.startDate} - {exp.endDate}</div>
                      </div>
                      <span className="text-xs text-[#1E65FF] font-bold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        Mapped
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Summary */}
              {portfolio.education.length > 0 && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <GraduationCap className="w-4 h-4 text-[#1E65FF]" />
                      <span>Education & Credentials ({portfolio.education.length})</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {portfolio.education.map((edu) => (
                      <div key={edu.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">{edu.degree}</div>
                          <div className="text-[11px] text-slate-600">{edu.institution} {edu.endDate ? `• ${edu.endDate}` : ''}</div>
                        </div>
                        {edu.gpa && <span className="text-xs font-mono text-emerald-600 font-bold">{edu.gpa}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setStep(1);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-300 transition-colors shadow-sm cursor-pointer"
              >
                ← Back to Upload
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    // syncToCloud automatically uploads pendingResumeFile + portfolio JSON
                    await syncToCloud(portfolio);
                    triggerConfetti();
                    showToast('Portfolio Published!', `Your live site for ${portfolio.profile.fullName} is ready.`, 'sparkles');
                    navigate(`/p/${portfolio.slug}`);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Eye className="w-4 h-4 text-[#3ECF8E]" />
                  <span>View Live Portfolio</span>
                </button>

                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();

                    // Directly upload the PDF to Supabase storage first
                    if (rawFile && isSupabaseConfigured()) {
                      try {
                        const uploadRes = await uploadResumeToSupabase(rawFile, currentUser?.id);
                        if (uploadRes.success && uploadRes.publicUrl) {
                          showToast('Resume Uploaded!', `${rawFile.name} saved to Supabase storage.`, 'sparkles');
                          // Attach the public URL to the portfolio before syncing
                          portfolio.resumeUrl = uploadRes.publicUrl;
                        } else if (uploadRes.error) {
                          console.warn('PDF upload warning:', uploadRes.error);
                        }
                      } catch (err) {
                        console.warn('PDF upload error:', err);
                      }
                    }

                    // Then sync portfolio data to cloud
                    await syncToCloud(portfolio);
                    triggerConfetti();
                    showToast('Saved to Supabase!', `${portfolio.profile.fullName}'s portfolio and resume synced to cloud.`, 'sparkles');
                    navigate('/dashboard');
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1E65FF] hover:bg-[#1853db] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#1E65FF]/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <span>Save to Supabase</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Build From Scratch Modal */}
      {showScratchModal && (
        <BuildFromScratchWizard
          isModal={true}
          isOpen={showScratchModal}
          onClose={() => setShowScratchModal(false)}
        />
      )}
    </div>
  );
};
