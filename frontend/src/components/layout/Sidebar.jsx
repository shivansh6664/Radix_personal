import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  FileSearch,
  Award,
  GitCompare,
  Bookmark,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
  X
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const { activeCandidate, isDemoMode, addToast } = useApp();
  const { isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      addToast('Signed out of RADIX SkillSync', 'info');
      navigate('/login', { replace: true });
    } catch (err) {
      addToast(`Error signing out: ${err.message}`, 'error');
    }
  };

  const navSections = [
    {
      title: 'Core Workflow',
      items: [
        { name: 'Overview', path: '/', icon: LayoutDashboard },
        { name: 'JD Analytics', path: '/jd-analytics', icon: FileSearch },
        { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
        { name: 'Talent Insights', path: '/talent-insights', icon: Award },
        { name: 'Skill Matching', path: '/skill-matching', icon: GitCompare },
      ],
    },
    {
      title: 'Talent & Repository',
      items: [
        { name: 'My Profile', path: '/profile', icon: User },
        { name: 'Job Explorer', path: '/job-explorer', icon: Briefcase },
        { name: 'Saved Reports', path: '/saved-reports', icon: Bookmark },
      ],
    },
    {
      title: 'System',
      items: [
        { name: 'Platform Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)',
              flexShrink: 0,
            }}
          >
            <Zap size={18} color="#070A12" style={{ fill: '#070A12' }} />
          </div>
          {!collapsed && (
            <div style={{ whiteSpace: 'nowrap' }}>
              <div
                style={{
                  fontWeight: '800',
                  fontSize: '15px',
                  letterSpacing: '-0.025em',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                RADIX <span style={{ color: 'var(--accent-cyan)' }}>SkillSync</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-subtle)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: '600' }}>
                Mobbin Edition · v2.0
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="btn-ghost"
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-muted)',
              }}
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-ghost"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-muted)',
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation List grouped by Section */}
      <div className="sidebar-nav-container">
        {navSections.map((section) => (
          <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {!collapsed && (
              <div className="sidebar-nav-section-title">
                {section.title}
              </div>
            )}
            <nav className="sidebar-nav-list">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.name : undefined}
                  >
                    <span className="sidebar-icon-box">
                      <Icon size={18} />
                    </span>
                    {!collapsed && (
                      <>
                        <span className="sidebar-label">{item.name}</span>
                        {item.badge && (
                          <span className="sidebar-role-badge">{item.badge}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Candidate Mini Profile Card */}
      {!collapsed && activeCandidate && (
        <div
          style={{
            padding: '12px 14px',
            margin: '6px 12px 8px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: activeCandidate.isCustomer
                  ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(129, 140, 248, 0.2) 100%)',
                color: activeCandidate.isCustomer ? 'var(--success)' : 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '12px',
                border: activeCandidate.isCustomer ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid var(--border-accent)',
                flexShrink: 0,
              }}
            >
              {activeCandidate.avatar || 'CA'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeCandidate.name}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: activeCandidate.isCustomer ? 'var(--success)' : 'var(--accent-cyan)' }} />
                {activeCandidate.isCustomer ? 'Active Profile' : (activeCandidate.preferredRoles?.[0] || 'Benchmark Persona')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Action (if authenticated) */}
      {isAuthenticated && (
        <div style={{ padding: collapsed ? '4px 8px 8px' : '4px 12px 8px' }}>
          <button
            onClick={handleSignOut}
            className="sidebar-item"
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid transparent',
            }}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <span className="sidebar-icon-box">
              <LogOut size={16} color="var(--error)" />
            </span>
            {!collapsed && (
              <span className="sidebar-label" style={{ color: 'var(--error)' }}>
                Sign Out
              </span>
            )}
          </button>
        </div>
      )}

      {/* Mode Status Footer */}
      <div
        style={{
          padding: '12px 18px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--text-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          flexShrink: 0,
        }}
      >
        {!collapsed ? (
          <>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isDemoMode ? 'var(--accent-cyan)' : 'var(--success)',
                  boxShadow: `0 0 6px ${isDemoMode ? 'var(--accent-cyan)' : 'var(--success)'}`,
                }}
              />
              {isDemoMode ? 'Local Engine' : 'Cloud Sync'}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-subtle)', letterSpacing: '0.02em', fontWeight: '600' }}>FastAPI 8000</span>
          </>
        ) : (
          <span
            title={isDemoMode ? 'Platform: Standalone' : 'Platform: Cloud Synchronized'}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isDemoMode ? 'var(--accent-cyan)' : 'var(--success)',
            }}
          />
        )}
      </div>
    </aside>
  );
}
