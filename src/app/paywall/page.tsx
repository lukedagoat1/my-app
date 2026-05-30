'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'

const FEATURES = [
  'Unlimited skin scans — analyse as often as you like',
  'Full 5-angle facial zone breakdown every time',
  'Personalised morning & evening routine builder',
  'Scan history with progress tracking over time',
  'Priority ingredient recommendations & alerts',
]

export default function PaywallPage() {
  const router = useRouter()
  const { setIsPremium } = useAppStore()

  const handleDemo = () => {
    setIsPremium(true)
    router.push('/analysis')
  }

  return (
    <div className="min-h-screen bg-[#06060f] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button
          onClick={() => router.push('/')}
          className="text-white/40 hover:text-white/80 transition-colors text-sm"
        >
          ← Back to Home
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
        <div className="w-20" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span
              className="text-xs font-bold tracking-[0.25em] uppercase px-4 py-2 rounded-full"
              style={{
                background: 'rgba(212,168,71,0.12)',
                color: '#d4a847',
                border: '1px solid rgba(212,168,71,0.3)',
              }}
            >
              Free Scan Used
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl md:text-5xl font-bold text-center mb-3"
            style={{
              background: 'linear-gradient(135deg, #f5e6c8, #d4a847)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Unlock Unlimited Scans
          </h1>
          <p className="text-center text-white/40 text-sm mb-10">
            You&apos;ve used your free scan. Subscribe to keep analysing your skin and tracking progress.
          </p>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl p-6 mb-8 border border-white/8 space-y-4"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex-shrink-0 text-base" style={{ color: '#d4a847' }}>✓</span>
                <span className="text-sm text-white/70 leading-snug">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <span
              className="text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f5e6c8, #d4a847)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              $5
            </span>
            <span className="text-white/40 text-lg ml-2">/ month</span>
          </motion.div>

          {/* Subscribe button */}
          <motion.a
            href="https://buy.stripe.com/REPLACE_ME"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="block w-full text-center py-4 rounded-full font-semibold text-[#06060f] text-sm mb-4"
            style={{ background: 'linear-gradient(135deg, #d4a847, #e8cc70, #e8c4d0)' }}
          >
            Subscribe for $5 / month
          </motion.a>

          {/* Demo mode button */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleDemo}
            className="w-full py-4 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm mb-6"
          >
            Continue (Demo Mode)
          </motion.button>

          {/* Back link */}
          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="text-white/30 hover:text-white/60 transition-colors text-xs underline underline-offset-4"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
