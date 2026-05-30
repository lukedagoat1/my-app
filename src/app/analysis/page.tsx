'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { analyzeImageData, averageMetrics } from '@/lib/skinAnalysis'
import { AdBanner } from '@/components/AdBanner'

const STEPS = [
  { id: 'forward', title: 'Face Forward', sub: 'Centre your face in the oval', arrow: null, arrowDir: null },
  { id: 'left',   title: 'Turn Left',    sub: 'Show your left cheek',          arrow: '←', arrowDir: 'left' },
  { id: 'right',  title: 'Turn Right',   sub: 'Show your right cheek',         arrow: '→', arrowDir: 'right' },
  { id: 'up',     title: 'Chin Up',      sub: 'Tilt your chin upward',         arrow: '↑', arrowDir: 'up' },
  { id: 'down',   title: 'Chin Down',    sub: 'Tilt your chin down',           arrow: '↓', arrowDir: 'down' },
]

const CAM_W = 480
const CAM_H = 640
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

export default function AnalysisPage() {
  const router = useRouter()
  const videoRef   = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const captureRef = useRef<HTMLCanvasElement>(null)
  const animRef    = useRef<number>(0)
  const streamRef  = useRef<MediaStream | null>(null)

  const [step,        setStep]        = useState(0)
  const [countdown,   setCountdown]   = useState<number | null>(null)
  const [captured,    setCaptured]    = useState<boolean[]>([])
  const [error,       setError]       = useState('')
  const [cameraReady, setCameraReady] = useState(false)
  const [processing,  setProcessing]  = useState(false)

  const { freeScansUsed, isPremium, incrementFreeScansUsed, addCapture, addMetrics, setSkinMetrics } = useAppStore()

  useEffect(() => {
    if (freeScansUsed >= 1 && !isPremium) {
      router.push('/paywall')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function startCam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setCameraReady(true)
        }
      } catch {
        setError('Camera access is required. Please allow camera permissions and refresh.')
      }
    }
    startCam()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  useEffect(() => {
    if (!cameraReady) return
    const canvas = overlayRef.current
    if (canvas) { canvas.width = CAM_W; canvas.height = CAM_H }
  }, [cameraReady])

  const drawOverlay = useCallback((time: number) => {
    const canvas = overlayRef.current
    if (!canvas) return
    const w = canvas.width, h = canvas.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, w, h)
    const cx = w / 2
    const cy = h / 2
    const rx = Math.min(w, h) * 0.33
    const ry = rx * 1.55

    ctx.save()
    ctx.fillStyle = 'rgba(6,6,15,0.72)'
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    ctx.restore()

    const phase = (time % 2000) / 2000
    const ba = 0.5 + 0.5 * Math.sin(phase * Math.PI * 2)
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(212,168,71,${0.6 + ba * 0.4})`
    ctx.lineWidth = 2.5
    ctx.stroke()

    const ml = 22
    const corners: [number, number, number, number][] = [
      [cx - rx, cy - ry,  1,  1],
      [cx + rx, cy - ry, -1,  1],
      [cx - rx, cy + ry,  1, -1],
      [cx + rx, cy + ry, -1, -1],
    ]
    ctx.strokeStyle = `rgba(212,168,71,${0.7 + ba * 0.3})`
    ctx.lineWidth = 3
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath()
      ctx.moveTo(x + dx * ml, y)
      ctx.lineTo(x, y)
      ctx.lineTo(x, y + dy * ml)
      ctx.stroke()
    })

    const sp = (time % 2400) / 2400
    const scanY = cy - ry + sp * ry * 2
    if (scanY >= cy - ry && scanY <= cy + ry) {
      const hw = Math.sqrt(Math.max(0, 1 - ((scanY - cy) / ry) ** 2)) * rx
      const grad = ctx.createLinearGradient(cx - hw, 0, cx + hw, 0)
      grad.addColorStop(0,   'rgba(212,168,71,0)')
      grad.addColorStop(0.5, 'rgba(212,168,71,0.55)')
      grad.addColorStop(1,   'rgba(212,168,71,0)')
      ctx.beginPath()
      ctx.moveTo(cx - hw, scanY)
      ctx.lineTo(cx + hw, scanY)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    const cur = STEPS[step]
    if (cur.arrowDir) {
      const ap = 0.6 + 0.4 * Math.sin((time / 400) * Math.PI * 2)
      ctx.font = `bold ${Math.round(32 * ap)}px sans-serif`
      ctx.fillStyle = `rgba(212,168,71,${ap})`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      if (cur.arrowDir === 'left')  ctx.fillText('←', cx - rx - 30, cy)
      if (cur.arrowDir === 'right') ctx.fillText('→', cx + rx + 30, cy)
      if (cur.arrowDir === 'up')    ctx.fillText('↑', cx, cy - ry - 30)
      if (cur.arrowDir === 'down')  ctx.fillText('↓', cx, cy + ry + 30)
    }

    ctx.save()
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.clip()
    ctx.strokeStyle = 'rgba(212,168,71,0.06)'
    ctx.lineWidth = 0.5
    for (let gx = cx - rx; gx <= cx + rx; gx += 24) {
      ctx.beginPath(); ctx.moveTo(gx, cy - ry); ctx.lineTo(gx, cy + ry); ctx.stroke()
    }
    for (let gy = cy - ry; gy <= cy + ry; gy += 24) {
      ctx.beginPath(); ctx.moveTo(cx - rx, gy); ctx.lineTo(cx + rx, gy); ctx.stroke()
    }
    ctx.restore()

    animRef.current = requestAnimationFrame(drawOverlay)
  }, [step])

  useEffect(() => {
    if (!cameraReady) return
    animRef.current = requestAnimationFrame(drawOverlay)
    return () => cancelAnimationFrame(animRef.current)
  }, [cameraReady, drawOverlay])

  const doCapture = useCallback(() => {
    const video  = videoRef.current
    const canvas = captureRef.current
    if (!video || !canvas) return

    canvas.width  = CAM_W
    canvas.height = CAM_H
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    ctx.translate(CAM_W, 0)
    ctx.scale(-1, 1)
    const vw = video.videoWidth  || CAM_W
    const vh = video.videoHeight || CAM_H
    const srcRatio = vw / vh
    const dstRatio = CAM_W / CAM_H
    let sx = 0, sy = 0, sw = vw, sh = vh
    if (srcRatio > dstRatio) { sw = vh * dstRatio; sx = (vw - sw) / 2 }
    else                     { sh = vw / dstRatio; sy = (vh - sh) / 2 }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, CAM_W, CAM_H)
    ctx.restore()

    const cx = CAM_W / 2, cy = CAM_H / 2
    const rx = Math.min(CAM_W, CAM_H) * 0.33
    const ry = rx * 1.55
    const metrics = analyzeImageData(ctx.getImageData(0, 0, CAM_W, CAM_H), { cx, cy, rx, ry })
    addMetrics(metrics)
    addCapture(canvas.toDataURL('image/jpeg', 0.8))
    setCaptured(prev => [...prev, true])

    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 600)
    } else {
      setProcessing(true)
      incrementFreeScansUsed()
      setTimeout(() => {
        const avg = averageMetrics(useAppStore.getState().metricsHistory)
        setSkinMetrics(avg)
        router.push('/quiz')
      }, 1800)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const doCaptureRef = useRef(doCapture)
  useEffect(() => { doCaptureRef.current = doCapture }, [doCapture])

  useEffect(() => {
    if (!cameraReady || processing) return
    let cancelled = false
    ;(async () => {
      await sleep(step === 0 ? 2500 : 1800)
      if (cancelled) return
      for (let i = 3; i >= 1; i--) {
        setCountdown(i)
        await sleep(i > 1 ? 1000 : 800)
        if (cancelled) return
      }
      setCountdown(null)
      doCaptureRef.current()
    })()
    return () => { cancelled = true }
  }, [cameraReady, step, processing])

  if (error) {
    return (
      <div className="min-h-screen bg-[#06060f] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6 opacity-40">◎</div>
          <h2 className="text-xl font-semibold text-white/80 mb-3">Camera Access Needed</h2>
          <p className="text-white/40 text-sm mb-8">{error}</p>
          <button onClick={() => router.push('/')}
            className="px-8 py-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors text-sm">
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#06060f] flex flex-col">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => router.push('/')} className="text-white/40 hover:text-white/80 transition-colors text-sm">
          ← Back
        </button>
        <span className="text-lg font-bold tracking-[0.15em]" style={{
          background: 'linear-gradient(135deg, #f5e6c8, #d4a847)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          LUMINA
        </span>
        <div className="text-white/30 text-sm">{step + 1} / {STEPS.length}</div>
      </div>

      <div className="flex justify-center gap-2 py-4">
        {STEPS.map((_, i) => (
          <div key={i} className="transition-all duration-500 rounded-full" style={{
            width: i === step ? '24px' : '8px', height: '8px',
            background: i < captured.length
              ? 'linear-gradient(90deg, #d4a847, #e8c4d0)'
              : i === step ? 'rgba(212,168,71,0.7)' : 'rgba(255,255,255,0.12)',
          }} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-6">
        <div className="w-full max-w-sm mb-4">
          <AdBanner slot="analysis" />
        </div>
        <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-black/40 border border-white/8">
          <video ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
            playsInline muted />
          <canvas ref={overlayRef}
            className="absolute inset-0 w-full h-full"
            style={{ transform: 'scaleX(-1)' }} />
          <canvas ref={captureRef} className="hidden" />

          <AnimatePresence>
            {countdown === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white pointer-events-none" />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {processing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#06060f]/90 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold"
                  style={{ animation: 'lumina-spin-slow 1s linear infinite' }} />
                <p className="text-gold/80 text-sm tracking-widest uppercase">Analysing Skin</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {countdown !== null && (
              <motion.div key={countdown}
                initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 border-gold"
                style={{ background: 'rgba(212,168,71,0.25)', backdropFilter: 'blur(8px)' }}>
                {countdown}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {countdown !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-xs text-gold/70 tracking-widest uppercase bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  Hold still…
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-6 text-center max-w-sm">
            <div className="text-3xl mb-1 text-gold/60">{STEPS[step].arrow ?? '◎'}</div>
            <h2 className="text-xl font-semibold text-white/90 mb-1">{STEPS[step].title}</h2>
            <p className="text-sm text-white/40">{STEPS[step].sub}</p>
          </motion.div>
        </AnimatePresence>

        {!processing && countdown === null && (
          <p className="mt-4 text-white/20 text-xs tracking-wider">
            {!cameraReady ? 'Starting camera…' : 'Auto-capturing — just follow the guide'}
          </p>
        )}
      </div>
    </div>
  )
}
