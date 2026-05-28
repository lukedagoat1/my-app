'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { determineSkinType, getRoutine } from '@/lib/skinAnalysis'
import { ParticleField } from '@/components/ParticleField'
import type { SkinType } from '@/lib/store'

const typeColors: Record<SkinType, { from: string; to: string; badge: string }> = {
  oily: { from: '#7dd3b0', to: '#4ecca3', badge: 'rgba(77,204,163,0.15)' },
  dry: { from: '#93c5fd', to: '#60a5fa', badge: 'rgba(96,165,250,0.15)' },
  combination: { from: '#d4a847', to: '#e8cc70', badge: 'rgba(212,168,71,0.15)' },
  sensitive: { from: '#f9a8d4', to: '#ec4899', badge: 'rgba(236,72,153,0.15)' },
  normal: { from: '#e8c4d0', to: '#c4b5d0', badge: 'rgba(196,181,208,0.15)' },
}

function RadarChart({ metrics }: { metrics: { oiliness: number; hydration: number; redness: number; texture: number; uniformity: number } }) {
  const labels = ['Hydration', 'Texture', 'Uniformity', 'Control', 'Clarity']
  const values = [
    metrics.hydration,
    metrics.texture,
    metrics.uniformity,
    100 - metrics.oiliness,
    100 - metrics.redness,
  ]

  const cx = 120, cy = 120, r = 90
  const n = 5
  const angle = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2
  const point = (i: number, radius: number) => ({
    x: cx + radius * Math.cos(angle(i)),
    y: cy + radius * Math.sin(angle(i)),
  })
  const poly = (radius: number) =>
    Array.from({ length: n }, (_, i) => point(i, radius))
      .map((p) => `${p.x},${p.y}`)
      .join(' ')

  const dataPoints = values
    .map((v, i) => {
      const p = point(i, (r * v) / 100)
      return `${p.x},${p.y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 240 240" className="w-48 h-48 md:w-56 md:h-56 mx-auto">
      {[25, 50, 75, 100].map((pct) => (
        <polygon
          key={pct}
          points={poly((r * pct) / 100)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const p = point(i, r)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      })}
      <polygon
        points={dataPoints}
        fill="rgba(212,168,71,0.15)"
        stroke="#d4a847"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const p = point(i, (r * v) / 100)
        return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#d4a847" />
      })}
      {labels.map((label, i) => {
        const p = point(i, r + 18)
        return (
          <text
            key={label}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.45)"
            fontSize="9"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}

function MetricBar({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) {
  const display = invert ? 100 - value : value
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(display), 100)
    return () => clearTimeout(t)
  }, [display])

  const color = display > 70 ? '#4ecca3' : display > 40 ? '#d4a847' : '#f87171'

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-white/50">{label}</span>
        <span className="font-semibold" style={{ color }}>{display}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${animated}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const { skinMetrics, quizAnswers, skinType: storedType, concerns: storedConcerns, reset } = useAppStore()
  const [tab, setTab] = useState<'morning' | 'evening'>('morning')

  const fallbackMetrics = skinMetrics ?? { oiliness: 50, hydration: 50, redness: 30, texture: 70, uniformity: 70 }
  const result = determineSkinType(quizAnswers, fallbackMetrics)
  const skinType = (storedType ?? result.type) as SkinType
  const concerns = storedConcerns.length > 0 ? storedConcerns : result.concerns
  const routine = getRoutine(skinType)
  const colors = typeColors[skinType] ?? typeColors.normal

  if (!skinType) {
    return (
      <div className="min-h-screen bg-[#06060f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-6">No analysis data found.</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-full text-sm border border-white/20 text-white/60 hover:text-white transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#06060f]">
      <ParticleField />

      {/* Background orb */}
      <div
        className="fixed top-0 right-0 w-[40vw] h-[40vh] blur-[100px] pointer-events-none opacity-15 rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => router.push('/')} className="text-white/40 hover:text-white/80 transition-colors text-sm">
          ← Home
        </button>
        <span
          className="text-lg font-bold tracking-[0.15em]"
          style={{
            background: 'linear-gradient(135deg, #f5e6c8, #d4a847)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          LUMINA
        </span>
        <button
          onClick={() => { reset(); router.push('/') }}
          className="text-white/30 hover:text-white/70 transition-colors text-xs border border-white/10 px-3 py-1 rounded-full"
        >
          Restart
        </button>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Skin Type Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 border border-white/8 text-center"
          style={{
            background: `linear-gradient(160deg, ${colors.badge}, rgba(255,255,255,0.02))`,
            backdropFilter: 'blur(20px)',
          }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-white/30 uppercase mb-3">Your Skin Type</p>
          <h1
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {result.label}
          </h1>
          <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">{result.description}</p>

          {/* Concerns */}
          {concerns.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {concerns.map((c) => (
                <span
                  key={c}
                  className="text-xs px-3 py-1.5 rounded-full border"
                  style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.04)' }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Metrics + Radar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Radar */}
          <div
            className="rounded-2xl p-6 border border-white/8 flex flex-col items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-white/30 uppercase mb-4">Skin Profile</p>
            <RadarChart metrics={fallbackMetrics} />
          </div>

          {/* Metric bars */}
          <div
            className="rounded-2xl p-6 border border-white/8 space-y-5"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-white/30 uppercase mb-2">Metrics</p>
            <MetricBar label="Hydration" value={fallbackMetrics.hydration} />
            <MetricBar label="Texture Score" value={fallbackMetrics.texture} />
            <MetricBar label="Skin Uniformity" value={fallbackMetrics.uniformity} />
            <MetricBar label="Oil Control" value={fallbackMetrics.oiliness} invert />
            <MetricBar label="Redness Level" value={fallbackMetrics.redness} invert />
          </div>
        </motion.div>

        {/* Routine */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex">
            {(['morning', 'evening'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-4 text-sm font-semibold tracking-widest uppercase transition-all"
                style={{
                  color: tab === t ? '#d4a847' : 'rgba(255,255,255,0.3)',
                  borderBottom: tab === t ? '2px solid #d4a847' : '2px solid transparent',
                  background: tab === t ? 'rgba(212,168,71,0.05)' : 'transparent',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {routine[tab].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(212,168,71,0.12)', color: '#d4a847' }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm text-white/70">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div
            className="rounded-2xl p-6 border border-white/8"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-gold/60 uppercase mb-4">✓ Ingredients to Seek</p>
            <div className="flex flex-wrap gap-2">
              {routine.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="text-xs px-3 py-1.5 rounded-full border border-gold/20 text-gold/70 bg-gold/5"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
          <div
            className="rounded-2xl p-6 border border-white/8"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-rose-400/60 uppercase mb-4">✕ Ingredients to Avoid</p>
            <div className="flex flex-wrap gap-2">
              {routine.avoid.map((ing) => (
                <span
                  key={ing}
                  className="text-xs px-3 py-1.5 rounded-full border border-rose-400/20 text-rose-400/60 bg-rose-400/5"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4 pb-10"
        >
          <button
            onClick={() => { reset(); router.push('/analysis') }}
            className="px-10 py-4 rounded-full font-semibold text-[#06060f] text-sm"
            style={{ background: 'linear-gradient(135deg, #d4a847, #e8cc70, #e8c4d0)' }}
          >
            Analyse Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-10 py-4 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  )
}
