'use client'

import Image from 'next/image'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { LucentBooking } from '@/components/lucent/LucentBooking'
import { faqs } from './faq-data'

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
}

const services = [
  { icon: '🖥️', title: 'Custom Websites', desc: 'Bespoke, fast, mobile-perfect sites built from scratch around your brand and your goals.' },
  { icon: '🎯', title: 'Landing Pages', desc: 'High-converting one-pagers engineered to turn ad clicks and visitors into booked customers.' },
  { icon: '♻️', title: 'Redesigns', desc: 'Tired, slow or dated site? I rebuild it modern, quick and credible — without losing your SEO.' },
  { icon: '⚡', title: 'Speed & SEO', desc: 'Lightning-fast load times and on-page SEO so you rank, get found, and keep visitors.' },
  { icon: '✨', title: 'Animation & Interaction', desc: 'Smooth motion and micro-interactions that make your brand feel premium and trustworthy.' },
  { icon: '🛟', title: 'Ongoing Care', desc: 'Hosting, updates and support built into every plan — your site stays live, fresh and worry-free.' },
]

const steps = [
  { n: '01', title: 'Discovery', desc: 'We talk goals, audience and what success looks like. Free 15-min call.' },
  { n: '02', title: 'Design', desc: 'I craft a look that fits your brand — you review and shape it before a line of code.' },
  { n: '03', title: 'Build', desc: 'Fast, clean development with motion, SEO and mobile baked in from day one.' },
  { n: '04', title: 'Launch & grow', desc: 'We go live, track results, and I keep improving it month after month.' },
]

type Project = {
  name: string
  category: string
  result: string
  img?: string
  href?: string
  gradient: string
}

const projects: Project[] = [
  {
    name: 'Crystal Detailing',
    category: 'Mobile car detailing · Allen, TX',
    result: 'Booking-focused site with interactive before/after sliders and instant lead texts.',
    img: '/work/crystal-detailing.jpg',
    href: '/crystal',
    gradient: 'from-sky-500 to-indigo-600',
  },
  {
    name: 'Sharp & Co.',
    category: 'Demo — Brand site',
    result: 'Bold, modern storefront built to showcase the brand and drive orders.',
    img: '/work/gblendz.jpg',
    href: '/gblendz',
    gradient: 'from-amber-500 to-rose-600',
  },
  {
    name: 'Lumina',
    category: 'AI face-scanning web app',
    result: 'Interactive face-scanning experience with a sleek, futuristic interface and real-time results.',
    img: '/work/lumina.jpg',
    href: 'https://my-app-navy-sigma-97.vercel.app/lumina',
    gradient: 'from-violet-500 to-fuchsia-600',
  },
  {
    name: "Sara's Trading Post",
    category: 'Full online store · e-commerce',
    result: 'Complete storefront with live inventory, cart, and checkout — built to sell, not just look nice.',
    img: '/work/saras-trading-post.jpg',
    href: 'https://saras-trading-post.vercel.app',
    gradient: 'from-rose-500 to-orange-500',
  },
  {
    name: 'Your brand here',
    category: 'Available this month',
    result: 'Two project slots open — your business could be the next case study.',
    gradient: 'from-emerald-500 to-teal-600',
  },
]

const stats = [
  { value: '1 day', label: 'Typical launch time' },
  { value: '100/100', label: 'Performance scores I build to' },
  { value: '24 hr', label: 'Reply time, guaranteed' },
  { value: '∞', label: 'Revisions until you love it' },
]

const testimonials = [
  { quote: 'Luke turned my idea into a site that actually books jobs. The before/after sliders are a game changer.', name: 'Dimitri K.', role: 'Crystal Detailing' },
  { quote: 'Fast, communicative, and the design is way nicer than agencies that quoted me 5x as much.', name: 'Marcus T.', role: 'Local business owner' },
  { quote: 'My site finally loads instantly and shows up on Google. Wish I’d done this a year ago.', name: 'Priya R.', role: 'Founder' },
]

