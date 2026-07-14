import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onFinish: () => void
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<'line1' | 'line2' | 'fadeout' | 'done'>('line1')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('line2'), 800)
    const t2 = setTimeout(() => setPhase('fadeout'), 4500)
    const t3 = setTimeout(() => {
      setPhase('done')
      onFinish()
    }, 5500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onFinish])

  if (phase === 'done') return null

  return (
    <div className="splash-overlay">
      <div className="splash-bg-grid" />
      <div className="splash-bg-glow" />
      <div className="splash-bg-glow-2" />
      <div className="splash-content">
        <h1 className={`splash-title ${phase === 'line1' || phase === 'line2' || phase === 'fadeout' ? 'visible' : ''} ${phase === 'fadeout' ? 'fading' : ''}`}>
          WaveX: The cyber optics Sandbox.
        </h1>
        <p className={`splash-subtitle ${phase === 'line2' || phase === 'fadeout' ? 'visible' : ''} ${phase === 'fadeout' ? 'fading' : ''}`}>
          Next Gen virtual lab and AI tutor
        </p>
      </div>
      <style>{`
        .splash-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #060b18;
          overflow: hidden;
        }
        .splash-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .splash-bg-glow {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent 70%);
          animation: floatGlow 20s ease-in-out infinite;
        }
        .splash-bg-glow-2 {
          position: absolute;
          bottom: -20%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.08), transparent 70%);
          animation: floatGlow 25s ease-in-out infinite reverse;
        }
        .splash-content {
          position: relative;
          text-align: center;
          z-index: 1;
        }
        .splash-title {
          font-size: clamp(28px, 5vw, 56px);
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          transition: opacity 0.8s ease, transform 0.8s ease;
          filter: blur(4px);
        }
        .splash-title.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        .splash-title.fading {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
          filter: blur(4px);
          transition: opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease;
        }
        .splash-subtitle {
          font-size: clamp(14px, 2vw, 22px);
          font-weight: 400;
          color: #94a3b8;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.8s ease, transform 0.8s ease;
          filter: blur(3px);
        }
        .splash-subtitle.visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
        .splash-subtitle.fading {
          opacity: 0;
          transform: translateY(10px);
          filter: blur(3px);
          transition: opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease;
        }
        @keyframes floatGlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 30px) scale(1.02); }
        }
      `}</style>
    </div>
  )
}
