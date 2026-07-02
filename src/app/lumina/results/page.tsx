'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { determineSkinType, getRoutine } from '@/lib/skinAnalysis'
import { ParticleField } from '@/components/ParticleField'
import type { SkinType, SkinMetrics, ScanRecord } from '@/lib/store'

const typeColors: Record<SkinType, { from: string; to: string; badge: string }> = {
  oily:        { from: '#7dd3b0', to: '#4ecca3', badge: 'rgba(77,204,163,0.15)' },
  dry:         { from: '#93c5fd', to: '#60a5fa', badge: 'rgba(96,165,250,0.15)' },
  combination: { from: '#d4a847', to: '#e8cc70', badge: 'rgba(212,168,71,0.15)' },
  sensitive:   { from: '#f9a8d4', to: '#ec4899', badge: 'rgba(236,72,153,0.15)' },
  normal:      { from: '#e8c4d0', to: '#c4b5d0', badge: 'rgba(196,181,208,0.15)' },
}

function zoneColor(val: number, concernIfHigh: boolean) {
  const concern = concernIfHigh ? val : 100 - val
  return concern > 62 ? '#f87171' : concern > 40 ? '#d4a847' : '#4ecca3'
}

function FaceZoneDiagram({ metrics }: { metrics: SkinMetrics }) {
  const zones = [
    {
      id: 'tzone',
      dot:   [150, 107] as [number, number],
      label: [75,  90]  as [number, number],
      side: 'left' as const,
      name: 'T-Zone',
      detail: metrics.oiliness > 62 ? 'Excess oil' : metrics.oiliness > 40 ? 'Slightly oily' : 'Balanced',
      color: zoneColor(metrics.oiliness, true),
    },
    {
      id: 'undereye',
      dot:   [118, 160] as [number, number],
      label: [75,  150] as [number, number],
      side: 'left' as const,
      name: 'Under-eye',
      detail: metrics.hydration < 38 ? 'Dehydrated' : metrics.hydration < 58 ? 'Moderate' : 'Hydrated',
      color: zoneColor(metrics.hydration, false),
    },
    {
      id: 'lcheek',
      dot:   [96,  192] as [number, number],
      label: [75,  196] as [number, number],
      side: 'left' as const,
      name: 'Left Cheek',
      detail: metrics.redness > 55 ? 'Redness' : metrics.redness > 35 ? 'Mild flush' : 'Clear',
      color: zoneColor(metrics.redness, true),
    },
    {
      id: 'nose',
      dot:   [150, 190] as [number, number],
      label: [225, 172] as [number, number],
      side: 'right' as const,
      name: 'Nose',
      detail: metrics.oiliness > 55 ? 'Large pores' : 'Fine pores',
      color: zoneColor(metrics.oiliness, true),
    },
    {
      id: 'rcheek',
      dot:   [204, 192] as [number, number],
      label: [225, 208] as [number, number],
      side: 'right' as const,
      name: 'Right Cheek',
      detail: metrics.hydration < 45 ? 'Dry' : 'Hydrated',
      color: zoneColor(metrics.hydration, false),
    },
    {
      id: 'chin',
      dot:   [150, 255] as [number, number],
      label: [225, 255] as [number, number],
      side: 'right' as const,
      name: 'Jawline',
      detail: metrics.texture < 50 ? 'Rough' : metrics.texture < 70 ? 'Moderate' : 'Smooth',
      color: zoneColor(metrics.texture, false),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl p-6 border border-white/8"
      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
    >
      <p className="text-xs font-semibold tracking-[0.25em] text-white/30 uppercase mb-2 text-center">
        Dermatologist Zone Analysis
      </p>
      <svg viewBox="0 0 300 320" className="w-full max-w-xs mx-auto">
        <ellipse cx="150" cy="178" rx="70" ry="93"
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
        <ellipse cx="80"  cy="178" rx="8" ry="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <ellipse cx="220" cy="178" rx="8" ry="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path d="M 118 138 Q 133 129 148 136" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M 152 136 Q 167 129 182 138" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8" strokeLinecap="round"/>
        <ellipse cx="133" cy="150" rx="13" ry="7" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
        <ellipse cx="167" cy="150" rx="13" ry="7" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
        <circle cx="133" cy="150" r="3.5" fill="rgba(255,255,255,0.1)"/>
        <circle cx="167" cy="150" r="3.5" fill="rgba(255,255,255,0.1)"/>
        <path d="M 150 163 L 142 184 Q 150 190 158 184 L 150 163"
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M 137 184 Q 143 189 150 188 Q 157 189 163 184"
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2"/>
        <path d="M 134 215 Q 150 227 166 215"
          fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="136" y1="271" x2="128" y2="296" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
        <line x1="164" y1="271" x2="172" y2="296" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>

        {zones.map(z => (
          <g key={z.id}>
            <line x1={z.dot[0]} y1={z.dot[1]} x2={z.label[0]} y2={z.label[1]}
              stroke={z.color} strokeWidth="0.9" opacity="0.5" strokeDasharray="3,2"/>
            <circle cx={z.dot[0]} cy={z.dot[1]} r="8"   fill={z.color} opacity="0.15"/>
            <circle cx={z.dot[0]} cy={z.dot[1]} r="4.5" fill={z.color} opacity="0.95"/>
            <text
              x={z.label[0]} y={z.label[1] - 4}
              textAnchor={z.side === 'left' ? 'end' : 'start'}
              fill="rgba(255,255,255,0.72)" fontSize="8.5" fontFamily="sans-serif" fontWeight="700"
            >
              {z.name}
            </text>
            <text
              x={z.label[0]} y={z.label[1] + 8}
              textAnchor={z.side === 'left' ? 'end' : 'start'}
              fill={z.color} fontSize="7.5" fontFamily="sans-serif"
            >
              {z.detail}
            </text>
          </g>
        ))}
      </svg>

      <div className="flex justify-center gap-6 mt-3">
        {([['#4ecca3', 'Good'], ['#d4a847', 'Moderate'], ['#f87171', 'Concern']] as [string, string][]).map(([color, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-white/35 text-xs">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function RadarChart({ metrics }: { metrics: SkinMetrics }) {
  const labels = ['Hydration', 'Texture', 'Uniformity', 'Control', 'Clarity']
  const values = [
    metrics.hydration,
    metrics.texture,
    metrics.uniformity,
    100 - metrics.oiliness,
    100 - metrics.redness,
  ]
  const cx = 120, cy = 120, r = 90, n = 5
  const angle = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2
  const point = (i: number, radius: number) => ({
    x: cx + radius * Math.cos(angle(i)),
    y: cy + radius * Math.sin(angle(i)),
  })
  const poly = (radius: number) =>
    Array.from({ length: n }, (_, i) => point(i, radius)).map(p => `${p.x},${p.y}`).join(' ')
  const dataPoints = values.map((v, i) => { const p = point(i, (r * v) / 100); return `${p.x},${p.y}` }).join(' ')

  return (
    <svg viewBox="0 0 240 240" className="w-48 h-48 md:w-56 md:h-56 mx-auto">
      {[25, 50, 75, 100].map(pct => (
        <polygon key={pct} points={poly((r * pct) / 100)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const p = point(i, r)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      })}
      <polygon points={dataPoints} fill="rgba(212,168,71,0.15)" stroke="#d4a847" strokeWidth="2" strokeLinejoin="round" />
      {values.map((v, i) => {
        const p = point(i, (r * v) / 100)
        return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#d4a847" />
      })}
      {labels.map((label, i) => {
        const p = point(i, r + 18)
        return (
          <text key={label} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="sans-serif">
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
  useEffect(() => { const t = setTimeout(() => setAnimated(display), 100); return () => clearTimeout(t) }, [display])
  const color = display > 70 ? '#4ecca3' : display > 40 ? '#d4a847' : '#f87171'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-white/50">{label}</span>
        <span className="font-semibold" style={{ color }}>{display}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${animated}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const { skinMetrics, quizAnswers, skinType: storedType, concerns: storedConcerns, reset, saveScanToHistory, captures } = useAppStore()
  const [tab, setTab] = useState<'morning' | 'evening'>('morning')
  const savedRef = useRef(false)

  const fallbackMetrics = skinMetrics ?? { oiliness: 50, hydration: 50, redness: 30, texture: 70, uniformity: 70 }
  const result   = determineSkinType(quizAnswers, fallbackMetrics)
  const skinType = (storedType ?? result.type) as SkinType
  const concerns = storedConcerns.length > 0 ? storedConcerns : result.concerns
  const routine  = getRoutine(skinType)
  const colors   = typeColors[skinType] ?? typeColors.normal

  useEffect(() => {
    if (!savedRef.current && skinType) {
      savedRef.current = true
      const record: ScanRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        skinType,
        metrics: fallbackMetrics,
        concerns: concerns.slice(0, 4),
        thumbnail: captures[0] ?? '',
      }
      saveScanToHistory(record)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skinType, fallbackMetrics])

  if (!skinType) {
    return (
      <div className="min-h-screen bg-[#06060f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-6">No analysis data found.</p>
          <button onClick={() => router.push('/lumina')}
            className="px-8 py-3 rounded-full text-sm border border-white/20 text-white/60 hover:text-white transition-colors">
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#06060f]">
      <ParticleField />
      <div className="fixed top-0 right-0 w-[40vw] h-[40vh] blur-[100px] pointer-events-none opacity-15 rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }} />

      <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => router.push('/lumina')} className="text-white/40 hover:text-white/80 transition-colors text-sm">
          ← Home
        </button>
        <span className="text-lg font-bold tracking-[0.15em]" style={{
          background: 'linear-gradient(135deg, #f5e6c8, #d4a847)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          LUMINA
        </span>
        <button onClick={() => { reset(); router.push('/lumina') }}
          className="text-white/30 hover:text-white/70 transition-colors text-xs border border-white/10 px-3 py-1 rounded-full">
          Restart
        </button>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10 space-y-6">

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 border border-white/8 text-center"
          style={{ background: `linear-gradient(160deg, ${colors.badge}, rgba(255,255,255,0.02))`, backdropFilter: 'blur(20px)' }}>
          <p className="text-xs font-semibold tracking-[0.3em] text-white/30 uppercase mb-3">Your Skin Type</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{
            background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {result.label}
          </h1>
          <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">{result.description}</p>
          {concerns.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {concerns.map(c => (
                <span key={c} className="text-xs px-3 py-1.5 rounded-full border"
                  style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.04)' }}>
                  {c}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <FaceZoneDiagram metrics={fallbackMetrics} />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 border border-white/8 flex flex-col items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
            <p className="text-xs font-semibold tracking-[0.25em] text-white/30 uppercase mb-4">Skin Profile</p>
            <RadarChart metrics={fallbackMetrics} />
          </div>
          <div className="rounded-2xl p-6 border border-white/8 space-y-5"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
            <p className="text-xs font-semibold tracking-[0.25em] text-white/30 uppercase mb-2">Metrics</p>
            <MetricBar label="Hydration"       value={fallbackMetrics.hydration}   />
            <MetricBar label="Texture Score"   value={fallbackMetrics.texture}     />
            <MetricBar label="Skin Uniformity" value={fallbackMetrics.uniformity}  />
            <MetricBar label="Oil Control"     value={fallbackMetrics.oiliness}    invert />
            <MetricBar label="Redness Level"   value={fallbackMetrics.redness}     invert />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
          <div className="flex">
            {(['morning', 'evening'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-4 text-sm font-semibold tracking-widest uppercase transition-all"
                style={{
                  color: tab === t ? '#d4a847' : 'rgba(255,255,255,0.3)',
                  borderBottom: tab === t ? '2px solid #d4a847' : '2px solid transparent',
                  background: tab === t ? 'rgba(212,168,71,0.05)' : 'transparent',
                }}>
                {t}
              </button>
            ))}
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {routine[tab].map((s, i) => (
                <motion.div key={s} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(212,168,71,0.12)', color: '#d4a847' }}>
                    {i + 1}
                  </div>
                  <span className="text-sm text-white/70">{s}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-6 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold/60 uppercase mb-4">✓ Ingredients to Seek</p>
            <div className="flex flex-wrap gap-2">
              {routine.ingredients.map(ing => (
                <span key={ing} className="text-xs px-3 py-1.5 rounded-full border border-gold/20 text-gold/70 bg-gold/5">{ing}</span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-6 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs font-semibold tracking-[0.2em] text-rose-400/60 uppercase mb-4">✕ Ingredients to Avoid</p>
            <div className="flex flex-wrap gap-2">
              {routine.avoid.map(ing => (
                <span key={ing} className="text-xs px-3 py-1.5 rounded-full border border-rose-400/20 text-rose-400/60 bg-rose-400/5">{ing}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4 pb-10">
          <button onClick={() => { reset(); router.push('/lumina/analysis') }}
            className="px-10 py-4 rounded-full font-semibold text-[#06060f] text-sm"
            style={{ background: 'linear-gradient(135deg, #d4a847, #e8cc70, #e8c4d0)' }}>
            Analyse Again
          </button>
          <button onClick={() => router.push('/lumina/history')}
            className="px-10 py-4 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm">
            Scan History
          </button>
          <button onClick={() => router.push('/lumina')}
            className="px-10 py-4 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm">
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  )
}
