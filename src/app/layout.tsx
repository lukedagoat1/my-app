import type { Metadata } from "next";
import { Geist, Sora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Fallback only — every real route sets its own metadata via a nested
// layout. This used to hardcode Lumina's title/description, which leaked
// onto any route outside every branded folder (e.g. /admin).
export const metadata: Metadata = {
  title: "Lucent Studio",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-white overflow-x-hidden selection:bg-crystal/30">
        {children}
      </body>
    </html>
  );
}
