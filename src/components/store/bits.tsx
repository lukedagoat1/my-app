"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarRating({ value, size = 14, showNum = false, count }: { value: number; size?: number; showNum?: boolean; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center" style={{ color: "var(--s-gold)" }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star className="absolute inset-0" style={{ width: size, height: size }} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="fill-current" style={{ width: size, height: size }} />
              </span>
            </span>
          );
        })}
      </div>
      {showNum && (
        <span className="text-xs font-medium text-[var(--s-ink-soft)]">
          {value.toFixed(1)}{count != null ? ` (${count})` : ""}
        </span>
      )}
    </div>
  );
}

export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (err || !src) {
    return (
      <div className={`grid place-items-center bg-[var(--s-rose-soft)] ${className}`}>
        <span className="font-display text-3xl text-[var(--s-wine)]/40">Sara&apos;s</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErr(true)}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}
