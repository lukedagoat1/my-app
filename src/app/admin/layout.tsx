export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", background: "#f8f5f0", minHeight: "100vh", color: "#1a1a1a" }}>
      {children}
    </div>
  );
}
