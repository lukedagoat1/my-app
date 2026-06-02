"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin } from "lucide-react";

interface Suggestion {
  label: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (fields: { address: string; city: string; state: string; zip: string }) => void;
  error?: string;
  placeholder?: string;
}

export default function AddressAutocomplete({ value, onChange, onSelect, error, placeholder }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 4) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/address-search?q=${encodeURIComponent(q)}`);
      const data: Suggestion[] = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(val: string) {
    onChange(val);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 320);
  }

  function handleSelect(s: Suggestion) {
    onChange(s.line1);
    onSelect({ address: s.line1, city: s.city, state: s.state, zip: s.zip });
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && activeIndex >= 0) { e.preventDefault(); handleSelect(suggestions[activeIndex]); }
    if (e.key === "Escape") { setOpen(false); }
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="text-xs font-semibold text-[var(--s-ink)]">Address</label>
      <div className="relative mt-1.5">
        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--s-ink-soft)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder ?? "Start typing your address…"}
          autoComplete="off"
          className={`w-full rounded-xl border bg-white py-3 pl-9 pr-3.5 text-sm text-[var(--s-ink)] outline-none transition-colors placeholder:text-[var(--s-ink-soft)]/60 focus:border-[var(--s-wine)] ${error ? "border-red-400" : "border-[var(--s-line)]"}`}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-[var(--s-wine)] border-t-transparent" />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-[var(--s-line)] bg-white shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex cursor-pointer items-start gap-2.5 px-4 py-3 text-sm transition-colors ${
                i === activeIndex ? "bg-[var(--s-rose-soft)] text-[var(--s-wine)]" : "text-[var(--s-ink)] hover:bg-[var(--s-rose-soft)]/50"
              }`}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--s-wine)]" />
              <span className="line-clamp-1">{s.label}</span>
            </li>
          ))}
          <li className="border-t border-[var(--s-line)] px-4 py-2 text-[10px] text-[var(--s-ink-soft)]">
            © OpenStreetMap contributors
          </li>
        </ul>
      )}
    </div>
  );
}
