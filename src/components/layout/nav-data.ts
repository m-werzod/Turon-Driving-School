/**
 * Serializable navigation data passed from the server layout into the client
 * header/menu/footer. Keeps content-service reads on the server; the client
 * chrome only receives plain strings.
 */
export interface NavCategory {
  slug: string;
  code: string;
  name: string;
  tagline: string;
  /** Preformatted "from" price, or null when no priced offer is shown. */
  priceFrom: string | null;
}

export interface NavBranch {
  slug: string;
  name: string;
  district: string;
  phones: string[];
  hours: string;
}

export interface NavPhone {
  number: string;
  label: string;
}

export interface HeaderData {
  categories: NavCategory[];
  branches: NavBranch[];
  phones: NavPhone[];
  telegramUrl: string;
  instagramUrl: string;
}

export interface FooterData extends HeaderData {
  /** Working hours value from settings content (label comes from i18n). */
  hours: string;
  licenseNumber: string | null;
}

/**
 * Curated footer quick-links — deliberately short (not a mirror of every
 * route) so the mobile footer stays scannable instead of turning into a
 * long link dump.
 */
export const FOOTER_PAGE_LINKS = [
  "/",
  "/categories",
  "/express-courses",
  "/pricing",
  "/branches",
  "/results",
] as const;
