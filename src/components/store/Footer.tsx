import Link from "next/link";
import { Mail, ShieldCheck, Truck, BadgeCheck, Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--s-line)] bg-[var(--s-cream-2)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--s-wine)] text-[var(--s-gold-soft)] font-display text-lg font-bold">S</span>
            <span className="font-display text-[17px] font-bold text-[var(--s-ink)]">Sara&apos;s Trading Post</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--s-ink-soft)]">
            Authentic prestige beauty, hand-checked and resold with love. Trusted by thousands of
            beauty lovers since our first eBay sale.
          </p>
          <div className="mt-4 flex items-center gap-1 text-[var(--s-gold)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
            <span className="ml-2 text-xs font-medium text-[var(--s-ink-soft)]">99.8% positive · 3.3K followers</span>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-[var(--s-ink)]">Shop</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--s-ink-soft)]">
            <li><Link href="/shop" className="hover:text-[var(--s-wine)]">All Products</Link></li>
            <li><Link href="/shop?cat=Makeup" className="hover:text-[var(--s-wine)]">Makeup</Link></li>
            <li><Link href="/shop?cat=Skincare" className="hover:text-[var(--s-wine)]">Skincare</Link></li>
            <li><Link href="/shop?cat=Fragrance" className="hover:text-[var(--s-wine)]">Fragrance</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-[var(--s-ink)]">Help</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--s-ink-soft)]">
            <li><Link href="/about" className="hover:text-[var(--s-wine)]">Our Story</Link></li>
            <li><Link href="/reviews" className="hover:text-[var(--s-wine)]">Customer Reviews</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--s-wine)]">Contact Us</Link></li>
            <li><Link href="/policies" className="hover:text-[var(--s-wine)]">Returns &amp; Policies</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-[var(--s-ink)]">Questions?</h4>
          <p className="mt-4 text-sm text-[var(--s-ink-soft)]">We reply within one business day.</p>
          <a
            href="mailto:sarastradingpost@gmail.com"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--s-wine)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--s-wine-deep)]"
          >
            <Mail className="h-4 w-4" /> sarastradingpost@gmail.com
          </a>
        </div>
      </div>

      <div className="border-t border-[var(--s-line)]">
        <div className="mx-auto grid max-w-7xl gap-3 px-6 py-6 text-xs text-[var(--s-ink-soft)] sm:grid-cols-3">
          <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[var(--s-wine)]" /> 100% Authentic Guarantee</span>
          <span className="flex items-center gap-2 sm:justify-center"><Truck className="h-4 w-4 text-[var(--s-wine)]" /> Fast, Tracked Shipping</span>
          <span className="flex items-center gap-2 sm:justify-end"><ShieldCheck className="h-4 w-4 text-[var(--s-wine)]" /> Secure Checkout</span>
        </div>
      </div>
      <div className="border-t border-[var(--s-line)] px-6 py-5 text-center text-xs text-[var(--s-ink-soft)]">
        <p>© {new Date().getFullYear()} Sara&apos;s Trading Post. All rights reserved. An independent reseller of authentic prestige beauty.</p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link href="/terms" className="hover:text-[var(--s-wine)]">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-[var(--s-wine)]">Privacy Policy</Link>
          <Link href="/policies" className="hover:text-[var(--s-wine)]">Store Policies</Link>
        </p>
        <p className="mt-2 text-[11px] text-[var(--s-ink-soft)]/70">
          Not affiliated with or endorsed by Estée Lauder, CHANEL, Tom Ford, YSL, Pat McGrath Labs, BareMinerals, Lancôme, IMAGE Skincare, or any other brand whose products appear on this site.
        </p>
      </div>
    </footer>
  );
}
