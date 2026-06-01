import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "How Sara's Trading Post collects, uses, and protects your personal information.",
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 font-display text-xl font-bold text-[var(--s-ink)] first:mt-0">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[15px] leading-relaxed text-[var(--s-ink-soft)]">{children}</p>
);
const Ul = ({ children }: { children: React.ReactNode }) => (
  <ul className="mt-3 space-y-1.5 pl-5 text-[15px] leading-relaxed text-[var(--s-ink-soft)] list-disc">{children}</ul>
);

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden s-hero-grad">
        <div className="absolute inset-0 s-mesh" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--s-gold-soft)] bg-white/70 px-4 py-1.5 text-xs font-semibold text-[var(--s-wine)]">
            <ShieldCheck className="h-3.5 w-3.5" /> Your data, handled with care
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-[var(--s-ink)] sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--s-ink-soft)]">
            Effective date: June 1, 2025 &nbsp;·&nbsp; Last updated: June 1, 2025
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-[var(--s-line)] bg-white p-8 sm:p-12 s-shadow">

          <H2>Who we are</H2>
          <P>
            Sara&apos;s Trading Post (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is an independent
            online reseller of authentic prestige beauty products. We operate at{" "}
            <strong className="text-[var(--s-ink)]">sarastradingpost.com</strong> and through our eBay store at{" "}
            <a
              href="https://www.ebay.com/str/sarastradingpost"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--s-wine)] underline"
            >
              ebay.com/str/sarastradingpost
            </a>. You can reach us at{" "}
            <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">
              sarastradingpost@gmail.com
            </a>.
          </P>

          <H2>Information we collect</H2>
          <P>When you place an order we collect:</P>
          <Ul>
            <li>Your name, email address, and shipping address</li>
            <li>Payment method details — processed and encrypted by our third-party payment
              processor; we never store full card numbers on our servers</li>
            <li>Order history (items, quantities, prices, order ID)</li>
          </Ul>
          <P>When you browse the site we may collect:</P>
          <Ul>
            <li>Standard web-server access logs (IP address, browser type, pages visited) — retained
              for security purposes only and not used for advertising</li>
            <li>Cart contents stored in your browser&apos;s <code className="rounded bg-[var(--s-cream-2)] px-1 text-sm">localStorage</code> — this data never leaves your device unless you complete a purchase</li>
          </Ul>
          <P>
            We do <strong className="text-[var(--s-ink)]">not</strong> use advertising cookies, tracking pixels,
            or third-party analytics services. We do not build profiles or sell your data.
          </P>

          <H2>How we use your information</H2>
          <Ul>
            <li>To process, fulfill, and ship your order</li>
            <li>To send your order confirmation and tracking information</li>
            <li>To respond to questions, return requests, or support inquiries</li>
            <li>To comply with legal obligations (tax records, fraud prevention)</li>
          </Ul>
          <P>
            We will not send you marketing emails without your explicit opt-in consent.
          </P>

          <H2>Third-party services</H2>
          <P>We use a small number of third-party services to operate this site:</P>
          <Ul>
            <li>
              <strong className="text-[var(--s-ink)]">Google Fonts</strong> — fonts are loaded from{" "}
              <code className="rounded bg-[var(--s-cream-2)] px-1 text-sm">fonts.googleapis.com</code>. Google
              may log your IP address when your browser requests a font file. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--s-wine)] underline"
              >
                Google&apos;s Privacy Policy
              </a>.
            </li>
            <li>
              <strong className="text-[var(--s-ink)]">Payment processor</strong> — payment card data is
              handled entirely by our PCI-DSS-compliant payment processor. We receive only your
              billing name and the last four digits of your card for display purposes.
            </li>
            <li>
              <strong className="text-[var(--s-ink)]">eBay</strong> — purchases made directly through our
              eBay store are governed by{" "}
              <a
                href="https://www.ebay.com/help/policies/member-behavior-policies/ebay-privacy-policy?id=4260"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--s-wine)] underline"
              >
                eBay&apos;s Privacy Policy
              </a>.
            </li>
          </Ul>

          <H2>Data retention &amp; security</H2>
          <P>
            Order records are retained for a minimum of seven years as required by US tax law.
            Personal data is stored using industry-standard encryption at rest and in transit (TLS/HTTPS).
            We restrict access to your personal information to individuals who need it to operate the business.
          </P>
          <P>
            Your cart and most-recent order confirmation are stored in your own browser (
            <code className="rounded bg-[var(--s-cream-2)] px-1 text-sm">localStorage</code> /
            <code className="rounded bg-[var(--s-cream-2)] px-1 text-sm ml-1">sessionStorage</code>)
            and are automatically cleared when you close your browser session or clear your browser data.
          </P>

          <H2>Your rights</H2>
          <P>You have the right to:</P>
          <Ul>
            <li><strong className="text-[var(--s-ink)]">Access</strong> — request a copy of the personal data we hold about you</li>
            <li><strong className="text-[var(--s-ink)]">Correction</strong> — ask us to correct inaccurate information</li>
            <li><strong className="text-[var(--s-ink)]">Deletion</strong> — request that we delete your personal data, subject to legal retention obligations</li>
            <li><strong className="text-[var(--s-ink)]">Opt-out of marketing</strong> — unsubscribe from any marketing communications at any time</li>
          </Ul>
          <P>
            California residents have additional rights under the California Consumer Privacy Act (CCPA),
            including the right to know what personal information is collected, the right to delete it, and
            the right to opt out of the sale of personal information.{" "}
            <strong className="text-[var(--s-ink)]">We do not sell personal information.</strong>
          </P>
          <P>
            To exercise any of these rights, email us at{" "}
            <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">
              sarastradingpost@gmail.com
            </a>. We will respond within 30 days.
          </P>

          <H2>Children&apos;s privacy</H2>
          <P>
            Our site is not directed at children under 13. We do not knowingly collect personal
            information from children. If you believe we have inadvertently collected such information,
            please contact us and we will delete it promptly.
          </P>

          <H2>Changes to this policy</H2>
          <P>
            We may update this policy from time to time. Material changes will be noted at the top
            of this page with an updated effective date. Continued use of the site after a change
            constitutes acceptance of the revised policy.
          </P>

          <H2>Contact</H2>
          <P>
            Questions or concerns about this policy? Email us at{" "}
            <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">
              sarastradingpost@gmail.com
            </a>{" "}
            or visit our{" "}
            <Link href="/contact" className="font-medium text-[var(--s-wine)] underline">contact page</Link>.
          </P>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-[var(--s-line)] pt-8 text-sm text-[var(--s-ink-soft)]">
            <Link href="/terms" className="text-[var(--s-wine)] hover:underline">Terms of Service</Link>
            <Link href="/policies" className="text-[var(--s-wine)] hover:underline">Store Policies</Link>
          </div>
        </div>
      </div>
    </>
  );
}
