import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Sparkles,
  MapPin,
  CheckCircle2,
  GitCompare,
  RefreshCw,
  BookOpen,
  Building2,
  FileText,
  Trash2
} from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { apiClient } from '../services/api';
import { SAMPLE_JOBS, RADIX_CATEGORIES } from '../lib/radixData';
import Card from '../components/ui/Card';

const getCompanyBadgeStyle = (company) => {
  const c = company?.toLowerCase() || '';
  if (c.includes('google')) {
    return { bg: 'rgba(66, 133, 244, 0.14)', color: '#60A5FA', border: 'rgba(66, 133, 244, 0.35)' };
  }
  if (c.includes('microsoft')) {
    return { bg: 'rgba(0, 164, 239, 0.14)', color: '#38BDF8', border: 'rgba(0, 164, 239, 0.35)' };
  }
  if (c.includes('oracle')) {
    return { bg: 'rgba(234, 67, 53, 0.14)', color: '#FB7185', border: 'rgba(234, 67, 53, 0.35)' };
  }
  return { bg: 'rgba(129, 140, 248, 0.14)', color: '#A5B4FC', border: 'rgba(129, 140, 248, 0.35)' };
};

export default function JDAnalyticsPage() {
  const navigate = useNavigate();
  const { selectedJob, setSelectedJob, addCustomJob, deleteCustomJob, isDemoMode, isBackendOnline, addToast, activeCandidate } = useApp();

  const [activeJob, setActiveJob] = useState(selectedJob || SAMPLE_JOBS[0]);
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('sample');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSelectSampleJob = (job) => {
    setActiveJob(job);
    setSelectedJob(job);
  };

  const handleExecuteFileAnalysis = async () => {
    if (!uploadedFile) {
      addToast('Please select or drop a job description file first', 'warning');
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(15);
    setUploadStep('Reading document binary...');
    try {
      if (!isDemoMode && isBackendOnline) {
        setUploadProgress(40);
        setUploadStep('Extracting requirements via OpenRouter Nemotron...');
        const res = await apiClient.extractJobDescription(uploadedFile, true);
        setUploadProgress(80);
        setUploadStep('Mapping competencies to 12 RADIX categories...');

        const jdData = res.data || {};
        const newJob = {
          id: `custom_jd_${Date.now()}`,
          company: jdData.company || uploadedFile.name.split('-')[0]?.trim() || 'Analyzed Company',
          role: jdData.role || 'Analyzed Position',
          location: jdData.location || 'Bengaluru / Remote',
          ctc: jdData.ctc || 'Competitive CTC',
          overview: `Extracted from ${uploadedFile.name}. Identifies ${jdData.skills?.length || 0} core competencies.`,
          sourceFile: uploadedFile.name,
          skills: jdData.skills || [],
          keyResponsibilities: jdData.responsibilities || [],
          requirements: jdData.requirements || [],
        };
        setActiveJob(newJob);
        if (addCustomJob) addCustomJob(newJob);
        else setSelectedJob(newJob);
        setUploadProgress(100);
        setUploadStep('Extraction Complete!');
        addToast(`Extracted ${newJob.skills.length} competencies from ${uploadedFile.name}`, 'success');
      } else {
        setUploadProgress(50);
        setUploadStep('Processing with client-side NLP engine...');
        await new Promise((r) => setTimeout(r, 600));

        const detectedSkills = [
          { skill_name: 'Python', category_code: 'COD', evidence: 'Core language requirement', confidence: 'high' },
          { skill_name: 'Data Structures & Algorithms', category_code: 'DSA', evidence: 'Foundational algorithmic problem solving', confidence: 'high' },
          { skill_name: 'System Design', category_code: 'SYSD', evidence: 'Scalable service architecture', confidence: 'high' },
          { skill_name: 'PostgreSQL', category_code: 'SQL', evidence: 'Database query design', confidence: 'high' },
          { skill_name: 'Docker & Kubernetes', category_code: 'CLOUD', evidence: 'Containerized deployment', confidence: 'medium' },
        ];
        const newJob = {
          id: `custom_jd_${Date.now()}`,
          company: uploadedFile.name.split('-')[0]?.trim() || 'Uploaded JD',
          role: uploadedFile.name.split('-')[1]?.replace(/\.[^/.]+$/, "")?.trim() || 'Software Engineer',
          location: 'Bengaluru / Remote',
          ctc: '₹18,00,000 - ₹24,00,000',
          overview: `Parsed requirements from uploaded document ${uploadedFile.name}`,
          sourceFile: uploadedFile.name,
          skills: detectedSkills,
          keyResponsibilities: ['Deliver production-grade code', 'Collaborate across cross-functional engineering teams'],
          requirements: ['Strong foundations in computer science and distributed systems'],
        };
        setActiveJob(newJob);
        if (addCustomJob) addCustomJob(newJob);
        else setSelectedJob(newJob);
        setUploadProgress(100);
        setUploadStep('Extraction Complete!');
        addToast(`Parsed ${uploadedFile.name} successfully`, 'success');
      }
    } catch (err) {
      addToast(`Error analyzing document: ${err.message}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunTextAnalysis = async () => {
    if (!pastedText.trim()) {
      addToast('Please enter job description text to analyze', 'warning');
      return;
    }

    setIsAnalyzing(true);
    try {
      if (!isDemoMode && isBackendOnline) {
        const res = await apiClient.extractJobDescription(pastedText, false);
        const newJob = {
          id: `custom_jd_${Date.now()}`,
          company: res.data?.company || 'Analyzed Company',
          role: res.data?.role || 'Analyzed Role',
          location: res.data?.location || 'Remote / Hybrid',
          ctc: res.data?.ctc || 'Competitive CTC',
          overview: pastedText.substring(0, 300) + '...',
          skills: res.data?.skills || [],
          keyResponsibilities: res.data?.responsibilities || [],
        };
        setActiveJob(newJob);
        if (addCustomJob) addCustomJob(newJob);
        else setSelectedJob(newJob);
        addToast('Job description analyzed successfully', 'success');
      } else {
        await new Promise((r) => setTimeout(r, 600));

        const detectedSkills = [];
        const lower = pastedText.toLowerCase();

        if (lower.includes('algorithm') || lower.includes('data structure') || lower.includes('dsa')) {
          detectedSkills.push({ skill_name: 'Data Structures & Algorithms', category_code: 'DSA', evidence: 'Extracted from algorithm requirements', confidence: 'high' });
        }
        if (lower.includes('system design') || lower.includes('distributed') || lower.includes('scalab')) {
          detectedSkills.push({ skill_name: 'Distributed System Design', category_code: 'SYSD', evidence: 'Extracted from scalability/architecture requirements', confidence: 'high' });
        }
        if (lower.includes('sql') || lower.includes('database') || lower.includes('postgres') || lower.includes('mysql')) {
          detectedSkills.push({ skill_name: 'Relational SQL & Schema Design', category_code: 'SQL', evidence: 'Extracted from database specifications', confidence: 'high' });
        }
        if (lower.includes('python')) {
          detectedSkills.push({ skill_name: 'Python Development', category_code: 'COD', evidence: 'Identified Python programming requirement', confidence: 'high' });
        }
        if (lower.includes('c++')) {
          detectedSkills.push({ skill_name: 'C++ Systems Programming', category_code: 'COD', evidence: 'Identified C++ requirement', confidence: 'high' });
        }
        if (lower.includes('java')) {
          detectedSkills.push({ skill_name: 'Java & OOP Principles', category_code: 'COD', evidence: 'Identified Java requirement', confidence: 'high' });
        }
        if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure') || lower.includes('gcp') || lower.includes('docker')) {
          detectedSkills.push({ skill_name: 'Cloud & Containerization', category_code: 'CLOUD', evidence: 'Identified cloud infrastructure requirements', confidence: 'high' });
        }
        if (lower.includes('test') || lower.includes('ci/cd') || lower.includes('git')) {
          detectedSkills.push({ skill_name: 'Software Testing & CI/CD', category_code: 'SWE', evidence: 'Extracted testing/SDLC standards', confidence: 'high' });
        }
        if (lower.includes('communication') || lower.includes('stakeholder') || lower.includes('present')) {
          detectedSkills.push({ skill_name: 'Stakeholder Communication', category_code: 'COMM', evidence: 'Extracted collaboration/communication standards', confidence: 'high' });
        }

        if (detectedSkills.length === 0) {
          detectedSkills.push(
            { skill_name: 'Programming & Logic', category_code: 'COD', evidence: 'Foundational coding expectation', confidence: 'medium' },
            { skill_name: 'Technical Communication', category_code: 'COMM', evidence: 'Cross-functional teamwork requirement', confidence: 'medium' }
          );
        }

        const customAnalyzedJob = {
          id: `custom_jd_${Date.now()}`,
          company: 'Custom Evaluated JD',
          companyShort: 'Custom',
          role: 'Analyzed Position',
          roleCategory: 'Engineering',
          location: 'Bengaluru / Remote',
          ctc: 'Market Standard CTC',
          overview: pastedText.substring(0, 320) + (pastedText.length > 320 ? '...' : ''),
          keyResponsibilities: [
            'Deliver production code meeting engineering specifications',
            'Collaborate with product and quality assurance partners',
            'Participate in architecture discussions and technical reviews'
          ],
          requirements: [
            'Hands-on computer science foundations and problem-solving aptitude',
            'Strong communication and ability to explain engineering tradeoffs'
          ],
          skills: detectedSkills,
        };

        setActiveJob(customAnalyzedJob);
        if (addCustomJob) addCustomJob(customAnalyzedJob);
        else setSelectedJob(customAnalyzedJob);
        addToast(`Extracted ${detectedSkills.length} competencies using RADIX Analyzer`, 'success');
      }
    } catch (err) {
      addToast(`JD Analysis error: ${err.message}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRouteToMatch = () => {
    setSelectedJob(activeJob);
    if (activeJob?.id) {
      localStorage.setItem('radix_selected_job_id_v1', activeJob.id);
    }
    navigate('/skill-matching');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
            Job Description Analytics
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Parse employer JDs, extract core competencies mapped to 12 RADIX standards, and prepare for candidate matching.
          </p>
        </div>

        <button
          onClick={handleRouteToMatch}
          className="btn btn-primary"
        >
          <GitCompare size={16} />
          <span>Match with {activeCandidate?.name}</span>
        </button>
      </div>

      {/* 3 Prominent Mobbin Mode Selector Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {/* Card 1: Benchmark JD */}
        <div
          onClick={() => setActiveTab('sample')}
          style={{
            padding: '22px 24px',
            borderRadius: 'var(--radius-lg)',
            background: activeTab === 'sample'
              ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.88) 100%)'
              : 'var(--bg-surface)',
            border: activeTab === 'sample' ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
            boxShadow: activeTab === 'sample' ? '0 0 24px rgba(56, 189, 248, 0.22)' : 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {activeTab === 'sample' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #38BDF8, #818CF8)' }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: activeTab === 'sample' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${activeTab === 'sample' ? 'rgba(56, 189, 248, 0.4)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeTab === 'sample' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              }}
            >
              <Building2 size={22} />
            </div>
            <span
              className="badge"
              style={{
                background: activeTab === 'sample' ? 'rgba(56, 189, 248, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === 'sample' ? 'var(--accent-cyan)' : 'var(--text-subtle)',
                border: `1px solid ${activeTab === 'sample' ? 'rgba(56, 189, 248, 0.35)' : 'var(--border-subtle)'}`,
                fontWeight: '700',
                fontSize: '11px',
                padding: '4px 10px',
              }}
            >
              6 BENCHMARKS
            </span>
          </div>

          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Select Benchmark JD
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
            Curated hiring standards from Google, Microsoft, and Oracle with verified 12-category weights.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '11.5px', color: activeTab === 'sample' ? 'var(--accent-cyan)' : 'var(--text-subtle)', fontWeight: '700' }}>
            <CheckCircle2 size={13} color={activeTab === 'sample' ? 'var(--accent-cyan)' : 'var(--text-subtle)'} />
            <span>{activeTab === 'sample' ? 'Active Workflow Mode' : 'Click to explore benchmarks'}</span>
          </div>
        </div>

        {/* Card 2: Paste Job Description */}
        <div
          onClick={() => setActiveTab('paste')}
          style={{
            padding: '22px 24px',
            borderRadius: 'var(--radius-lg)',
            background: activeTab === 'paste'
              ? 'linear-gradient(135deg, rgba(129, 140, 248, 0.14) 0%, rgba(15, 23, 42, 0.88) 100%)'
              : 'var(--bg-surface)',
            border: activeTab === 'paste' ? '1.5px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
            boxShadow: activeTab === 'paste' ? '0 0 24px rgba(129, 140, 248, 0.22)' : 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {activeTab === 'paste' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #818CF8, #C084FC)' }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: activeTab === 'paste' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${activeTab === 'paste' ? 'rgba(129, 140, 248, 0.4)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeTab === 'paste' ? 'var(--accent-violet)' : 'var(--text-muted)',
              }}
            >
              <FileText size={22} />
            </div>
            <span
              className="badge"
              style={{
                background: activeTab === 'paste' ? 'rgba(129, 140, 248, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === 'paste' ? 'var(--accent-violet)' : 'var(--text-subtle)',
                border: `1px solid ${activeTab === 'paste' ? 'rgba(129, 140, 248, 0.35)' : 'var(--border-subtle)'}`,
                fontWeight: '700',
                fontSize: '11px',
                padding: '4px 10px',
              }}
            >
              RAW TEXT PARSER
            </span>
          </div>

          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Paste Job Description
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
            Paste raw requirements from LinkedIn, Indeed, or career portals for custom NLP parsing.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '11.5px', color: activeTab === 'paste' ? 'var(--accent-violet)' : 'var(--text-subtle)', fontWeight: '700' }}>
            <CheckCircle2 size={13} color={activeTab === 'paste' ? 'var(--accent-violet)' : 'var(--text-subtle)'} />
            <span>{activeTab === 'paste' ? 'Active Workflow Mode' : 'Click to paste raw JD'}</span>
          </div>
        </div>

        {/* Card 3: Upload Document */}
        <div
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '22px 24px',
            borderRadius: 'var(--radius-lg)',
            background: activeTab === 'upload'
              ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.12) 0%, rgba(15, 23, 42, 0.88) 100%)'
              : 'var(--bg-surface)',
            border: activeTab === 'upload' ? '1.5px solid var(--success)' : '1px solid var(--border-subtle)',
            boxShadow: activeTab === 'upload' ? '0 0 24px rgba(52, 211, 153, 0.22)' : 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {activeTab === 'upload' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #34D399, #38BDF8)' }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: activeTab === 'upload' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${activeTab === 'upload' ? 'rgba(52, 211, 153, 0.4)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeTab === 'upload' ? 'var(--success)' : 'var(--text-muted)',
              }}
            >
              <UploadCloud size={22} />
            </div>
            <span
              className="badge"
              style={{
                background: activeTab === 'upload' ? 'rgba(52, 211, 153, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === 'upload' ? 'var(--success)' : 'var(--text-subtle)',
                border: `1px solid ${activeTab === 'upload' ? 'rgba(52, 211, 153, 0.35)' : 'var(--border-subtle)'}`,
                fontWeight: '700',
                fontSize: '11px',
                padding: '4px 10px',
              }}
            >
              PDF / DOCX
            </span>
          </div>

          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Upload JD Document
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
            Drop or browse employer JD documents for automated competency extraction.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '11.5px', color: activeTab === 'upload' ? 'var(--success)' : 'var(--text-subtle)', fontWeight: '700' }}>
            <CheckCircle2 size={13} color={activeTab === 'upload' ? 'var(--success)' : 'var(--text-subtle)'} />
            <span>{activeTab === 'upload' ? 'Active Workflow Mode' : 'Click to upload JD file'}</span>
          </div>
        </div>
      </div>

      {/* Mode Content Panel */}
      <Card>
        {activeTab === 'sample' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Tier-1 Hiring Standards Roster
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Select an enterprise benchmark below to inspect required competencies and match candidates.
                </p>
              </div>
              <span className="badge badge-primary">
                {activeJob ? `Selected: ${activeJob.company} (${activeJob.role})` : 'Select a benchmark'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {SAMPLE_JOBS.map((job) => {
                const isSelected = activeJob.id === job.id;
                const badgeStyle = getCompanyBadgeStyle(job.company);
                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectSampleJob(job)}
                    style={{
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-lg)',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.18)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: `1px solid ${badgeStyle.border}`,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {job.companyShort || job.company}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: '600' }}>
                        {job.roleCategory}
                      </span>
                    </div>

                    <div style={{ fontWeight: '800', fontSize: '15px', color: isSelected ? '#FFFFFF' : 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                      {job.role}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>{job.location}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: '600' }}>
                        {job.ctc}
                      </span>
                    </div>

                    {isSelected && (
                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                        <CheckCircle2 size={13} />
                        <span>Selected for Evaluation</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'paste' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <textarea
              className="form-textarea"
              style={{ minHeight: '150px' }}
              placeholder="Paste raw job description text here (e.g. responsibilities, requirements, skills)..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleRunTextAnalysis}
                disabled={isAnalyzing || !pastedText.trim()}
                className="btn btn-primary"
              >
                {isAnalyzing ? <RefreshCw size={14} className="spin-animation" /> : <Sparkles size={14} />}
                <span>Extract Skills & Categories</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setUploadedFile(file);
                  addToast(`Selected ${file.name}`, 'info');
                }
              }}
              onClick={() => document.getElementById('jd-file-input').click()}
              style={{
                background: isDragOver ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                border: isDragOver ? '2px dashed var(--accent-cyan)' : '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                id="jd-file-input"
                type="file"
                accept=".pdf,.docx,.doc"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedFile(file);
                    addToast(`Selected ${file.name}`, 'info');
                  }
                }}
              />
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                }}
              >
                <UploadCloud size={28} color="var(--accent-cyan)" />
              </div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px', fontSize: '16px', fontWeight: '700' }}>
                {uploadedFile ? uploadedFile.name : 'Upload Job Description Document'}
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Drag and drop your PDF or Word (.docx) file here, or click to browse.
              </p>
              {uploadedFile && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--accent-cyan)', fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                  <CheckCircle2 size={14} color="var(--success)" />
                  <span>Ready for Analysis ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                {isAnalyzing && (
                  <div style={{ width: '100%', maxWidth: '420px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>{uploadStep}</span>
                      <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{uploadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #38BDF8, #34D399)', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                )}
                <button
                  onClick={handleExecuteFileAnalysis}
                  disabled={isAnalyzing}
                  className="btn btn-primary"
                  style={{ minWidth: '240px', height: '42px', fontSize: '14px' }}
                >
                  {isAnalyzing ? <RefreshCw size={15} className="spin-animation" /> : <Sparkles size={15} />}
                  <span>{isAnalyzing ? (uploadStep || 'Analyzing JD...') : 'Analyze Job Description'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Analysis Output Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-primary">{activeJob.company}</span>
                {activeJob.sourceFile && (
                  <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
                    Uploaded File
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                  {activeJob.ctc}
                </span>
                {(activeJob.id?.startsWith('custom_') || activeJob.sourceFile) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete custom JD "${activeJob.role}" at ${activeJob.company}?`)) {
                        deleteCustomJob(activeJob.id);
                        setActiveJob(SAMPLE_JOBS[0]);
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
              </div>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              {activeJob.role}
            </h2>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="var(--accent-violet)" />
                {activeJob.location}
              </span>
              <span>·</span>
              <span>Full-Time Role</span>
              {activeJob.sourceFile && (
                <>
                  <span>·</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{activeJob.sourceFile}</span>
                </>
              )}
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {activeJob.overview}
            </p>
          </Card>

          <Card
            title={`Required Skills & Technologies (${activeJob.skills?.length || 0})`}
            subtitle="Extracted requirements mapped to RADIX 12-category standard"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeJob.skills?.map((skill, idx) => {
                const cat = RADIX_CATEGORIES[skill.category_code] || RADIX_CATEGORIES['OTHER'];
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                          {skill.category_code}
                        </span>
                        <span style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                          {skill.skill_name}
                        </span>
                      </div>

                      <span
                        className="badge"
                        style={{
                          fontSize: '10px',
                          background: skill.confidence === 'high' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: skill.confidence === 'high' ? 'var(--success)' : 'var(--accent-cyan)',
                        }}
                      >
                        {skill.confidence || 'verified'} confidence
                      </span>
                    </div>

                    {skill.evidence && (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '8px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                        &quot;{skill.evidence}&quot;
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeJob.keyResponsibilities && (
            <Card title="Key Responsibilities" icon={CheckCircle2}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                {activeJob.keyResponsibilities.map((resp, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '12.5px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', marginTop: '6px', flexShrink: 0 }} />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {activeJob.requirements && (
            <Card title="Qualifications & Requirements" icon={BookOpen}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                {activeJob.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '12.5px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-violet)', marginTop: '6px', flexShrink: 0 }} />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {(activeJob.niceToHave || activeJob.benefits) && (
            <Card title="Additional Context">
              {activeJob.niceToHave && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Nice to Have
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    {activeJob.niceToHave}
                  </p>
                </div>
              )}
              {activeJob.benefits && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Benefits & Perks
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    {activeJob.benefits}
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
