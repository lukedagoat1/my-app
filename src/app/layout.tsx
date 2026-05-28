import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "G-Blendz — Precision Cuts & Clean Blends | Plano, TX",
  description: "Professional barbering services in Plano, TX. Clean fades, tapers, beard trims, line-ups, kids cuts. Mobile/in-home services available. Book at 469-648-7481.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#06060f] text-white overflow-x-hidden">{children}</body>
    </html>
  );
}
