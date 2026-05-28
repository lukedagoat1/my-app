'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Scissors,
  Phone,
  MapPin,
  Star,
  CheckCircle2,
  Home,
  ChevronDown,
  Menu,
  X,
  Clock,
} from 'lucide-react'

const services = [
  { name: 'Clean Fade', price: 'From $25', desc: 'Skin, low, mid, or high — crisp every time.' },
  { name: 'Taper Cut', price: 'From $25', desc: 'Classic taper shaped to your style.' },
  { name: 'Beard Trim & Line-Up', price: 'From $15', desc: 'Defined edges and a clean sculpt.' },
  { name: 'Full Cut + Beard', price: 'From $35', desc: 'Complete look — hair and beard together.' },
  { name: "Kids Cut", price: 'From $15', desc: 'Patient, precise cuts for the little ones.' },
  { name: 'Mobile / In-Home', price: 'Call for pricing', desc: 'G-Blendz comes to you — on your schedule.' },
]

const reasons = [
  'All hair textures welcome',
  'Mobile & in-home services available',
  'Kids friendly environment',
  'Precision line-ups every visit',
  'Now accepting new clients',
  'Flexible scheduling',
]

const faqs = [
  {
    q: 'Do you accept walk-ins?',
    a: 'Yes! Walk-ins are welcome, but booking in advance guarantees your time slot. Call or text to reserve.',
  },
  {
    q: 'Where are you located?',
    a: "Currently cutting at Daniel's Beauty Salon — 2612–2640 Ave Plano, TX 75074 and 26000 Rave, Plano, TX 75074.",
  },
  {
    q: 'Do you offer mobile services?',
    a: 'Absolutely. G-Blendz offers mobile and in-home services. Call to discuss availability and pricing.',
  },
  {
    q: 'How do I book an appointment?',
    a: 'Call or text 469-648-7481. We respond quickly and can usually get you in same-day or next-day.',
  },
  {
    q: 'What hair types do you work with?',
    a: 'All hair textures are welcome — straight, wavy, curly, coily. Every client gets precision and care.',
  },
]

function NavBar() {
  const [open, setOpen] = useState(false)
  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ]
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/70 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-amber-400" />
          <span className="font-black text-xl tracking-widest text-white uppercase">G-Blendz</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/60 hover:text-white transition-colors tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:4696487481"
            className="ml-2 px-5 py-2 rounded-full text-sm font-semibold bg-amber-400 text-black hover:bg-amber-300 transition-colors"
          >
            Book Now
          </a>
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/95 border-t border-white/10 px-5 py-4 flex flex-col gap-4"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/70 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:4696487481"
            className="mt-2 px-5 py-2.5 rounded-full text-sm font-bold bg-amber-400 text-black text-center"
            onClick={() => setOpen(false)}
          >
            Book Now — 469-648-7481
          </a>
        </motion.div>
      )}
    </nav>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border border-white/10 rounded-xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-white/90 text-sm">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 pb-4 text-sm text-white/50 leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </div>
  )
}

