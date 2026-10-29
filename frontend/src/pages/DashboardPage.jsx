import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  FileSearch,
  UserCheck,
  ChevronRight,
  Target,
  Zap
} from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { talentCheckService } from '../services/talentCheckService';
import { matchService } from '../services/matchService';
import Card from '../components/ui/Card';
import RadarChart from '../components/ui/RadarChart';
import CategoryBar from '../components/ui/CategoryBar';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { activeCandidate, switchActiveCandidate, candidates, jobs, setSelectedJob } = useApp();
  const [chartView, setChartView] = useState('radar');
  const [matchResult, setMatchResult] = useState(null);
  const [savedReportsCount, setSavedReportsCount] = useState(0);

  const targetJob = jobs[0] || null;

  useEffect(() => {
    let cancelled = false;
    async function loadMatch() {
      if (activeCandidate && targetJob) {
        try {
          const res = await matchService.calculateMatch(activeCandidate, targetJob);
          if (!cancelled && res) {
            setMatchResult(res);
          }
        } catch (e) {
          console.warn('Dashboard match calculation error:', e);
        }
      }
    }
    loadMatch();
    return () => { cancelled = true; };
  }, [activeCandidate, targetJob]);

  useEffect(() => {
    async function loadReportsCount() {
      try {
        const reports = await matchService.getReports();
        setSavedReportsCount(reports?.length || 0);
      } catch {
        setSavedReportsCount(0);
      }
    }
    loadReportsCount();
  }, []);

  if (!activeCandidate) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading candidate profile intelligence...</p>
      </div>
    );
  }

  const talentCheckResult = talentCheckService.calculateReadiness(activeCandidate, 'Google LLC');

  const hasSkills = (activeCandidate.skills?.length || 0) > 0;
  const hasPendingEdu = !activeCandidate.education || activeCandidate.education.includes('Pending');

  let completionPoints = 0;
  if (activeCandidate.name && activeCandidate.email) completionPoints += 20;
  if (!hasPendingEdu) completionPoints += 20;
  if (activeCandidate.skills?.length > 4) completionPoints += 30;
  else if (hasSkills) completionPoints += 15;
  if (activeCandidate.projects?.length > 0) completionPoints += 15;
  if (activeCandidate.internships?.length > 0 || activeCandidate.hackathons?.length > 0) completionPoints += 15;
  const profileCompletion = Math.min(100, completionPoints);

  const identifiedSkillsCount = activeCandidate.skills?.length || 0;
  const topGaps = talentCheckResult?.skillGaps?.slice(0, 3) || [];
  const topStrengths = talentCheckResult?.meetingSkills?.slice(0, 4) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Mobbin Hero Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 23, 41, 0.95) 0%, rgba(12, 16, 28, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), var(--shadow-lg)',
        }}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-40px',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            right: '28%',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--accent-cyan)', fontSize: '11.5px', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <Sparkles size={13} />
              <span>RADIX SkillSync · AI Career Intelligence</span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '10px', color: '#FFFFFF', lineHeight: 1.2 }}>
              Your career, decoded.
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              Discover your verified competencies, eliminate skill gaps with company hiring standards, and benchmark yourself against tier-1 engineering bars.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/jd-analytics')}
                className="btn btn-primary btn-lg"
              >
                <FileSearch size={17} />
                <span>Analyze Job Description</span>
              </button>
              <button
                onClick={() => navigate('/resume-analyzer')}
                className="btn btn-secondary btn-lg"
              >
                <Zap size={17} color="var(--accent-cyan)" />
                <span>Parse Resume</span>
              </button>
              <button
                onClick={() => navigate('/talent-insights')}
                className="btn btn-outline"
                style={{ padding: '11px 18px' }}
              >
                <Target size={15} />
                <span>Company Benchmarks</span>
              </button>
            </div>
          </div>

          {/* Quick Active Persona Pill */}
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 22px',
              minWidth: '260px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--text-subtle)', fontWeight: '700', marginBottom: '10px', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between' }}>
              <span>Active Subject</span>
              <span style={{ color: activeCandidate.isCustomer ? 'var(--success)' : 'var(--accent-cyan)' }}>
                {activeCandidate.isCustomer ? 'Your Account' : 'Demo Persona'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '11px',
                  background: activeCandidate.isCustomer
                    ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)'
                    : 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
                  color: activeCandidate.isCustomer ? '#34D399' : '#070A12',
                  border: activeCandidate.isCustomer ? '1px solid rgba(52, 211, 153, 0.4)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '15px',
                  flexShrink: 0,
                }}
              >
                {activeCandidate.avatar || 'CD'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeCandidate.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeCandidate.preferredRoles?.[0] || 'Software Engineer'}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', lineHeight: 1.4 }}>
              {activeCandidate.fitSummary || 'Multi-dimensional readiness active across 12 RADIX standards.'}
            </div>
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards with Mobbin styling */}
      <div className="grid-5">
        <Card interactive onClick={() => navigate('/profile')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Profile Completion</span>
            <UserCheck size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{profileCompletion}%</span>
            <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>Ready</span>
          </div>
          <div style={{ marginTop: '12px', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${profileCompletion}%`, height: '100%', background: 'linear-gradient(90deg, #38BDF8, #818CF8)' }} />
          </div>
        </Card>

        <Card interactive onClick={() => navigate('/skill-matching')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Latest Job Match</span>
            <Briefcase size={16} color="var(--accent-violet)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: hasSkills ? (matchResult?.ratingColor || '#38BDF8') : 'var(--text-muted)', letterSpacing: '-0.02em' }}>
              {hasSkills ? `${matchResult?.matchScore ?? 0}%` : '--'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {hasSkills ? `vs ${targetJob?.companyShort || 'Target'}` : 'Pending'}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {hasSkills ? (targetJob?.role || 'Software Engineer') : 'Upload resume to calculate'}
          </p>
        </Card>

        <Card interactive onClick={() => navigate('/talent-insights')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Company Readiness</span>
            <Award size={16} color="var(--success)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: hasSkills ? '#34D399' : 'var(--text-muted)', letterSpacing: '-0.02em' }}>
              {hasSkills ? `${talentCheckResult?.readinessScore ?? 0}/100` : '--'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {hasSkills ? 'Google Bar' : 'Pending'}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {hasSkills ? `${talentCheckResult?.categoriesMeeting ?? 0} of 12 standards met` : '0 of 12 standards met'}
          </p>
        </Card>

        <Card interactive onClick={() => navigate('/profile')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Skills Verified</span>
            <TrendingUp size={16} color="var(--warning)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {identifiedSkillsCount}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '600' }}>Extracted</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Mapped across 12 standards
          </p>
        </Card>

        <Card interactive onClick={() => navigate('/saved-reports')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Saved Matches</span>
            <Target size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{savedReportsCount}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Archived</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Access report history
          </p>
        </Card>
      </div>

      {/* Main Competency Visualizer & Persona Switcher */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '24px' }}>
        <Card
          title="Competency Intelligence across 12 RADIX Categories"
          subtitle="Real-time multi-dimensional evaluation based on candidate profile"
          actions={
            <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setChartView('radar')}
                className={`btn-ghost ${chartView === 'radar' ? 'btn-primary' : ''}`}
                style={{ padding: '4px 12px', fontSize: '11.5px', borderRadius: '6px' }}
              >
                Radar Chart
              </button>
              <button
                onClick={() => setChartView('bars')}
                className={`btn-ghost ${chartView === 'bars' ? 'btn-primary' : ''}`}
                style={{ padding: '4px 12px', fontSize: '11.5px', borderRadius: '6px' }}
              >
                Competency Bars
              </button>
            </div>
          }
        >
          {!hasSkills ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <Sparkles size={26} color="var(--accent-cyan)" />
              </div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '700' }}>
                No Competency Data Identified Yet
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.6 }}>
                Upload your resume in Resume Analyzer or add skills to activate your 12-competency RADIX radar profile and benchmark readiness comparisons.
              </p>
              <button onClick={() => navigate('/resume-analyzer')} className="btn btn-primary" style={{ marginTop: '8px' }}>
                <FileSearch size={16} />
                <span>Launch Resume Analyzer</span>
              </button>
            </div>
          ) : chartView === 'radar' ? (
            <div style={{ padding: '10px 0', textAlign: 'center' }}>
              <RadarChart
                candidateScores={activeCandidate.categoryScores}
                benchmarkScores={{
                  COD: 9, DSA: 9, OOD: 8, APTI: 8, COMM: 8, AI: 8,
                  CLOUD: 8, SQL: 7, SWE: 8, SYSD: 8, NETW: 7, OS: 7
                }}
                size={340}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '14px', fontSize: '11.5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
                  <span style={{ width: '10px', height: '10px', background: 'var(--accent-cyan)', borderRadius: '2px' }} />
                  {activeCandidate.name} (Candidate)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-violet)' }}>
                  <span style={{ width: '10px', height: '2px', borderTop: '2px dashed var(--accent-violet)' }} />
                  Google SWE Benchmark
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '380px', overflowY: 'auto', paddingRight: '8px' }}>
              {Object.keys(activeCandidate.categoryScores || {}).map((code) => {
                if (code === 'OTHER') return null;
                const candLvl = activeCandidate.categoryScores[code] || 0;
                return (
                  <CategoryBar
                    key={code}
                    categoryCode={code}
                    candidateLevel={candLvl}
                    requiredLevel={8}
                    compact
                  />
                );
              })}
            </div>
          )}
        </Card>

        {/* Right Persona Switcher with Mobbin Card styles */}
        <Card
          title="Sample Benchmark Personas"
          subtitle="Compare readiness profiles across diverse candidates"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {candidates.map((cand) => {
              const isSelected = cand.id === activeCandidate.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => switchActiveCandidate(cand.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.16s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.1)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '9px',
                        background: isSelected ? 'linear-gradient(135deg, #38BDF8, #818CF8)' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#070A12' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '11.5px',
                        flexShrink: 0,
                      }}
                    >
                      {cand.avatar || 'CD'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: isSelected ? '#FFFFFF' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cand.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cand.headline?.split('·')[0]}
                      </div>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="badge badge-primary">Active</span>
                  ) : (
                    <ChevronRight size={15} color="var(--text-subtle)" />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '18px', padding: '12px 14px', background: 'rgba(56, 189, 248, 0.05)', border: '1px dashed rgba(56, 189, 248, 0.25)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>Platform Live Sync: </span>
            Selecting candidate personas dynamically re-evaluates all 12 competency scores, match reports, and gap analysis in real-time.
          </div>
        </Card>
      </div>

      {/* Strengths & Priority Gaps */}
      <div className="grid-2">
        <Card
          title="Top Verified Strengths"
          subtitle="Areas where candidate meets or exceeds tier-1 standards"
          icon={CheckCircle2}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topStrengths.map((item) => (
              <div
                key={item.category_code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--success)',
                  border: '1px solid var(--border-subtle)',
                  borderLeftWidth: '3px',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {item.category_name} ({item.category_code})
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {item.description}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                    Lvl {item.candidate_level}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Top Skill Gaps to Close"
          subtitle="Prioritized recommendations based on company bar weights"
          icon={AlertTriangle}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topGaps.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--success)', padding: '12px 0' }}>
                All evaluated categories meet or exceed the selected benchmark bar!
              </p>
            ) : (
              topGaps.map((item) => (
                <div
                  key={item.category_code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: '3px solid var(--warning)',
                    borderLeftWidth: '3px',
                  }}
                >
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{item.category_name}</span>
                      <span className="badge badge-warning" style={{ fontSize: '9px', padding: '1px 6px' }}>
                        Gap -{item.required_level - item.candidate_level}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Required Lvl {item.required_level} · Candidate Lvl {item.candidate_level}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/talent-insights')}
                    className="btn btn-outline btn-sm"
                  >
                    View Plan
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Featured Job Match Opportunities */}
      <Card
        title="Featured Job Opportunities"
        subtitle="Explore how candidate competencies align with enterprise job specifications"
        actions={
          <button
            onClick={() => navigate('/job-explorer')}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--accent-cyan)' }}
          >
            <span>View All Jobs</span>
            <ArrowRight size={14} />
          </button>
        }
      >
        <div className="grid-3">
          {jobs.slice(0, 3).map((job) => {
            const match = matchService.calculateMatch(activeCandidate, job);
            return (
              <div
                key={job.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.16s ease, transform 0.16s ease',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="badge badge-primary">{job.companyShort || job.company}</span>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: match?.ratingColor || '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                      {match?.matchScore}% Match
                    </span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {job.role}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    {job.location} · {job.ctc}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      navigate('/skill-matching');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Match Report
                  </button>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      navigate('/jd-analytics');
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    JD Analytics
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
