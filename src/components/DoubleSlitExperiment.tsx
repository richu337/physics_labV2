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
    const slitX = 100
    const screenX = W - 70

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

    // Draw slits with fixed height (independent of fringe width)
    const slitH = 30
    const slitCenter1 = H / 2 - d * scale / 2
    const slitCenter2 = H / 2 + d * scale / 2

    ctx.fillStyle = '#060b18'
    ctx.fillRect(slitX - 2, slitCenter1 - slitH / 2, 4, slitH)
    ctx.fillRect(slitX - 2, slitCenter2 - slitH / 2, 4, slitH)

    // Slit labels
    ctx.fillStyle = '#64748b'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('S₁', slitX, slitCenter1 - slitH / 2 - 8)
    ctx.fillText('S₂', slitX, slitCenter2 - slitH / 2 - 8)

    // Draw wavefronts from slits
    if (showWave) {
      const t = timeRef.current
      for (let slit = 0; slit < 2; slit++) {
        const sy = slit === 0 ? slitCenter1 : slitCenter2
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

    // Draw interference fringes on screen (actual pattern)
    for (let y = 0; y < H; y++) {
      const theta = Math.atan2(y - H / 2, screenX - slitX)
      const alpha = Math.PI * d * 1e-3 * Math.sin(theta) / lambda
      const intensity = Math.cos(alpha) * Math.cos(alpha)
      const v = Math.round(Math.min(intensity, 1) * 220)
      ctx.fillStyle = `rgb(${v}, ${Math.round(v * 0.85)}, 255)`
      ctx.fillRect(screenX, y, 8, 1)
    }

    // Draw screen edge
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

    // Draw rays to screen (pure interference, no diffraction envelope)
    const numRays = 120
    for (let i = 0; i < numRays; i++) {
      const screenY = (i / numRays) * H
      const theta = Math.atan2(screenY - H / 2, screenX - slitX)

      const alpha = Math.PI * d * 1e-3 * Math.sin(theta) / lambda
      const intensity = Math.cos(alpha) * Math.cos(alpha)

      if (intensity > 0.01) {
        ctx.strokeStyle = `rgba(0, 212, 255, ${intensity * 0.3})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(slitX + 6, H / 2)
        ctx.lineTo(screenX - 2, screenY)
        ctx.stroke()
      }
    }

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

    // Calculate pure interference pattern (no diffraction envelope)
    const points: { x: number; y: number }[] = []
    for (let px = 0; px < iW; px++) {
      const theta = (px - centerX) / (iW / 2) * 0.02

      const alpha = Math.PI * d * 1e-3 * Math.sin(theta) / lambda
      const intensity = Math.max(0, Math.cos(alpha) * Math.cos(alpha))
      const y = iH - 8 - intensity * (iH - 24)
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

    // Find peaks (bright fringes) and troughs (dark fringes) for labeling
    const peakPxs: number[] = []
    const troughPxs: number[] = []
    for (let i = 2; i < points.length - 2; i++) {
      if (points[i].y < points[i - 1].y && points[i].y <= points[i + 1].y) {
        peakPxs.push(points[i].x)
      }
      if (points[i].y > points[i - 1].y && points[i].y >= points[i + 1].y) {
        troughPxs.push(points[i].x)
      }
    }

    // Label title
    ictx.fillStyle = '#64748b'
    ictx.font = '9px Inter, sans-serif'
    ictx.textAlign = 'center'
    ictx.fillText('Interference Pattern (I vs θ)', iW / 2, 12)

    // Label central bright fringe
    if (peakPxs.length > 0) {
      const cx = peakPxs[0]
      ictx.fillStyle = '#00d4ff'
      ictx.font = '8px Inter, sans-serif'
      ictx.textAlign = 'center'
      ictx.fillText('Central Bright', cx, 28)
      ictx.fillText('Fringe (n=0)', cx, 38)

      // Fringe width bracket from central to first side peak
      if (peakPxs.length > 1) {
        const p1 = peakPxs[1]
        const bracketY = 52
        ictx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ictx.lineWidth = 1
        ictx.beginPath()
        ictx.moveTo(cx, bracketY)
        ictx.lineTo(p1, bracketY)
        ictx.stroke()
        ictx.beginPath()
        ictx.moveTo(cx, bracketY - 4)
        ictx.lineTo(cx, bracketY + 4)
        ictx.stroke()
        ictx.beginPath()
        ictx.moveTo(p1, bracketY - 4)
        ictx.lineTo(p1, bracketY + 4)
        ictx.stroke()
        ictx.fillStyle = '#94a3b8'
        ictx.font = '8px Inter, sans-serif'
        ictx.textAlign = 'center'
        ictx.fillText('Fringe Width (β)', (cx + p1) / 2, bracketY - 3)
      }

      // Label first bright fringe
      if (peakPxs.length > 1) {
        const p1 = peakPxs[1]
        ictx.fillStyle = '#00d4ff'
        ictx.font = '8px Inter, sans-serif'
        ictx.textAlign = 'center'
        ictx.fillText('Bright Fringe', p1, 28)
        ictx.fillText('(n=1)', p1, 38)
      }

      // Label first dark fringe
      if (troughPxs.length > 0) {
        const t1 = troughPxs[0]
        if (t1 > 0 && t1 < iW) {
          ictx.fillStyle = '#64748b'
          ictx.font = '8px Inter, sans-serif'
          ictx.textAlign = 'center'
          ictx.fillText('Dark Fringe', t1, H > 300 ? iH - 20 : iH - 14)
        }
      }
    }

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
          that interfere, producing alternating bright and dark fringes. In the ideal case, all bright
          fringes have equal intensity. The fringe width is given by:
        </p>
        <div className="info-formula">β = λL / d</div>
        <p>
          <strong>Key observations:</strong> All bright fringes have equal intensity (ideal case).
          Fringes are equally spaced. Increasing d (slit separation) decreases fringe width.
          Increasing λ (wavelength) increases fringe width. Fringe spacing is uniform across the screen.
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
