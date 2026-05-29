'use client'

import { useState } from 'react'

const PACKAGES = [
  'Interior Detail — $90 (was $140)',
  'Exterior Detail — $75 (was $125)',
  'Interior + Exterior — $149.99 (was $199.99)',
  'Premium Detail — $250 (was $300)',
  'Not sure yet — help me choose',
]

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function BookingForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('submitting')

    try {
      const res = await fetch('https://formsubmit.co/ajax/4696538552@vzwpix.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      if (json.success === 'true' || json.success === true) {
        setStatus('success')
        form.reset()
      } else {
        throw new Error('Submission failed')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="cd-glass flex flex-col items-center gap-4 rounded-3xl border border-crystal/30 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-crystal/20 text-crystal">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl font-bold">You&apos;re on the list!</h3>
        <p className="max-w-sm text-steel">
          Thanks — we&apos;ve got your request and your <strong className="text-crystal">$50 off</strong> is locked in.
          We&apos;ll reach out within minutes to set a time. Need us now? Call{' '}
          <a href="tel:+14696538552" className="font-semibold text-white underline decoration-crystal">
            (469) 653-8552
          </a>
          .
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm font-medium text-crystal hover:text-crystal-light"
        >
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="cd-glass rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl"
    >
      {/* FormSubmit config — delivers as a text to (469) 653-8552 via Verizon MMS gateway */}
      <input type="hidden" name="_subject" value="New Crystal Detailing booking" />
      <input type="hidden" name="_template" value="basic" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="Name" type="text" placeholder="Jordan Smith" required />
        <Field label="Phone number" name="Phone" type="tel" placeholder="(469) 555-0123" required />
      </div>

      <div className="mt-4">
        <Field label="Email" name="Email" type="email" placeholder="you@email.com" required />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Vehicle (year / make / model)" name="Vehicle" type="text" placeholder="2019 Mercedes E63" required />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-steel">Package</label>
          <select
            name="Package"
            required
            defaultValue=""
            className="w-full rounded-xl border border-white/10 bg-ink-soft/80 px-4 py-3 text-white outline-none transition focus:border-crystal focus:ring-2 focus:ring-crystal/30"
          >
            <option value="" disabled>Choose a package…</option>
            {PACKAGES.map((p) => (
              <option key={p} value={p} className="bg-ink-soft">{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-steel">
          Anything else? <span className="text-white/40">(optional)</span>
        </label>
        <textarea
          name="Notes"
          rows={3}
          placeholder="Pet hair, coffee stains, preferred days/times, your address area…"
          className="w-full resize-none rounded-xl border border-white/10 bg-ink-soft/80 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-crystal focus:ring-2 focus:ring-crystal/30"
        />
      </div>

      {status === 'error' && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Something went wrong. Please call or text us at{' '}
          <a href="tel:+14696538552" className="font-semibold underline">(469) 653-8552</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-crystal px-6 py-4 font-heading text-base font-bold text-ink shadow-[0_8px_30px_rgba(56,189,248,0.35)] transition hover:bg-crystal-light disabled:opacity-60"
      >
        <span className="absolute inset-0 -translate-x-full bg-white/30 [animation:cd-shine_2.5s_ease-in-out_infinite] group-hover:opacity-100" style={{ width: '40%' }} />
        {status === 'submitting' ? 'Sending…' : 'Claim My $50 Off →'}
      </button>
      <p className="mt-3 text-center text-xs text-white/40">
        No spam. We only use this to schedule your detail. Reply STOP anytime.
      </p>
    </form>
  )
}

function Field({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string
  name: string
  type: string
  placeholder: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-steel">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-ink-soft/80 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-crystal focus:ring-2 focus:ring-crystal/30"
      />
    </div>
  )
}
