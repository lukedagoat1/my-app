"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, Check, ChevronDown } from "lucide-react";
import { products as catalog, categories, brands, type Category } from "@/lib/products";
import { useCustomProducts, useHiddenIds } from "@/components/store/SalePriceProvider";
import ProductCard from "@/components/store/ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "rating" | "discount";

const sortLabels: Record<Sort, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Top Rated",
  discount: "Biggest Savings",
};

export default function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const custom = useCustomProducts();
  const hiddenIds = useHiddenIds();
  const products = useMemo(
    () => [...catalog.filter((p) => !hiddenIds.includes(p.id)), ...custom],
    [custom, hiddenIds],
  );
  const allBrands = useMemo(
    () => Array.from(new Set([...brands, ...custom.map((p) => p.brand)])).sort(),
    [custom],
  );

  const initialCat = (params.get("cat") as Category) || "All";
  const [cat, setCat] = useState<Category | "All">(initialCat);
  const [sub, setSub] = useState<string | null>(params.get("sub"));
  const [brand, setBrand] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [maxPrice, setMaxPrice] = useState(400);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    const c = (params.get("cat") as Category) || "All";
    setCat(c);
    setSub(params.get("sub"));
  }, [params]);

  const subOptions = useMemo(() => {
    if (cat === "All") return [];
    return categories.find((c) => c.name === cat)?.subs ?? [];
  }, [cat]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (sub && p.sub !== sub) return false;
      if (brand && p.brand !== brand) return false;
      if (p.price > maxPrice) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(`${p.title} ${p.brand} ${p.sub}`.toLowerCase().includes(q))) return false;
      }
      return true;
    });
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "discount": list = [...list].sort((a, b) => (1 - a.price / a.compareAt < 1 - b.price / b.compareAt ? 1 : -1)); break;
      default: list = [...list].sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.sold - a.sold);
    }
    return list;
  }, [products, cat, sub, brand, query, sort, maxPrice]);

  function pickCat(c: Category | "All") {
    setCat(c);
    setSub(null);
    const sp = new URLSearchParams();
    if (c !== "All") sp.set("cat", c);
    router.replace(`/shop${sp.toString() ? `?${sp}` : ""}`, { scroll: false });
  }

  const activeFilters = (cat !== "All" ? 1 : 0) + (sub ? 1 : 0) + (brand ? 1 : 0) + (query ? 1 : 0);

  const Filters = (
    <div className="space-y-7">
      <FilterGroup title="Category">
        {(["All", ...categories.map((c) => c.name)] as (Category | "All")[]).map((c) => (
          <FilterRadio key={c} label={c} active={cat === c} onClick={() => pickCat(c)} count={c === "All" ? products.length : products.filter((p) => p.category === c).length} />
        ))}
      </FilterGroup>

      {subOptions.length > 0 && (
        <FilterGroup title={`${cat} types`}>
          <FilterRadio label="All types" active={!sub} onClick={() => setSub(null)} />
          {subOptions.map((s) => (
            <FilterRadio key={s} label={s} active={sub === s} onClick={() => setSub(s)} count={products.filter((p) => p.sub === s).length} />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Brand">
        <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
          <FilterRadio label="All brands" active={!brand} onClick={() => setBrand(null)} />
          {allBrands.map((b) => (
            <FilterRadio key={b} label={b} active={brand === b} onClick={() => setBrand(b)} count={products.filter((p) => p.brand === b).length} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Max price">
        <input
          type="range" min={10} max={400} step={5} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--s-wine)]"
        />
        <div className="mt-1 flex justify-between text-xs text-[var(--s-ink-soft)]">
          <span>$10</span>
          <span className="font-semibold text-[var(--s-wine)]">Up to ${maxPrice}</span>
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* header */}
      <div className="border-b border-[var(--s-line)] pb-6">
        <h1 className="font-display text-3xl font-bold text-[var(--s-ink)] sm:text-4xl">
          {cat === "All" ? "The Full Collection" : cat}
        </h1>
        <p className="mt-2 text-sm text-[var(--s-ink-soft)]">
          {filtered.length} authentic {filtered.length === 1 ? "find" : "finds"} · hand-checked &amp; ready to ship
        </p>
      </div>

      {/* search + sort bar */}
      <div className="sticky top-16 z-30 -mx-6 mt-4 flex items-center gap-3 bg-[var(--s-cream)]/90 px-6 py-3 backdrop-blur">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--s-ink-soft)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand or product…"
            className="w-full rounded-full border border-[var(--s-line)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--s-ink)] outline-none transition-colors placeholder:text-[var(--s-ink-soft)] focus:border-[var(--s-wine)]"
          />
        </div>
        <button
          onClick={() => setMobileFilters(true)}
          className="flex items-center gap-2 rounded-full border border-[var(--s-line)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--s-ink)] lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {activeFilters > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--s-wine)] text-[10px] text-white">{activeFilters}</span>}
        </button>
        <div className="relative hidden sm:block">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="appearance-none rounded-full border border-[var(--s-line)] bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-[var(--s-ink)] outline-none focus:border-[var(--s-wine)]"
          >
            {Object.entries(sortLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--s-ink-soft)]" />
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">{Filters}</div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--s-line)] bg-white py-24 text-center">
              <p className="font-display text-xl text-[var(--s-ink)]">No matches found</p>
              <p className="mt-1 text-sm text-[var(--s-ink-soft)]">Try clearing a filter or searching another brand.</p>
              <button onClick={() => { pickCat("All"); setBrand(null); setQuery(""); setMaxPrice(400); }} className="mt-4 rounded-full bg-[var(--s-wine)] px-5 py-2.5 text-sm font-semibold text-white">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-[var(--s-cream)] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Filters</h2>
              <button onClick={() => setMobileFilters(false)}><X className="h-5 w-5" /></button>
            </div>
            {Filters}
            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--s-ink-soft)]">Sort</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="mt-1 w-full rounded-xl border border-[var(--s-line)] bg-white p-3 text-sm">
                {Object.entries(sortLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <button onClick={() => setMobileFilters(false)} className="mt-6 w-full rounded-full bg-[var(--s-wine)] py-3 text-sm font-semibold text-white">
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--s-ink)]">{title}</h3>
      {children}
    </div>
  );
}

function FilterRadio({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${
        active ? "bg-[var(--s-rose-soft)] font-semibold text-[var(--s-wine)]" : "text-[var(--s-ink-soft)] hover:bg-[var(--s-cream-2)]"
      }`}
    >
      <span className="flex items-center gap-2">
        {active && <Check className="h-3.5 w-3.5" />}
        {label}
      </span>
      {count != null && <span className="text-[11px] opacity-70">{count}</span>}
    </button>
  );
}
