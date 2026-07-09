import { useRef, useEffect, useState, useCallback } from 'react'

interface Ray {
  startX: number
  startY: number
  angle: number
  color: string
}

export default function RayOpticsSim({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<{ dragging: boolean; type: string; startX: number; startY: number }>({
    dragging: false,
    type: '',
    startX: 0,
    startY: 0,
  })

  const [mode, setMode] = useState<'reflection' | 'refraction' | 'lens'>('reflection')
  const [mirrorAngle, setMirrorAngle] = useState(90)
  const [rayAngle, setRayAngle] = useState(30)
  const [refractiveIndex, setRefractiveIndex] = useState(1.5)
  const [lensFocalLength, setLensFocalLength] = useState(60)
  const [objectPos, setObjectPos] = useState(-100)

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2

    ctx.fillStyle = '#060b18'
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.04)'
    ctx.lineWidth = 0.5
    for (let x = 0; x < W; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
      ctx.stroke()
    }
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
    }

    if (mode === 'reflection') {
      drawReflection(ctx, W, H, cx, cy, mirrorAngle, rayAngle)
    } else if (mode === 'refraction') {
      drawRefraction(ctx, W, H, cx, cy, refractiveIndex)
    } else if (mode === 'lens') {
      drawLens(ctx, W, H, cx, cy, lensFocalLength, objectPos)
    }

    animRef.current = requestAnimationFrame(drawScene)
  }, [mode, mirrorAngle, rayAngle, refractiveIndex, lensFocalLength, objectPos])

  const animRef = useRef<number>(0)

  useEffect(() => {
    const setup = () => {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.parentElement!.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = 480
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

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current.dragging = true
    dragRef.current.startX = e.clientX
    dragRef.current.startY = e.clientY
  }

  return (
    <div className="lab-detail animate-fade-in">
      <button className="back-btn" onClick={onBack}>← Back to Labs</button>

      <div className="lab-detail-header">
        <span className="lab-detail-icon">💡</span>
        <div>
          <h1>Ray Optics Simulator</h1>
          <p className="lab-detail-desc">
            Interactive simulation of reflection, refraction, and lens behavior.
          </p>
        </div>
      </div>

      <div className="mode-tabs">
        {(['reflection', 'refraction', 'lens'] as const).map((m) => (
          <button
            key={m}
            className={`mode-tab${mode === m ? ' active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'reflection' ? '🪞 Reflection' : m === 'refraction' ? '💧 Refraction' : '🔍 Lens'}
          </button>
        ))}
      </div>

      <div className="lab-canvas-wrapper glass-card-static">
        <canvas
          ref={canvasRef}
          className="ray-canvas"
          onMouseDown={handleMouseDown}
        />
      </div>

      <div className="lab-controls glass-card-static">
        {mode === 'reflection' && (
          <>
            <div className="control-group">
              <label>Ray Angle <span className="control-val">{rayAngle}°</span></label>
              <input
                type="range"
                min="5"
                max="85"
                value={rayAngle}
                onChange={(e) => setRayAngle(Number(e.target.value))}
              />
            </div>
            <div className="control-group">
              <label>Mirror Angle <span className="control-val">{mirrorAngle}°</span></label>
              <input
                type="range"
                min="30"
                max="150"
                value={mirrorAngle}
                onChange={(e) => setMirrorAngle(Number(e.target.value))}
              />
            </div>
          </>
        )}

        {mode === 'refraction' && (
          <div className="control-group">
            <label>Refractive Index (n₂) <span className="control-val">{refractiveIndex.toFixed(2)}</span></label>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.01"
              value={refractiveIndex}
              onChange={(e) => setRefractiveIndex(Number(e.target.value))}
            />
          </div>
        )}

        {mode === 'lens' && (
          <>
            <div className="control-group">
              <label>Focal Length (f) <span className="control-val">{lensFocalLength} px</span></label>
              <input
                type="range"
                min="20"
                max="150"
                value={lensFocalLength}
                onChange={(e) => setLensFocalLength(Number(e.target.value))}
              />
            </div>
            <div className="control-group">
              <label>Object Position (u) <span className="control-val">{Math.abs(objectPos)} px</span></label>
              <input
                type="range"
                min="-200"
                max="-30"
                value={objectPos}
                onChange={(e) => setObjectPos(Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>

      <div className="lab-info glass-card-static">
        <h3>
          {mode === 'reflection' ? 'Law of Reflection' :
           mode === 'refraction' ? "Snell's Law" :
           'Lens Formula'}
        </h3>
        <p>
          {mode === 'reflection' &&
            'The angle of incidence equals the angle of reflection (θᵢ = θᵣ). Both rays and the normal lie in the same plane.'}
          {mode === 'refraction' &&
            "Snell's law: n₁ sin θ₁ = n₂ sin θ₂. Light bends toward the normal when entering a denser medium (n₂ > n₁)."}
          {mode === 'lens' &&
            '1/f = 1/v - 1/u (using sign convention). Move the object to see how the image position and size change.'}
        </p>
        <div className="info-formula">
          {mode === 'reflection' ? 'θᵢ = θᵣ' :
           mode === 'refraction' ? 'n₁ sin θ₁ = n₂ sin θ₂' :
           '1/f = 1/v − 1/u'}
        </div>
      </div>

      <style>{`
        .lab-detail { max-width: 900px; margin: 0 auto; }
        .back-btn { background: transparent; color: var(--accent-cyan); font-size: 14px; font-weight: 500; padding: 8px 0; margin-bottom: 16px; display: inline-block; }
        .back-btn:hover { color: var(--accent-electric); }
        .lab-detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .lab-detail-icon { font-size: 40px; }
        .lab-detail-header h1 { font-size: 24px; }
        .lab-detail-desc { color: var(--text-secondary); font-size: 14px; margin-top: 4px; }
        .mode-tabs { display: flex; gap: 4px; background: var(--bg-card); border-radius: var(--radius-sm); padding: 3px; margin-bottom: 16px; }
        .mode-tab { flex: 1; padding: 10px 16px; border-radius: 6px; background: transparent; color: var(--text-muted); font-size: 13px; font-weight: 500; transition: var(--transition); }
        .mode-tab:hover { color: var(--text-secondary); }
        .mode-tab.active { background: var(--gradient-primary); color: white; }
        .lab-canvas-wrapper { padding: 0; overflow: hidden; margin-bottom: 16px; }
        .ray-canvas { width: 100%; height: 480px; display: block; cursor: crosshair; }
        .lab-controls { padding: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 16px; }
        .control-group { }
        .control-group label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .control-val { color: var(--accent-cyan); font-weight: 600; font-family: var(--font-mono); }
        .lab-info { padding: 20px; }
        .lab-info h3 { font-size: 16px; margin-bottom: 8px; }
        .lab-info p { color: var(--text-secondary); font-size: 14px; line-height: 1.7; margin: 8px 0; }
        .info-formula { text-align: center; padding: 12px; margin: 12px 0; background: rgba(59, 130, 246, 0.05); border-radius: var(--radius-sm); font-family: var(--font-mono); color: var(--accent-electric); font-size: 18px; border: 1px solid rgba(59, 130, 246, 0.1); }
        @media (max-width: 768px) {
          .ray-canvas { height: 320px; }
        }
      `}</style>
    </div>
  )
}

function drawReflection(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  cx: number, cy: number,
  mirrorAngleDeg: number,
  rayAngleDeg: number
) {
  const mirrorRad = (mirrorAngleDeg * Math.PI) / 180
  const rayRad = (rayAngleDeg * Math.PI) / 180

  // Mirror line
  const mirrorLen = 180
  const mx1 = cx - mirrorLen * Math.cos(mirrorRad)
  const my1 = cy - mirrorLen * Math.sin(mirrorRad)
  const mx2 = cx + mirrorLen * Math.cos(mirrorRad)
  const my2 = cy + mirrorLen * Math.sin(mirrorRad)

  // Draw mirror
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(mx1, my1)
  ctx.lineTo(mx2, my2)
  ctx.stroke()

  // Hatching on mirror back
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)'
  ctx.lineWidth = 1
  const hatchCount = 10
  for (let i = 0; i < hatchCount; i++) {
    const t = (i + 0.5) / hatchCount
    const hx = mx1 + (mx2 - mx1) * t
    const hy = my1 + (my2 - my1) * t
    const perpX = -(my2 - my1) / mirrorLen
    const perpY = (mx2 - mx1) / mirrorLen
    ctx.beginPath()
    ctx.moveTo(hx + perpX * 6, hy + perpY * 6)
    ctx.lineTo(hx - perpX * 6, hy - perpY * 6)
    ctx.stroke()
  }

  // Normal line
  const normalX = -(my2 - my1) / mirrorLen
  const normalY = (mx2 - mx1) / mirrorLen
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(cx - normalX * 120, cy - normalY * 120)
  ctx.lineTo(cx + normalX * 120, cy + normalY * 120)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#94a3b8'
  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Normal', cx - normalX * 130, cy - normalY * 130 + 4)

  // Incident ray
  const incLen = 150
  const incEndX = cx - incLen * Math.sin(rayRad + Math.PI / 2 - mirrorRad)
  const incEndY = cy - incLen * Math.cos(rayRad + Math.PI / 2 - mirrorRad)

  // Arrow
  ctx.strokeStyle = '#00d4ff'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(incEndX, incEndY)
  ctx.lineTo(cx, cy)
  ctx.stroke()

  // Arrowhead
  const arrowSize = 8
  const aAngle = Math.atan2(cy - incEndY, cx - incEndX)
  ctx.fillStyle = '#00d4ff'
  ctx.beginPath()
  ctx.moveTo(incEndX + arrowSize * Math.cos(aAngle + 0.4),
             incEndY + arrowSize * Math.sin(aAngle + 0.4))
  ctx.lineTo(incEndX, incEndY)
  ctx.lineTo(incEndX + arrowSize * Math.cos(aAngle - 0.4),
             incEndY + arrowSize * Math.sin(aAngle - 0.4))
  ctx.fill()

  // Reflected ray
  const refLen = 150
  const refEndX = cx + refLen * Math.sin(rayRad + Math.PI / 2 - mirrorRad)
  const refEndY = cy + refLen * Math.cos(rayRad + Math.PI / 2 - mirrorRad)

  ctx.strokeStyle = '#06b6d4'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(refEndX, refEndY)
  ctx.stroke()

  // Arrowhead
  const aAngle2 = Math.atan2(refEndY - cy, refEndX - cx)
  ctx.fillStyle = '#06b6d4'
  ctx.beginPath()
  ctx.moveTo(refEndX - arrowSize * Math.cos(aAngle2 + 0.4),
             refEndY - arrowSize * Math.sin(aAngle2 + 0.4))
  ctx.lineTo(refEndX, refEndY)
  ctx.lineTo(refEndX - arrowSize * Math.cos(aAngle2 - 0.4),
             refEndY - arrowSize * Math.sin(aAngle2 - 0.4))
  ctx.fill()

  // Angle arcs
  const arcR = 30
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  const startA1 = Math.atan2(-normalY, -normalX)
  const endA1 = Math.atan2(incEndY - cy, incEndX - cx)
  ctx.arc(cx, cy, arcR, startA1, endA1)
  ctx.stroke()

  ctx.beginPath()
  const startA2 = Math.atan2(refEndY - cy, refEndX - cx)
  const endA2 = Math.atan2(normalY, normalX)
  ctx.arc(cx, cy, arcR, startA2, endA2)
  ctx.stroke()

  ctx.fillStyle = '#94a3b8'
  ctx.font = '12px Inter, sans-serif'
  ctx.fillText('θᵢ', cx + (arcR + 16) * Math.cos((startA1 + endA1) / 2),
               cy + (arcR + 16) * Math.sin((startA1 + endA1) / 2))
  ctx.fillText('θᵣ', cx + (arcR + 16) * Math.cos((startA2 + endA2) / 2),
               cy + (arcR + 16) * Math.sin((startA2 + endA2) / 2))

  ctx.fillStyle = '#00d4ff'
  ctx.font = '11px Inter, sans-serif'
  ctx.fillText('Incident Ray', incEndX + 10, incEndY)
  ctx.fillStyle = '#06b6d4'
  ctx.fillText('Reflected Ray', refEndX + 10, refEndY)
}

function drawRefraction(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  cx: number, cy: number,
  n2: number
) {
  const n1 = 1.0
  const boundaryY = cy + 20

  // Medium 1
  ctx.fillStyle = 'rgba(59, 130, 246, 0.03)'
  ctx.fillRect(0, 0, W, boundaryY)

  // Medium 2
  ctx.fillStyle = 'rgba(6, 182, 212, 0.04)'
  ctx.fillRect(0, boundaryY, W, H - boundaryY)

  // Boundary
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, boundaryY)
  ctx.lineTo(W, boundaryY)
  ctx.stroke()

  ctx.fillStyle = '#94a3b8'
  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`n₁ = ${n1.toFixed(2)} (air)`, 16, boundaryY - 12)
  ctx.fillText(`n₂ = ${n2.toFixed(2)}`, 16, boundaryY + 24)

  // Normal
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#64748b'
  ctx.font = '10px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Normal', cx, 14)

  // Incident ray (angle of incidence = 45 degrees)
  const incAngle = 45
  const incRad = (incAngle * Math.PI) / 180
  const incLen = 130
  const incEndX = cx - incLen * Math.sin(incRad)
  const incEndY = boundaryY - incLen * Math.cos(incRad)

  ctx.strokeStyle = '#00d4ff'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(incEndX, incEndY)
  ctx.lineTo(cx, boundaryY)
  ctx.stroke()

  // Arrowhead
  const aA1 = Math.atan2(boundaryY - incEndY, cx - incEndX)
  ctx.fillStyle = '#00d4ff'
  ctx.beginPath()
  ctx.moveTo(incEndX + 8 * Math.cos(aA1 + 0.4), incEndY + 8 * Math.sin(aA1 + 0.4))
  ctx.lineTo(incEndX, incEndY)
  ctx.lineTo(incEndX + 8 * Math.cos(aA1 - 0.4), incEndY + 8 * Math.sin(aA1 - 0.4))
  ctx.fill()

  // Refracted ray
  const sinTheta2 = (n1 / n2) * Math.sin(incRad)
  const theta2Rad = Math.asin(Math.min(sinTheta2, 1))
  const theta2Deg = (theta2Rad * 180) / Math.PI

  const refrLen = 130
  const refrEndX = cx + refrLen * Math.sin(theta2Rad)
  const refrEndY = boundaryY + refrLen * Math.cos(theta2Rad)

  if (sinTheta2 <= 1) {
    ctx.strokeStyle = '#06b6d4'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(cx, boundaryY)
    ctx.lineTo(refrEndX, refrEndY)
    ctx.stroke()

    const aA2 = Math.atan2(refrEndY - boundaryY, refrEndX - cx)
    ctx.fillStyle = '#06b6d4'
    ctx.beginPath()
    ctx.moveTo(refrEndX - 8 * Math.cos(aA2 + 0.4), refrEndY - 8 * Math.sin(aA2 + 0.4))
    ctx.lineTo(refrEndX, refrEndY)
    ctx.lineTo(refrEndX - 8 * Math.cos(aA2 - 0.4), refrEndY - 8 * Math.sin(aA2 - 0.4))
    ctx.fill()
  }

  // Reflected ray (small)
  const reflLen = 80
  const reflEndX = cx - reflLen * Math.sin(incRad)
  const reflEndY = boundaryY - reflLen * Math.cos(incRad)

  ctx.strokeStyle = 'rgba(89, 89, 89, 0.5)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(cx, boundaryY)
  ctx.lineTo(reflEndX, reflEndY)
  ctx.stroke()
  ctx.setLineDash([])

  // Angle arcs
  const arcR = 25
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  const s1 = Math.atan2(-1, 0)
  const e1 = Math.atan2(incEndY - boundaryY, incEndX - cx)
  ctx.arc(cx, boundaryY, arcR, s1, e1)
  ctx.stroke()

  if (sinTheta2 <= 1) {
    ctx.beginPath()
    const s2 = Math.atan2(1, 0)
    const e2 = Math.atan2(refrEndY - boundaryY, refrEndX - cx)
    ctx.arc(cx, boundaryY, arcR, s2, e2)
    ctx.stroke()
  }

  ctx.fillStyle = '#94a3b8'
  ctx.font = '12px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('θ₁', cx - 20, boundaryY + (arcR + 16) * (-0.7))
  if (sinTheta2 <= 1) {
    ctx.fillText('θ₂', cx + 20, boundaryY + (arcR + 16) * 0.7)
  }

  ctx.fillStyle = '#00d4ff'
  ctx.font = '10px Inter, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Incident', incEndX + 6, incEndY - 4)

  if (sinTheta2 <= 1) {
    ctx.fillStyle = '#06b6d4'
    ctx.fillText(`Refracted (${theta2Deg.toFixed(1)}°)`, refrEndX + 6, refrEndY + 4)
  } else {
    ctx.fillStyle = '#ef4444'
    ctx.fillText('Total Internal Reflection', cx + 16, boundaryY + 50)
  }
}

function drawLens(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  cx: number, cy: number,
  f: number,
  u: number
) {
  // Draw lens (convex)
  const lensH = 180
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cx, cy - lensH / 2)
  ctx.quadraticCurveTo(cx + 20, cy, cx, cy + lensH / 2)
  ctx.stroke()

  // Lens label
  ctx.fillStyle = '#64748b'
  ctx.font = '10px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Lens', cx + 6, cy + lensH / 2 + 16)

  // Principal axis
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(W, cy)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#64748b'
  ctx.font = '9px Inter, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Principal Axis', 6, cy + 14)

  // Focal points
  const fL = cx + f
  const fR = cx - f

  ctx.fillStyle = 'rgba(6, 182, 212, 0.3)'
  ctx.beginPath()
  ctx.arc(fL, cy, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(fR, cy, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#06b6d4'
  ctx.font = '10px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('F', fL, cy + 16)
  ctx.fillText("F'", fR, cy + 16)

  // 2F points
  ctx.fillStyle = 'rgba(6, 182, 212, 0.15)'
  ctx.beginPath()
  ctx.arc(cx + 2 * f, cy, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx - 2 * f, cy, 3, 0, Math.PI * 2)
  ctx.fill()

  // Object (arrow)
  const objX = cx + u
  const objH = 60
  const objTop = cy - objH

  ctx.fillStyle = '#00d4ff'
  ctx.strokeStyle = '#00d4ff'
  ctx.lineWidth = 2.5

  // Vertical line
  ctx.beginPath()
  ctx.moveTo(objX, cy)
  ctx.lineTo(objX, objTop)
  ctx.stroke()

  // Arrowhead
  ctx.beginPath()
  ctx.moveTo(objX - 8, objTop + 8)
  ctx.lineTo(objX, objTop)
  ctx.lineTo(objX + 8, objTop + 8)
  ctx.fill()

  ctx.fillStyle = '#00d4ff'
  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Object', objX, cy + 16)

  // Calculate image position using lens formula
  const v = 1 / (1 / f + 1 / u)

  if (v > 0 || v < -500) {
    // Image is real (on opposite side)
    const imgX = cx + v
    const magnification = v / u
    const imgH = objH * Math.abs(magnification)
    const imgTop = cy - (imgH * Math.sign(magnification))

    if (Math.abs(imgX) < W + 50 && Math.abs(imgH) < 300) {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.6)'
      ctx.strokeStyle = '#06b6d4'
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(imgX, cy)
      ctx.lineTo(imgX, imgTop)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(imgX - 8 * Math.sign(magnification), imgTop + 8)
      ctx.lineTo(imgX, imgTop)
      ctx.lineTo(imgX + 8 * Math.sign(magnification), imgTop + 8)
      ctx.fill()

      ctx.fillStyle = '#06b6d4'
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'center'
      const imgLabel = imgH > objH ? 'Real (magnified)' : 'Real (diminished)'
      ctx.fillText(imgLabel, imgX, cy + (imgH > 0 ? -imgH - 16 : Math.abs(imgH) + 20))
    }
  } else {
    // Virtual image
    const imgX = cx + Math.abs(v)
    const magnification = Math.abs(v / u)
    const imgH = objH * magnification
    const imgTop = cy - imgH

    ctx.fillStyle = 'rgba(6, 182, 212, 0.3)'
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])

    ctx.beginPath()
    ctx.moveTo(imgX, cy)
    ctx.lineTo(imgX, imgTop)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(imgX - 8, imgTop + 8)
    ctx.lineTo(imgX, imgTop)
    ctx.lineTo(imgX + 8, imgTop + 8)
    ctx.stroke()

    ctx.setLineDash([])

    ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Virtual Image', imgX, cy + imgH + 16)
  }

  // Show formula values
  ctx.fillStyle = '#64748b'
  ctx.font = '10px Inter, sans-serif'
  ctx.textAlign = 'left'

  const infoX = 16
  const infoY = 20
  ctx.fillStyle = '#00d4ff'
  ctx.fillText(`u = ${Math.abs(u)} px (object distance)`, infoX, infoY)
  ctx.fillStyle = '#3b82f6'
  ctx.fillText(`f = ${f} px (focal length)`, infoX, infoY + 16)
  if (isFinite(v)) {
    ctx.fillStyle = '#06b6d4'
    ctx.fillText(`v = ${Math.abs(Math.round(v))} px (image distance)`, infoX, infoY + 32)
  }
}
