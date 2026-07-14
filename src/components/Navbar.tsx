import { TabInfo, TabId } from '../App'

interface NavbarProps {
  tabs: TabInfo[]
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function Navbar({ tabs, activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
              <circle cx="16" cy="10" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M10 16 Q16 24 22 16" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="16" y1="16" x2="16" y2="28" stroke="currentColor" strokeWidth="2" />
              <circle cx="16" cy="10" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">WaveX</span>
            <span className="brand-subtitle">Cyber Optics Sandbox</span>
          </div>
        </div>
        <div className="navbar-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="nav-tab-icon">{tab.icon}</span>
              <span className="nav-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(6, 11, 24, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: var(--nav-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .brand-icon {
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-weight: 700;
          font-size: 16px;
          letter-spacing: -0.02em;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-subtitle {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .navbar-tabs {
          display: flex;
          gap: 4px;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: transparent;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          transition: var(--transition);
          white-space: nowrap;
        }

        .nav-tab:hover {
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-tab.active {
          color: white;
          background: rgba(59, 130, 246, 0.15);
          box-shadow: inset 0 -2px 0 var(--accent-blue);
        }

        .nav-tab-icon {
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .navbar-inner {
            padding: 0 12px;
            gap: 8px;
          }
          .brand-subtitle {
            display: none;
          }
          .nav-tab {
            padding: 8px 10px;
            font-size: 12px;
          }
          .nav-tab-label {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .brand-title {
            font-size: 14px;
          }
          .nav-tab {
            padding: 6px 8px;
          }
        }
      `}</style>
    </nav>
  )
}
