import Link from "next/link";
import {
  ShieldCheck, Truck, BadgeCheck, Gift, ArrowRight, Star, Quote, Sparkles, Heart, Lock,
} from "lucide-react";
import { products, brands } from "@/lib/products";
import { reviews, trustStats } from "@/lib/reviews";
import ProductCard from "@/components/store/ProductCard";
import { ProductImage, StarRating } from "@/components/store/bits";

const bestsellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
const heroPicks = [...products].filter((p) => p.bestseller).slice(0, 3);

const catCards = [
  { name: "Makeup", href: "/shop?cat=Makeup", blurb: "Foundation, lips, eyes & cheeks", img: products.find((p) => p.category === "Makeup" && p.bestseller)?.image ?? products.find((p) => p.category === "Makeup")?.image },
  { name: "Skincare", href: "/shop?cat=Skincare", blurb: "Serums, SPF, moisturizers & more", img: products.find((p) => p.category === "Skincare" && p.bestseller)?.image ?? products.find((p) => p.category === "Skincare")?.image },
  { name: "Fragrance", href: "/shop?cat=Fragrance", blurb: "Signature scents, sealed & authentic", img: products.find((p) => p.category === "Fragrance")?.image },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden s-hero-grad">
        <div className="absolute inset-0 s-mesh" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-14 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-20">
          <div className="s-reveal">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--s-gold-soft)] bg-white/70 px-4 py-1.5 text-xs font-semibold text-[var(--s-wine)]">
              <Sparkles className="h-3.5 w-3.5" /> 99.8% positive across 79,000+ orders
            </span>
            <h1 className="mt-5 font-display text-[42px] font-bold leading-[1.05] text-[var(--s-ink)] sm:text-6xl">
              Luxury beauty,
              <br />
              <span className="s-gold-text italic">resold with love.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--s-ink-soft)]">
              100% authentic prestige makeup, skincare &amp; fragrance — Estée Lauder, Tom Ford,
              CHANEL, Pat McGrath and more, at a fraction of department-store prices. Every order is
              hand-checked, beautifully packed, and ships with a free beauty sample.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--s-wine)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--s-wine-deep)] s-shadow"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--s-line)] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--s-ink)] transition-colors hover:border-[var(--s-wine)]"
              >
                <Star className="h-4 w-4 fill-[var(--s-gold)] text-[var(--s-gold)]" /> Read 79k+ reviews
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[var(--s-ink-soft)]">
              <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-[var(--s-wine)]" /> 100% Authentic</span>
              <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-[var(--s-wine)]" /> Fast tracked shipping</span>
              <span className="flex items-center gap-1.5"><Gift className="h-4 w-4 text-[var(--s-wine)]" /> Free beauty sample every order</span>
            </div>
          </div>

          {/* Hero product collage */}
          <div className="s-reveal relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: "120ms" }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {heroPicks[0] && <HeroTile id={heroPicks[0].id} img={heroPicks[0].image} title={heroPicks[0].title} brand={heroPicks[0].brand} tall />}
                {heroPicks[1] && <HeroTile id={heroPicks[1].id} img={heroPicks[1].image} title={heroPicks[1].title} brand={heroPicks[1].brand} />}
              </div>
              <div className="space-y-4 pt-10">
                {heroPicks[2] && <HeroTile id={heroPicks[2].id} img={heroPicks[2].image} title={heroPicks[2].title} brand={heroPicks[2].brand} />}
                <div className="rounded-2xl bg-[var(--s-wine)] p-5 text-white s-shadow-lg">
                  <div className="flex items-center gap-1 text-[var(--s-gold-soft)]">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold leading-none">99.8%</p>
                  <p className="text-xs text-[var(--s-rose-soft)]">positive feedback from real buyers</p>
                </div>
              </div>
            </div>
            <div className="s-float absolute -bottom-5 -left-5 hidden rounded-2xl bg-white px-4 py-3 s-shadow-lg sm:block">
              <p className="flex items-center gap-2 text-xs font-semibold text-[var(--s-ink)]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-green-100 text-green-700"><Lock className="h-3.5 w-3.5" /></span>
                Authenticity guaranteed
              </p>
            </div>
          </div>
        </div>

        {/* brand marquee */}
        <div className="relative border-y border-[var(--s-line)] bg-white/60 py-4">
          <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="s-marquee flex shrink-0 items-center gap-12 pr-12">
              {[...brands, ...brands].map((b, i) => (
                <span key={i} className="whitespace-nowrap font-display text-lg font-medium text-[var(--s-ink-soft)]">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STATS */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trustStats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[var(--s-line)] bg-white p-6 text-center s-shadow">
              <p className="font-display text-3xl font-bold text-[var(--s-wine)]">{s.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--s-ink-soft)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        <SectionHeading eyebrow="Shop by category" title="Find your next obsession" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {catCards.map((c) => (
            <Link key={c.name} href={c.href} className="s-card-hover group relative overflow-hidden rounded-3xl border border-[var(--s-line)] bg-white s-shadow">
              <div className="aspect-[5/4] overflow-hidden bg-[var(--s-cream-2)]">
                {c.img && <ProductImage src={c.img} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--s-wine-deep)]/85 via-[var(--s-wine-deep)]/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-2xl font-bold">{c.name}</h3>
                <p className="mt-1 text-sm text-white/85">{c.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Shop now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Customer favorites" title="This month's bestsellers" />
          <Link href="/shop" className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--s-wine)] hover:gap-2.5 sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {bestsellers.map((p, i) => (
            <div key={p.id} className="s-reveal" style={{ animationDelay: `${i * 50}ms` }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* WHY TRUST US */}
      <section className="bg-[var(--s-wine-deep)] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--s-gold-soft)]">Why thousands trust Sara</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Buy prestige beauty without the worry</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--s-rose-soft)]">
              Ten years of five-star service, built one happy customer at a time. Here&apos;s our promise on every single order.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: BadgeCheck, t: "100% Authentic — guaranteed", d: "Every item is sourced, inspected and batch-verified by hand. If it isn't genuine, your money back. No questions, ever." },
              { icon: Truck, t: "Carefully packed, quickly shipped", d: "Bubble-wrapped, tissue-lined and shipped fast with tracking. 79,000+ orders delivered with a 99.8% positive rating." },
              { icon: Heart, t: "Real human, real care", d: "Sara personally answers every message and tucks a free beauty sample into each order. You're never just an order number here." },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--s-gold)] text-[var(--s-wine-deep)]"><f.icon className="h-6 w-6" /></span>
                <h3 className="mt-5 font-display text-xl font-bold">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--s-rose-soft)]">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <SectionHeading center eyebrow="Loved by real buyers" title="Don't just take our word for it" />
          <div className="mt-4 flex items-center justify-center gap-2">
            <StarRating value={5} size={18} />
            <span className="text-sm font-medium text-[var(--s-ink-soft)]">4.9 average · 99.8% positive feedback</span>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <figure key={r.name} className="flex flex-col rounded-2xl border border-[var(--s-line)] bg-white p-6 s-shadow">
              <Quote className="h-7 w-7 text-[var(--s-rose)]" />
              <StarRating value={r.rating} size={14} />
              <figcaption className="mt-3 font-display text-base font-bold text-[var(--s-ink)]">{r.title}</figcaption>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--s-ink-soft)]">{r.body}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-[var(--s-line)] pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--s-rose-soft)] text-xs font-bold text-[var(--s-wine)]">{r.initials}</span>
                <div className="text-xs">
                  <p className="font-semibold text-[var(--s-ink)]">{r.name}</p>
                  <p className="text-[var(--s-ink-soft)]">{r.location} · <span className="text-green-700">✓ Verified buyer</span></p>
                </div>
              </div>
            </figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/reviews" className="inline-flex items-center gap-2 rounded-full border border-[var(--s-line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--s-ink)] hover:border-[var(--s-wine)]">
            See all customer reviews <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* GUARANTEE STRIP */}
      <section className="border-y border-[var(--s-line)] bg-[var(--s-cream-2)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BadgeCheck, t: "Authenticity guarantee" },
            { icon: ShieldCheck, t: "Secure encrypted checkout" },
            { icon: Truck, t: "Fast, fully tracked shipping" },
            { icon: Gift, t: "Free beauty sample with every order" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[var(--s-wine)] s-shadow"><f.icon className="h-5 w-5" /></span>
              <span className="text-sm font-semibold text-[var(--s-ink)]">{f.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--s-wine)] px-8 py-14 text-center text-white s-shadow-lg sm:px-16">
          <div className="absolute inset-0 s-mesh opacity-40" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to treat yourself?</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-[var(--s-rose-soft)]">
              Authentic luxury beauty, unbeatable prices, and a free beauty sample waiting in every order.
            </p>
            <Link href="/shop" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[var(--s-wine)] transition-transform hover:scale-[1.03]">
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-xs text-[var(--s-rose-soft)]">Questions? Email <a href="mailto:sarastradingpost@gmail.com" className="underline">sarastradingpost@gmail.com</a></p>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroTile({ id, img, title, brand, tall }: { id: string; img: string; title: string; brand: string; tall?: boolean }) {
  return (
    <Link href={`/product/${id}`} className={`s-shine-wrap group overflow-hidden rounded-2xl border border-[var(--s-line)] bg-white s-shadow ${tall ? "row-span-2" : ""}`}>
      <div className={`overflow-hidden bg-[var(--s-cream-2)] ${tall ? "aspect-[3/4]" : "aspect-square"}`}>
        <ProductImage src={img} alt={title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--s-wine)]">{brand}</p>
        <p className="line-clamp-1 text-xs text-[var(--s-ink-soft)]">{title}</p>
      </div>
    </Link>
  );
}

function SectionHeading({ eyebrow, title, center }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--s-wine)]">{eyebrow}</span>
      <h2 className="mt-2 font-display text-3xl font-bold text-[var(--s-ink)] sm:text-4xl">{title}</h2>
    </div>
  );
}
