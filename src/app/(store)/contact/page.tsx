"use client";

import { useState } from "react";
import {
  Mail, Clock, BadgeCheck, MessageCircle, Send, Check, ChevronDown,
} from "lucide-react";

const faqs = [
  { q: "Are your products 100% authentic?", a: "Yes — every item is genuine, hand-inspected and batch-verified before it's listed. If anything ever isn't authentic, you get a full refund, no questions asked." },
  { q: "How fast do you ship?", a: "Most orders ship within one business day with full tracking. You'll get an email with your tracking number the moment it's on its way." },
  { q: "Do you really include a free beauty sample?", a: "Always. Every single order ships with a free beauty sample tucked inside — our small way of saying thank you." },
  { q: "What's your return policy?", a: "If something isn't right, email us within 30 days and we'll make it right with a replacement or refund. Your satisfaction is the whole point." },
  { q: "Where can I see your track record?", a: "We've earned 99.8% positive feedback across more than 79,000 orders. Check our Reviews page for hundreds of real customer experiences." },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [open, setOpen] = useState<number | null>(0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const mailto = `mailto:sarastradingpost@gmail.com?subject=${encodeURIComponent(form.subject || "Question for Sara's Trading Post")}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--s-wine)]">We&apos;re here to help</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-[var(--s-ink)] sm:text-5xl">Get in touch</h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] text-[var(--s-ink-soft)]">
          Have a question about a product, your order, or authenticity? Sara personally reads and
          replies to every message — usually within one business day.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* form */}
        <div className="rounded-3xl border border-[var(--s-line)] bg-white p-7 sm:p-9 s-shadow">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="s-pop grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600"><Check className="h-8 w-8" /></span>
              <h2 className="mt-5 font-display text-2xl font-bold text-[var(--s-ink)]">Message ready to send!</h2>
              <p className="mt-2 max-w-sm text-sm text-[var(--s-ink-soft)]">
                Tap below to open your email and send it our way. We&apos;ll get back to you within a business day.
              </p>
              <a href={mailto} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--s-wine)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--s-wine-deep)]">
                <Mail className="h-4 w-4" /> Open email to sarastradingpost@gmail.com
              </a>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-3 text-sm font-medium text-[var(--s-ink-soft)] hover:text-[var(--s-wine)]">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="font-display text-xl font-bold text-[var(--s-ink)]">Send us a message</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Your name" v={form.name} on={(v) => setForm((s) => ({ ...s, name: v }))} required />
                <Input label="Email" type="email" v={form.email} on={(v) => setForm((s) => ({ ...s, email: v }))} required />
              </div>
              <Input label="Subject" v={form.subject} on={(v) => setForm((s) => ({ ...s, subject: v }))} required />
              <div>
                <label className="text-xs font-semibold text-[var(--s-ink)]">Message</label>
                <textarea
                  required rows={5} value={form.message}
                  onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                  placeholder="How can we help?"
                  className="mt-1.5 w-full resize-none rounded-xl border border-[var(--s-line)] bg-white px-3.5 py-3 text-sm text-[var(--s-ink)] outline-none transition-colors placeholder:text-[var(--s-ink-soft)]/60 focus:border-[var(--s-wine)]"
                />
              </div>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--s-wine)] py-3.5 text-sm font-bold text-white hover:bg-[var(--s-wine-deep)]">
                <Send className="h-4 w-4" /> Send message
              </button>
            </form>
          )}
        </div>

        {/* contact cards */}
        <div className="space-y-4">
          <a href="mailto:sarastradingpost@gmail.com" className="s-card-hover block rounded-2xl border border-[var(--s-line)] bg-white p-6 s-shadow">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--s-rose-soft)] text-[var(--s-wine)]"><Mail className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-base font-bold text-[var(--s-ink)]">Email us</h3>
            <p className="mt-1 text-sm font-medium text-[var(--s-wine)]">sarastradingpost@gmail.com</p>
            <p className="mt-1 text-xs text-[var(--s-ink-soft)]">The fastest way to reach us.</p>
          </a>
          <div className="rounded-2xl border border-[var(--s-line)] bg-white p-6 s-shadow">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--s-rose-soft)] text-[var(--s-wine)]"><Clock className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-base font-bold text-[var(--s-ink)]">Response time</h3>
            <p className="mt-1 text-sm text-[var(--s-ink-soft)]">Within one business day, every time.</p>
          </div>
          <div className="rounded-2xl border border-[var(--s-line)] bg-[var(--s-wine)] p-6 text-white s-shadow">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><BadgeCheck className="h-5 w-5 text-[var(--s-gold-soft)]" /></span>
            <h3 className="mt-4 font-display text-base font-bold">Shop with confidence</h3>
            <p className="mt-1 text-sm text-[var(--s-rose-soft)]">99.8% positive feedback across 79,000+ orders. You&apos;re in good hands.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="mx-auto mt-16 max-w-3xl">
        <div className="text-center">
          <MessageCircle className="mx-auto h-7 w-7 text-[var(--s-wine)]" />
          <h2 className="mt-2 font-display text-3xl font-bold text-[var(--s-ink)]">Frequently asked</h2>
        </div>
        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-[var(--s-line)] bg-white">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="font-semibold text-[var(--s-ink)]">{f.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--s-wine)] transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--s-ink-soft)]">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Input({ label, v, on, type = "text", required }: { label: string; v: string; on: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold text-[var(--s-ink)]">{label}</label>
      <input
        type={type} value={v} onChange={(e) => on(e.target.value)} required={required}
        className="mt-1.5 w-full rounded-xl border border-[var(--s-line)] bg-white px-3.5 py-3 text-sm text-[var(--s-ink)] outline-none transition-colors focus:border-[var(--s-wine)]"
      />
    </div>
  );
}
