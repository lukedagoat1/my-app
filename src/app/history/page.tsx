'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import type { SkinType, ScanRecord } from '@/lib/store'

const typeColors: Record<SkinType, { from: string; to: string; badge: string; label: string }> = {
  oily:        { from: '#7dd3b0', to: '#4ecca3', badge: 'rgba(77,204,163,0.15)',   label: 'Oily' },
  dry:         { from: '#93c5fd', to: '#60a5fa', badge: 'rgba(96,165,250,0.15)',   label: 'Dry' },
  combination: { from: '#d4a847', to: '#e8cc70', badge: 'rgba(212,168,71,0.15)',  label: 'Combination' },
  sensitive:   { from: '#f9a8d4', to: '#ec4899', badge: 'rgba(236,72,153,0.15)',  label: 'Sensitive' },
  normal:      { from: '#e8c4d0', to: '#c4b5d0', badge: 'rgba(196,181,208,0.15)', label: 'Normal' },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function MiniBar({ value, invert = false }: { value: number; invert?: boolean }) {
  const display = invert ? 100 - value : value
  const color = display > 70 ? '#4ecca3' : display > 40 ? '#d4a847' : '#f87171'
  return (
    <div className="h-1 rounded-full bg-white/8 overflow-hidden flex-1">
      <div className="h-full rounded-full transition-all" style={{ width: `${display}%`, background: color }} />
    </div>
  )
}

function ScanCard({ record, index }: { record: ScanRecord; index: number }) {
  const colors = record.skinType ? typeColors[record.skinType] : typeColors.normal
  const skinLabel = record.skinType ? typeColors[record.skinType].label : 'Unknown'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div
          className="flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border border-white/8"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {record.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={record.thumbnail}
              alt="Scan thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl">◎</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-white/35 text-xs">{formatDate(record.date)}</p>
            {record.skinType && (
              <span
                className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: colors.badge,
                  color: colors.from,
                  border: `1px solid ${colors.from}30`,
                }}
              >
                {skinLabel}
              </span>
            )}
          </div>

          {/* Mini metric bars */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs w-20 flex-shrink-0">Hydration</span>
              <MiniBar value={record.metrics.hydration} />
              <span className="text-white/40 text-xs w-6 text-right">{record.metrics.hydration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs w-20 flex-shrink-0">Oil Control</span>
              <MiniBar value={record.metrics.oiliness} invert />
              <span className="text-white/40 text-xs w-6 text-right">{100 - record.metrics.oiliness}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs w-20 flex-shrink-0">Redness</span>
              <MiniBar value={record.metrics.redness} invert />
              <span className="text-white/40 text-xs w-6 text-right">{100 - record.metrics.redness}</span>
            </div>
          </div>

          {/* Concern tags */}
          {record.concerns.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {record.concerns.slice(0, 2).map(c => (
                <span
                  key={c}
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.4)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function HistoryPage() {
  const router = useRouter()
  const { scanHistory } = useAppStore()

  return (
    <div className="min-h-screen bg-[#06060f] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="text-white/40 hover:text-white/80 transition-colors text-sm"
        >
          ← Back
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
        <div className="w-16 text-right">
          {scanHistory.length > 0 && (
            <span className="text-white/25 text-xs">{scanHistory.length} scan{scanHistory.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-auto w-full px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #f5e6c8, #d4a847)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Scan History
          </h1>
          <p className="text-white/35 text-sm">Your previous skin analyses</p>
        </motion.div>

        {scanHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl"
              style={{ background: 'rgba(212,168,71,0.08)', border: '1px solid rgba(212,168,71,0.15)' }}
            >
              ◎
            </div>
            <h2 className="text-xl font-semibold text-white/60 mb-3">No scans saved yet</h2>
            <p className="text-white/30 text-sm mb-8 max-w-xs">
              Complete your first skin analysis to see your history and track your skin health over time.
            </p>
            <button
              onClick={() => router.push('/analysis')}
              className="px-8 py-3.5 rounded-full font-semibold text-[#06060f] text-sm"
              style={{ background: 'linear-gradient(135deg, #d4a847, #e8cc70, #e8c4d0)' }}
            >
              Start Your First Scan
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {scanHistory.map((record, i) => (
              <ScanCard key={record.id} record={record} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
