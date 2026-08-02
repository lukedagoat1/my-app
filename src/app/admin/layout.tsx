import type { Metadata } from "next";

// page.tsx is a client component and can't export metadata itself — was
// silently inheriting the root layout's "Lumina — AI Skin Analysis" title.
export const metadata: Metadata = {
  title: "Admin — Sara's Trading Post",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", background: "#f8f5f0", minHeight: "100vh", color: "#1a1a1a" }}>
      {children}
    </div>
  );
}
