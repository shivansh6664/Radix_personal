export default function Card({
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  children,
  className = '',
  interactive = false,
  glow = false,
  onClick,
  style = {},
}) {
  return (
    <div
      className={`radix-card ${interactive ? 'radix-card-interactive' : ''} ${className}`}
      onClick={onClick}
      style={{
        ...(glow ? { borderColor: 'rgba(56, 189, 248, 0.3)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.1)' } : {}),
        ...style,
      }}
    >
      {(title || Icon || badge || actions) && (
        <div className="card-header">
          <div>
            <div className="card-title">
              {Icon && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} />
                </div>
              )}
              <span>{title}</span>
              {badge && <span className="card-badge">{badge}</span>}
            </div>
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
