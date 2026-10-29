import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate, NavLink } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  Plus,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  ShieldCheck,
  FileSearch,
  FileText,
  Award,
  GitCompare,
  Check,
  Trash2
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';

export default function TopNav({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidates, activeCandidate, switchActiveCandidate, deleteCandidateProfile, isBackendOnline, addToast } = useApp();
  const { user, profile: customerProfile, signOut, isAuthenticated } = useAuth();

  const [candidateDropdownOpen, setCandidateDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const candidateRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (candidateRef.current && !candidateRef.current.contains(event.target)) {
        setCandidateDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return { title: 'Overview Dashboard', subtitle: 'Career readiness and competency intelligence' };
      case '/profile': return { title: 'Candidate Profile', subtitle: 'Comprehensive skills and credential inventory' };
      case '/resume-analyzer': return { title: 'Resume Analyzer', subtitle: 'Automated skill extraction and verification' };
      case '/job-explorer': return { title: 'Job Explorer', subtitle: 'Curated enterprise job opportunities' };
      case '/jd-analytics': return { title: 'JD Analytics', subtitle: 'Requirement analysis and category mapping' };
      case '/talent-check':
      case '/talent-insights': return { title: 'Talent Insights', subtitle: 'Company readiness and benchmark evaluation' };
      case '/skill-matching': return { title: 'Skill Matching', subtitle: 'Role-fit scoring and prioritized preparation' };
      case '/saved-reports': return { title: 'Saved Reports', subtitle: 'Archived evaluations and analysis history' };
      case '/settings': return { title: 'Platform Settings', subtitle: 'System preferences and configuration' };
      default: return { title: 'RADIX SkillSync', subtitle: 'Career Intelligence' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  const workflowSteps = [
    { num: '1', name: 'JD Analytics', path: '/jd-analytics', icon: FileSearch },
    { num: '2', name: 'Resume Parser', path: '/resume-analyzer', icon: FileText },
    { num: '3', name: 'Talent Check', path: '/talent-insights', icon: Award },
    { num: '4', name: 'Skill Match', path: '/skill-matching', icon: GitCompare },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      addToast('Signed out of RADIX SkillSync', 'info');
      navigate('/login', { replace: true });
    } catch (err) {
      addToast(`Error signing out: ${err.message}`, 'error');
    }
  };

  const displayName = customerProfile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Candidate';
  const displayEmail = user?.email || '';
  const displayAvatar = customerProfile?.avatar || displayName.substring(0, 2).toUpperCase();

  return (
    <header className="top-nav">
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-toggle btn-ghost"
          aria-label="Toggle navigation menu"
          title="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {title}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        </div>
      </div>

      {/* Center: Mobbin Interactive Workflow Stepper */}
      <div className="workflow-stepper">
        {workflowSteps.map((step, idx) => {
          const isActive = location.pathname === step.path;
          return (
            <div key={step.path} style={{ display: 'flex', alignItems: 'center' }}>
              <NavLink
                to={step.path}
                className={`stepper-step ${isActive ? 'active' : ''}`}
                title={`Go to Step ${step.num}: ${step.name}`}
              >
                <span className="stepper-step-num">{step.num}</span>
                <span>{step.name}</span>
              </NavLink>
              {idx < workflowSteps.length - 1 && (
                <span className="stepper-arrow">›</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Right: Backend Status, Candidate Selector, and User Account */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Backend Status Pill */}
        <Link
          to="/settings"
          className="badge"
          style={{
            cursor: 'pointer',
            padding: '4px 10px',
            background: isBackendOnline ? 'rgba(52, 211, 153, 0.12)' : 'rgba(56, 189, 248, 0.12)',
            border: `1px solid ${isBackendOnline ? 'rgba(52, 211, 153, 0.35)' : 'rgba(56, 189, 248, 0.35)'}`,
            color: isBackendOnline ? 'var(--success)' : 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
          }}
          title={isBackendOnline ? 'Connected to FastAPI Backend (8000)' : 'Running in Standalone Mode'}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isBackendOnline ? 'var(--success)' : 'var(--accent-cyan)',
              boxShadow: `0 0 8px ${isBackendOnline ? 'var(--success)' : 'var(--accent-cyan)'}`,
            }}
          />
          <span style={{ fontSize: '10.5px', fontWeight: '700', letterSpacing: '0.04em' }}>
            {isBackendOnline ? 'API LIVE' : 'OFFLINE'}
          </span>
        </Link>

        {/* Candidate Switcher Dropdown */}
        <div style={{ position: 'relative' }} ref={candidateRef}>
          <button
            onClick={() => setCandidateDropdownOpen(!candidateDropdownOpen)}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'all 0.15s ease',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
            title="Switch active candidate profile"
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: activeCandidate?.isCustomer
                  ? 'linear-gradient(135deg, #34D399 0%, #38BDF8 100%)'
                  : 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
                color: '#070A12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '11px',
              }}
            >
              {activeCandidate?.avatar || 'CA'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                {activeCandidate?.name || 'Select Candidate'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {activeCandidate?.isCustomer ? 'Active Profile' : 'Benchmark Persona'}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {candidateDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '290px',
                background: 'var(--bg-surface-solid)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 60,
                overflow: 'hidden',
                animation: 'fadeIn 0.15s ease',
              }}
            >
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: '11px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Candidate Selection
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <div style={{ padding: '8px 14px 4px', fontSize: '10px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Account Profile
                </div>
                {candidates.filter(c => c.isCustomer).map((c) => {
                  const isCurrent = c.id === activeCandidate?.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        switchActiveCandidate(c.id);
                        setCandidateDropdownOpen(false);
                      }}
                      style={{
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        background: isCurrent ? 'var(--bg-surface-elevated)' : 'transparent',
                        borderLeft: isCurrent ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: 'rgba(52, 211, 153, 0.15)',
                          color: '#34D399',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '700',
                          border: '1px solid rgba(52, 211, 153, 0.3)',
                        }}
                      >
                        {c.avatar || 'ME'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{c.name}</span>
                          <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(52, 211, 153, 0.2)', color: '#34D399', fontWeight: '700' }}>
                            You
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.preferredRoles?.[0] || 'Software Engineer'} · {c.skills?.length || 0} skills
                        </div>
                      </div>
                      {isCurrent && <Check size={14} color="var(--accent-cyan)" />}
                    </div>
                  );
                })}

                {/* Uploaded / Custom Resumes */}
                {candidates.filter(c => c.isResumeParsed || c.isCustom).length > 0 && (
                  <>
                    <div style={{ padding: '12px 14px 4px', borderTop: '1px solid var(--border-subtle)', fontSize: '10px', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>⭐ Uploaded Resumes</span>
                      <span style={{ fontSize: '9px', fontWeight: '600', color: 'var(--text-muted)' }}>Custom</span>
                    </div>
                    {candidates.filter(c => c.isResumeParsed || c.isCustom).map((c) => {
                      const isCurrent = c.id === activeCandidate?.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            switchActiveCandidate(c.id);
                            setCandidateDropdownOpen(false);
                          }}
                          style={{
                            padding: '8px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            background: isCurrent ? 'var(--bg-surface-elevated)' : 'transparent',
                            borderLeft: isCurrent ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: 'var(--accent-cyan)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              fontWeight: '700',
                            }}
                          >
                            {c.avatar || 'CD'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                              {c.name}
                            </div>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                              {c.skills?.length || 0} skills extracted
                            </div>
                          </div>
                          {isCurrent && <Check size={14} color="var(--accent-cyan)" />}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete candidate profile "${c.name}"?`)) {
                                deleteCandidateProfile(c.id);
                              }
                            }}
                            className="btn-ghost"
                            style={{ padding: '4px', color: 'var(--error)' }}
                            title="Delete this candidate profile"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </>
                )}

                <div style={{ padding: '12px 14px 4px', borderTop: '1px solid var(--border-subtle)', fontSize: '10px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Benchmark Personas</span>
                  <span style={{ fontSize: '9px', fontWeight: '600', color: 'var(--accent-cyan)' }}>Reference</span>
                </div>
                {candidates.filter(c => !c.isCustomer && !c.isResumeParsed && !c.isCustom).map((c) => {
                  const isCurrent = c.id === activeCandidate?.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        switchActiveCandidate(c.id);
                        setCandidateDropdownOpen(false);
                      }}
                      style={{
                        padding: '8px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        background: isCurrent ? 'var(--bg-surface-elevated)' : 'transparent',
                        borderLeft: isCurrent ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: 'var(--accent-cyan)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: '700',
                        }}
                      >
                        {c.avatar || 'CD'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                          {c.preferredRoles?.[0] || 'Candidate'}
                        </div>
                      </div>
                      {isCurrent && <Check size={14} color="var(--accent-cyan)" />}
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)' }}>
                <Link
                  to="/profile"
                  onClick={() => setCandidateDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    color: 'var(--accent-cyan)',
                    textDecoration: 'none',
                    padding: '4px 6px',
                  }}
                >
                  <Plus size={13} />
                  <span>Edit Profile / Manage Skills</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        {isAuthenticated && (
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #162035 0%, #1E2B47 100%)',
                border: '1px solid var(--border-accent)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={displayName}
            >
              {displayAvatar}
            </button>

            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  background: 'var(--bg-surface-solid)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 70,
                  overflow: 'hidden',
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                {/* User info header */}
                <div style={{ padding: '14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {displayName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    {displayEmail}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '10px', color: 'var(--success)' }}>
                    <ShieldCheck size={12} />
                    <span>Supabase Authenticated</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '6px' }}>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12.5px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                    }}
                  >
                    <UserIcon size={14} color="var(--accent-cyan)" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12.5px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                    }}
                  >
                    <SettingsIcon size={14} color="var(--text-muted)" />
                    <span>Platform Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleSignOut();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12.5px',
                      color: 'var(--error)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '4px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <LogOut size={14} color="var(--error)" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
