import Link from "next/link";
import {
  Heart, BadgeCheck, Gift, Sparkles, PackageCheck, MessageCircle, ArrowRight, Star,
} from "lucide-react";
import { trustStats } from "@/lib/reviews";
import { products } from "@/lib/products";
import { ProductImage } from "@/components/store/bits";

export const metadata = {
  title: "Our Story",
  description: "The story behind Sara's Trading Post — a one-woman beauty resale shop trusted by 79,000+ customers with 99.8% positive feedback.",
};

const gallery = products.filter((p) => p.bestseller).slice(0, 4);

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden s-hero-grad">
        <div className="absolute inset-0 s-mesh" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--s-gold-soft)] bg-white/70 px-4 py-1.5 text-xs font-semibold text-[var(--s-wine)]">
            <Heart className="h-3.5 w-3.5" /> Family-run since our very first sale
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-[var(--s-ink)] sm:text-5xl">
            Beauty you can trust,<br /><span className="s-gold-text italic">from someone who cares.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--s-ink-soft)]">
            Sara&apos;s Trading Post began as a small eBay shop with a simple idea: make genuine luxury
            beauty affordable, and treat every customer like a friend. Tens of thousands of orders later,
            that promise hasn&apos;t changed one bit.
          </p>
        </div>
      </section>

      {/* stats */}
      <section className="mx-auto -mt-8 max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-[var(--s-line)] bg-white p-6 s-shadow-lg sm:grid-cols-4">
          {trustStats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-[var(--s-wine)]">{s.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--s-ink-soft)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* story */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            {gallery.map((p, i) => (
              <div key={p.id} className={`overflow-hidden rounded-2xl border border-[var(--s-line)] bg-[var(--s-cream-2)] s-shadow ${i % 2 ? "mt-6" : ""}`}>
                <ProductImage src={p.image} alt={p.title} className="aspect-square h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--s-wine)]">Our story</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-[var(--s-ink)]">Real products, real people, real care</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-[var(--s-ink-soft)]">
              <p>
                What started in a spare room — carefully sourcing authentic, hard-to-find prestige makeup
                and skincare — has grown into one of eBay&apos;s most-loved beauty shops, with a{" "}
                <span className="font-semibold text-[var(--s-ink)]">99.8% positive feedback rating</span> across more than{" "}
                <span className="font-semibold text-[var(--s-ink)]">79,000 orders</span>.
              </p>
              <p>
                Every item is hand-inspected and batch-verified before it&apos;s listed. We hunt down
                discontinued favorites, sealed gift sets, and luxury staples from brands like Estée Lauder,
                Tom Ford, CHANEL, Pat McGrath and IMAGE Skincare — then pass the savings straight to you.
              </p>
              <p>
                And because little things matter, every single order ships beautifully wrapped with a free
                beauty sample tucked inside. It&apos;s our way of saying thank you.
              </p>
            </div>
            <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--s-wine)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--s-wine-deep)]">
              Explore the collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="bg-[var(--s-cream-2)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--s-wine)]">What we stand for</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-[var(--s-ink)] sm:text-4xl">Promises we keep on every order</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BadgeCheck, t: "Authentic, always", d: "Every product is genuine and inspected by hand. If it isn't, your money back — guaranteed." },
              { icon: PackageCheck, t: "Packed with care", d: "Bubble-wrapped, tissue-lined and shipped fast with full tracking on every parcel." },
              { icon: Gift, t: "A sample, every time", d: "A free beauty sample is included with each order — our small thank-you to you." },
              { icon: MessageCircle, t: "A real person replies", d: "Message Sara directly and get a thoughtful answer, usually within a day." },
            ].map((v) => (
              <div key={v.t} className="rounded-2xl border border-[var(--s-line)] bg-white p-6 s-shadow">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--s-rose-soft)] text-[var(--s-wine)]"><v.icon className="h-6 w-6" /></span>
                <h3 className="mt-4 font-display text-lg font-bold text-[var(--s-ink)]">{v.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--s-ink-soft)]">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-[var(--s-gold)]" />
        <h2 className="mt-3 font-display text-3xl font-bold text-[var(--s-ink)] sm:text-4xl">Come see why thousands keep coming back</h2>
        <div className="mt-3 flex items-center justify-center gap-1 text-[var(--s-gold)]">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="rounded-full bg-[var(--s-wine)] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[var(--s-wine-deep)]">Shop now</Link>
          <Link href="/reviews" className="rounded-full border border-[var(--s-line)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--s-ink)] hover:border-[var(--s-wine)]">Read reviews</Link>
        </div>
        <p className="mt-5 text-sm text-[var(--s-ink-soft)]">Questions? Email <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">sarastradingpost@gmail.com</a></p>
      </section>
    </>
  );
}
