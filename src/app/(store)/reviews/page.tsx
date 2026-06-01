import Link from "next/link";
import { Quote, BadgeCheck, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { reviews, trustStats } from "@/lib/reviews";
import { StarRating } from "@/components/store/bits";

export const metadata = {
  title: "Customer Reviews",
  description: "Read real customer reviews for Sara's Trading Post — 99.8% positive feedback across 79,000+ authentic luxury beauty orders.",
};

const ratingBreakdown = [
  { stars: 5, pct: 96 },
  { stars: 4, pct: 3 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 0 },
  { stars: 1, pct: 0 },
];

// Extra short feedback snippets to flesh out the wall of love.
const snippets = [
  { name: "Olivia S.", text: "Authentic, fast, and so pretty when it arrived. 10/10.", initials: "OS" },
  { name: "Renee B.", text: "Found a discontinued shade I'd given up on. Thank you Sara!", initials: "RB" },
  { name: "Kayla W.", text: "Better than buying at the counter — same product, way less.", initials: "KW" },
  { name: "Priya N.", text: "The free beauty sample gets me every time. Such a kind seller.", initials: "PN" },
  { name: "Grace L.", text: "Sealed, fresh batch codes, perfect packaging. Trustworthy.", initials: "GL" },
  { name: "Monica D.", text: "Third order, never disappointed. Highly recommend.", initials: "MD" },
];

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--s-wine)]">Reviews &amp; feedback</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-[var(--s-ink)] sm:text-5xl">Loved by 79,000+ customers</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-[var(--s-ink-soft)]">
          Carried over from a decade of five-star eBay feedback. Here&apos;s what real buyers say about
          shopping with Sara&apos;s Trading Post.
        </p>
      </div>

      {/* rating summary */}
      <div className="mt-10 grid gap-6 rounded-3xl border border-[var(--s-line)] bg-white p-8 s-shadow md:grid-cols-[260px_1fr] md:items-center">
        <div className="text-center md:border-r md:border-[var(--s-line)]">
          <p className="font-display text-6xl font-bold text-[var(--s-ink)]">4.9</p>
          <div className="mt-2 flex justify-center"><StarRating value={4.9} size={20} /></div>
          <p className="mt-2 text-sm text-[var(--s-ink-soft)]">99.8% positive · 79,000+ orders</p>
        </div>
        <div className="space-y-2">
          {ratingBreakdown.map((r) => (
            <div key={r.stars} className="flex items-center gap-3 text-sm">
              <span className="flex w-12 items-center gap-1 text-[var(--s-ink-soft)]">{r.stars} <Star className="h-3.5 w-3.5 fill-[var(--s-gold)] text-[var(--s-gold)]" /></span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--s-cream-2)]">
                <div className="h-full rounded-full bg-[var(--s-gold)]" style={{ width: `${r.pct}%` }} />
              </div>
              <span className="w-9 text-right text-xs text-[var(--s-ink-soft)]">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* trust stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {trustStats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--s-line)] bg-white p-5 text-center s-shadow">
            <p className="font-display text-2xl font-bold text-[var(--s-wine)]">{s.value}</p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[var(--s-ink-soft)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* full reviews */}
      <div className="mt-12 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
        {reviews.map((r) => (
          <figure key={r.name} className="break-inside-avoid rounded-2xl border border-[var(--s-line)] bg-white p-6 s-shadow">
            <div className="flex items-center justify-between">
              <StarRating value={r.rating} size={15} />
              <span className="text-xs text-[var(--s-ink-soft)]">{r.date}</span>
            </div>
            <Quote className="mt-3 h-6 w-6 text-[var(--s-rose)]" />
            <figcaption className="mt-1 font-display text-base font-bold text-[var(--s-ink)]">{r.title}</figcaption>
            <p className="mt-2 text-sm leading-relaxed text-[var(--s-ink-soft)]">{r.body}</p>
            {r.item && <p className="mt-3 rounded-lg bg-[var(--s-cream-2)] px-3 py-1.5 text-xs text-[var(--s-ink-soft)]">Purchased: {r.item}</p>}
            <div className="mt-4 flex items-center gap-3 border-t border-[var(--s-line)] pt-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--s-rose-soft)] text-xs font-bold text-[var(--s-wine)]">{r.initials}</span>
              <div className="text-xs">
                <p className="font-semibold text-[var(--s-ink)]">{r.name}</p>
                <p className="flex items-center gap-1 text-green-700"><BadgeCheck className="h-3.5 w-3.5" /> Verified buyer · {r.location}</p>
              </div>
            </div>
          </figure>
        ))}
      </div>

      {/* snippet wall */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {snippets.map((s) => (
          <div key={s.name} className="flex items-start gap-3 rounded-2xl border border-[var(--s-line)] bg-[var(--s-cream-2)] p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-[var(--s-wine)]">{s.initials}</span>
            <div>
              <div className="flex items-center gap-1 text-[var(--s-gold)]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div>
              <p className="mt-1 text-sm text-[var(--s-ink)]">&ldquo;{s.text}&rdquo;</p>
              <p className="mt-1 text-xs font-semibold text-[var(--s-ink-soft)]">{s.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* cta */}
      <div className="mt-14 rounded-3xl bg-[var(--s-wine)] px-8 py-12 text-center text-white">
        <ShieldCheck className="mx-auto h-8 w-8 text-[var(--s-gold-soft)]" />
        <h2 className="mt-3 font-display text-3xl font-bold">Join thousands of happy customers</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--s-rose-soft)]">Authentic luxury beauty, backed by a 99.8% positive track record.</p>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--s-wine)] hover:scale-[1.03] transition-transform">
          Shop with confidence <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