const pricing = [
  {
    name: 'Basic',
    price: '$600',
    cadence: 'then $30/mo',
    tag: 'Perfect to get online',
    features: ['Custom one-page site', 'Mobile-perfect & fast', 'Lead form → your phone', 'Hosting + domain managed', 'Basic on-page SEO', 'Live in one day'],
    accent: false,
  },
  {
    name: 'Pro',
    price: '$900',
    cadence: 'then $50/mo',
    tag: 'Most popular',
    features: ['Everything in Basic', 'Multi-page custom site', 'Advanced animation & interaction', 'Full SEO + schema markup', 'Priority support + monthly updates', 'Analytics + lead tracking'],
    accent: true,
  },
  {
    name: 'Premium',
    price: '$1,400',
    cadence: 'then $70/mo',
    tag: 'The complete package',
    features: ['Everything in Pro', 'Unlimited pages', 'Custom integrations & booking systems', 'E-commerce / online payments', 'Ongoing growth + A/B testing', 'Same-day priority support'],
    accent: false,
  },
]

const techStack = ['Next.js', 'React', 'Tailwind', 'Framer Motion', 'TypeScript', 'SEO', 'Vercel', 'Analytics']

// Tilt/magnetic only make sense with a hovering cursor; on touch they fight
// scrolling, and reduced-motion users shouldn't get them at all.
function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    setFine(
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])
  return fine
}

// ── 3D tilt card with cursor-tracked glare ──────────────────────────
function Tilt({ children, className = '', max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const fine = useFinePointer()
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 18 })
  const glareX = useTransform(px, [0, 1], ['0%', '100%'])
  const glareY = useTransform(py, [0, 1], ['0%', '100%'])
  const glare = useMotionTemplate`radial-gradient(320px circle at ${glareX} ${glareY}, rgba(255,255,255,0.35), transparent 65%)`

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  function onLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  if (!fine) return <div className={`relative ${className}`}>{children}</div>

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  )
}

// ── magnetic CTA button ──────────────────────────────────────────────
function Magnetic({ children }: { children: React.ReactNode }) {
  const fine = useFinePointer()
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 160, damping: 14 })
  const y = useSpring(useMotionValue(0), { stiffness: 160, damping: 14 })

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  if (!fine) return <div className="inline-block">{children}</div>

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x, y }} className="inline-block">
      {children}
    </motion.div>
  )
}

