'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'

export default function PaywallSuccessPage() {
  const router = useRouter()
  const { setIsPremium } = useAppStore()

  useEffect(() => {
    setIsPremium(true)
    const timer = setTimeout(() => {
      router.push('/lumina/analysis')
    }, 2000)
    return () => clearTimeout(timer)
  }, [setIsPremium, router])

  return (
    <div className="min-h-screen bg-[#06060f] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(212,168,71,0.15)', border: '2px solid rgba(212,168,71,0.4)' }}
        >
          <span className="text-3xl" style={{ color: '#d4a847' }}>✓</span>
        </motion.div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{
            background: 'linear-gradient(135deg, #f5e6c8, #d4a847)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          You&apos;re Premium!
        </h1>
        <p className="text-white/40 text-sm mb-6">
          Subscription activated. Redirecting you to your scan…
        </p>

        <div className="flex justify-center">
          <div
            className="w-6 h-6 rounded-full border-2 border-t-transparent"
            style={{
              borderColor: 'rgba(212,168,71,0.3)',
              borderTopColor: '#d4a847',
              animation: 'spin 0.9s linear infinite',
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
