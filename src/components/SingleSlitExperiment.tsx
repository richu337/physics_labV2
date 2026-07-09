import { useRef, useEffect, useState, useCallback } from 'react'

interface Params {
  wavelength: number
  slitWidth: number
  screenDistance: number
}

export default function SingleSlitExperiment({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intensityCanvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const [params, setParams] = useState<Params>({
    wavelength: 550,
    slitWidth: 0.16,
    screenDistance: 1.0,
  })

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current
    const iCanvas = intensityCanvasRef.current
    if (!canvas || !iCanvas) return

    const ctx = canvas.getContext('2d')
    const ictx = iCanvas.getContext('2d')
    if (!ctx || !ictx) return

    const W = canvas.width
    const H = canvas.height
    const iW = iCanvas.width
    const iH = iCanvas.height
    const { wavelength, slitWidth, screenDistance } = params

    const a = slitWidth
    const lambda = wavelength

    ctx.fillStyle = '#060b18'
    ctx.fillRect(0, 0, W, H)

    // Barrier
    const slitX = 100
    const screenX = W - 50

    ctx.fillStyle = '#1e2438'
    ctx.fillRect(slitX - 6, 0, 12, H)
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 1
    ctx.strokeRect(slitX - 6, 0, 12, H)

    // Slit opening
    const slitH = a * 120
    const slitY = (H - slitH) / 2
    ctx.fillStyle = '#060b18'
    ctx.fillRect(slitX - 2, slitY, 4, slitH)

    ctx.fillStyle = '#64748b'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('a', slitX, slitY - 8)

    // Incident wavefronts
    ctx.fillStyle = 'rgba(59, 130, 246, 0.04)'
    for (let i = 0; i < 25; i++) {
      ctx.fillRect(slitX - 20 - i * 4, 0, 2, H)
    }

    // Huygens wavelets from slit
    const waveCount = 60
    for (let i = 0; i < waveCount; i++) {
      const wy = slitY + (i / waveCount) * slitH
      for (let r = 0; r < screenX - slitX; r += 4) {
        const beta = Math.PI * a * 1e-3 * Math.sin(Math.atan2(wy - H / 2 + (wy - H / 2) * r / (screenX - slitX), r)) / (lambda * 1e-9)
        const intensity = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2)

        if (intensity > 0.05) {
          const alpha = 0.02 * intensity
          const x = slitX + r
          const yRange = 1 + r * 0.006

          ctx.beginPath()
          ctx.arc(x, wy, yRange, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    // Diffracted rays
    const numRays = 200
    for (let i = 0; i < numRays; i++) {
      const sy = slitY + (i / numRays) * slitH
      const screenY = (i / numRays) * H
      const theta = Math.atan2(screenY - H / 2, screenX - slitX)

      const beta = Math.PI * a * 1e-3 * Math.sin(theta) / (lambda * 1e-9)
      const intensity = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2)

      if (intensity > 0.03) {
        ctx.strokeStyle = `rgba(0, 212, 255, ${intensity * 0.3})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(slitX + 6, sy)
        ctx.lineTo(screenX - 2, screenY)
        ctx.stroke()
      }
    }

    // Screen
    const screenGrad = ctx.createLinearGradient(screenX, 0, screenX + 6, 0)
    screenGrad.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
    screenGrad.addColorStop(1, 'rgba(6, 11, 24, 0)')
    ctx.fillStyle = screenGrad
    ctx.fillRect(screenX, 0, 6, H)

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(screenX, 0)
    ctx.lineTo(screenX, H)
    ctx.stroke()

    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Screen', screenX + 4, H - 8)

    // Labels
    ctx.fillStyle = '#00d4ff'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`λ = ${wavelength} nm`, 16, 20)
    ctx.fillStyle = '#3b82f6'
    ctx.fillText(`a = ${slitWidth.toFixed(2)} mm`, 16, 38)
    ctx.fillStyle = '#64748b'
    ctx.fillText(`L = ${screenDistance.toFixed(1)} m`, 16, 56)

    // Intensity graph
    const iGrad = ictx.createLinearGradient(0, 0, 0, iH)
    iGrad.addColorStop(0, '#060b18')
    iGrad.addColorStop(1, '#0a0e1a')
    ictx.fillStyle = iGrad
    ictx.fillRect(0, 0, iW, iH)

    const centerX = iW / 2
    const maxY = iH - 16

    const points: { x: number; y: number }[] = []
    for (let px = 0; px < iW; px++) {
      const xPos = (px - centerX) / (iW / 2) * 0.03
      const theta = xPos

      const beta = Math.PI * a * 1e-3 * Math.sin(theta) / (lambda * 1e-9)
      let intensity
      if (Math.abs(beta) < 0.001) {
        intensity = 1
      } else {
        intensity = Math.pow(Math.sin(beta) / beta, 2)
      }

      intensity = Math.max(0, intensity)
      const y = iH - 8 - intensity * maxY
      points.push({ x: px, y })
    }

    ictx.strokeStyle = 'rgba(59, 130, 246, 0.2)'
    ictx.lineWidth = 1
    ictx.beginPath()
    ictx.moveTo(0, iH - 8)
    ictx.lineTo(iW, iH - 8)
    ictx.stroke()

    if (points.length > 1) {
      ictx.beginPath()
      ictx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ictx.lineTo(points[i].x, points[i].y)
      }
      ictx.strokeStyle = '#06b6d4'
      ictx.lineWidth = 2
      ictx.stroke()
    }

    // Fill
    if (points.length > 1) {
      ictx.beginPath()
      ictx.moveTo(points[0].x, iH - 8)
      for (let i = 0; i < points.length; i++) {
        ictx.lineTo(points[i].x, points[i].y)
      }
      ictx.lineTo(points[points.length - 1].x, iH - 8)
      ictx.closePath()
      ictx.fillStyle = 'rgba(6, 182, 212, 0.08)'
      ictx.fill()
    }

    ictx.fillStyle = '#64748b'
    ictx.font = '9px Inter, sans-serif'
    ictx.textAlign = 'center'
    ictx.fillText('Single Slit Diffraction Pattern', iW / 2, 14)

    animRef.current = requestAnimationFrame(drawScene)
  }, [params])

  useEffect(() => {
    const setup = () => {
      const canvas = canvasRef.current
      const iCanvas = intensityCanvasRef.current
      if (canvas && iCanvas) {
        const rect = canvas.parentElement!.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = 320
        iCanvas.width = rect.width
        iCanvas.height = 140
      }
    }
    setup()
    window.addEventListener('resize', setup)
    animRef.current = requestAnimationFrame(drawScene)
    return () => {
      window.removeEventListener('resize', setup)
      cancelAnimationFrame(animRef.current)
    }
  }, [drawScene])

  return (
    <div className="lab-detail animate-fade-in">
      <button className="back-btn" onClick={onBack}>← Back to Labs</button>

      <div className="lab-detail-header">
        <span className="lab-detail-icon">🔆</span>
        <div>
          <h1>Single Slit Diffraction</h1>
          <p className="lab-detail-desc">
            Observe the diffraction pattern from a single slit. The central maximum is twice as wide
            as the secondary maxima.
          </p>
        </div>
      </div>

      <div className="lab-canvas-wrapper glass-card-static">
        <div className="canvas-container">
          <canvas ref={canvasRef} className="lab-canvas" />
        </div>
        <div className="intensity-container">
          <canvas ref={intensityCanvasRef} className="intensity-canvas" />
        </div>
      </div>

      <div className="lab-controls glass-card-static">
        <div className="controls-row">
          <div className="control-group">
            <label>Wavelength (λ) <span className="control-val">{params.wavelength} nm</span></label>
            <input
              type="range"
              min="380"
              max="780"
              value={params.wavelength}
              onChange={(e) => setParams({ ...params, wavelength: Number(e.target.value) })}
            />
          </div>
          <div className="control-group">
            <label>Slit Width (a) <span className="control-val">{params.slitWidth.toFixed(2)} mm</span></label>
            <input
              type="range"
              min="0.04"
              max="0.5"
              step="0.01"
              value={params.slitWidth}
              onChange={(e) => setParams({ ...params, slitWidth: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="controls-row">
          <div className="control-group">
            <label>Screen Distance (L) <span className="control-val">{params.screenDistance.toFixed(1)} m</span></label>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={params.screenDistance}
              onChange={(e) => setParams({ ...params, screenDistance: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="lab-info glass-card-static">
        <h3>About Single Slit Diffraction</h3>
        <p>
          When light passes through a narrow slit, it spreads out (diffracts) due to the wave nature
          of light. The resulting pattern has a bright central maximum with alternating dark and
          bright fringes on either side.
        </p>
        <div className="info-formula">a sin θ = nλ (minima)</div>
        <p>
          <strong>Key observations:</strong> The central maximum is twice as wide as the secondary
          maxima. Decreasing slit width (a) widens the diffraction pattern. Most of the light energy
          is concentrated in the central maximum.
        </p>
      </div>

      <style>{`
        .lab-detail { max-width: 900px; margin: 0 auto; }
        .back-btn { background: transparent; color: var(--accent-cyan); font-size: 14px; font-weight: 500; padding: 8px 0; margin-bottom: 16px; display: inline-block; }
        .back-btn:hover { color: var(--accent-electric); }
        .lab-detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .lab-detail-icon { font-size: 40px; }
        .lab-detail-header h1 { font-size: 24px; }
        .lab-detail-desc { color: var(--text-secondary); font-size: 14px; margin-top: 4px; }
        .lab-canvas-wrapper { padding: 0; overflow: hidden; margin-bottom: 16px; }
        .canvas-container { width: 100%; }
        .lab-canvas { width: 100%; height: 320px; display: block; }
        .intensity-container { width: 100%; border-top: 1px solid var(--border-color); }
        .intensity-canvas { width: 100%; height: 140px; display: block; }
        .lab-controls { padding: 20px; margin-bottom: 16px; }
        .controls-row { display: flex; gap: 20px; }
        .control-group { flex: 1; }
        .control-group label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .control-val { color: var(--accent-cyan); font-weight: 600; font-family: var(--font-mono); }
        .lab-info { padding: 20px; }
        .lab-info h3 { font-size: 16px; margin-bottom: 8px; }
        .lab-info p { color: var(--text-secondary); font-size: 14px; line-height: 1.7; margin: 8px 0; }
        .info-formula { text-align: center; padding: 12px; margin: 12px 0; background: rgba(59, 130, 246, 0.05); border-radius: var(--radius-sm); font-family: var(--font-mono); color: var(--accent-electric); font-size: 18px; border: 1px solid rgba(59, 130, 246, 0.1); }
        @media (max-width: 768px) {
          .controls-row { flex-direction: column; gap: 12px; }
          .lab-canvas { height: 240px; }
        }
      `}</style>
    </div>
  )
}
