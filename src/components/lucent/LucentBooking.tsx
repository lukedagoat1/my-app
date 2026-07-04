'use client'

import { useState } from 'react'

// ── LEAD DELIVERY ────────────────────────────────────────────────
// Web3Forms — delivers leads to lucentstudio77@gmail.com
// Access key tied to that inbox. No activation needed.
const LEAD_ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = '21ca7ef7-a0fd-4822-a0b2-dcae4cc0c0db'

const PROJECT_TYPES = [
  'I need a brand new website',
  'I want to redesign my current website',
  'I just need one simple page',
  'I want to show up higher on Google',
  'I need help updating my existing site',
  'I’m not sure — help me figure it out',
]

const PLANS = [
  'Basic — $600 + $30/mo',
  'Pro — $900 + $50/mo (most popular)',
  'Premium — $1,400 + $70/mo',
  'Not sure yet — help me choose',
]

const CONTACTS = ['Luke', 'Mark']

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function LucentBooking() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('submitting')
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!res.ok) throw new Error('Network error')
      const json = await res.json()
      if (json.success === 'true' || json.success === true) {
        setStatus('success')
        form.reset()
      } else throw new Error('failed')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-xl shadow-neutral-200/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl font-bold text-neutral-900">Got it — talk soon.</h3>
        <p className="max-w-sm text-neutral-500">
          Your project request is in and I&apos;ll reply personally within{' '}
          <strong className="text-neutral-900">24 hours</strong> (usually much faster) with next steps.
        </p>
        <button onClick={() => setStatus('idle')} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-200/50 sm:p-8">
      <input type="hidden" name="access_key" value={ACCESS_KEY} />
      <input type="hidden" name="subject" value="New Lucent Studio project lead" />
      <input type="hidden" name="from_name" value="Lucent Studio" />
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="Name" type="text" placeholder="Jane Doe" required />
        <Field label="Phone" name="Phone" type="tel" placeholder="(555) 123-4567" required />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Email" name="Email" type="email" placeholder="you@business.com" required />
        <Field label="Business / website" name="Business" type="text" placeholder="Acme Co. or acme.com" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Select label="What do you need?" name="Project" options={PROJECT_TYPES} />
        <Select label="Plan selection" name="Plan" options={PLANS} />
      </div>
      <div className="mt-4">
        <Select label="Who'd you speak with?" name="Spoke with" options={CONTACTS} />
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Tell me about your website <span className="font-semibold text-indigo-600">(strongly recommended)</span>
        </label>
        <textarea
          name="Details"
          rows={3}
          placeholder="What are you building, what's the goal, any deadline or examples you love…"
          className="w-full resize-none rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Images, logo or branding <span className="font-semibold text-indigo-600">(strongly recommended)</span>
        </label>
        <textarea
          name="Images"
          rows={2}
          placeholder="Paste links to your logo, photos or branding (Google Drive, Dropbox, Imgur…) or describe what you have."
          className="w-full resize-none rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {status === 'error' && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          Something went wrong — please email me directly and I&apos;ll jump on it.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-4 font-heading text-base font-bold text-white shadow-lg shadow-neutral-900/20 transition hover:bg-neutral-800 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Start My Project →'}
      </button>
      <p className="mt-3 text-center text-xs text-neutral-400">
        Free 15-min consult · No obligation · Reply within 24 hours
      </p>
    </form>
  )
}

function Field({ label, name, type, placeholder, required }: { label: string; name: string; type: string; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
      />
    </div>
  )
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
      <select
        name={name}
        required
        defaultValue=""
        className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
      >
        <option value="" disabled>Choose…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}
