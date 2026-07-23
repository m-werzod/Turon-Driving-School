import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * Baseline security headers (OWASP). A strict nonce-based CSP is part of the
 * security milestone (TZ doc 16 §7) because it requires per-request rendering
 * decisions; these headers are safe for fully static pages.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Doc 04 §4: no trailing slashes; Next.js 301-redirects `/path/` → `/path`
  // by default when trailingSlash is false (the default), which we rely on.
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
