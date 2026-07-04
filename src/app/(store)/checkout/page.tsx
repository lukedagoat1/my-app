"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Lock, CreditCard, Truck, Check, ChevronLeft, BadgeCheck, ShieldCheck, Loader2,
} from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart, useCartTotals, useHydrated, money } from "@/lib/cart";
import { getStripe } from "@/lib/stripe";
import OrderSummary from "@/components/store/OrderSummary";
import AddressAutocomplete from "@/components/store/AddressAutocomplete";

type Step = 1 | 2 | 3;

const empty = {
  email: "", first: "", last: "", address: "", apt: "", city: "", state: "", zip: "",
};

// ── Stripe payment form — must live inside <Elements> ─────────────────────
// Uses elements.submit() to validate card before advancing to review step
function StripePaymentForm({
  onElementReady,
  onReview,
  onBack,
}: {
  onElementReady: () => void;
  onReview: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [validating, setValidating] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Validate card details BEFORE advancing to review — fixes "not waiting" issue
  async function handleReview() {
    if (!stripe || !elements) return;
    setValidating(true);
    setCardError(null);
    const { error } = await elements.submit();
    setValidating(false);
    if (error) {
      setCardError(error.message ?? "Please check your payment details.");
      return;
    }
    onReview(); // only advances if card is valid and complete
  }

  return (
    <div className="s-reveal">
      <h2 className="font-display text-xl font-bold text-[var(--s-ink)]">Payment</h2>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--s-ink-soft)]">
        <Lock className="h-3.5 w-3.5" /> Secured by Stripe — your details are encrypted.
      </p>
      <div className="mt-5">
        <PaymentElement
          options={{ layout: "tabs", wallets: { applePay: "auto", googlePay: "auto" } }}
          onReady={onElementReady}
        />
      </div>
      {cardError && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{cardError}</p>
      )}
      <div className="mt-6 flex gap-3">
        <button onClick={onBack} className="rounded-full border border-[var(--s-line)] px-6 py-3.5 text-sm font-semibold text-[var(--s-ink)]">
          Back
        </button>
        <button
          type="button"
          onClick={handleReview}
          disabled={validating || !stripe}
          className="flex-1 rounded-full bg-[var(--s-wine)] py-3.5 text-sm font-bold text-white hover:bg-[var(--s-wine-deep)] disabled:opacity-70"
        >
          {validating ? <><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Validating…</> : "Review order"}
        </button>
      </div>
    </div>
  );
}

// ── Place-order button — must live inside <Elements> ──────────────────────
function PlaceOrderButton({
  order,
  clientSecret,
  onError,
}: {
  order: {
    id: string; email: string; name: string; address: string;
    items: { title: string; qty: number; price: number; image: string; variant?: string }[];
    totals: { subtotal: number; shipping: number; tax: number; total: number };
    date: string;
  };
  clientSecret: string;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [placing, setPlacing] = useState(false);

  async function handlePlace() {
    if (!stripe || !elements) return;
    setPlacing(true);

    sessionStorage.setItem("sara-last-order", JSON.stringify(order));

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: order.email,
        payment_method_data: {
          billing_details: { name: order.name, email: order.email },
        },
      },
    });

    if (error) {
      sessionStorage.removeItem("sara-last-order");
      onError(error.message ?? "Payment failed. Please try again.");
    }
    setPlacing(false);
  }

  return (
    <button
      onClick={handlePlace}
      disabled={placing || !stripe}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--s-wine)] py-4 text-sm font-bold text-white hover:bg-[var(--s-wine-deep)] disabled:opacity-70"
    >
      {placing
        ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing payment…</>
        : <><Lock className="h-4 w-4" /> Pay now · {money(order.totals.total)}</>}
    </button>
  );
}

