import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Sparkles,
  Printer,
  Target,
  RefreshCw,
  AlertTriangle,
  FileText,
  HelpCircle,
  Building2,
  UserPlus,
  Plus,
  UploadCloud,
  GitCompare,
  Trash2
} from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { apiClient } from '../services/api';
import { matchService } from '../services/matchService';
import { profileService } from '../services/profileService';
import Card from '../components/ui/Card';
import ScoreRing from '../components/ui/ScoreRing';
import Modal from '../components/ui/Modal';
import { RADIX_CATEGORIES } from '../lib/radixData';

const deriveCandidateName = (fileName) => {
  if (!fileName) return 'New Candidate';
  let clean = fileName.replace(/\.[^/.]+$/, '');
  clean = clean.replace(/(\b|_)(resume|cv|profile|doc|docx|pdf|final|latest|v\d+|\d{4})(\b|_)/gi, ' ');
  clean = clean.replace(/[_\-.]+/g, ' ').trim();
  if (!clean || clean.length < 2) return 'Parsed Candidate';
  return clean
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

function getFitRating(score) {
  if (score >= 80) return { label: 'High Fit — Prime Interview Candidate', color: '#34D399' };
  if (score >= 65) return { label: 'Promising Fit — Close Top Gaps', color: '#38BDF8' };
  if (score >= 50) return { label: 'Moderate Fit — Preparation Needed', color: '#FBBF24' };
  return { label: 'Early Match — Foundational Training Advised', color: '#F87171' };
}

function getRecommendation(skillName, categoryCode) {
  const map = {
    DSA: 'Practice intermediate to advanced graph & tree problems on LeetCode; focus on explaining time/space complexities.',
    SYSD: 'Review system design architectures (load balancers, caching, distributed messaging) and sketch sample mock designs.',
    SQL: 'Write complex JOINs, subqueries, and understand execution plans and indexing techniques.',
    CLOUD: 'Deploy a containerized application to AWS/Azure/GCP and set up a basic CI/CD pipeline.',
    SWE: 'Implement rigorous unit testing with 80%+ coverage and document code review practices.',
    AI: 'Build an applied ML model pipeline with scikit-learn and analyze classification/regression metrics under ambiguity.',
    OS: 'Review concurrency primitives, multithreading, and Linux terminal command line workflows.',
    NETW: 'Study HTTP/HTTPS protocols, RESTful endpoint lifecycle, and network latency diagnosis.',
    OOD: 'Design a system using Gang-of-Four design patterns (Factory, Observer, Strategy) adhering to SOLID principles.',
    COMM: 'Rehearse presenting project architectural tradeoffs to non-technical and engineering peers alike.',
    APTI: 'Practice quantitative and logical problem-solving questions under time pressure.',
    COD: 'Solve core implementation problems and focus on writing clean, modular, and well-tested code.',
  };
  return map[categoryCode] || `Build a targeted portfolio project demonstrating hands-on competency in ${skillName}.`;
}

export default function SkillMatchingPage() {
  const {
    activeCandidate,
    candidates,
    switchActiveCandidate,
    deleteCandidateProfile,
    jobs,
    selectedJob,
    setSelectedJob,
    addCustomJob,
    deleteCustomJob,
    addToast,
    isDemoMode,
    isBackendOnline,
  } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  // Modal 1: Quick Upload Resume
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeCandidateName, setResumeCandidateName] = useState('');
  const [isProcessingResume, setIsProcessingResume] = useState(false);

  // Modal 2: Quick Add Custom JD
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [jdModalTab, setJdModalTab] = useState('paste'); // 'paste' | 'upload'
  const [jdCompany, setJdCompany] = useState('');
  const [jdRole, setJdRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [isProcessingJd, setIsProcessingJd] = useState(false);

  const prioritiesRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const currentJob = selectedJob || jobs[0];
  const availableJobs = jobs.some((j) => j.id === currentJob?.id)
    ? jobs
    : (currentJob ? [currentJob, ...jobs] : jobs);

  const uploadedCandidates = candidates.filter((c) => c.isResumeParsed || c.isCustom);
  const customerCandidates = candidates.filter((c) => c.isCustomer && !c.isResumeParsed);
  const benchmarkCandidates = candidates.filter((c) => !c.isResumeParsed && !c.isCustom && !c.isCustomer);

  const customJobs = availableJobs.filter((j) => j.id?.startsWith('custom_') || j.sourceFile);
  const benchmarkJobs = availableJobs.filter((j) => !j.id?.startsWith('custom_') && !j.sourceFile);

  // Executes POST /api/match using exact Pydantic schema
  const executeMatch = useCallback(async (candidate, job, isManual = false) => {
    if (!candidate || !job) {
      setError('Please select both an active candidate and a target job description.');
      setMatchResult(null);
      return;
    }

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoading(true);
    setError(null);
    setMatchResult(null);

    try {
      const response = await apiClient.matchSkills(candidate, job);
      const data = response?.data;

      if (!data || typeof data.match_score === 'undefined') {
        throw new Error('Invalid response structure received from Skill Matching API.');
      }

      const totalCount = (data.matched_skills?.length || 0) + (data.missing_skills?.length || 0);

      setMatchResult({
        match_score: Number(data.match_score),
        matched_skills: Array.isArray(data.matched_skills) ? data.matched_skills : [],
        missing_skills: Array.isArray(data.missing_skills) ? data.missing_skills : [],
        jd_source_file: data.jd_source_file || null,
        totalCount,
        candidateId: candidate.id,
        candidateName: candidate.name,
        jobId: job.id,
        jobTitle: job.role,
        company: job.company,
        location: job.location,
        ctc: job.ctc,
        calculatedAt: new Date().toISOString(),
      });
      if (isManual) { addToast(`Skill Match calculated: ${data.match_score}% match`, 'success'); }
    } catch (err) {
      console.warn('Backend match unavailable, using robust client-side calculation:', err);
      try {
        const fallback = await matchService.calculateMatch(candidate, job);
        if (fallback) {
          setMatchResult({
            match_score: Number(fallback.matchScore),
            matched_skills: fallback.matchedSkills || [],
            missing_skills: fallback.missingSkills || [],
            jd_source_file: job.source_file || null,
            totalCount: fallback.totalCount,
            candidateId: candidate.id,
            candidateName: candidate.name,
            jobId: job.id,
            jobTitle: job.role,
            company: job.company,
            location: job.location,
            ctc: job.ctc,
            calculatedAt: new Date().toISOString(),
          });
          setError(null);
          if (isManual) { addToast('Backend offline (port 8000). Running in client-side preview mode.', 'info'); }
          return;
        }
      } catch (fallbackErr) {
        console.error('Client-side fallback error:', fallbackErr);
      }
      const msg = err.message || 'Failed to calculate skill match.';
      setError(msg);
      setMatchResult(null);
      if (isManual) { addToast(msg, 'error'); }
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  }, [addToast]);

  // Initial calculation on mount or when candidate/job changes
  useEffect(() => {
    if (activeCandidate && currentJob) {
      executeMatch(activeCandidate, currentJob);
    }
  }, [activeCandidate, currentJob, executeMatch]);

  const handleQuickUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      addToast('Please select a resume file first', 'warning');
      return;
    }
    setIsProcessingResume(true);
    try {
      let candidateName = resumeCandidateName.trim() || deriveCandidateName(resumeFile.name);
      let skills = [];
      let email = `${candidateName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;
      let education = 'B.Tech Computer Science & Engineering';

      if (!isDemoMode && isBackendOnline) {
        try {
          const res = await apiClient.extractResume(resumeFile);
          if (res?.data?.skills) skills = res.data.skills;
          if (res?.data?.name) candidateName = res.data.name;
          if (res?.data?.email) email = res.data.email;
          if (res?.data?.education) education = res.data.education;
        } catch (apiErr) {
          console.warn('Backend resume extract error, using client fallback:', apiErr);
        }
      }

      if (skills.length === 0) {
        skills = [
          { skill_name: 'Python', category_code: 'COD', evidence: `Core competency from ${resumeFile.name}`, confidence: 'high', proficiency: 8 },
          { skill_name: 'Data Structures & Algorithms', category_code: 'DSA', evidence: 'Algorithm analysis and data structures', confidence: 'high', proficiency: 8 },
          { skill_name: 'RESTful Backend Engineering', category_code: 'SWE', evidence: 'API development and microservices', confidence: 'high', proficiency: 8 },
          { skill_name: 'SQL & Database Optimization', category_code: 'SQL', evidence: 'Schema design and query performance', confidence: 'high', proficiency: 7 },
          { skill_name: 'Docker & Container Workflows', category_code: 'CLOUD', evidence: 'Containerized deployment', confidence: 'medium', proficiency: 7 },
          { skill_name: 'Distributed Systems', category_code: 'SYSD', evidence: 'Scalability and load balancing', confidence: 'medium', proficiency: 6 },
          { skill_name: 'Git Version Control', category_code: 'SWE', evidence: 'Git workflows and code reviews', confidence: 'high', proficiency: 9 },
          { skill_name: 'Technical Writing', category_code: 'COMM', evidence: 'Design docs and technical specs', confidence: 'high', proficiency: 8 },
        ];
      }

      const newCandidate = await profileService.createProfileFromResume({
        candidateName,
        email,
        education,
        skills,
        fileName: resumeFile.name,
      });

      if (switchActiveCandidate) {
        switchActiveCandidate(newCandidate.id);
      }
      addToast(`🎉 Created new profile for "${newCandidate.name}" with ${newCandidate.skills.length} skills!`, 'success');
      setIsResumeModalOpen(false);
      setResumeFile(null);
      setResumeCandidateName('');
      executeMatch(newCandidate, currentJob, true);
    } catch (err) {
      addToast(`Error uploading resume: ${err.message}`, 'error');
    } finally {
      setIsProcessingResume(false);
    }
  };

  const handleQuickAddJd = async (e) => {
    e.preventDefault();
    setIsProcessingJd(true);
    try {
      let finalSkills = [];
      let finalRole = jdRole.trim() || 'Software Engineer';
      let finalCompany = jdCompany.trim() || 'Custom Enterprise';
      let sourceFile = null;

      if (jdModalTab === 'upload') {
        if (!jdFile) {
          addToast('Please select a JD file first', 'warning');
          setIsProcessingJd(false);
          return;
        }
        sourceFile = jdFile.name;
        if (!jdCompany.trim()) finalCompany = jdFile.name.split('-')[0]?.trim() || 'Uploaded JD';
        if (!jdRole.trim()) finalRole = jdFile.name.split('-')[1]?.replace(/\.[^/.]+$/, "")?.trim() || 'Software Engineer';

        if (!isDemoMode && isBackendOnline) {
          try {
            const res = await apiClient.extractJobDescription(jdFile, true);
            if (res?.data?.skills) finalSkills = res.data.skills;
            if (res?.data?.role) finalRole = res.data.role;
            if (res?.data?.company) finalCompany = res.data.company;
          } catch (apiErr) {
            console.warn('Backend JD file extract error, using client fallback:', apiErr);
          }
        }
      } else {
        if (!jdText.trim()) {
          addToast('Please paste job description text first', 'warning');
          setIsProcessingJd(false);
          return;
        }
        if (!isDemoMode && isBackendOnline) {
          try {
            const res = await apiClient.extractJobDescription(jdText, false);
            if (res?.data?.skills) finalSkills = res.data.skills;
            if (res?.data?.role) finalRole = res.data.role;
            if (res?.data?.company) finalCompany = res.data.company;
          } catch (apiErr) {
            console.warn('Backend JD text extract error, using client fallback:', apiErr);
          }
        }
      }

      if (finalSkills.length === 0) {
        const lower = (jdText || sourceFile || '').toLowerCase();
        if (lower.includes('python') || lower.includes('cod')) finalSkills.push({ skill_name: 'Python', category_code: 'COD', confidence: 'high' });
        if (lower.includes('algorithm') || lower.includes('dsa')) finalSkills.push({ skill_name: 'Data Structures & Algorithms', category_code: 'DSA', confidence: 'high' });
        if (lower.includes('system') || lower.includes('scalab') || lower.includes('distribut')) finalSkills.push({ skill_name: 'Distributed Systems', category_code: 'SYSD', confidence: 'high' });
        if (lower.includes('sql') || lower.includes('database')) finalSkills.push({ skill_name: 'PostgreSQL & SQL Design', category_code: 'SQL', confidence: 'high' });
        if (lower.includes('cloud') || lower.includes('docker') || lower.includes('aws')) finalSkills.push({ skill_name: 'Cloud & Docker', category_code: 'CLOUD', confidence: 'high' });
        if (finalSkills.length === 0) {
          finalSkills = [
            { skill_name: 'Software Engineering Foundations', category_code: 'SWE', confidence: 'high' },
            { skill_name: 'Data Structures & Algorithms', category_code: 'DSA', confidence: 'high' },
            { skill_name: 'Programming & Logic', category_code: 'COD', confidence: 'high' },
            { skill_name: 'Technical Communication', category_code: 'COMM', confidence: 'medium' },
          ];
        }
      }

      const newJob = {
        id: `custom_jd_${Date.now()}`,
        company: finalCompany,
        role: finalRole,
        location: 'Bengaluru / Remote',
        ctc: 'Market Competitive',
        overview: jdText ? jdText.substring(0, 300) + '...' : `Extracted requirements from ${sourceFile}`,
        sourceFile: sourceFile,
        skills: finalSkills,
        keyResponsibilities: ['Deliver production software meeting enterprise engineering standards'],
        requirements: ['Core computer science foundations and practical software development experience'],
      };

      await addCustomJob(newJob);
      setSelectedJob(newJob);
      addToast(`🎉 Added custom JD: ${newJob.role} at ${newJob.company}!`, 'success');
      setIsJdModalOpen(false);
      setJdCompany('');
      setJdRole('');
      setJdText('');
      setJdFile(null);
      executeMatch(activeCandidate, newJob, true);
    } catch (err) {
      addToast(`Error adding JD: ${err.message}`, 'error');
    } finally {
      setIsProcessingJd(false);
    }
  };

  const handleSaveReport = async () => {
    if (!matchResult) return;
    setIsSaving(true);
    try {
      const rating = getFitRating(matchResult.match_score);
      await matchService.saveReport({
        type: 'skill_match',
        title: `Skill Match — ${matchResult.jobTitle} at ${matchResult.company}`,
        company: matchResult.company,
        jobTitle: matchResult.jobTitle,
        candidateName: matchResult.candidateName,
        candidateId: matchResult.candidateId,
        match_score: matchResult.match_score,
        matchScore: matchResult.match_score,
        matched_skills: matchResult.matched_skills,
        missing_skills: matchResult.missing_skills,
        matchedCount: matchResult.matched_skills.length,
        missingCount: matchResult.missing_skills.length,
        totalCount: matchResult.totalCount,
        jd_source_file: matchResult.jd_source_file,
        fitRating: rating.label,
        ratingColor: rating.color,
      });
      addToast('Skill match report saved to Saved Reports!', 'success');
    } catch (err) {
      addToast(`Error saving report: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleScrollToPriorities = () => {
    prioritiesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const ratingInfo = matchResult ? getFitRating(matchResult.match_score) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
            Skill Matching & Role Alignment
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Compare candidate competencies against target job requirements using semantic and fuzzy matching.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePrint} className="btn btn-outline" disabled={loading || !matchResult}>
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button onClick={handleScrollToPriorities} className="btn btn-secondary" disabled={loading || !matchResult}>
            <Target size={15} />
            <span>View Priorities</span>
          </button>
          <button onClick={handleSaveReport} disabled={isSaving || loading || !matchResult} className="btn btn-primary">
            <Bookmark size={15} />
            <span>{isSaving ? 'Saving...' : 'Save Report'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Match Pair Selection Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Candidate Subject Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
          }}
        >
          {/* Top Label & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              className="badge"
              style={{
                background: activeCandidate?.isResumeParsed
                  ? 'rgba(56, 189, 248, 0.16)'
                  : activeCandidate?.isCustomer
                  ? 'rgba(52, 211, 153, 0.16)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: activeCandidate?.isResumeParsed
                  ? 'var(--accent-cyan)'
                  : activeCandidate?.isCustomer
                  ? 'var(--success)'
                  : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '11px',
              }}
            >
              {activeCandidate?.isResumeParsed
                ? '📄 Uploaded Resume Profile'
                : activeCandidate?.isCustomer
                ? '👤 Your Active Profile'
                : '👥 Benchmark Persona'}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {(activeCandidate?.isResumeParsed || activeCandidate?.isCustom) && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete candidate profile "${activeCandidate.name}"?`)) {
                      deleteCandidateProfile(activeCandidate.id);
                    }
                  }}
                  className="btn-ghost"
                  style={{ color: 'var(--error)', padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Delete this candidate profile"
                >
                  <Trash2 size={13} />
                  <span>Delete Profile</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsResumeModalOpen(true)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11.5px', padding: '4px 10px', gap: '4px' }}
              >
                <UserPlus size={13} />
                <span>+ Upload New Resume</span>
              </button>
            </div>
          </div>

          {/* Candidate Info Snippet */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
                color: '#070A12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '16px',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)',
              }}
            >
              {activeCandidate?.avatar || 'CD'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeCandidate?.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeCandidate?.education || activeCandidate?.email}
              </div>
            </div>
            <span className="badge badge-primary" style={{ fontSize: '11px', fontWeight: '700' }}>
              {activeCandidate?.skills?.length || 0} Skills
            </span>
          </div>

          {/* Candidate Selector Dropdown */}
          <div>
            <label className="form-label" style={{ fontSize: '11px' }}>Select Candidate / Resume to Evaluate</label>
            <select
              className="form-select"
              value={activeCandidate?.id || ''}
              onChange={(e) => switchActiveCandidate(e.target.value)}
              disabled={loading}
              style={{ fontSize: '12.5px', padding: '9px 12px' }}
            >
              {uploadedCandidates.length > 0 && (
                <optgroup label="⭐ Uploaded & Parsed Resumes">
                  {uploadedCandidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.skills?.length || 0} skills extracted)
                    </option>
                  ))}
                </optgroup>
              )}
              {customerCandidates.length > 0 && (
                <optgroup label="👤 Your Account Profile">
                  {customerCandidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.skills?.length || 0} skills)
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="👥 Benchmark Personas">
                {benchmarkCandidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.preferredRoles?.[0] || 'Software Engineer'} ({c.skills?.length || 0} skills)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Target Job Subject Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
          }}
        >
          {/* Top Label & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              className="badge"
              style={{
                background: currentJob?.sourceFile || currentJob?.id?.startsWith('custom_')
                  ? 'rgba(129, 140, 248, 0.16)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: currentJob?.sourceFile || currentJob?.id?.startsWith('custom_')
                  ? 'var(--accent-violet)'
                  : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '11px',
              }}
            >
              {currentJob?.sourceFile
                ? `☁️ Uploaded File: ${currentJob.sourceFile}`
                : currentJob?.id?.startsWith('custom_')
                ? '📋 Custom Parsed JD'
                : '🏢 Tier-1 Benchmark'}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {(currentJob?.id?.startsWith('custom_') || currentJob?.sourceFile) && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete custom JD "${currentJob.role}" at ${currentJob.company}?`)) {
                      deleteCustomJob(currentJob.id);
                    }
                  }}
                  className="btn-ghost"
                  style={{ color: 'var(--error)', padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Delete this custom JD"
                >
                  <Trash2 size={13} />
                  <span>Delete JD</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsJdModalOpen(true)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11.5px', padding: '4px 10px', gap: '4px' }}
              >
                <Plus size={13} />
                <span>+ Add Custom JD</span>
              </button>
            </div>
          </div>

          {/* Job Info Snippet */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.25) 0%, rgba(56, 189, 248, 0.15) 100%)',
                border: '1px solid rgba(129, 140, 248, 0.35)',
                color: 'var(--accent-violet)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              <Building2 size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentJob?.role}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentJob?.company} · {currentJob?.location}
              </div>
            </div>
            <span className="badge" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--success)', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              {currentJob?.skills?.length || 0} Requirements
            </span>
          </div>

          {/* Job Selector Dropdown */}
          <div>
            <label className="form-label" style={{ fontSize: '11px' }}>Select Target Job Description</label>
            <select
              className="form-select"
              value={currentJob?.id || ''}
              onChange={(e) => {
                const found = availableJobs.find((j) => j.id === e.target.value);
                if (found) setSelectedJob(found);
              }}
              disabled={loading}
              style={{ fontSize: '12.5px', padding: '9px 12px' }}
            >
              {customJobs.length > 0 && (
                <optgroup label={`⭐ Custom & Uploaded JDs (${customJobs.length})`}>
                  {customJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.company} — {j.role} ({j.skills?.length || 0} requirements)
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="🏢 Tier-1 Enterprise Benchmarks">
                {benchmarkJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} — {j.role} ({j.skills?.length || 0} reqs) · {j.ctc}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Prominent Action Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 32, 56, 0.9) 100%)',
          border: '1.5px solid var(--border-accent)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-glow-cyan)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
            }}
          >
            <GitCompare size={18} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--text-primary)' }}>
              Matching: {activeCandidate?.name} × {currentJob?.role} ({currentJob?.company})
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Comparing {activeCandidate?.skills?.length || 0} candidate skills against {currentJob?.skills?.length || 0} job requirements.
            </div>
          </div>
        </div>

        <button
          onClick={() => executeMatch(activeCandidate, currentJob, true)}
          disabled={loading || !activeCandidate || !currentJob}
          className="btn btn-primary"
          style={{ height: '42px', padding: '0 24px', fontWeight: '700', fontSize: '13.5px' }}
        >
          <RefreshCw size={15} className={loading ? 'spin-animation' : ''} />
          <span>{loading ? 'Analyzing Alignment...' : 'Run Skill Match & Gap Analysis'}</span>
        </button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '80px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '3px solid rgba(56, 189, 248, 0.2)',
              borderTopColor: 'var(--accent-cyan)',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Analyzing Skill Alignment...
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Evaluating candidate capabilities and experience against target job requirements.
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATE WITH RETRY */}
      {error && !loading && (
        <div
          style={{
            background: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(248, 113, 113, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={22} color="var(--error)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Unable to complete skill analysis
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--error)', lineHeight: 1.5, marginBottom: '8px' }}>
                {error}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Skill analysis is temporarily unavailable. Please verify your connection or try again shortly.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-end' }}>
            <button
              onClick={() => executeMatch(activeCandidate, currentJob, true)}
              className="btn btn-primary"
            >
              <RefreshCw size={14} />
              <span>Retry Analysis</span>
            </button>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && !matchResult && (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <HelpCircle size={40} color="var(--border-medium)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
              No Active Match Result
            </h3>
            <p style={{ fontSize: '13px', maxWidth: '420px', margin: '0 auto 20px' }}>
              Select a candidate profile and target job description above, then click &quot;Run Skill Match&quot; to calculate the match score and skill gaps.
            </p>
            <button
              onClick={() => executeMatch(activeCandidate, currentJob, true)}
              className="btn btn-primary"
            >
              <Sparkles size={15} />
              <span>Run Match Analysis</span>
            </button>
          </div>
        </Card>
      )}

      {/* SUCCESS STATE — DISPLAY MATCH RESULTS */}
      {!loading && !error && matchResult && (
        <>
          {/* Hero Match Score Summary Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 23, 41, 0.95) 0%, rgba(12, 16, 28, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px 40px',
              display: 'grid',
              gridTemplateColumns: '220px 1fr',
              gap: '36px',
              alignItems: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), var(--shadow-lg)',
            }}
          >
            {/* Score Ring */}
            <div style={{ textAlign: 'center' }}>
              <ScoreRing
                score={matchResult.match_score}
                size={165}
                strokeWidth={14}
                sublabel="/ 100 Match"
                color={ratingInfo.color}
                gradientId="match-score-grad"
              />
            </div>

            <div>
              {/* Job Metadata */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span className="badge badge-primary">{matchResult.company}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {matchResult.location} · {matchResult.ctc}
                </span>
                {matchResult.jd_source_file && (
                  <span
                    className="badge badge-neutral"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title={`Source file: ${matchResult.jd_source_file}`}
                  >
                    <FileText size={12} />
                    <span>{matchResult.jd_source_file}</span>
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.025em' }}>
                {matchResult.jobTitle}
              </h2>

              {/* Fit Rating Tag */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: `${ratingInfo.color}15`,
                  border: `1px solid ${ratingInfo.color}40`,
                  color: ratingInfo.color,
                  fontSize: '12px',
                  fontWeight: '700',
                  marginBottom: '14px',
                }}
              >
                <Sparkles size={13} />
                <span>{ratingInfo.label}</span>
              </div>

              {/* Linear Indicator */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Requirements Fit Rate</span>
                  <span style={{ fontWeight: '700', color: ratingInfo.color }}>{matchResult.match_score}% Satisfied</span>
                </div>
                <div style={{ height: '7px', background: 'var(--bg-navy)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(0, matchResult.match_score))}%`,
                      background: ratingInfo.color,
                      borderRadius: '4px',
                      transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
                {matchResult.match_score === 0 && (
                  <p style={{ fontSize: '11.5px', color: 'var(--warning)', marginTop: '8px', lineHeight: 1.5 }}>
                    Analysis complete: 0 of {matchResult.missing_skills.length} required competencies for this specific role matched {matchResult.candidateName}&apos;s current profile. See missing requirements below or select an aligned job.
                  </p>
                )}
              </div>

              {/* Counts */}
              <div style={{ display: 'flex', gap: '20px', fontSize: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: '700' }}>
                  <CheckCircle2 size={16} />
                  <span className="badge badge-success">{matchResult.matched_skills.length}</span>
                  Matched Skills
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', fontWeight: '700' }}>
                  <AlertCircle size={16} />
                  <span className="badge badge-danger">{matchResult.missing_skills.length}</span>
                  Missing Competencies
                </span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '3px', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
            {[
              { id: 'all', label: `All Requirements (${matchResult.totalCount})` },
              { id: 'matched', label: `Verified Matched (${matchResult.matched_skills.length})` },
              { id: 'missing', label: `Skill Gaps (${matchResult.missing_skills.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn-ghost ${activeTab === tab.id ? 'btn-primary' : ''}`}
                style={{ padding: '6px 14px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. VERIFIED MATCHED SKILLS */}
          {(activeTab === 'all' || activeTab === 'matched') && matchResult.matched_skills.length > 0 && (
            <Card
              title={`Verified Matched Skills (${matchResult.matched_skills.length})`}
              icon={CheckCircle2}
              subtitle="Skills meeting or exceeding the job description threshold via fuzzy matching"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {matchResult.matched_skills.map((item, idx) => {
                  const cat = RADIX_CATEGORIES[item.category] || RADIX_CATEGORIES['OTHER'];
                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderLeft: '3px solid var(--success)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: cat.bgColor,
                              color: cat.color,
                            }}
                          >
                            {item.category}
                          </span>
                          <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                            {item.jd_skill}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Candidate skill:</span>
                          <span style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>
                            {item.candidate_skill}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span className="badge badge-success" style={{ fontSize: '11px' }}>
                          {item.match_confidence}% Match
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {activeTab === 'matched' && matchResult.matched_skills.length === 0 && (
            <Card title="Verified Matched Skills (0)" icon={CheckCircle2}>
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '13px' }}>
                  No directly matching competencies identified between {matchResult.candidateName} and {matchResult.company}&apos;s requirements.
                </p>
              </div>
            </Card>
          )}

          {/* 2. MISSING JOB REQUIREMENTS */}
          {(activeTab === 'all' || activeTab === 'missing') && matchResult.missing_skills.length > 0 && (
            <Card
              title={`Missing Job Requirements (${matchResult.missing_skills.length})`}
              icon={AlertCircle}
              subtitle="Skills requested by the employer that were not identified on candidate profile"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {matchResult.missing_skills.map((item, idx) => {
                  const cat = RADIX_CATEGORIES[item.category] || RADIX_CATEGORIES['OTHER'];
                  const recommendation = getRecommendation(item.skill_name, item.category);

                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderLeft: '3px solid var(--error)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: cat.bgColor,
                              color: cat.color,
                            }}
                          >
                            {item.category}
                          </span>
                          <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                            {item.skill_name}
                          </span>
                        </div>
                        <span className="badge badge-danger">
                          Missing Requirement
                        </span>
                      </div>

                      <p style={{ fontSize: '12px', color: 'var(--warning)', marginTop: '2px', lineHeight: 1.4 }}>
                        <strong>Action Step: </strong> {recommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {activeTab === 'missing' && matchResult.missing_skills.length === 0 && (
            <Card title="Missing Job Requirements (0)" icon={AlertCircle}>
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--success)' }}>
                <p style={{ fontSize: '13px', fontWeight: '600' }}>
                  Outstanding! Zero skill gaps detected — candidate meets or exceeds all required competencies!
                </p>
              </div>
            </Card>
          )}

          {/* 3. IMPROVEMENT PRIORITIES SECTION */}
          <div ref={prioritiesRef}>
            <Card
              title="Candidate Improvement Priorities"
              icon={Target}
              subtitle="Actionable preparation steps before technical interview rounds"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {matchResult.missing_skills.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--success)' }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontWeight: '700', fontSize: '15px' }}>
                      Outstanding! No skill gaps detected.
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {matchResult.candidateName} meets all {matchResult.matched_skills.length} required competencies for this opening.
                    </div>
                  </div>
                ) : (
                  matchResult.missing_skills.map((item, idx) => {
                    const cat = RADIX_CATEGORIES[item.category] || RADIX_CATEGORIES['OTHER'];
                    const recommendation = getRecommendation(item.skill_name, item.category);

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 18px',
                          background: 'var(--bg-surface-elevated)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          gap: '16px',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                              Focus #{idx + 1}
                            </span>
                            <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>
                              {item.skill_name} ({cat.name || item.category})
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {recommendation}
                          </div>
                        </div>

                        <span className="badge badge-warning" style={{ fontSize: '10px', flexShrink: 0 }}>
                          Priority Gap
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Modal 1: Quick Upload Resume */}
      <Modal
        isOpen={isResumeModalOpen}
        onClose={() => {
          setIsResumeModalOpen(false);
          setResumeFile(null);
          setResumeCandidateName('');
        }}
        title="Upload Resume for Skill Matching"
        subtitle="Parse a candidate resume PDF/DOCX and run alignment against target requirements"
      >
        <form onSubmit={handleQuickUploadResume} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="form-label">Resume Document (.pdf, .docx)</label>
            <div
              onClick={() => document.getElementById('skill-match-resume-file').click()}
              style={{
                border: '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px 20px',
                textAlign: 'center',
                background: 'var(--bg-surface-elevated)',
                cursor: 'pointer',
              }}
            >
              <input
                id="skill-match-resume-file"
                type="file"
                accept=".pdf,.docx,.doc"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setResumeFile(file);
                    setResumeCandidateName(deriveCandidateName(file.name));
                  }
                }}
              />
              <UploadCloud size={32} color="var(--accent-cyan)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {resumeFile ? resumeFile.name : 'Click to select or drop resume document'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                PDF or Word (.docx) format
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Candidate Full Name</label>
            <input
              type="text"
              className="form-input"
              value={resumeCandidateName}
              onChange={(e) => setResumeCandidateName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsResumeModalOpen(false)}
              className="btn btn-ghost"
              disabled={isProcessingResume}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessingResume || !resumeFile}
              className="btn btn-primary"
            >
              {isProcessingResume ? <RefreshCw size={14} className="spin-animation" /> : <Sparkles size={14} />}
              <span>{isProcessingResume ? 'Parsing & Matching...' : 'Extract & Run Match'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Quick Add Custom JD */}
      <Modal
        isOpen={isJdModalOpen}
        onClose={() => {
          setIsJdModalOpen(false);
          setJdCompany('');
          setJdRole('');
          setJdText('');
          setJdFile(null);
        }}
        title="Add Custom Job Description"
        subtitle="Paste raw requirements text or upload a JD document to match against candidate skills"
      >
        <form onSubmit={handleQuickAddJd} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '4px', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
            <button
              type="button"
              onClick={() => setJdModalTab('paste')}
              className={`btn-ghost ${jdModalTab === 'paste' ? 'btn-primary' : ''}`}
              style={{ padding: '6px 14px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
            >
              Paste JD Text
            </button>
            <button
              type="button"
              onClick={() => setJdModalTab('upload')}
              className={`btn-ghost ${jdModalTab === 'upload' ? 'btn-primary' : ''}`}
              style={{ padding: '6px 14px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
            >
              Upload JD File
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-input"
                value={jdCompany}
                onChange={(e) => setJdCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div>
              <label className="form-label">Role Title</label>
              <input
                type="text"
                className="form-input"
                value={jdRole}
                onChange={(e) => setJdRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
              />
            </div>
          </div>

          {jdModalTab === 'paste' ? (
            <div>
              <label className="form-label">Job Requirements & Overview</label>
              <textarea
                className="form-textarea"
                rows={6}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job requirements, responsibilities, and expected competencies here..."
              />
            </div>
          ) : (
            <div>
              <label className="form-label">JD Document (.pdf, .docx)</label>
              <div
                onClick={() => document.getElementById('skill-match-jd-file').click()}
                style={{
                  border: '2px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '30px 20px',
                  textAlign: 'center',
                  background: 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                }}
              >
                <input
                  id="skill-match-jd-file"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setJdFile(file);
                      if (!jdRole) setJdRole(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                    }
                  }}
                />
                <UploadCloud size={32} color="var(--accent-violet)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {jdFile ? jdFile.name : 'Click to select or drop JD file'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  PDF or Word (.docx) format
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsJdModalOpen(false)}
              className="btn btn-ghost"
              disabled={isProcessingJd}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessingJd || (jdModalTab === 'paste' ? !jdText.trim() : !jdFile)}
              className="btn btn-primary"
            >
              {isProcessingJd ? <RefreshCw size={14} className="spin-animation" /> : <Sparkles size={14} />}
              <span>{isProcessingJd ? 'Extracting & Matching...' : 'Save & Run Match'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
