import { useState } from 'react'
import DoubleSlitExperiment from './DoubleSlitExperiment'
import SingleSlitExperiment from './SingleSlitExperiment'
import RayOpticsSim from './RayOpticsSim'

const LABS = [
  {
    id: 'doubleslit',
    title: "Young's Double Slit",
    desc: 'Interference pattern from two coherent sources',
    icon: '🌈',
  },
  {
    id: 'singleslit',
    title: 'Single Slit Diffraction',
    desc: 'Diffraction pattern from a single aperture',
    icon: '🔆',
  },
  {
    id: 'rayoptics',
    title: 'Ray Optics Simulator',
    desc: 'Interactive reflection, refraction & lens simulation',
    icon: '💡',
  },
] as const

type LabId = (typeof LABS)[number]['id']

export default function Labs() {
  const [activeLab, setActiveLab] = useState<LabId | null>(null)

  if (activeLab === 'doubleslit') {
    return <DoubleSlitExperiment onBack={() => setActiveLab(null)} />
  }
  if (activeLab === 'singleslit') {
    return <SingleSlitExperiment onBack={() => setActiveLab(null)} />
  }
  if (activeLab === 'rayoptics') {
    return <RayOpticsSim onBack={() => setActiveLab(null)} />
  }

  return (
    <div className="labs-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Interactive Labs</h1>
        <p className="page-desc">Explore optics through hands-on simulations</p>
      </div>

      <div className="labs-grid">
        {LABS.map((lab) => (
          <button
            key={lab.id}
            className="lab-card glass-card"
            onClick={() => setActiveLab(lab.id)}
          >
            <div className="lab-card-icon">{lab.icon}</div>
            <h3 className="lab-card-title">{lab.title}</h3>
            <p className="lab-card-desc">{lab.desc}</p>
            <div className="lab-card-action">
              <span>Launch Lab</span>
              <span className="lab-arrow">→</span>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .labs-page {
          max-width: 1000px;
          margin: 0 auto;
        }
        .page-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .page-title {
          font-size: 32px;
          margin-bottom: 8px;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .page-desc {
          color: var(--text-secondary);
          font-size: 15px;
        }
        .labs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .lab-card {
          padding: 32px;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .lab-card-icon {
          font-size: 42px;
          margin-bottom: 16px;
        }
        .lab-card-title {
          font-size: 19px;
          margin-bottom: 8px;
        }
        .lab-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .lab-card-action {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--accent-cyan);
          margin-top: auto;
          transition: var(--transition);
        }
        .lab-arrow {
          transition: var(--transition);
        }
        .lab-card:hover .lab-arrow {
          transform: translateX(6px);
        }
        @media (max-width: 768px) {
          .labs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
