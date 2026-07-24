// Plain module (no "use client") so these are safe to import from both
// client components and server route handlers. A Set imported across a
// "use client" boundary loses its prototype methods in Next.js's RSC
// serialization — this file exists specifically to avoid that.
export const SHIPPING_THRESHOLD = 75;
export const SHIPPING_FLAT = 6.95;
export const TAX_RATE = 0.0825;
// Sara has sales-tax nexus only in Texas — extend when the business
// registers in more states.
export const TAX_STATES = new Set(["TX"]);
