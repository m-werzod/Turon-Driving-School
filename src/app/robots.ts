import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots policy (TZ doc 18 §2). Admin and API surfaces are disallowed;
 * everything public is crawlable. Sitemap is advertised absolutely.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