export default function GBlendz() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <main className="bg-[#0a0a0a] text-white overflow-x-hidden">
      <NavBar />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,191,36,0.18) 0%, transparent 70%), #0a0a0a',
          }}
        />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px opacity-10"
            style={{
              left: `${i * 14 + 3}%`,
              background: 'linear-gradient(to bottom, transparent, #fbbf24, transparent)',
            }}
          />
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Now Accepting New Clients
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-7xl md:text-[10rem] font-black tracking-[-0.03em] leading-none mb-4"
            style={{
              background: 'linear-gradient(160deg, #ffffff 0%, #fde68a 40%, #fbbf24 70%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'g-shimmer 5s linear infinite',
            }}
          >
            G-BLENDZ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg md:text-2xl font-light text-white/60 tracking-[0.3em] uppercase mb-10"
          >
            Precision Cuts &nbsp;·&nbsp; Clean Blends
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="tel:4696487481"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base text-black bg-amber-400 hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-400/20"
            >
              <Phone className="w-4 h-4" />
              Book Now — 469-648-7481
            </a>
            <a
              href="#services"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white/80 border border-white/20 hover:border-white/40 transition-all hover:scale-105"
            >
              View Services
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { n: '5★', label: 'Rated' },
              { n: 'All', label: 'Hair Textures' },
              { n: 'Mobile', label: 'Services' },
              { n: 'Kids', label: 'Welcome' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-amber-400">{s.n}</div>
                <div className="text-xs text-white/40 tracking-widest uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          style={{ animation: 'g-bounce 2s ease-in-out infinite' }}
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">What We Offer</p>
            <h2 className="text-4xl md:text-5xl font-black">Services</h2>
            <p className="mt-4 text-white/40 max-w-md mx-auto text-sm">
              Every service is delivered with precision tools and a passion for clean work.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative p-6 rounded-2xl border border-white/8 hover:border-amber-400/40 transition-all duration-300 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at top left, rgba(251,191,36,0.07), transparent 60%)' }}
                />
                <Scissors className="w-5 h-5 text-amber-400 mb-4" />
                <h3 className="font-bold text-white text-lg mb-1">{s.name}</h3>
                <p className="text-sm text-white/40 mb-4">{s.desc}</p>
                <span className="font-bold text-amber-400 text-sm">{s.price}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <a
              href="tel:4696487481"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-black bg-amber-400 hover:bg-amber-300 transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              Call to Book — 469-648-7481
            </a>
          </motion.div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 px-5 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">The Work</p>
            <h2 className="text-4xl md:text-5xl font-black">Gallery</h2>
            <p className="mt-4 text-white/40 max-w-md mx-auto text-sm">
              The cuts speak for themselves. Precision and consistency every single time.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Clean Fades', emoji: '✂️', tall: true },
              { label: 'Tapers', emoji: '💈', tall: false },
              { label: 'Beard Trims', emoji: '🪒', tall: false },
              { label: 'Line-Ups', emoji: '📐', tall: false },
              { label: 'Kids Cuts', emoji: '👦', tall: false },
              { label: 'Full Looks', emoji: '🔥', tall: true },
            ].map((tile, i) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`${tile.tall ? 'row-span-2' : ''} rounded-2xl border border-white/8 flex flex-col items-center justify-center gap-3 overflow-hidden group cursor-pointer min-h-[140px]`}
                style={{
                  background: `linear-gradient(135deg, rgba(251,191,36,${0.04 + i * 0.015}) 0%, rgba(255,255,255,0.02) 100%)`,
                }}
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{tile.emoji}</span>
                <span className="text-xs font-bold text-white/40 tracking-widest uppercase group-hover:text-white/70 transition-colors">
                  {tile.label}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 text-sm text-white/30"
          >
            Follow G-Blendz on social media for the latest cuts and styles
          </motion.p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">The Barber</p>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Precision is the <span className="text-amber-400">standard.</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                G-Blendz is built on one principle — every client walks out looking their best. Whether
                it's a clean skin fade, a crisp beard line-up, or a fresh kids cut, the attention to
                detail never wavers. All hair textures are welcome and treated with the same level of
                care and expertise.
              </p>
              <p className="text-white/50 leading-relaxed mb-8">
                Now cutting at Daniel's Beauty Salon in Plano, TX — and available for mobile and
                in-home appointments. No commute needed. G-Blendz brings the barbershop experience
                directly to you.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {reasons.map((r) => (
                  <div key={r} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/60">{r}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                {
                  icon: <MapPin className="w-5 h-5 text-amber-400" />,
                  title: "Daniel's Beauty Salon",
                  desc: "2612–2640 Ave Plano, TX 75074\n26000 Rave, Plano, TX 75074",
                },
                {
                  icon: <Home className="w-5 h-5 text-amber-400" />,
                  title: 'Mobile & In-Home Available',
                  desc: 'Call to schedule a visit at your location.',
                },
                {
                  icon: <Phone className="w-5 h-5 text-amber-400" />,
                  title: 'Book by Call or Text',
                  desc: '469-648-7481 — fast response, flexible scheduling.',
                },
                {
                  icon: <Clock className="w-5 h-5 text-amber-400" />,
                  title: 'Walk-Ins Welcome',
                  desc: 'No appointment needed, but booking ahead guarantees your slot.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-white/8"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="mt-0.5 shrink-0">{card.icon}</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">{card.title}</div>
                    <div className="text-xs text-white/40 leading-relaxed whitespace-pre-line">{card.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-16 px-5 border-y border-white/5" style={{ background: 'rgba(251,191,36,0.04)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl font-semibold text-white/80 leading-relaxed max-w-2xl mx-auto">
            "Best fade I've ever gotten. Clean, precise, and on point every single time. G-Blendz is the real deal."
          </blockquote>
          <p className="mt-4 text-sm text-white/30">— Happy Client, Plano TX</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-5">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">Got Questions?</p>
            <h2 className="text-4xl font-black">FAQ</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <FaqItem q={f.q} a={f.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section id="contact" className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-amber-400/20 p-10 md:p-16 text-center"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(251,191,36,0.1) 0%, rgba(255,255,255,0.02) 70%)',
            }}
          >
            <p className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">Ready to Book?</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Let's Get You <br />Looking Fresh
            </h2>
            <p className="text-white/40 text-sm mb-10 max-w-md mx-auto">
              Call or text to lock in your appointment. Kids cuts start at $15. Mobile service available.
            </p>

            <a
              href="tel:4696487481"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-black text-lg text-black bg-amber-400 hover:bg-amber-300 transition-all hover:scale-105 shadow-xl shadow-amber-400/20"
            >
              <Phone className="w-5 h-5" />
              469-648-7481
            </a>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Plano, TX 75074
              </span>
              <span className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-amber-400" />
                Mobile / In-Home
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                All Hair Textures
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-400" />
            <span className="font-black text-lg tracking-widest text-white uppercase">G-Blendz</span>
          </div>
          <p className="text-xs text-white/30 text-center">
            Precision Cuts · Clean Blends · Plano, TX 75074
          </p>
          <a href="tel:4696487481" className="text-xs text-white/40 hover:text-amber-400 transition-colors flex items-center gap-1">
            <Phone className="w-3 h-3" /> 469-648-7481
          </a>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes g-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes g-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </main>
  )
}
