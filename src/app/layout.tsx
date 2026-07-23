import type { ReactNode } from "react";

/**
 * Passthrough root layout. The real <html>/<body> shell lives in
 * app/[locale]/layout.tsx so the lang attribute and direction track the
 * active locale; this root only satisfies the App Router's requirement for a
 * top-level layout.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
