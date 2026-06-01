"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Search, Sparkles } from "lucide-react";
import { useCartCount } from "@/lib/cart";

const links = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?cat=Makeup", label: "Makeup" },
  { href: "/shop?cat=Skincare", label: "Skincare" },
  { href: "/shop?cat=Fragrance", label: "Fragrance" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "Our Story" },
];

const phrases = [
  "Free beauty sample 🎁 with every order",
  "99.8% positive feedback · 79,000+ orders shipped",
  "100% authentic, guaranteed · or your money back",
  "Free tracked shipping over $75",
];

export default function Navbar() {
  const count = useCartCount();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [phrase, setPhrase] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setPhrase((p) => (p + 1) % phrases.length), 3800);
    return () => clearInterval(t);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="bg-[var(--s-wine-deep)] text-[var(--s-rose-soft)] text-[12.5px] tracking-wide">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-4 overflow-hidden">
          <Sparkles className="h-3.5 w-3.5 text-[var(--s-gold-soft)]" />
          <span key={phrase} className="s-pop font-medium">{phrases[phrase]}</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--s-cream)]/90 backdrop-blur-md border-b border-[var(--s-line)] s-shadow"
            : "bg-[var(--s-cream)] border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            className="lg:hidden -ml-1 p-2 text-[var(--s-ink)]"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--s-wine)] text-[var(--s-gold-soft)] font-display text-lg font-bold">
              S
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-[17px] font-bold text-[var(--s-ink)]">Sara&apos;s Trading Post</span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--s-ink-soft)]">Authentic Luxury Beauty</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="relative text-[13.5px] font-medium text-[var(--s-ink-soft)] transition-colors hover:text-[var(--s-wine)] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-[var(--s-wine)] after:transition-all hover:after:w-full"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link href="/shop" aria-label="Search" className="grid h-9 w-9 place-items-center rounded-full text-[var(--s-ink)] hover:bg-[var(--s-cream-2)] transition-colors">
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative grid h-9 w-9 place-items-center rounded-full text-[var(--s-ink)] hover:bg-[var(--s-cream-2)] transition-colors"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {mounted && count > 0 && (
                <span className="s-pop absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--s-wine)] px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-[var(--s-line)] bg-[var(--s-cream)] px-4 pb-4 pt-2">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="block rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--s-ink)] hover:bg-[var(--s-cream-2)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
