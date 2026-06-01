import type { NextConfig } from "next";

// Content-Security-Policy
// - script-src: 'unsafe-inline' required by Next.js App Router inline scripts; 'unsafe-eval' for dev HMR
// - style-src: 'unsafe-inline' required by Tailwind CSS; Google Fonts stylesheet
// - font-src: Google Fonts static assets
// - img-src: eBay CDN for all product images; data: for base64 placeholders
// - Stripe requires: js.stripe.com scripts, hooks.stripe.com + js.stripe.com frames, api.stripe.com connects
// - frame-ancestors 'none': prevents clickjacking (redundant with X-Frame-Options but CSP level 3)
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://i.ebayimg.com https://*.stripe.com",
  "connect-src 'self' https://api.stripe.com",
  "media-src 'none'",
  "object-src 'none'",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Deny framing (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Legacy XSS filter (IE/older Chrome)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Limit referrer data sent to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Enforce HTTPS for 2 years (only effective when deployed on HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // CSP
  { key: "Content-Security-Policy", value: cspHeader },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
