'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BookingForm } from '@/components/BookingForm'

const PHONE_DISPLAY = '(469) 653-8552'
const PHONE_HREF = 'tel:+14696538552'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

const packages = [
  {
    name: 'Exterior Detail',
    now: '95',
    was: '145',
    tag: 'Showroom shine',
    desc: 'Hand wash, wheels & tires, bug & tar removal, streak-free glass, and a protective wax finish.',
    features: ['Foam hand wash', 'Wheels & tire shine', 'Streak-free windows', 'Spray wax protection'],
    accent: false,
  },
  {
    name: 'Interior Detail',
    now: '110',
    was: '160',
    tag: 'Like-new cabin',
    desc: 'Full vacuum, steam clean, shampooed seats & carpets, and dressed dash, vents and panels.',
    features: ['Deep vacuum & steam', 'Seat & carpet shampoo', 'Dash & panel treatment', 'Streak-free interior glass'],
    accent: false,
  },
  {
    name: 'Interior + Exterior',
    now: '169',
    cents: '.99',
    was: '219.99',
    startingAt: true,
    tag: 'Most popular',
    desc: 'The full reset — our complete interior deep clean paired with a premium exterior wash & wax.',
    features: ['Everything interior', 'Everything exterior', 'Inside & out, done right', 'Best value bundle'],
    accent: true,
  },
  {
    name: 'Premium Detail',
    now: '270',
    was: '320',
    tag: 'The works',
    desc: 'Clay bar treatment, ceramic spray protection, deep interior restoration and stain & odor removal.',
    features: ['Clay bar treatment', 'Ceramic spray coating', 'Deep interior restore', 'Stain & odor removal'],
    accent: false,
  },
]

const stats = [
  { value: '4.8★', label: 'Average rating' },
  { value: '100%', label: 'Mobile — we come to you' },
  { value: 'Allen, TX', label: '& surrounding areas' },
  { value: '24hr', label: 'Response guarantee' },
]

const gallery = [
  { src: '/work/skyline.jpg', label: 'Foam bath — full exterior wash', span: 'col-span-2 row-span-2' },
  { src: '/work/wheel.jpg', label: 'Wheel & caliper detail', span: '' },
  { src: '/work/headlight.png', label: 'Paint & headlight restoration', span: '' },
  { src: '/work/4runner.jpg', label: 'TRD Pro — exterior detail', span: 'row-span-2' },
  { src: '/work/hero-car.jpg', label: 'Full exterior finish', span: 'col-span-2' },
]

const reasons = [
  { icon: '🚐', title: 'Fully mobile', desc: 'We bring the water, power and products to your driveway. You never leave home.' },
  { icon: '✨', title: 'No corners cut', desc: 'Every vent, seam and wheel barrel. We detail the details others skip.' },
  { icon: '🛡️', title: 'Safe on every car', desc: 'Daily drivers, trucks, EVs and exotics — pH-balanced, paint-safe process.' },
  { icon: '⚡', title: 'Fast & easy booking', desc: 'Text or tap. Most jobs scheduled the same week, response in minutes.' },
]

