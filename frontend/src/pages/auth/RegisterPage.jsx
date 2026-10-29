import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Database
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp, isConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passwordScore = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    if (!isConfigured) {
      setError('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });

      if (result.needsEmailConfirmation) {
        setSuccessInfo({
          type: 'confirm_email',
          message: `Account created! We've sent a confirmation email to ${email.trim()}. Please verify your email before logging in.`,
        });
      } else {
        // Direct session established
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Sign up error:', err);
      let msg = err.message || 'Failed to create account.';
      if (msg.includes('User already registered')) {
        msg = 'An account with this email address already exists. Please sign in instead.';
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
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '25%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 124, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '25%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(69, 214, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '460px', zIndex: 1 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #45D6FF 0%, #8B7CFF 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(69, 214, 255, 0.35)',
              marginBottom: '14px',
            }}
          >
            <Zap size={24} color="#0B1020" style={{ fill: '#0B1020' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            RADIX <span style={{ color: 'var(--accent-cyan)' }}>SkillSync</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Join the AI-powered career intelligence platform
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 28px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {successInfo ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(53, 212, 154, 0.12)',
                  border: '1px solid rgba(53, 212, 154, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <CheckCircle2 size={30} color="var(--success)" />
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Verify Your Email
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                {successInfo.message}
              </p>
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ width: '100%', padding: '11px' }}
              >
                <span>Proceed to Sign In</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Create your candidate account
                </h2>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Start discovering your skill gaps and measuring company readiness today.
                </p>
              </div>

              {!isConfigured && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(244, 190, 94, 0.1)',
                    border: '1px solid rgba(244, 190, 94, 0.3)',
                    color: 'var(--warning)',
                    fontSize: '12px',
                    marginBottom: '18px',
                    lineHeight: 1.5,
                  }}
                >
                  <Database size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Supabase Configuration Required:</strong>
                    <p style={{ marginTop: '2px' }}>
                      Add <code style={{ color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: '4px' }}>VITE_SUPABASE_URL</code> and <code style={{ color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: '4px' }}>VITE_SUPABASE_ANON_KEY</code> to enable persistence.
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
                    border: '1px solid rgba(255, 107, 129, 0.3)',
                    color: 'var(--error)',
                    fontSize: '12.5px',
                    marginBottom: '18px',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="register-name">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={16}
                      color="var(--text-muted)"
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      id="register-name"
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="e.g. Rohan Verma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="register-email">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={16}
                      color="var(--text-muted)"
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      id="register-email"
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="register-password">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      color="var(--text-muted)"
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      style={{ paddingLeft: '38px', paddingRight: '38px' }}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {password && (
                    <div style={{ marginTop: '6px' }}>
                      <div
                        style={{
                          height: '4px',
                          background: 'rgba(255,255,255,0.08)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${passwordScore}%`,
                            background:
                              passwordScore < 50
                                ? 'var(--error)'
                                : passwordScore < 75
                                ? 'var(--warning)'
                                : 'var(--success)',
                            transition: 'width 0.3s ease, background 0.3s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-subtle)', marginTop: '2px', display: 'block' }}>
                        Strength:{' '}
                        {passwordScore < 50
                          ? 'Weak'
                          : passwordScore < 75
                          ? 'Moderate'
                          : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      color="var(--text-muted)"
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      id="register-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: 'var(--accent-cyan)' }}
                      required
                    />
                    <span>
                      I agree to the RADIX SkillSync Terms of Service and Privacy Policy.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '11px', marginTop: '6px' }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={15} className="spin-animation" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

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
                <span>Already have an account? </span>
                <Link
                  to="/login"
                  style={{
                    color: 'var(--accent-cyan)',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