// ── Main checkout page ─────────────────────────────────────────────────────
export default function CheckoutPage() {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const totals = useCartTotals();

  const [step, setStep] = useState<Step>(1);
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  function set<K extends keyof typeof empty>(k: K, v: string) {
    setF((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  const US_STATES = new Set([
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
    "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
    "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
    "VA","WA","WV","WI","WY","DC",
  ]);

  function validate(fields: (keyof typeof empty)[]) {
    const e: Record<string, string> = {};
    for (const k of fields) {
      const v = f[k].trim();
      if (!v) { e[k] = "Required"; continue; }
      if (k === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { e[k] = "Enter a valid email"; continue; }
      if ((k === "first" || k === "last") && v.length < 2) { e[k] = "Too short"; continue; }
      if ((k === "first" || k === "last") && !/^[A-Za-zÀ-ÖØ-öø-ÿ'\- ]+$/.test(v)) { e[k] = "Letters only"; continue; }
      if (k === "address" && v.length < 5) { e[k] = "Enter a full street address"; continue; }
      if (k === "city" && v.length < 2) { e[k] = "Enter a city name"; continue; }
      if (k === "state" && !US_STATES.has(v.toUpperCase())) { e[k] = "Enter a 2-letter state (e.g. TX)"; continue; }
      if (k === "zip" && !/^\d{5}(-\d{4})?$/.test(v)) { e[k] = "Enter a valid ZIP code"; continue; }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function goToPayment() {
    if (!validate(["email", "first", "last", "address", "city", "state", "zip"])) return;
    setLoadingIntent(true);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totals.total,
          email: f.email,
          name: `${f.first} ${f.last}`,
          orderId,
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setClientSecret(data.clientSecret);
      setStep(2);
    } catch (err: unknown) {
      setErrors({ _general: err instanceof Error ? err.message : "Could not initialise payment. Please try again." });
    } finally {
      setLoadingIntent(false);
    }
  }

  const handleStripeElementReady = useCallback(() => {}, []);
  const handleReviewOrder = useCallback(() => setStep(3), []);

  // Stable orderId that doesn't regenerate on every render
  const [orderId] = useState(() => "STP-" + Math.random().toString(36).slice(2, 8).toUpperCase());
  const orderForStripe = {
    id: orderId,
    email: f.email,
    name: `${f.first} ${f.last}`,
    address: `${f.address}${f.apt ? ", " + f.apt : ""}, ${f.city}, ${f.state} ${f.zip}`,
    items: lines.map((l) => ({ id: l.id, title: l.title, qty: l.qty, price: l.price, image: l.image, ...(l.variant ? { variant: l.variant } : {}) })),
    totals,
    date: new Date().toISOString(),
  };

  const stripeAppearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#7c2d44", colorBackground: "#ffffff", colorText: "#1a1a2e",
      colorDanger: "#ef4444", fontFamily: "Inter, system-ui, sans-serif",
      borderRadius: "12px", spacingUnit: "4px",
    },
  };

  if (!hydrated) return <div className="mx-auto max-w-7xl px-6 py-24 text-center text-[var(--s-ink-soft)]">Loading…</div>;

  if (lines.length === 0) return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl font-bold text-[var(--s-ink)]">Your bag is empty</h1>
      <p className="mt-2 text-[var(--s-ink-soft)]">Add a few favorites before checking out.</p>
      <Link href="/shop" className="mt-5 inline-block rounded-full bg-[var(--s-wine)] px-6 py-3 text-sm font-semibold text-white">Browse the collection</Link>
    </div>
  );

  const steps = [
    { n: 1, label: "Shipping", icon: Truck },
    { n: 2, label: "Payment", icon: CreditCard },
    { n: 3, label: "Review", icon: Check },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-[var(--s-ink)]">Checkout</h1>
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-[var(--s-ink-soft)] hover:text-[var(--s-wine)]">
          <ChevronLeft className="h-4 w-4" /> Back to bag
        </Link>
      </div>

      {/* stepper */}
      <ol className="mt-7 flex items-center">
        {steps.map((s, i) => (
          <li key={s.n} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-colors ${
                step > s.n ? "bg-green-600 text-white" : step === s.n ? "bg-[var(--s-wine)] text-white" : "bg-[var(--s-cream-2)] text-[var(--s-ink-soft)]"
              }`}>
                {step > s.n ? <Check className="h-4 w-4" /> : s.n}
              </span>
              <span className={`text-sm font-semibold ${step >= s.n ? "text-[var(--s-ink)]" : "text-[var(--s-ink-soft)]"}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <span className={`mx-3 h-px flex-1 ${step > s.n ? "bg-green-600" : "bg-[var(--s-line)]"}`} />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-[var(--s-line)] bg-white p-6 sm:p-8 s-shadow">

          {/* ── Step 1: Shipping ── */}
          {step === 1 && (
            <div className="s-reveal">
              <h2 className="font-display text-xl font-bold text-[var(--s-ink)]">Contact &amp; shipping</h2>
              <div className="mt-5 grid gap-4">
                <Field label="Email" v={f.email} on={(v) => set("email", v)} err={errors.email} type="email"
                  placeholder="you@email.com" hint="For your order confirmation &amp; tracking" full autoComplete="email" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name" v={f.first} on={(v) => set("first", v)} err={errors.first} autoComplete="given-name" />
                  <Field label="Last name" v={f.last} on={(v) => set("last", v)} err={errors.last} autoComplete="family-name" />
                </div>

                {/* Address with autocomplete */}
                <AddressAutocomplete
                  value={f.address}
                  onChange={(v) => set("address", v)}
                  onSelect={({ address, city, state, zip }) => {
                    setF((prev) => ({ ...prev, address, city, state, zip }));
                    setErrors((e) => ({ ...e, address: "", city: "", state: "", zip: "" }));
                  }}
                  error={errors.address}
                  placeholder="Start typing your street address…"
                />

                <Field label="Apartment, suite (optional)" v={f.apt} on={(v) => set("apt", v)} full autoComplete="address-line2" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="City" v={f.city} on={(v) => set("city", v)} err={errors.city} autoComplete="address-level2" />
                  <Field label="State" v={f.state} on={(v) => set("state", v)} err={errors.state} placeholder="TX" autoComplete="address-level1" />
                  <Field label="ZIP" v={f.zip} on={(v) => set("zip", v)} err={errors.zip} placeholder="75001" autoComplete="postal-code" />
                </div>
              </div>
              {errors._general && <p className="mt-3 text-sm text-red-500">{errors._general}</p>}
              <button
                onClick={goToPayment}
                disabled={loadingIntent}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--s-wine)] py-3.5 text-sm font-bold text-white hover:bg-[var(--s-wine-deep)] disabled:opacity-70"
              >
                {loadingIntent ? <><Loader2 className="h-4 w-4 animate-spin" /> Setting up payment…</> : "Continue to payment"}
              </button>
            </div>
          )}

          {/* ── Steps 2 & 3: Stripe Elements (mounted once clientSecret exists) ── */}
          {clientSecret && (
            <Elements stripe={getStripe()} options={{ clientSecret, appearance: stripeAppearance }}>
              {/* Payment form — invisible on step 3 but kept mounted so elements remain registered */}
              <div style={step !== 2 ? { position: "absolute", visibility: "hidden", pointerEvents: "none", height: 0, overflow: "hidden" } : {}}>
                <StripePaymentForm
                  onElementReady={handleStripeElementReady}
                  onReview={handleReviewOrder}
                  onBack={() => setStep(1)}
                />
              </div>

              {/* Review + pay — step 3 */}
              {step === 3 && (
                <div className="s-reveal">
                  <h2 className="font-display text-xl font-bold text-[var(--s-ink)]">Review &amp; pay</h2>
                  <div className="mt-5 space-y-4">
                    <ReviewRow icon={Truck} title="Ship to"
                      value={`${f.first} ${f.last}, ${f.address}${f.apt ? " " + f.apt : ""}, ${f.city}, ${f.state} ${f.zip}`}
                      onEdit={() => setStep(1)} />
                    <ReviewRow icon={CreditCard} title="Payment" value="Secured via Stripe" onEdit={() => setStep(2)} />
                  </div>
                  <ul className="mt-5 divide-y divide-[var(--s-line)] rounded-xl border border-[var(--s-line)]">
                    {lines.map((l) => (
                      <li key={l.key} className="flex items-center gap-3 p-3 text-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={l.image} alt={l.title} className="h-12 w-12 rounded-lg border border-[var(--s-line)] object-cover" />
                        <span className="line-clamp-1 flex-1 text-[var(--s-ink-soft)]">{l.title}{l.variant && ` (${l.variant})`} × {l.qty}</span>
                        <span className="font-semibold text-[var(--s-ink)]">{money(l.price * l.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  {paymentError && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{paymentError}</div>
                  )}
                  <PlaceOrderButton order={orderForStripe} clientSecret={clientSecret} onError={setPaymentError} />
                  <p className="mt-3 text-center text-xs text-[var(--s-ink-soft)]">
                    By placing your order you agree to our{" "}
                    <Link href="/policies" className="font-medium text-[var(--s-wine)] underline">return policy</Link> &amp; authenticity guarantee.
                  </p>
                </div>
              )}
            </Elements>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start space-y-3">
          <OrderSummary showItems />
          <div className="rounded-2xl border border-[var(--s-line)] bg-white p-4 text-xs text-[var(--s-ink-soft)]">
            <p className="flex items-center gap-2 font-semibold text-[var(--s-ink)]">
              <BadgeCheck className="h-4 w-4 text-green-600" /> Shop with confidence
            </p>
            <p className="mt-1.5">99.8% positive feedback · 79,000+ orders shipped · 100% authentic guarantee.</p>
          </div>
          <div className="rounded-2xl border border-[var(--s-line)] bg-white p-4 text-xs text-[var(--s-ink-soft)]">
            <p className="flex items-center gap-2 font-semibold text-[var(--s-ink)]">
              <ShieldCheck className="h-4 w-4 text-[var(--s-wine)]" /> Secure payment
            </p>
            <p className="mt-1.5">Payments processed by Stripe. We never see or store your card details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, v, on, err, type = "text", placeholder, hint, full, autoComplete }: {
  label: string; v: string; on: (v: string) => void; err?: string; type?: string;
  placeholder?: string; hint?: string; full?: boolean; autoComplete?: string;
}) {
  return (
    <div className={full ? "sm:col-span-full" : ""}>
      <label className="text-xs font-semibold text-[var(--s-ink)]">{label}</label>
      <div className="mt-1.5">
        <input
          type={type} value={v} onChange={(e) => on(e.target.value)}
          placeholder={placeholder} autoComplete={autoComplete}
          className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-[var(--s-ink)] outline-none transition-colors placeholder:text-[var(--s-ink-soft)]/60 focus:border-[var(--s-wine)] ${err ? "border-red-400" : "border-[var(--s-line)]"}`}
        />
      </div>
      {err ? <p className="mt-1 text-xs text-red-500">{err}</p> : hint ? <p className="mt-1 text-xs text-[var(--s-ink-soft)]" dangerouslySetInnerHTML={{ __html: hint }} /> : null}
    </div>
  );
}

function ReviewRow({ icon: Icon, title, value, onEdit }: {
  icon: React.ComponentType<{ className?: string }>; title: string; value: string; onEdit: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--s-line)] p-3.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--s-wine)]" />
      <div className="flex-1">
        <p className="text-xs font-semibold text-[var(--s-ink)]">{title}</p>
        <p className="text-xs text-[var(--s-ink-soft)]">{value}</p>
      </div>
      <button onClick={onEdit} className="text-xs font-semibold text-[var(--s-wine)] hover:underline">Edit</button>
    </div>
  );
}
