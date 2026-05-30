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

export const metadata: Metadata = {
  metadataBase: new URL("https://crystaldetailing.com"),
  title: "Crystal Detailing — Mobile Car Detailing in Allen, TX",
  description:
    "Allen, TX's 4.8-star mobile car detailing. We come to you. Interior, exterior & premium packages — $50 OFF your first detail. Book in seconds: (469) 653-8552.",
  keywords: [
    "car detailing Allen TX",
    "mobile detailing",
    "interior detailing",
    "exterior detailing",
    "ceramic wash",
    "Crystal Detailing",
  ],
  openGraph: {
    title: "Crystal Detailing — Mobile Car Detailing in Allen, TX",
    description:
      "We come to you. 4.8-star mobile detailing in Allen, TX. $50 OFF your first detail.",
    images: ["/work/hero-car.jpg"],
    type: "website",
  },
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8671336417372021"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-ink text-white overflow-x-hidden selection:bg-crystal/30">
        {children}
      </body>
    </html>
  );
}
