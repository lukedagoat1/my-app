import Link from "next/link";
import {
  RotateCcw, Truck, BadgeCheck, Gift, ShieldCheck, AlertCircle, CheckCircle2, XCircle,
  Clock, PackageCheck, Globe,
} from "lucide-react";

export const metadata = {
  title: "Policies",
  description:
    "Sara's Trading Post store policies — returns, shipping, authenticity guarantee, and free sample program. Everything you need to shop with confidence.",
};

const Section = ({
  id,
  icon: Icon,
  color,
  title,
  children,
}: {
  id?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div id={id} className="scroll-mt-24 rounded-3xl border border-[var(--s-line)] bg-white p-8 s-shadow">
    <div className="flex items-center gap-3">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${color}`}>
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="font-display text-2xl font-bold text-[var(--s-ink)]">{title}</h2>
    </div>
    <div className="mt-6">{children}</div>
  </div>
);

const Row = ({
  icon: Icon,
  color,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  text: React.ReactNode;
}) => (
  <li className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--s-ink-soft)]">
    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
    <span>{text}</span>
  </li>
);

export default function PoliciesPage() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden s-hero-grad">
        <div className="absolute inset-0 s-mesh" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--s-gold-soft)] bg-white/70 px-4 py-1.5 text-xs font-semibold text-[var(--s-wine)]">
            <ShieldCheck className="h-3.5 w-3.5" /> Clear policies, no surprises
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-[var(--s-ink)] sm:text-5xl">
            Store Policies
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--s-ink-soft)]">
            Everything you need to know before you buy — returns, shipping, authenticity, and more.
            Questions?{" "}
            <a href="mailto:sarastradingpost@gmail.com" className="font-semibold text-[var(--s-wine)] underline">
              Email Sara directly
            </a>.
          </p>
        </div>
      </section>

      {/* policy cards */}
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-16">

        {/* returns */}
        <Section id="returns" icon={RotateCcw} color="bg-[var(--s-rose-soft)] text-[var(--s-wine)]" title="Returns &amp; Refunds">
          <ul className="space-y-4">
            <Row
              icon={CheckCircle2}
              color="text-green-600"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">30-day return window.</strong> Returns are accepted
                  within 30 days of the delivery date.
                </>
              }
            />
            <Row
              icon={CheckCircle2}
              color="text-green-600"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">Original condition required.</strong> Items must be
                  new, unopened, and untested, in all original packaging with any tags or seals intact.
                </>
              }
            />
            <Row
              icon={AlertCircle}
              color="text-amber-500"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">20% restocking fee.</strong> A 20% restocking fee
                  applies to all returns except those resulting from our error or a defective item.
                </>
              }
            />
            <Row
              icon={XCircle}
              color="text-red-500"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">No returns on opened products.</strong> For hygiene
                  and safety reasons, we cannot accept returns on any item that has been opened, used,
                  swatched, or had its seal broken.
                </>
              }
            />
            <Row
              icon={XCircle}
              color="text-red-500"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">Fragrances are final sale.</strong> Due to the
                  nature of perfume and parfum, all fragrance purchases are non-returnable and
                  non-refundable unless received damaged or not as described.
                </>
              }
            />
            <Row
              icon={CheckCircle2}
              color="text-green-600"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">Contact Sara first.</strong> Please email{" "}
                  <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">
                    sarastradingpost@gmail.com
                  </a>{" "}
                  before opening a return case. We handle every situation personally and will make it right.
                </>
              }
            />
          </ul>
        </Section>

        {/* shipping */}
        <Section id="shipping" icon={Truck} color="bg-blue-50 text-blue-600" title="Shipping">
          <ul className="space-y-4">
            <Row
              icon={Clock}
              color="text-[var(--s-wine)]"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">Same or next business day dispatch.</strong> Orders
                  placed before 2 pm on a business day typically ship the same day. All others ship
                  the next business day.
                </>
              }
            />
            <Row
              icon={PackageCheck}
              color="text-[var(--s-wine)]"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">Full tracking on every order.</strong> You will
                  receive a tracking number as soon as your parcel is collected. Every shipment is
                  carefully bubble-wrapped and secured before dispatch.
                </>
              }
            />
            <Row
              icon={CheckCircle2}
              color="text-green-600"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">Expedited options available.</strong> Need it
                  faster? Expedited and priority shipping upgrades are available at checkout.
                </>
              }
            />
            <Row
              icon={Globe}
              color="text-[var(--s-wine)]"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">International shipping.</strong> We ship worldwide
                  via eBay&apos;s International Standard Shipping program. Delivery times and import
                  duties vary by destination country.
                </>
              }
            />
          </ul>
        </Section>

        {/* authenticity */}
        <Section id="authenticity" icon={BadgeCheck} color="bg-green-50 text-green-700" title="Authenticity Guarantee">
          <ul className="space-y-4">
            <Row
              icon={BadgeCheck}
              color="text-green-600"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">100% authentic, always.</strong> Every product
                  listed is 100% genuine. We source directly from authorized retailers, department
                  stores, and brand-authorized channels — never from grey-market or unverified suppliers.
                </>
              }
            />
            <Row
              icon={CheckCircle2}
              color="text-green-600"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">Hand-inspected before it ships.</strong> Sara
                  personally inspects and batch-verifies each item before listing. Products are
                  sanitized and sealed for transit.
                </>
              }
            />
            <Row
              icon={CheckCircle2}
              color="text-green-600"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">Smoke-free, climate-controlled storage.</strong>{" "}
                  All inventory is stored in a clean, smoke-free, climate-controlled environment to
                  preserve product integrity.
                </>
              }
            />
            <Row
              icon={ShieldCheck}
              color="text-green-600"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">Full refund if not genuine.</strong> In the
                  extremely unlikely event that you receive an item you believe is not authentic,
                  contact us immediately. We will issue a full refund — no questions asked.
                </>
              }
            />
          </ul>
        </Section>

        {/* free sample */}
        <Section id="sample" icon={Gift} color="bg-[var(--s-gold-soft)]/40 text-[var(--s-gold)]" title="Free Beauty Sample">
          <ul className="space-y-4">
            <Row
              icon={Gift}
              color="text-[var(--s-wine)]"
              text={
                <>
                  <strong className="text-[var(--s-ink)]">A surprise sample in every order.</strong> As
                  a thank-you for shopping with us, we include a complimentary high-end prestige
                  beauty sample with every single order — no minimum spend required.
                </>
              }
            />
            <Row
              icon={CheckCircle2}
              color="text-green-600"
              text={
                <>
                  Samples are genuine, full-quality products from prestige brands — the same ones
                  we carry. Think of it as a little gift from Sara to you.
                </>
              }
            />
          </ul>
        </Section>

        {/* legal links */}
        <div className="rounded-2xl border border-[var(--s-line)] bg-white p-6 text-sm text-[var(--s-ink-soft)]">
          <p className="font-semibold text-[var(--s-ink)]">Legal</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <Link href="/terms" className="text-[var(--s-wine)] hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="text-[var(--s-wine)] hover:underline">Privacy Policy</Link>
          </div>
        </div>

        {/* contact cta */}
        <div className="rounded-3xl border border-[var(--s-gold-soft)] bg-gradient-to-br from-[var(--s-cream)] to-white p-8 text-center s-shadow">
          <h2 className="font-display text-2xl font-bold text-[var(--s-ink)]">Still have a question?</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-[var(--s-ink-soft)]">
            Sara reads and replies to every message personally, usually within one business day.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:sarastradingpost@gmail.com"
              className="rounded-full bg-[var(--s-wine)] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[var(--s-wine-deep)]"
            >
              Email Sara
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-[var(--s-line)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--s-ink)] hover:border-[var(--s-wine)]"
            >
              Contact page
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
