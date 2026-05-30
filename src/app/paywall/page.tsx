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

const PLANS = [
  {
    id: 'pro',
    label: 'Lumina Pro',
    price: '$5',
    period: '/ month',
    badge: null,
    description: 'Unlock unlimited skin scans, track your skin\'s progress over time, and get personalised routine recommendations that update as your skin changes. Cancel anytime.',
    href: 'https://buy.stripe.com/test_3cI5kF4IXcsD4Z8cXceZ200',
    cta: 'Subscribe for $5 / month',
  },
  {
    id: 'loyalty',
    label: 'Lumina Loyalty',
    price: '$150',
    period: 'one-time',
    badge: 'Best Value',
    description: 'Pay once, own it forever. Get everything in Lumina Pro for life — unlimited scans, full history, and every future feature we ever ship, at no extra cost. For the skincare obsessed who are in it for the long game.',
    href: 'https://buy.stripe.com/test_3cI5kF4IXcsD4Z8cXceZ200',
    cta: 'Get Lifetime Access — $150',
  },
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
          className="w-full max-w-lg"
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
            You&apos;ve used your free scan. Choose a plan to keep analysing your skin and tracking progress.
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

          {/* Plans */}
          <div className="space-y-4 mb-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="rounded-2xl p-5 border relative"
                style={{
                  background: plan.id === 'loyalty' ? 'rgba(212,168,71,0.06)' : 'rgba(255,255,255,0.03)',
                  borderColor: plan.id === 'loyalty' ? 'rgba(212,168,71,0.35)' : 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #d4a847, #e8cc70)', color: '#06060f' }}
                  >
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="text-3xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #f5e6c8, #d4a847)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-white/40 text-sm">{plan.period}</span>
                  <span className="ml-auto text-white/60 text-sm font-semibold">{plan.label}</span>
                </div>
                <p className="text-white/45 text-xs leading-relaxed mb-4">{plan.description}</p>
                <a
                  href={plan.href}
                  className="block w-full text-center py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
                  style={
                    plan.id === 'loyalty'
                      ? { background: 'linear-gradient(135deg, #d4a847, #e8cc70, #e8c4d0)', color: '#06060f' }
                      : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)' }
                  }
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Demo mode button */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
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