const testimonials = [
  { quote: 'Came to my house and made my E-Class look better than the day I bought it. The interior was spotless.', name: 'Marcus T.', car: 'Mercedes E63' },
  { quote: 'Booked the combo with the $50 off — unreal value. Showed up on time and the wheels were mirror clean.', name: 'Priya R.', car: 'Lexus RX' },
  { quote: 'Got coffee stains out of my seats I thought were permanent. Crystal is my detailer for life now.', name: 'Devon W.', car: 'Honda Accord' },
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('cd_booked') === 'true') {
      setIsFirstVisit(false)
    }
  }, [])

  return (
    <main className="relative">
      {/* NAV */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'cd-glass border-b border-white/10 py-3' : 'py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-crystal/15 text-crystal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4 3 9l9 11 9-11-3-5z" /><path d="M3 9h18M9 4l-1.5 5L12 20M15 4l1.5 5L12 20" />
              </svg>
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">
              Crystal <span className="text-crystal">Detailing</span>
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-steel md:flex">
            <a href="#services" className="transition hover:text-white">Services</a>
            <a href="#work" className="transition hover:text-white">Our Work</a>
            <a href="#why" className="transition hover:text-white">Why Us</a>
            <a href="#book" className="transition hover:text-white">Book</a>
          </div>
          <a
            href={PHONE_HREF}
            className="flex items-center gap-2 rounded-full bg-crystal px-4 py-2 text-sm font-semibold text-ink transition hover:bg-crystal-light"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/work/hero-car.jpg"
            alt="Freshly detailed Mercedes"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        </div>

        {/* floating orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-crystal/20 blur-3xl [animation:cd-orb_14s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-crystal-deep/15 blur-3xl [animation:cd-orb_18s_ease-in-out_infinite_reverse]" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="max-w-2xl">
            <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-crystal/30 bg-crystal/10 px-4 py-1.5 text-sm font-medium text-crystal-light">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crystal opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-crystal" />
              </span>
              Mobile detailing · Allen, TX
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Make your car
              <br />
              look <span className="cd-text-gradient">brand new.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-steel">
              We don&apos;t cut corners — we detail them. Premium mobile car detailing that comes
              to your driveway in Allen and surrounding areas.
            </motion.p>

            {isFirstVisit && (
              <motion.div variants={fadeUp} className="mt-7 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-crystal/30 bg-ink-soft/60 p-4 backdrop-blur">
                <span className="font-heading text-3xl font-extrabold text-crystal">$50 OFF</span>
                <span className="text-steel">your first detail —</span>
                <span className="font-semibold text-white">starting at just $95</span>
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <a
                href="#book"
                className="group relative overflow-hidden rounded-xl bg-crystal px-7 py-4 font-heading font-bold text-ink shadow-[0_8px_30px_rgba(56,189,248,0.4)] transition hover:bg-crystal-light"
              >
                <span className="absolute inset-0 w-1/3 -translate-x-full bg-white/40 [animation:cd-shine_2.8s_ease-in-out_infinite]" />
                Book My Detail →
              </a>
              <a
                href={PHONE_HREF}
                className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-heading font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Call {PHONE_DISPLAY}
              </a>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 cd-glass">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 px-5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-3 py-5 text-center sm:text-left">
                <div className="font-heading text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-steel">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER BAR */}
      <div className="border-y border-crystal/20 bg-crystal/10 py-3 overflow-hidden">
        <div className="flex w-max gap-12 whitespace-nowrap [animation:cd-marquee_28s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12">
              {['$50 OFF your first detail', '100% Mobile — we come to you', 'Interior · Exterior · Premium', '4.8★ locally trusted', 'Allen, TX & surrounding areas'].map((t) => (
                <span key={t} className="flex items-center gap-3 text-sm font-medium text-crystal-light">
                  <span className="text-crystal">◆</span> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <Section id="services">
        <SectionHead
          kicker="Services & Pricing"
          title={isFirstVisit ? 'Pick your package. Save $50 on every one.' : 'Pick your package.'}
          sub={isFirstVisit ? 'First-time customer pricing shown below — the $50 discount is already baked in. Final price varies slightly by vehicle size and condition.' : 'Final price varies slightly by vehicle size and condition.'}
        />
        <div className="grid gap-6 lg:grid-cols-4 sm:grid-cols-2">
          {packages.map((p, i) => (
            <motion.div
              key={p.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                p.accent
                  ? 'border-crystal bg-gradient-to-b from-crystal/15 to-ink-soft shadow-[0_0_40px_rgba(56,189,248,0.2)]'
                  : 'border-white/10 bg-ink-soft/60'
              }`}
            >
              {p.accent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-crystal px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                  Most popular
                </span>
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-crystal">{p.tag}</span>
              <h3 className="mt-1 font-heading text-xl font-bold">{p.name}</h3>
              <div className="mt-4">
                {(p as {startingAt?: boolean}).startingAt && (
                  <div className="text-xs font-medium text-steel mb-0.5">starting at</div>
                )}
                <div className="flex items-end gap-2">
                  <span className="font-heading text-4xl font-extrabold text-white">
                    ${isFirstVisit ? p.now : p.was.replace('.99', '')}<span className="text-2xl">{isFirstVisit ? p.cents : (p.was.endsWith('.99') ? '.99' : '')}</span>
                  </span>
                  {isFirstVisit && <span className="mb-1 text-sm text-steel line-through">${p.was}</span>}
                </div>
              </div>
              {isFirstVisit && (
                <span className="mt-1 inline-block w-fit rounded-md bg-crystal/15 px-2 py-0.5 text-xs font-semibold text-crystal-light">
                  $50 off applied
                </span>
              )}
              <p className="mt-4 text-sm text-steel">{p.desc}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-white/80">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#book"
                className={`mt-6 rounded-xl px-4 py-3 text-center font-heading text-sm font-bold transition ${
                  p.accent
                    ? 'bg-crystal text-ink hover:bg-crystal-light'
                    : 'border border-white/15 text-white hover:bg-white/10'
                }`}
              >
                Book this →
              </a>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* BOOK */}
      <Section id="book" tint>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHead
              align="left"
              kicker="Book your detail"
              title="Lock in your $50 off."
              sub="Drop your details and we'll text or call within minutes to set a time. Or skip the form and call us directly."
            />
            <div className="space-y-4">
              <a href={PHONE_HREF} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-soft/60 p-5 transition hover:border-crystal/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-crystal/15 text-crystal [animation:cd-pulse-ring_2s_ease-out_infinite]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-steel">Call or text</div>
                  <div className="font-heading text-xl font-bold text-white">{PHONE_DISPLAY}</div>
                </div>
              </a>
              <a href="mailto:crystalautodetailsss@gmail.com" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-soft/60 p-5 transition hover:border-crystal/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-crystal/15 text-crystal">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-steel">Email</div>
                  <div className="font-heading text-base font-bold text-white break-all">crystalautodetailsss@gmail.com</div>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-soft/60 p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-crystal/15 text-crystal">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-steel">Service area</div>
                  <div className="font-heading text-base font-bold text-white">Allen, TX & surrounding areas</div>
                </div>
              </div>
            </div>
          </div>
          <div id="form">
            <BookingForm />
          </div>
        </div>
      </Section>

      {/* BEFORE / AFTER */}
      <Section id="work" tint>
        <SectionHead
          kicker="See the difference"
          title="Real results. Drag to reveal."
          sub="Actual customer interiors and finishes — slide the handle to see the Crystal transformation."
        />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <BeforeAfter
              before="/work/interior-before.jpg"
              after="/work/interior-after.jpg"
              alt="Interior detail"
            />
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="space-y-5">
            <h3 className="font-heading text-3xl font-bold">Stains gone. Like it never happened.</h3>
            <p className="text-steel">
              Coffee spills, ground-in dirt, pet hair, faded plastics — our steam and shampoo
              process lifts what regular washes leave behind. The result is a cabin that looks,
              feels and smells brand new.
            </p>
            <ul className="space-y-3">
              {['Deep steam extraction of seats & carpets', 'Stain & odor removal', 'UV-safe dash and panel restoration', 'Streak-free glass, every window'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-crystal/15 text-crystal">✓</span>
                  <span className="text-white/85">{t}</span>
                </li>
              ))}
            </ul>
            <a href="#book" className="inline-block rounded-xl bg-crystal px-6 py-3 font-heading font-bold text-ink transition hover:bg-crystal-light">
              Get this result — $50 off
            </a>
          </motion.div>
        </div>

        {/* SECOND BEFORE / AFTER */}
        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="order-2 space-y-5 lg:order-1">
            <h3 className="font-heading text-3xl font-bold">Into every crevice.</h3>
            <p className="text-steel">
              Center consoles, cupholders, door pockets and trim seams collect crumbs, dust and
              grime that build up for years. We pull it all out, deep-clean and dress every surface
              so the whole cabin feels factory-fresh.
            </p>
            <ul className="space-y-3">
              {['Console & cupholder deep clean', 'Crumbs, dust & debris removal', 'Trim & panel dressing', 'Detailed door pockets & seams'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-crystal/15 text-crystal">✓</span>
                  <span className="text-white/85">{t}</span>
                </li>
              ))}
            </ul>
            <a href="#book" className="inline-block rounded-xl bg-crystal px-6 py-3 font-heading font-bold text-ink transition hover:bg-crystal-light">
              Book a deep clean — $50 off
            </a>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="order-1 lg:order-2">
            <BeforeAfter
              before="/work/console-before.jpg"
              after="/work/console-after.jpg"
              alt="Center console detail"
            />
          </motion.div>
        </div>

        {/* THIRD BEFORE / AFTER — cloth seats */}
        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <BeforeAfter
              before="/work/seat-before.jpg"
              after="/work/seat-after.jpg"
              alt="Cloth seat detail"
            />
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="space-y-5">
            <h3 className="font-heading text-3xl font-bold">Cloth seats, brought back to life.</h3>
            <p className="text-steel">
              Fabric and cloth seats trap spills, sweat and set-in stains that vacuuming alone
              can&apos;t touch. Our hot-water extraction and shampoo process lifts discoloration
              and odor from deep in the weave — restoring the original color and feel.
            </p>
            <ul className="space-y-3">
              {['Hot-water extraction shampoo', 'Set-in stain & spot removal', 'Odor neutralizing treatment', 'Fast-dry, no soggy seats'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-crystal/15 text-crystal">✓</span>
                  <span className="text-white/85">{t}</span>
                </li>
              ))}
            </ul>
            <a href="#book" className="inline-block rounded-xl bg-crystal px-6 py-3 font-heading font-bold text-ink transition hover:bg-crystal-light">
              Refresh my seats — $50 off
            </a>
          </motion.div>
        </div>

        {/* GALLERY */}
        <div className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-3">
          {gallery.map((g, i) => (
            <motion.figure
              key={g.src}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${g.span}`}
            >
              <Image src={g.src} alt={g.label} fill sizes="(max-width:640px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-4 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
                {g.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Section>

      {/* WHY US */}
      <Section id="why">
        <SectionHead
          kicker="Why Crystal"
          title="Detailing done the right way."
          sub="We treat every car like it's parked in our own garage."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-ink-soft/60 p-6 transition hover:border-crystal/40 hover:bg-ink-soft"
            >
              <div className="mb-3 text-3xl">{r.icon}</div>
              <h3 className="font-heading text-lg font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-steel">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* testimonials */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-ink-soft/60 p-6"
            >
              <div className="mb-3 text-crystal">★★★★★</div>
              <p className="text-white/85">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-steel">
                <span className="font-semibold text-white">{t.name}</span> · {t.car}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-heading text-lg font-bold">
              Crystal <span className="text-crystal">Detailing</span>
            </div>
            <p className="mt-1 text-sm text-steel">Mobile car detailing · Allen, TX & surrounding areas</p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-steel sm:text-right">
            <a href={PHONE_HREF} className="font-semibold text-white hover:text-crystal">{PHONE_DISPLAY}</a>
            <a href="mailto:crystalautodetailsss@gmail.com" className="hover:text-crystal">crystalautodetailsss@gmail.com</a>
            <a href="mailto:team@orcamanagement.agency" className="hover:text-crystal">team@orcamanagement.agency</a>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-xs text-steel">
          © {new Date().getFullYear()} Crystal Detailing. We don&apos;t cut corners — we detail them.
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <a
        href="#book"
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-crystal px-6 py-3 font-heading text-sm font-bold text-ink shadow-[0_8px_30px_rgba(56,189,248,0.5)] md:hidden"
      >
        Claim $50 Off →
      </a>
    </main>
  )
}

function Section({
  id,
  children,
  tint,
}: {
  id?: string
  children: React.ReactNode
  tint?: boolean
}) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${tint ? 'cd-grain bg-ink-soft/40' : ''}`}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  )
}

function SectionHead({
  kicker,
  title,
  sub,
  align = 'center',
}: {
  kicker: string
  title: string
  sub?: string
  align?: 'center' | 'left'
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={fadeUp}
      className={`mb-12 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-crystal">{kicker}</span>
      <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-steel">{sub}</p>}
    </motion.div>
  )
}