export default function LucentPage() {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const orb1Y = useTransform(scrollY, [0, 800], [0, 170])
  const orb2Y = useTransform(scrollY, [0, 800], [0, -120])
  const heroFade = useTransform(scrollY, [0, 500], [1, 0.35])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-indigo-200">
      {/* scroll progress */}
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-600" />

      {/* NAV */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-neutral-200 bg-white/80 py-3 backdrop-blur-xl' : 'py-5'}`}>
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-md shadow-indigo-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
              </svg>
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">Lucent <span className="text-indigo-600">Studio</span></span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
            <a href="#services" className="transition hover:text-neutral-900">Services</a>
            <a href="#work" className="transition hover:text-neutral-900">Work</a>
            <a href="#pricing" className="transition hover:text-neutral-900">Pricing</a>
            <a href="#faq" className="transition hover:text-neutral-900">FAQ</a>
          </div>
          <a href="#book" className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800">
            Start a project
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden px-5 pt-36 pb-24 sm:pt-44">
        {/* grid pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black,transparent)]"
        />
        <motion.div aria-hidden style={{ y: orb1Y }} className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/40 via-sky-200/40 to-transparent blur-3xl" />
        <motion.div aria-hidden style={{ y: orb2Y }} className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-gradient-to-br from-rose-200/40 to-amber-100/30 blur-3xl" />

        <motion.div style={{ opacity: heroFade }} className="relative mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.a href="#work" variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Taking 2 new projects this month
            </motion.a>
            <motion.h1 variants={fadeUp} className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Websites that win you{' '}
              <span className="animate-gradient-x bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-600 bg-[length:200%_auto] bg-clip-text text-transparent">customers.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-neutral-500">
              I&apos;m Luke — I design fast, beautiful, high-converting websites for businesses
              that want to look premium and actually get booked. Not just pretty. Built to sell.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Magnetic>
                <a href="#book" className="inline-block rounded-xl bg-neutral-900 px-7 py-4 font-heading font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-neutral-800 hover:shadow-xl hover:shadow-indigo-500/30">
                  Start my project →
                </a>
              </Magnetic>
              <a href="#work" className="rounded-xl border border-neutral-300 bg-white px-7 py-4 font-heading font-semibold text-neutral-800 transition hover:border-neutral-400 hover:shadow-md">
                See my work
              </a>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-5 text-sm text-neutral-400">
              Free 15-min consult · Reply within 24 hrs · Trusted by Crystal Detailing &amp; more
            </motion.p>
          </motion.div>
        </motion.div>

        {/* stats */}
        <div className="relative mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 shadow-xl shadow-neutral-200/60 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 120, damping: 16 }}
              className="group bg-white p-5 text-center transition hover:bg-neutral-50"
            >
              <div className="font-heading text-2xl font-bold text-neutral-900 transition group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-sky-500 group-hover:bg-clip-text group-hover:text-transparent">{s.value}</div>
              <div className="mt-1 text-xs text-neutral-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TECH MARQUEE */}
      <div className="overflow-hidden border-y border-neutral-200 bg-neutral-50 py-6">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">What I build with</p>
        <div className="relative [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <motion.div
            className="flex w-max gap-14 pr-14"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
          >
            {[...techStack, ...techStack].map((t, i) => (
              <span key={`${t}-${i}`} className="font-heading text-lg font-semibold text-neutral-400 transition hover:text-indigo-500">{t}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* SERVICES */}
      <Section id="services">
        <Head kicker="What I do" title="Everything your site needs — in one place." sub="From first pixel to ongoing growth. You get a partner, not just a developer." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div key={s.title} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} transition={{ delay: i * 0.06 }} className="group">
              <Tilt max={6} className="h-full rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50">
                <div className="mb-3 text-3xl transition group-hover:scale-110" style={{ transformOrigin: 'left' }}>{s.icon}</div>
                <h3 className="font-heading text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{s.desc}</p>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* WORK */}
      <Section id="work" tint>
        <Head kicker="Selected work" title="Real sites. Real results." sub="A few recent builds. Yours could be next." />
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div key={p.name} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="group">
              <Tilt max={7} className="h-full">
                <a
                  href={p.href ?? '#book'}
                  target={p.href ? '_blank' : undefined}
                  rel={p.href ? 'noopener noreferrer' : undefined}
                  className="block h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-2xl hover:shadow-neutral-300/40"
                >
                  <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${p.gradient}`}>
                    {p.img ? (
                      <Image src={p.img} alt={`${p.name} — web project by Lucent Studio`} fill sizes="(max-width:768px) 100vw, 400px" className="object-cover opacity-95 transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-heading text-2xl font-bold text-white/90">{p.name}</span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-700 backdrop-blur">{p.category}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-bold">{p.name}</h3>
                      {p.href && (
                        <span className="text-indigo-600 transition group-hover:translate-x-0.5">↗</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-neutral-500">{p.result}</p>
                  </div>
                </a>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process">
        <Head kicker="How it works" title="A simple, no-stress process." sub="You always know what’s happening next. No jargon, no ghosting." />
        <div className="relative grid gap-5 md:grid-cols-4">
          <div aria-hidden className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent md:block" />
          {steps.map((s, i) => (
            <motion.div key={s.n} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="group relative rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
              <div className="font-heading text-4xl font-extrabold text-indigo-100 transition group-hover:text-indigo-200">{s.n}</div>
              <h3 className="mt-2 font-heading text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" tint>
        <Head kicker="Pricing" title="Fair, flat pricing. No surprises." sub="Pick where you start — upgrade anytime. Every project includes a free consult." />
        <div className="grid gap-6 md:grid-cols-3">
          {pricing.map((p, i) => (
            <motion.div key={p.name} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="group">
              <Tilt max={5} className={`relative flex h-full flex-col rounded-2xl border p-7 ${p.accent ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xl shadow-indigo-500/20' : 'border-neutral-200 bg-white'}`}>
                {p.accent && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-indigo-500/40">Most popular</span>}
                <span className={`text-xs font-semibold uppercase tracking-wider ${p.accent ? 'text-indigo-300' : 'text-indigo-600'}`}>{p.tag}</span>
                <h3 className="mt-1 font-heading text-xl font-bold">{p.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-heading text-4xl font-extrabold">{p.price}</span>
                  <span className={`mb-1 text-sm ${p.accent ? 'text-neutral-400' : 'text-neutral-500'}`}>{p.cadence}</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.accent ? '#818cf8' : '#4f46e5'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 6 9 17l-5-5" /></svg>
                      <span className={p.accent ? 'text-neutral-200' : 'text-neutral-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#book" className={`mt-7 rounded-xl px-4 py-3 text-center font-heading text-sm font-bold transition ${p.accent ? 'bg-white text-neutral-900 hover:bg-neutral-100' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
                  Get started →
                </a>
              </Tilt>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          🔒 Unlimited revisions until you love the design — no extra charge.
        </p>
      </Section>

      {/* TESTIMONIALS */}
      <Section id="testimonials">
        <Head kicker="Kind words" title="Clients who got results." />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote key={t.name} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-3 text-amber-400">★★★★★</div>
              <p className="text-neutral-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 font-heading text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </span>
                <span className="text-sm text-neutral-500"><span className="font-semibold text-neutral-900">{t.name}</span> · {t.role}</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" tint>
        <Head kicker="Questions" title="Everything you’re wondering." />
        <div className="mx-auto max-w-2xl divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/50">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-neutral-50">
                <span className="font-heading font-semibold text-neutral-900">{f.q}</span>
                <span className={`shrink-0 text-xl text-indigo-600 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <motion.div initial={false} animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }} className="overflow-hidden">
                <p className="px-6 pb-5 text-sm text-neutral-500">{f.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </Section>

      {/* BOOK */}
      <Section id="book">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Head align="left" kicker="Let’s build it" title="Start your project today." sub="Tell me what you need and I’ll reply within 24 hours with a clear plan and price. No pressure, no jargon." />
            <ul className="space-y-4">
              {[
                ['Free 15-minute consult', 'We figure out if it’s a fit — zero obligation.'],
                ['Unlimited revisions', 'We keep refining the design until you love it.'],
                ['Live in about a week', 'Most one-page sites launch fast.'],
                ['Only 2 slots this month', 'I keep quality high by limiting projects.'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">✓</span>
                  <div>
                    <div className="font-semibold text-neutral-900">{t}</div>
                    <div className="text-sm text-neutral-500">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div><LucentBooking /></div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-neutral-950 text-neutral-300">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
                </svg>
              </span>
              <span className="font-heading text-lg font-bold text-white">Lucent <span className="text-indigo-400">Studio</span></span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-neutral-400">
              Conversion-focused web design for local businesses. Fast, beautiful, and built to turn visitors into customers.
            </p>
            <a href="#book" className="mt-5 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200">Start a project →</a>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#services" className="transition hover:text-white">Services</a></li>
              <li><a href="#work" className="transition hover:text-white">Work</a></li>
              <li><a href="#pricing" className="transition hover:text-white">Pricing</a></li>
              <li><a href="#faq" className="transition hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">Get in touch</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="https://calendly.com/lucentstudio_/30min" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Book a free call ↗</a></li>
              <li><a href="mailto:lucentstudio77@gmail.com" className="transition hover:text-white">lucentstudio77@gmail.com</a></li>
              <li><a href="https://www.instagram.com/lucentsites/" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Instagram ↗</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-neutral-500">© {new Date().getFullYear()} Lucent Studio · lucent-studios.com</div>
      </footer>

      {/* gradient keyframes for hero headline */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { animation: gradient-x 5s ease infinite; }
      `}</style>
    </div>
  )
}

function Section({ id, children, tint }: { id?: string; children: React.ReactNode; tint?: boolean }) {
  return (
    <section id={id} className={`px-5 py-20 sm:py-24 ${tint ? 'bg-neutral-50' : ''}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

function Head({ kicker, title, sub, align = 'center' }: { kicker: string; title: string; sub?: string; align?: 'center' | 'left' }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} variants={fadeUp} className={`mb-12 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{kicker}</span>
      <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-neutral-500">{sub}</p>}
    </motion.div>
  )
}
