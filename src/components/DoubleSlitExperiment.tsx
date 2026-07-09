import { useRef, useEffect, useState, useCallback } from 'react'

interface Params {
  wavelength: number
  slitSeparation: number
  slitWidth: number
  screenDistance: number
}

export default function DoubleSlitExperiment({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intensityCanvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  const [params, setParams] = useState<Params>({
    wavelength: 550,
    slitSeparation: 0.3,
    slitWidth: 0.08,
    screenDistance: 1.0,
  })

  const [showWave, setShowWave] = useState(true)

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

    const { wavelength, slitSeparation, slitWidth, screenDistance } = params
    const d = slitSeparation
    const a = slitWidth
    const L = screenDistance
    const lambda = wavelength * 1e-9

    // Scale: 1mm = 60 pixels in the simulation view
    const scale = 180
    const slitX = 80
    const screenX = W - 60

    // Clear
    ctx.fillStyle = '#060b18'
    ctx.fillRect(0, 0, W, H)

    // Draw incident light
    ctx.fillStyle = 'rgba(59, 130, 246, 0.04)'
    for (let i = 0; i < 30; i++) {
      const x = slitX - 20 - i * 3
      ctx.fillRect(x, 0, 2, H)
    }

    // Draw barrier
    ctx.fillStyle = '#1e2438'
    ctx.fillRect(slitX - 6, 0, 12, H)
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 1
    ctx.strokeRect(slitX - 6, 0, 12, H)

    // Draw slits
    const slitH = 20
    const slitY1 = H / 2 - d * scale / 2 - slitH / 2
    const slitY2 = H / 2 + d * scale / 2 - slitH / 2

    ctx.fillStyle = '#060b18'
    ctx.fillRect(slitX - 2, slitY1, 4, slitH)
    ctx.fillRect(slitX - 2, slitY2, 4, slitH)

    // Slit labels
    ctx.fillStyle = '#64748b'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('S₁', slitX, slitY1 - 8)
    ctx.fillText('S₂', slitX, slitY2 - 8)

    // Draw wavefronts from slits
    if (showWave) {
      const t = timeRef.current
      for (let slit = 0; slit < 2; slit++) {
        const sy = slit === 0 ? H / 2 - d * scale / 2 : H / 2 + d * scale / 2
        const maxR = screenX - slitX

        for (let r = 0; r < maxR; r += 6) {
          const phase = (r / 60) * 2 * Math.PI * (lambda * 1e7) - t * 0.03
          const alpha = 0.05 + 0.08 * Math.max(0, Math.sin(phase))
          const x = slitX + r
          const yRange = 2 + r * 0.008

          ctx.beginPath()
          ctx.arc(x, sy, yRange, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    // Draw rays to screen
    const numRays = 120
    for (let i = 0; i < numRays; i++) {
      const screenY = (i / numRays) * H
      const theta = Math.atan2(screenY - H / 2, screenX - slitX)

      const pathDiff1 = d * scale / 2 * Math.sin(theta)
      const pathDiff2 = -d * scale / 2 * Math.sin(theta)
      const phase1 = (pathDiff1 / (lambda * scale)) * 2 * Math.PI
      const phase2 = (pathDiff2 / (lambda * scale)) * 2 * Math.PI

      const amp1 = Math.sin(Math.PI * a * scale * Math.sin(theta) / (lambda * scale)) / (Math.PI * a * scale * Math.sin(theta) / (lambda * scale) + 0.001)
      const amp = amp1 * Math.cos(Math.PI * d * scale * Math.sin(theta) / (lambda * scale))
      const intensity = amp * amp * 255

      if (intensity > 5) {
        ctx.strokeStyle = `rgba(0, 212, 255, ${Math.min(intensity / 255, 0.3)})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(slitX + 6, H / 2)
        ctx.lineTo(screenX - 2, screenY)
        ctx.stroke()
      }
    }

    // Draw screen
    const screenGrad = ctx.createLinearGradient(screenX, 0, screenX + 8, 0)
    screenGrad.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
    screenGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.1)')
    screenGrad.addColorStop(1, 'rgba(6, 11, 24, 0)')
    ctx.fillStyle = screenGrad
    ctx.fillRect(screenX, 0, 8, H)

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
    ctx.fillStyle = '#64748b'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'left'

    const labelY = 20
    ctx.fillStyle = '#00d4ff'
    ctx.fillText(`λ = ${wavelength} nm`, 16, labelY)
    ctx.fillStyle = '#3b82f6'
    ctx.fillText(`d = ${slitSeparation.toFixed(2)} mm`, 16, labelY + 18)
    ctx.fillStyle = '#06b6d4'
    ctx.fillText(`a = ${slitWidth.toFixed(2)} mm`, 16, labelY + 36)
    ctx.fillStyle = '#64748b'
    ctx.fillText(`L = ${screenDistance.toFixed(1)} m`, 16, labelY + 54)

    // Draw intensity graph
    const iGrad = ictx.createLinearGradient(0, 0, 0, iH)
    iGrad.addColorStop(0, '#060b18')
    iGrad.addColorStop(1, '#0a0e1a')
    ictx.fillStyle = iGrad
    ictx.fillRect(0, 0, iW, iH)

    const centerX = iW / 2
    const maxY = iH - 16

    // Calculate intensity pattern
    const points: { x: number; y: number }[] = []
    for (let px = 0; px < iW; px++) {
      const xPos = (px - centerX) / (iW / 2) * 0.02
      const theta = xPos

      const beta = Math.PI * a * 1e-3 * Math.sin(theta) / (lambda)
      const alpha = Math.PI * d * 1e-3 * Math.sin(theta) / (lambda)

      let intensity
      if (Math.abs(beta) < 0.001) {
        intensity = Math.cos(alpha) * Math.cos(alpha)
      } else {
        const sinc = Math.sin(beta) / beta
        intensity = sinc * sinc * Math.cos(alpha) * Math.cos(alpha)
      }

      intensity = Math.max(0, intensity)
      const y = iH - 8 - intensity * maxY * 1.5
      points.push({ x: px, y })
    }

    // Baseline
    ictx.strokeStyle = 'rgba(59, 130, 246, 0.2)'
    ictx.lineWidth = 1
    ictx.beginPath()
    ictx.moveTo(0, iH - 8)
    ictx.lineTo(iW, iH - 8)
    ictx.stroke()

    // Intensity curve
    if (points.length > 1) {
      ictx.beginPath()
      ictx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ictx.lineTo(points[i].x, points[i].y)
      }
      ictx.strokeStyle = '#00d4ff'
      ictx.lineWidth = 2
      ictx.stroke()
    }

    // Fill under curve
    if (points.length > 1) {
      ictx.beginPath()
      ictx.moveTo(points[0].x, iH - 8)
      for (let i = 0; i < points.length; i++) {
        ictx.lineTo(points[i].x, points[i].y)
      }
      ictx.lineTo(points[points.length - 1].x, iH - 8)
      ictx.closePath()
      ictx.fillStyle = 'rgba(0, 212, 255, 0.08)'
      ictx.fill()
    }

    // Labels
    ictx.fillStyle = '#64748b'
    ictx.font = '9px Inter, sans-serif'
    ictx.textAlign = 'center'
    ictx.fillText('Intensity Pattern', iW / 2, 14)

    timeRef.current += 1
    animRef.current = requestAnimationFrame(drawScene)
  }, [params, showWave])

  useEffect(() => {
    const setupCanvas = () => {
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

    setupCanvas()
    window.addEventListener('resize', setupCanvas)

    animRef.current = requestAnimationFrame(drawScene)

    return () => {
      window.removeEventListener('resize', setupCanvas)
      cancelAnimationFrame(animRef.current)
    }
  }, [drawScene])

  return (
    <div className="lab-detail animate-fade-in">
      <button className="back-btn" onClick={onBack}>← Back to Labs</button>

      <div className="lab-detail-header">
        <span className="lab-detail-icon">🌈</span>
        <div>
          <h1>Young's Double Slit Experiment</h1>
          <p className="lab-detail-desc">
            Observe the interference pattern from two coherent light sources.
            Adjust the parameters to see how they affect the fringe pattern.
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
            <label>Slit Separation (d) <span className="control-val">{params.slitSeparation.toFixed(2)} mm</span></label>
            <input
              type="range"
              min="0.05"
              max="2.0"
              step="0.01"
              value={params.slitSeparation}
              onChange={(e) => setParams({ ...params, slitSeparation: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="controls-row">
          <div className="control-group">
            <label>Slit Width (a) <span className="control-val">{params.slitWidth.toFixed(2)} mm</span></label>
            <input
              type="range"
              min="0.02"
              max="0.5"
              step="0.01"
              value={params.slitWidth}
              onChange={(e) => setParams({ ...params, slitWidth: Number(e.target.value) })}
            />
          </div>
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
        <div className="controls-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showWave}
              onChange={(e) => setShowWave(e.target.checked)}
            />
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
            Show Wavefronts
          </label>
        </div>
      </div>

      <div className="lab-info glass-card-static">
        <h3>About this experiment</h3>
        <p>
          In Young's double-slit experiment, light from a single source is split into two coherent beams
          that interfere, producing alternating bright and dark fringes. The fringe width is given by:
        </p>
        <div className="info-formula">β = λL / d</div>
        <p>
          <strong>Key observations:</strong> Increasing d (slit separation) decreases fringe width.
          Increasing λ (wavelength) increases fringe width. The single-slit envelope (from slit width a)
          modulates the interference pattern intensity.
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
        .lab-controls { padding: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 12px; }
        .controls-row { display: flex; gap: 20px; }
        .control-group { flex: 1; }
        .control-group label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .control-val { color: var(--accent-cyan); font-weight: 600; font-family: var(--font-mono); }
        .controls-toggle { padding-top: 4px; }
        .toggle-label { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-secondary); cursor: pointer; }
        .toggle-label input { display: none; }
        .toggle-track { width: 36px; height: 20px; background: var(--bg-elevated); border-radius: 10px; position: relative; transition: var(--transition); }
        .toggle-label input:checked + .toggle-track { background: var(--accent-blue); }
        .toggle-thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: var(--transition); }
        .toggle-label input:checked + .toggle-track .toggle-thumb { left: 18px; }
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
