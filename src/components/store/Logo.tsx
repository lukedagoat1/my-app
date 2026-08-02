// Sara's Trading Post mark: a wax-seal medallion (fits the "trading post" /
// vintage-exchange identity) with a serif S monogram. One SVG, reused in the
// navbar, footer, and as the basis for the generated favicon/OG image.
export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Sara's Trading Post">
      <circle cx="20" cy="20" r="19" fill="#7a2f43" stroke="#e7d3a1" strokeWidth="1.25" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#e7d3a1" strokeWidth="0.75" opacity="0.55" />
      <path d="M20 5.5l1.05 2.55 2.75.24-2.1 1.8.68 2.7L20 10.9l-2.38 1.9.68-2.71-2.1-1.8 2.75-.24z" fill="#e7d3a1" />
      <text
        x="20" y="27.5"
        textAnchor="middle"
        fontFamily="Georgia, 'Playfair Display', serif"
        fontWeight="700"
        fontSize="18"
        fill="#e7d3a1"
      >
        S
      </text>
    </svg>
  );
}
