'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ParticleField } from '@/components/ParticleField'
import { useAppStore } from '@/lib/store'

const features = [
  {
    icon: '◈',
    title: 'Multi-Angle Capture',
    desc: 'Five guided poses capture your skin from every angle for comprehensive analysis.',
  },
  {
    icon: '◎',
    title: 'Pixel-Level Analysis',
    desc: 'Real-time skin tone, oiliness, redness, hydration and texture measurement.',
  },
  {
    icon: '◇',
    title: 'Personalised Routine',
    desc: 'Morning and evening routines with exact ingredients tailored to your skin type.',
  },
]

const steps = [
  { n: '01', title: 'Face Scan', desc: 'Position your face and follow five guided capture directions.' },
  { n: '02', title: 'Skin Quiz', desc: 'Eight quick questions refine your profile for accuracy.' },
  { n: '03', title: 'Your Results', desc: 'Get your skin type, metrics radar and full personalised routine.' },
]

export default function Home() {
  const router = useRouter()
  const reset = useAppStore((s) => s.reset)

  const start = () => {
    reset()
    router.push('/analysis')
  }

  return (
    <main className="relative min-h-screen bg-[#06060f]">
      <ParticleField />

      {/* Background orbs */}
      <div
        className="fixed top-[-20vh] left-[-10vw] w-[60vw] h-[60vh] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #d4a847 0%, transparent 70%)',
          animation: 'lumina-orb-1 18s ease-in-out infinite',
        }}
      />
      <div
        className="fixed bottom-[-10vh] right-[-10vw] w-[50vw] h-[50vh] rounded-full opacity-15 blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #e8c4d0 0%, transparent 70%)',
          animation: 'lumina-orb-2 22s ease-in-out infinite',
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <span
          className="text-2xl font-bold tracking-[0.15em]"
          style={{
            background: 'linear-gradient(135deg, #f5e6c8, #d4a847, #e8c4d0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          LUMINA
        </span>
        <button
          onClick={start}
          className="text-sm font-medium text-white/70 hover:text-white transition-colors border border-white/10 px-5 py-2 rounded-full hover:border-white/30"
        >
          Start Analysis
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-24 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-xs font-semibold tracking-[0.3em] text-gold/70 uppercase mb-6 border border-gold/20 px-4 py-1.5 rounded-full bg-gold/5">
            AI Skin Intelligence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6"
          style={{
            background: 'linear-gradient(160deg, #ffffff 0%, #f5e6c8 30%, #d4a847 60%, #e8c4d0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
            animation: 'lumina-shimmer 6s linear infinite',
          }}
        >
          LUMINA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 max-w-lg mb-4"
        >
          Your skin has a story. Let AI read it.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm text-white/30 max-w-md mb-12"
        >
          Pixel-level facial analysis combined with an intelligent questionnaire delivers a complete skin profile and personalised routine in under 3 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={start}
            className="relative group px-10 py-4 rounded-full font-semibold text-[#06060f] text-base overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #d4a847, #e8cc70, #e8c4d0)',
              animation: 'lumina-glow 3s ease-in-out infinite',
            }}
          >
            <span className="relative z-10">Begin Your Analysis →</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <span className="text-white/30 text-sm">No account needed · Takes ~3 min</span>
        </motion.div>

        {/* Floating skin scan visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 relative"
          style={{ animation: 'lumina-float 6s ease-in-out infinite' }}
        >
          <div className="relative w-64 h-80 md:w-80 md:h-96 mx-auto">
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full border border-gold/20"
              style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
            />
            {/* Glass card */}
            <div
              className="absolute inset-4 rounded-2xl border border-white/10 overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(212,168,71,0.08) 0%, rgba(232,196,208,0.04) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              }}
            >
              {/* Scan line */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
                style={{ animation: 'lumina-scan 3s ease-in-out infinite' }}
              />
              {/* Grid dots */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, #d4a847 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
              {/* Center icon */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="text-5xl opacity-40">◈</div>
                <div className="text-xs text-gold/50 tracking-widest uppercase">Scanning</div>
              </div>
            </div>
            {/* Pulse rings */}
            {[0, 0.8, 1.6].map((delay, i) => (
              <div
                key={i}
                className="absolute inset-0 border border-gold/10 rounded-full"
                style={{
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  animation: `lumina-pulse-ring 2.4s ${delay}s ease-out infinite`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl md:text-4xl font-bold mb-14 text-white/90"
          >
            Built different.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group p-6 rounded-2xl border border-white/8 hover:border-gold/30 transition-all duration-300"
                style={{
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(212,168,71,0.02) 100%)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="text-3xl text-gold/60 mb-4 group-hover:text-gold transition-colors">{f.icon}</div>
                <h3 className="font-semibold text-white/90 mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 py-20 md:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl md:text-4xl font-bold mb-16 text-white/90"
          >
            How it works
          </motion.h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-rose/20 to-transparent hidden md:block" />
            <div className="space-y-10">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="md:pl-20 flex items-start gap-6"
                >
                  <div className="hidden md:flex absolute left-4 w-8 h-8 rounded-full items-center justify-center text-xs font-bold border border-gold/40 text-gold/80 bg-[#06060f]">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gold/50 tracking-widest uppercase mb-1">{s.n}</div>
                    <h3 className="text-lg font-semibold text-white/90 mb-1">{s.title}</h3>
                    <p className="text-sm text-white/40">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white/90">
            Know your skin. <br />
            <span style={{
              background: 'linear-gradient(135deg, #d4a847, #e8c4d0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Own it.</span>
          </h2>
          <p className="text-white/40 mb-10 text-sm">Free · Private · No data stored on servers</p>
          <button
            onClick={start}
            className="px-12 py-4 rounded-full font-semibold text-[#06060f] text-base"
            style={{ background: 'linear-gradient(135deg, #d4a847, #e8cc70, #e8c4d0)' }}
          >
            Begin Analysis
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-white/5">
        <span className="text-white/20 text-xs tracking-widest">LUMINA · AI SKIN INTELLIGENCE · 2025</span>
      </footer>
    </main>
  )
}
