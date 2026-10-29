import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Database,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, demoLogin, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState(location.state?.message || null);

  const destination = location.state?.from?.pathname || '/';

  const handleDemoAccess = () => {
    setDemoLoading(true);
    setTimeout(() => {
      demoLogin();
      navigate(destination, { replace: true });
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    if (!isConfigured) {
      setError('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Sign in error:', err);
      let msg = err.message || 'Failed to authenticate. Please check your credentials.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Invalid email or password. Please verify your credentials and try again.';
      } else if (msg.includes('Email not confirmed')) {
        msg = 'Your email address has not been confirmed yet. Please verify your inbox.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-navy)',
        backgroundImage:
          'radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(129, 140, 248, 0.08) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(52, 211, 153, 0.05) 0px, transparent 50%)',
        padding: '32px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          zIndex: 1,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 28px rgba(56, 189, 248, 0.4)',
              marginBottom: '16px',
            }}
          >
            <Zap size={24} color="#070A12" style={{ fill: '#070A12' }} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '6px' }}>
            RADIX <span style={{ color: 'var(--accent-cyan)' }}>SkillSync</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Know Your Skills. Own Your Future. · Mobbin Edition
          </p>
        </div>

        {/* Main Card with Mobbin Frosted Glass */}
        <div
          style={{
            background: 'rgba(15, 22, 38, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 32px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Quick Demo Access Button */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={handleDemoAccess}
              disabled={demoLoading}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={16} />
              <span>{demoLoading ? 'Entering Platform...' : 'Explore Platform (Instant Demo Access)'}</span>
              <ArrowRight size={15} />
            </button>
            <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '11px', color: 'var(--text-subtle)' }}>
              1-click instant preview with full access to all 5 roles & intelligence modules
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0', color: 'var(--text-subtle)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span>or sign in with supabase</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {!isConfigured && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: 'var(--warning)',
                fontSize: '12px',
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              <Database size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Supabase Configuration Notice:</strong>
                <p style={{ marginTop: '2px' }}>
                  Please set <code style={{ color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: '4px' }}>VITE_SUPABASE_URL</code> and <code style={{ color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: '4px' }}>VITE_SUPABASE_ANON_KEY</code> in <code style={{ color: '#fff' }}>frontend/.env</code> to connect live authentication.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--error-subtle)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                color: 'var(--error)',
                fontSize: '12.5px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '11.5px', color: 'var(--accent-cyan)', textDecoration: 'none' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--accent-cyan)' }}
                />
                <span>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '11px', marginTop: '4px' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="spin-animation" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In with Account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div
            style={{
              marginTop: '22px',
              paddingTop: '18px',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '12.5px',
              color: 'var(--text-muted)',
            }}
          >
            <span>Don&apos;t have an account? </span>
            <Link
              to="/register"
              style={{
                color: 'var(--accent-cyan)',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Security / Technology Badge */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={13} color="var(--success)" />
          <span>Protected by Supabase Auth with Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
}
