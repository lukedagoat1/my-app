"use client";

// Interaction FX for the storefront: pointer-tracked 3D tilt, scroll reveals,
// and a fly-to-cart animation. CSS 3D only — no extra dependencies.

import { useEffect, useRef, type ReactNode } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Pointer-tracked 3D tilt. Children at different translateZ get real parallax. */
export function Tilt({
  children,
  max = 10,
  className = "",
  glare = false,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const inner = el.firstElementChild as HTMLElement | null;
    const glow = el.querySelector<HTMLElement>("[data-glare]");
    if (!inner) return;

    function onMove(e: PointerEvent) {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        inner!.style.transform = `rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
        if (glow) {
          glow.style.opacity = "1";
          glow.style.background = `radial-gradient(320px circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, rgba(255,255,255,.35), transparent 60%)`;
        }
      });
    }
    function onLeave() {
      cancelAnimationFrame(frame.current);
      inner!.style.transform = "rotateX(0deg) rotateY(0deg)";
      if (glow) glow.style.opacity = "0";
    }
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame.current);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`s-persp ${className}`}>
      <div className="s-tilt-inner">
        {children}
        {glare && <div data-glare aria-hidden className="s-glare" />}
      </div>
    </div>
  );
}

/** Reveals children with a stagger when they scroll into view. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) { el.classList.add("s-io-in"); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("s-io-in"); io.unobserve(en.target); } }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`s-io ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

/** Animates a product image flying into the navbar cart icon. */
export function flyToCart(fromEl: HTMLElement | null, imgSrc: string) {
  if (!fromEl || reducedMotion()) return;
  const cart = document.querySelector("[data-cart-icon]");
  if (!cart) return;
  const from = fromEl.getBoundingClientRect();
  const to = cart.getBoundingClientRect();

  const ghost = document.createElement("img");
  ghost.src = imgSrc;
  ghost.alt = "";
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    objectFit: "cover",
    borderRadius: "14px",
    zIndex: "9999",
    pointerEvents: "none",
    transition: "all .7s cubic-bezier(.5,-0.1,.2,1)",
    boxShadow: "0 12px 40px rgba(122,47,67,.35)",
  } as CSSStyleDeclaration);
  document.body.appendChild(ghost);

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      Object.assign(ghost.style, {
        left: `${to.left + to.width / 2 - 12}px`,
        top: `${to.top + to.height / 2 - 12}px`,
        width: "24px",
        height: "24px",
        opacity: "0.2",
        transform: "rotate(12deg)",
      } as CSSStyleDeclaration);
    }),
  );
  ghost.addEventListener("transitionend", () => {
    ghost.remove();
    cart.classList.remove("s-cart-bump");
    void (cart as HTMLElement).offsetWidth; // restart animation
    cart.classList.add("s-cart-bump");
  }, { once: true });
}
