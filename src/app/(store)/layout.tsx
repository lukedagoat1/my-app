import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sarastradingpost.com"),
  title: {
    default: "Sara's Trading Post — Authentic Luxury Beauty, Resold with Love",
    template: "%s · Sara's Trading Post",
  },
  description:
    "Shop 100% authentic prestige makeup, skincare & fragrance — Estée Lauder, Tom Ford, CHANEL, Pat McGrath & more. 99.8% positive feedback across 79,000+ orders. Fast, tracked shipping and a free beauty sample with every order.",
  keywords: [
    "authentic luxury makeup", "discount prestige skincare", "Estee Lauder", "Tom Ford beauty",
    "CHANEL makeup", "Pat McGrath", "BareMinerals", "IMAGE Skincare", "Sara's Trading Post",
  ],
  openGraph: {
    title: "Sara's Trading Post — Authentic Luxury Beauty",
    description:
      "100% authentic prestige beauty at a fraction of retail. 99.8% positive feedback, 79,000+ happy customers.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`store-root ${playfair.variable} ${inter.variable} flex min-h-screen flex-col`}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
