import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for purchasing from Sara's Trading Post.",
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

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden s-hero-grad">
        <div className="absolute inset-0 s-mesh" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--s-gold-soft)] bg-white/70 px-4 py-1.5 text-xs font-semibold text-[var(--s-wine)]">
            <FileText className="h-3.5 w-3.5" /> Plain-English terms
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-[var(--s-ink)] sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--s-ink-soft)]">
            Effective date: June 1, 2025 &nbsp;·&nbsp; Last updated: June 1, 2025
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-[var(--s-line)] bg-white p-8 sm:p-12 s-shadow">

          <H2>Agreement to terms</H2>
          <P>
            By accessing or purchasing from sarastradingpost.com (&quot;the Site&quot;), you agree to
            be bound by these Terms of Service. If you do not agree, please do not use the Site.
            We reserve the right to update these terms at any time; continued use of the Site after
            changes are posted constitutes acceptance.
          </P>

          <H2>About Sara&apos;s Trading Post</H2>
          <P>
            Sara&apos;s Trading Post is an <strong className="text-[var(--s-ink)]">independent reseller</strong>{" "}
            of authentic, pre-owned-stock and new prestige beauty products. We are not affiliated with,
            sponsored by, or endorsed by any of the brands whose products we sell, including but not
            limited to Estée Lauder, CHANEL, Tom Ford, YSL, Pat McGrath Labs, BareMinerals, IMAGE
            Skincare, Lancôme, Dior, Givenchy, Gucci, Clinique, Smashbox, IT Cosmetics, ISDIN,
            Obagi, Eminence, Peter Thomas Roth, Charlotte Tilbury, Fenty, or Nakery Beauty.
          </P>
          <P>
            Brand names and trademarks are used solely for the purpose of accurately identifying the
            products being resold. The resale of genuine goods is lawful under the{" "}
            <strong className="text-[var(--s-ink)]">first sale doctrine</strong> (17 U.S.C. § 109).
          </P>

          <H2>Products &amp; pricing</H2>
          <P>
            All products listed are 100% authentic and sourced from authorized retailers, department
            stores, or brand-authorized channels. Product descriptions, images, and prices are
            provided in good faith and are subject to change without notice.
          </P>
          <P>
            Prices are displayed in US dollars. We reserve the right to correct pricing errors and
            to cancel any order placed at an incorrect price.
          </P>
          <P>
            Some products are listed as &quot;Rare / Discontinued&quot; or &quot;New &amp; Sealed.&quot;
            These descriptions reflect our good-faith assessment of the item&apos;s condition and
            availability. Discontinued status is based on publicly available brand information and may
            change.
          </P>

          <H2>Orders &amp; payment</H2>
          <P>
            Submitting an order constitutes an offer to purchase. We reserve the right to refuse or
            cancel any order for any reason, including but not limited to product unavailability,
            suspected fraud, or errors in product or pricing information. You will be notified and
            any charge will be fully refunded.
          </P>
          <P>
            Payment is processed by a third-party PCI-DSS-compliant payment processor. We do not
            store your full card number. By completing a purchase, you represent that you are
            authorized to use the payment method provided.
          </P>

          <H2>Shipping &amp; delivery</H2>
          <P>
            We ship from the United States. Estimated delivery times are not guaranteed and may vary
            due to carrier delays, weather, holidays, or customs processing for international orders.
            Risk of loss passes to you upon carrier pickup.
          </P>
          <P>
            International buyers are responsible for any applicable customs duties, taxes, or import
            fees. These charges are not included in our prices.
          </P>
          <P>See our <Link href="/policies#shipping" className="font-medium text-[var(--s-wine)] underline">Shipping Policy</Link> for full details.</P>

          <H2>Returns &amp; refunds</H2>
          <P>
            Returns are accepted within 30 days of delivery on new, unopened, untested items in
            original packaging. A 20% restocking fee applies. Opened products and fragrances are
            final sale. Full details are in our{" "}
            <Link href="/policies#returns" className="font-medium text-[var(--s-wine)] underline">Return Policy</Link>.
          </P>

          <H2>Authenticity guarantee</H2>
          <P>
            We guarantee the authenticity of every product we sell. If you receive an item that is
            not as described or that you reasonably believe is not genuine, contact us at{" "}
            <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">
              sarastradingpost@gmail.com
            </a>{" "}
            within 30 days of delivery for a full refund.
          </P>

          <H2>Intellectual property</H2>
          <P>
            All original content on this Site — including text, design, graphics, and the overall
            look and feel — is the property of Sara&apos;s Trading Post and may not be reproduced
            without written permission. Third-party brand names, logos, and trademarks displayed in
            product listings are the property of their respective owners and are used solely for
            product identification purposes.
          </P>

          <H2>User conduct</H2>
          <P>You agree not to:</P>
          <Ul>
            <li>Use the Site for any unlawful purpose or in violation of any applicable law</li>
            <li>Attempt to gain unauthorized access to any portion of the Site or its related systems</li>
            <li>Submit false, misleading, or fraudulent information</li>
            <li>Use automated tools (bots, scrapers) to access or copy content from the Site without our consent</li>
          </Ul>

          <H2>Disclaimer of warranties</H2>
          <P>
            The Site and its content are provided &quot;as is&quot; and &quot;as available&quot; without
            warranties of any kind, express or implied, including but not limited to implied warranties
            of merchantability, fitness for a particular purpose, or non-infringement. We do not
            warrant that the Site will be uninterrupted, error-free, or free of viruses.
          </P>
          <P>
            Product descriptions, images, and shade/color representations are provided in good faith
            but may vary slightly from the physical product due to differences in display settings
            and photography.
          </P>

          <H2>Limitation of liability</H2>
          <P>
            To the maximum extent permitted by applicable law, Sara&apos;s Trading Post shall not
            be liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of this Site or purchase of products, even if we have been advised
            of the possibility of such damages. Our total liability to you for any claim arising from
            a purchase shall not exceed the purchase price of the item in question.
          </P>

          <H2>Indemnification</H2>
          <P>
            You agree to indemnify and hold harmless Sara&apos;s Trading Post and its owner(s) from
            any claim, demand, loss, or expense (including reasonable attorneys&apos; fees) arising
            from your use of the Site, your violation of these Terms, or your infringement of any
            third-party rights.
          </P>

          <H2>Governing law &amp; disputes</H2>
          <P>
            These Terms are governed by the laws of the United States. Any disputes arising from
            these Terms or your use of the Site shall be resolved through good-faith negotiation
            first. If unresolved, disputes shall be submitted to binding arbitration in accordance
            with the rules of the American Arbitration Association, except that either party may
            seek injunctive relief in a court of competent jurisdiction.
          </P>

          <H2>Severability</H2>
          <P>
            If any provision of these Terms is found to be unenforceable, the remaining provisions
            will continue in full force and effect.
          </P>

          <H2>Contact</H2>
          <P>
            Questions about these Terms? Email us at{" "}
            <a href="mailto:sarastradingpost@gmail.com" className="font-medium text-[var(--s-wine)] underline">
              sarastradingpost@gmail.com
            </a>.
          </P>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-[var(--s-line)] pt-8 text-sm text-[var(--s-ink-soft)]">
            <Link href="/privacy" className="text-[var(--s-wine)] hover:underline">Privacy Policy</Link>
            <Link href="/policies" className="text-[var(--s-wine)] hover:underline">Store Policies</Link>
          </div>
        </div>
      </div>
    </>
  );
}
