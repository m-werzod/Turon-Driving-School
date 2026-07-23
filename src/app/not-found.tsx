import Link from "next/link";

/**
 * Root fallback 404 for paths outside the [locale] tree. It renders its own
 * minimal HTML shell (there is no shared layout above it) and points back to
 * the default-locale home. Locale-scoped 404s use [locale]/not-found.tsx.
 */
export default function RootNotFound() {
  return (
    <html lang="uz">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          color: "#0f172a",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <p style={{ fontSize: "3rem", fontWeight: 800, color: "#2563eb" }}>404</p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Sahifa topilmadi</h1>
        <Link href="/" style={{ color: "#2563eb", fontWeight: 600 }}>
          Bosh sahifa
        </Link>
      </body>
    </html>
  );
}
